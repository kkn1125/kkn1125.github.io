---
layout: post
date:   2022-03-15 21:17:09 +0900
title:  "[DJANGO] form valid를 제어해보자"
author: Kimson
categories: [ django ]
image: assets/images/post/covers/TIL-django.png
tags: [ basic, til ]
description: "form valid
이 포스팅은 참고용으로 만들어졌기 때문에 정확한 내용은 공식 홈페이지의 docs와 reference를 참고하는 것을 적극 권장합니다.
form valid 제어
처음 `ModelForm`을 접했을 때는 무슨 개념인지조차 몰랐는데 현재는 `ModelForm`이 아니면 끔찍하다는 생각이 듭니다. 경우에 따라 form에서 field를 따로 떼어 에러처리 하는 등의 작업이 필요하겠지만 지금은 연습 단계이니 field 별 제어하는 내용은 다음에 다루어 볼 예정입니다."
featured: true
hidden: false
rating: 4.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# form valid

> 이 포스팅은 참고용으로 만들어졌기 때문에 정확한 내용은 공식 홈페이지의 docs와 reference를 참고하는 것을 적극 권장합니다.

## form valid 제어

처음 `ModelForm`을 접했을 때는 무슨 개념인지조차 몰랐는데 현재는 `ModelForm`이 아니면 끔찍하다는 생각이 듭니다. 경우에 따라 form에서 field를 따로 떼어 에러처리 하는 등의 작업이 필요하겠지만 지금은 연습 단계이니 field 별 제어하는 내용은 다음에 다루어 볼 예정입니다.

### 설정

테스트 할 내용은 로그인 기능이고 ModelForm을 사용해서 기본적인 유효성 검사와 boostrap5를 연결한 유효성검사 입니다. 그리고 add_error로 추가적인 에러 처리 방법을 기록하려하는데 cleaned_data는 ModelForm을 사용한다면 사용할 필요가 없어 다음에 다루도록 하겠습니다.

#### forms.Form과 ModelForm 차이

이번 포스팅에 다루지는 않지만 차이점을 짚고 넘어갈 필요가 있을 것 같아 차이점을 이야기하겠습니다.

`ModelForm`을 사용하는 경우 `cleaned_data`를 사용할 필요가 없습니다. 해당 `dict`를 사용할 때 `form.save()`처럼 이미 일치하고 정리된 데이터가 저장되기 때문입니다.

하지만 `forms.Form`의 경우 `cleanded_data`를 해당 데이터베이스 위치에 수동으로 일치시켜 인스턴스를 만들어 데이터베이스에 저장시켜야 합니다.

##### forms.Form

```python
# Form
if form.is_valid():
    user = User()
    user.username = form.cleaned_data['username']
    user.save()
```

##### ModelForm

``` python
# ModelForm
if form.is_valid():
    form.save()
```

### 사용

예시되는 User라는 ModelForm과 Model을 만듭니다. 먼저 `forms.py`를 만들고

```python
# forms.py

from django.forms import ModelForm, PasswordInput#, ValidationError
from django import forms
from .models import User

class SignForm(ModelForm):
    class Meta:
        model = User
        fields = [
            'username', 'password'
        ]
        widgets = {
            'password': PasswordInput(attrs={'type': 'password'})
        }
```

models.py도 설정합니다.

```python
# models.py

from django.db import models

class User(models.Model):
    num = models.AutoField(primary_key=True)
    username = models.CharField(max_length=20, null=False)
    password = models.CharField(max_length=50, null=False)
```

그리고 `views.py`에서 `signin`이라 하고 설정합니다. `urls.py` 설정은 생략하겠습니다.

```python
from rest_framework.decorators import api_view
from django.shortcuts import render, redirect
from .forms import SignForm
from .models import User

# ...
@api_view(['GET', 'POST'])
def signin(request):
    if request.method == 'POST':
        data = request.POST
        sign_form = SignForm(data)

        if sign_form.is_valid():
            """ forms.Form을 사용할 때
            sign_form = SignForm()
            username = sign_form.cleaned_data['username']
            password = sign_form.cleaned_data['password']
            """
            username = data['username']
            password = data['password']

            if ' ' not in username:
                sign_form.add_error('username', '올바른 형식이 아닙니다.')
            else:
                if User.objects.filter(username=username):
                    user = User.objects.get(username=username)

                    if user.password == password:
                        session_user = {}
                        session_user['username'] = username
                        session_user['password'] = password
                        request.session['user'] = session_user
                        return redirect('/')
        else:
            return redirect('/signin?error=1')
    else:
        sign_form = SignForm()
        
    context = {
        'signForm': sign_form
    }

    return render(request, 'todo/signin.html', context)
```

{:.blockquote.blockquote-info}
> 잘 안되신다면 이것만 주의하면 될 것 같습니다. `sign_form`을 `if .. else`문 밖에서 `context`로 받아 `render`로 보내고 있습니다.  
> 위의 코드에서 위치를 보시면 아시겠지만 `sign_form`을 `is_valid`한 이후에 다시 `sign_form`을 재정의하면 당연히 **유효성 검사한 결과를 제대로 전달하지 못합니다**.

그 다음 `template`을 작성해보면 아래와 같습니다.

{%raw%}

```html
{% extends './layout.html' %}
{% load bootstrap5 %}
{% block content %}
<h1>Sign in</h1>
<div>
    <form action="{% url 'signin' %}" method="post" novalidate>
        {% if request.GET.error %}
            <div class="alert alert-danger">
                아이디와 비밀번호를 확인해주세요
            </div>
        {% endif %}
        {% if signForm.errors %}
        <div class="alert alert-danger">
            {% for field in signForm %}
            {% if field.errors %}
            {{field.label}}
            {{field.errors}}
            {% endif %}
            {% endfor %}
        </div>
        {% endif %}
        <div>
            {{ signForm.as_p }}
        </div>
        <button type="submit" class="btn btn-info">sign in</button>
    </form>
</div>
{% endblock %}
```

{%endraw%}

`request.GET.error`는 유효성검사가 아닌 db의 데이터와 매치가 되지 않고 `error`값을 파라미터로 받았을 때 나타나게하는 문구입니다.

`signForm.errors`는 form의 유효성 검사가 끝나고 유효하지 않으면 signForm에 errors를 받아와 if문에 걸리고 밑에 작성한 내용들을 출력합니다.

아래와 같이 유효성검사와 데이터 미스매치에 대한 결과를 손쉽게 볼 수 있습니다.

이메일 형식이 틀릴 때

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/django/modelform01.png" alt="sample" title="sample">
   <figcaption>유효성 검사</figcaption>
</span>
</figure>

필드가 비었을 때

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/django/modelform03.png" alt="sample" title="sample">
   <figcaption>빈 필드</figcaption>
</span>
</figure>

일치하는 데이터가 없을 때

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/django/modelform02.png" alt="sample" title="sample">
   <figcaption>미스매치</figcaption>
</span>
</figure>

## bootstrap valid로 변경

`boostrap`은 `pip`로 먼저 `install`하고 `installed_apps`에 추가해주고 사용해야합니다. 사용법은 구글 검색으로 방대한 양의 내용이 있으니 참고하시기를.

설치는 [여기](https://pypi.org/project/django-bootstrap-v5/){:target="_blank"}를 참고하세요.

{%raw%}

```html
{% load bootstrap5 %}
{% bootstrap_form signForm %}
```

{%endraw%}

기본 form에서와 마찬가지로 에러는 form의 field마다 자동으로 붙습니다. field별로 따로 작업 가능하며, error또한 별도로 제어 가능합니다.

field를 따로따로 설정하고 싶으시다면 [여기](https://docs.djangoproject.com/en/4.0/topics/forms/#rendering-fields-manually)를 참고하시면 됩니다. djangoproject페이지 이고 form관련한 내용이 아주 잘 정리되어 있어 영알못이어도 쉽게 참고 가능합니다.

## add_error

add_error는 위의 코드 중에서 잠시 나왔는데요. 아직 어떻게 활용하는지 명확하게는 모릅니다. 하지만 더 공부하면서 제대로된 목적으로 다시 정리하고자 하니 지금은 대충 이러하게 쓰인다 정도로만 정리하려합니다.

```python
# views.py 코드 일부
if sign_form.is_valid():
            """ forms.Form을 사용할 때
            sign_form = SignForm()
            username = sign_form.cleaned_data['username']
            password = sign_form.cleaned_data['password']
            """
            username = data['username']
            password = data['password']

            if ' ' not in username:
                sign_form.add_error('username', '올바른 형식이 아닙니다.')
```

`views.py`의 코드 일부인데요. 맨 아래 `if`문을 보시면 `add_error`라 하고 `field`명과 `error`메세지를 지정해서 추가하는 모습입니다.

분기문을 통해 기존에 있는 `is_valid`의 기준만이 아닌 사용자의 목적에 따라 `if`문으로 유효성 검사 목록을 더 추가 가능한 것으로 보입니다. 이러한 맥락으로 봤을 때 `add_error`한 시점부터 `form`의 에러 항목이 추가되고 `valid`되는 것 같습니다.

{:.blockquote.blockquote-info}
> 이는 짐작이고 추측이니 더 자세한 것은 해당 함수의 내용을 더 알아보고 해당 포스팅을 수정할 예정입니다.

-----

📚 함께 보면 좋은 내용

[Django Documentation :: form](https://docs.djangoproject.com/en/4.0/topics/forms/#more-about-django-form-classes){:target="_blank"}

[Django Documentation :: Form fields v2.1](https://docs.djangoproject.com/es/2.1/ref/forms/fields/#required){:target="_blank"}

[Django Documentation :: form v2.0](https://docs.djangoproject.com/en/2.0/ref/forms/validation/){:target="_blank"}

[Stackoverflow :: What is the use of cleaned_data in Django](https://stackoverflow.com/questions/53594745/what-is-the-use-of-cleaned-data-in-django){:target="_blank"}

[Stackoverflow :: Django modelform NOT required field](https://stackoverflow.com/questions/16205908/django-modelform-not-required-field){:target="_blank"}

[swhan9404님 :: Django Form](https://velog.io/@swhan9404/Django-Form){:target="_blank"}

[Junlab님 :: 폼 활용이 편한 django 폼 사용법 (form이란 무엇인가요?)](https://junlab.tistory.com/193){:target="_blank"}

[Jinmay님 :: [Form]의식의 흐름대로 정리하는 장고 Form](https://jinmay.github.io/2019/11/13/django/django-form-is-valid-mechanism-brief/){:target="_blank"}

[낭만온달님 :: [Django] HTML 템플릿내에서 Form Class의 is_valid호출시 오류를 받아 처리하기](https://niceit.tistory.com/395){:target="_blank"}