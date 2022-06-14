---
slug: "/django-authenticate"
layout: post
date:   2022-03-28 17:07:32 +0900
title:  "[DJANGO] User Authentication 사용하기 01"
author: Kimson
categories: [ django ]
image: /images/post/covers/TIL-django.png
tags: [ authentication, til ]
description: "기본 Authentication 사용
Used
1. postgreSQL
2. pgAdmin4
3. rest_framework
기본적으로 user authentication은 `id(pk)`, `username`, `email`, `password`, `firstname`, `lastname`, `last_login`, `date_joined`, `is_superuser`, `is_staff`, `is_active` 필드를 제공합니다.

저는 `mysql`을 사용할 때도 `mysqlbench`를 자주 사용한터라 `pgadmin`을 사용했습니다."
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

# 기본 Authentication 사용

> **Used**
> 
> 1. postgreSQL
> 2. pgAdmin4
> 3. rest_framework

`UI`로 보는 것을 선호해서 `pgadmin`을 사용했습니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="/images/post/django/authentication/auth01.png" alt="sample" title="sample">
   <figcaption>pgAdmin 속성</figcaption>
</span>
</figure>

표로 정리해서 보면 아래와 같습니다.

{:.table.table-hover.vertical-dot}
|name|:data type:|:length:|:null:|:pk:|:default:|
|:---:|---:|---:|---:|---:|---:|
|**id**|integer|-|not null|pk|auth|
|**username**|char|150|not null|-|-|
|**firstname**|char|150|not null|-|-|
|**lastname**|char|150|not null|-|-|
|**email**|char|254|not null|-|-|
|**password**|char|128|not null|-|-|
|**last_login**|timestamp|-|null|-|-|
|**date_joined**|timestamp|-|not null|-|-|
|**is_superuser**|boolean|-|not null|-|-|
|**is_staff**|boolean|-|not null|-|-|
|**is_active**|boolean|-|not null|-|-|

`pgAdmin`에서 `query tool`로 확인하고 싶으시다면 아래의 구문으로 확인하실 수 있습니다.

```sql
select column_name, data_type, is_nullable, character_maximum_length
from INFORMATION_SCHEMA.COLUMNS where table_name = '<name of table>';
```

위 속성처럼 기본적으로 user authentication은 `id(pk)`, `username`, `email`, `password`, `firstname`, `lastname`, `last_login`, `date_joined`, `is_superuser`, `is_staff`, `is_active` 필드를 제공합니다. 거기에 확장해서 프로필 사진이나, 주소, 상태메세지 등을 설정할 수 있는데요. 확장은 `User`를 `proxy` 혹은 `AbstractUser` 등의 방법이 있습니다. 저는 `AbstractUser`를 사용한 내용을 작성하려 합니다.

> postgre에서는 mysql의 `desc`와 같은 명령어가 없어 위처럼 만들어 비슷하게 결과를 얻기위해 사용한다고 합니다.

## 기본사용 테스트 준비

설명을 생략하고 테스트를 하는데에 초점을 두기위해 필요한 작업만을 아래에 나열하겠습니다. 테스트할 내용은 `authenticate`기본 설정입니다.

auth_test라는 프로젝트를 생성합니다.

```bash
$ django-admin startproject auth_test
$ cd auth_test/
$ django-admin startapp apps
$ django-admin startapp account
```

위처럼 두 개의 앱을 생성합니다. (하나만 생성해도 충분합니다. 두 개를 만드는 것은 단지 구분시켜서 보기위함 입니다.)

### urls 설정

테스트에 필요한 url은 아래와 같습니다.

```python
# auth_test/auth_test/urls.py

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('', include('apps.urls')),             # 홈
    path('account/', include('account.urls')),  # sign CRUD
    path('admin/', admin.site.urls),
]
```

`apps`와 `account` 앱에 필요한 `urls.py`를 추가합니다.

```python
# auth_test/apps/urls.py

from django.urls import include, path
from . import views

app_name = 'apps'

urlpatterns = [
    path('', views.index, name='index'),
]

# =============================

# auth_test/account/urls.py
from django.urls import include, path
from . import views

app_name = 'account'

urlpatterns = [
    path('signin', views.signin, name='signin'),
    path('signout', views.signout, name='signout'),
    path('signup', views.signup, name='signup'),
    path('unsign', views.unsign, name='unsign'),
]
```

### template 설정

`url` 설정이 끝났다면 `template`을 작성합니다. 필요한 페이지인 `index`, `signin`, `signup` 까지만 생성하겠습니다.

{%raw%}

```html
<!-- auth_test/templates/auth_test/layout.html -->

{% load static %}
{% load customs %}
{% set request.path as path %}
<!DOCTYPE html>
<html lang="ko">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <title>Test Account</title>
    </head>

    <body>
        <nav class="navbar navbar-expand-sm navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="{% url 'apps:index' %}">Kimson</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link{{path|is_active:''}}" aria-current="page" href="{% url 'apps:index' %}">Home</a>
                        </li>
                        {% if user.is_authenticated %}
                        <li class="nav-item">
                            <form action="{% url 'account:signout' %}" method="post">
                                {% csrf_token %}
                                <button class="nav-link border-0 bg-transparent" href="">Sign out</button>
                            </form>
                        </li>
                        <li class="nav-item">
                            <span class="nav-link">{{user.username}}님</span>
                        </li>
                        {% else %}
                        <li class="nav-item">
                            <a class="nav-link{{path|is_active:'signin'}}" href="{% url 'account:signin' %}">Sign in</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link{{path|is_active:'signup'}}" href="{% url 'account:signup' %}">Sign up</a>
                        </li>
                        {% endif %}
                    </ul>
                    <form class="d-flex">
                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>
        <div class="container">
            <div class="my-5">
                {% block content %}{% endblock %}
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous">
        </script>
    </body>

</html>
```

위 코드 중 커스텀 태그가 있습니다. 해당 부분은 `html`페이지 예시코드 다음에 코드를 올리겠습니다. 이어서 계속 `html` 코드입니다.

```html
<!-- auth_test/teplates/auth_test/index.html -->
{% extends './layout.html' %}

{% block content %}
홈입니다.
{% endblock %}

=============================

<!-- auth_test/teplates/auth_test/signin.html -->
{% extends './layout.html' %}

{% block content %}
<form method="post" action="{% url 'account:signin' %}">
    {{form.as_p}}
    <button class="btn btn-info">Sign in</button>
    <a class="btn btn-success" href="{% url 'account:signup' %}">Sign up</a>
</form>
{% endblock %}

=============================

<!-- auth_test/teplates/auth_test/signin.html -->
{% extends './layout.html' %}

{% block content %}
<form method="post" action="{% url 'account:signup' %}">
    {{form.as_p}}
    <button class="btn btn-info">Sign up</button>
</form>
{% endblock %}
```

아까 봤던 `set`과 `is_active`인데요. `jekyll`을 다루신 적이 있다면 `liquid` 구문과 비슷하다고 생각하실 겁니다. 모르시는 분을 위해 간단하게 설명드리자면 `template`에서 약속되어진 기능이 있습니다. `lower`나 `upper`, `length` 등 입니다. 템플릿구문에서는 연산기호 "+" 또한 작동하지 않고 `add`라는 `filter`를 사용해야 "+"의 기능을 구현할 수 있습니다.

이 `filter`를 사용하다보면 필요로하는 기능이 없을 때는 만들어야합니다. 사용자 태그를 만드는 방법은 [이전에 작성한 포스팅](https://kkn1125.github.io/django-custom-tags/){:.target="_blank"}포스팅을 참고하시기 바랍니다. 공식문서를 보시려면 [공식문서::code-layout](https://docs.djangoproject.com/en/4.0/howto/custom-template-tags/#code-layout)를 참고바랍니다.

아래는 필요한 기능을 작성해놓은 예시로 보시면 되겠습니다. `customs.py`라는 파일을 만들어 내용을 작성하고 `template`부분의 코드 상단을 보면 `customs`를 `load`하는 방법으로 사용하는 것을 알 수 있습니다. `customs`라는 이름은 자유입니다. 단, `templatetags/` 디렉토리명은 가급적 변경안하는 것이 좋습니다. 변경한다면 `settings`에 `library`설정을 따로해 주셔야하므로 자세한 내용은 [공식문서::built-in backends](https://docs.djangoproject.com/en/4.0/topics/templates/#module-django.template.backends.django)의 `libraries`를 참조바랍니다.

```python
# auth_test/auth_test/templatetags/customs.py
from django import template

register = template.Library()

@register.simple_tag
def set (value): 
    """
    템플릿에서 전역 변수로 사용하기 위함
    """
    return value

@register.filter(name="is_active")
def is_active(value, key):
    """
    현재 페이지가 받은 key값과 일치하는지 여부를
    active 혹은 공백으로 값을 반환
    """
    path = value.split('/')[-1]
    if key == path :
        return ' active'
    else:
        return ''
```

`templatetags`는 이 포스팅에서 필수가 아닙니다.

{%endraw%}

> 여담이지만 `jekyll`의 템플릿 엔진은 `liquid`이고 `python`용의 템플릿 엔진은 `jinja2`입니다.

### views 설정

```python
# auth_test/apps/views.py

from django.urls import reverse
from django.shortcuts import render, redirect, get_object_or_404

from rest_framework.decorators import api_view

@api_view(['GET'])
def index(request):
    return render(request, 'apps/index.html', {})

# =============================

# auth_test/account/views.py
from django.shortcuts import redirect, render
from django.contrib.auth import login, logout, authenticate, forms
from django.urls import reverse
from rest_framework.decorators import api_view

@api_view(['GET', 'POST'])
def signin(request):
    if request.method == 'POST':
        print(request.POST['username'])
        print(request.POST['password'])
        form = forms.AuthenticationForm(request=request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            print(user)
            if user is not None:
                login(request, form.get_user())
                return redirect(reverse('apps:index'), '?success=1')
    else:
        form = forms.AuthenticationForm()
    context = {
        'form': form
    }
    return render(request, 'apps/signin.html', context)

@api_view(['POST'])
def signout(request):
    logout(request)
    return redirect('apps:index')
    
@api_view(['GET', 'POST'])
def signup(request):
    if request.method == 'POST':
        # username = request.POST.get('username')
        # password = request.POST.get('password')
        # user = User.objects.create(username=username)
        # user.set_password(password)
        # user.save() # 비밀번호 저장 방식이 다름
        
        form = forms.UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
        return redirect('account:signin')
    else:
        form = forms.UserCreationForm()
    context = {
        'form': form
    }
    return render(request, 'apps/signup.html', context)
    
@api_view(['POST'])
def unsign(request):
    return render()
    
```

위의 `views`까지 설정하고나면 기본 설정이 완료됩니다. `signup`에 주석처리된 내용은 확실히 아는 내용이 없습니다. 영어를 해석하기 힘듦도 있지만 사용했을 때 데이터를 조회해보면 `create_user`라는 메서드가 있다고 하는데 어느 클래스의 메서드인지 몰라 대신에 사용한 것이 `create`와 `set_password`입니다. 한 유저분은 위의 방식으로 하면 `UserCreationForm`으로 저장한 것과 동일하게 암호화되어 `db`에 저장된다고 합니다.

하지만 `set_password` 후 `save`하는 방식은 `db`를 조회해보면 암호화된 비밀번호의 길이가 `UserCreationForm`으로 저장한 비밀번호 길이와 다르기도 하고, 로그인 시 비밀번호가 매칭이 안됩니다. 자세히 어떤 원리로 저장되고 검증하는지 몰라서 추후 찾아보기 위해 주석으로 메모만 해둔 것 입니다. 그래서 이용하고자 하는 방식은 `UserCreationForm`입니다.

작성된 내용으로 서버를 실행시켜 보자면 아래와 같습니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="/images/post/django/authentication/auth02.png" alt="sample" title="sample">
   <figcaption>메인</figcaption>
</span>
</figure>

로그인과 회원가입이 있습니다. 로그인 되면 로그아웃과 사용자 명이 나타나게 됩니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="/images/post/django/authentication/auth03.png" alt="sample" title="sample">
   <figcaption>회원가입 폼</figcaption>
</span>
</figure>

지저분하지만 필요에 따라 다듬으면 됩니다. `AbstractUser`로 확장할 때 다듬어 보려합니다!

<figure class="text-center">
<span class="w-inline-block">
   <img src="/images/post/django/authentication/auth05.png" alt="sample" title="sample">
   <figcaption>로그인 폼</figcaption>
</span>
</figure>

로그인하게 되면 메인으로 이동하고,

<figure class="text-center">
<span class="w-inline-block">
   <img src="/images/post/django/authentication/auth06.png" alt="sample" title="sample">
   <figcaption>로그인</figcaption>
</span>
</figure>

현재 로그인 한 유저의 이름을 가져와 표시합니다.

내용이 길어져 `User`를 확장해서 사용하는 `AbstractUser`를 다루는 포스팅은 다음에 올리겠습니다.

-----

📚 함께 보면 좋은 내용

[programcreek :: Python django.contrib.auth.forms.AuthenticationForm() Examples](https://www.programcreek.com/python/example/64448/django.contrib.auth.forms.AuthenticationForm)

[리뷰나라 :: [postgresql] PostgreSQL“DESCRIBE TABLE”](http://daplus.net/postgresql-postgresqldescribe-table/)

[Stackoverflow :: Manager isn't available; User has been swapped for 'pet.Person'](https://stackoverflow.com/questions/17873855/manager-isnt-available-user-has-been-swapped-for-pet-person)

[Stackoverflow :: Django - Login with Email](https://stackoverflow.com/questions/37332190/django-login-with-email)

[rahmanfadhil :: Enable Login with Email in Django](https://rahmanfadhil.com/django-login-with-email/)

[wkdgus7113님 :: Django UserModel 확장 (feat. AbstractUser)](https://velog.io/@wkdgus7113/Django-UserModel-%ED%99%95%EC%9E%A5-feat.-AbstractUser)

[초보몽키님 :: django 04. 장고 개인 프로젝트 2 - 인증 (회원가입, 로그인)](https://wayhome25.github.io/django/2017/03/01/django-99-my-first-project-2/)

[jiffydev님 :: Django 6. 기본 개념 5(회원가입, 로그인 인증)](https://velog.io/@jiffydev/Django-6.-%EA%B8%B0%EB%B3%B8-%EA%B0%9C%EB%85%90-5%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%9D%B8%EC%A6%9D)

[해리님 :: Django 15 - 사용자 인증(회원가입/로그인/로그아웃)](https://tothefullest08.github.io/django/2019/06/03/Django15_accounts1/)

[Yurim Jin님 :: Django 15 - [Django] User 모델 email을 기본으로 하기& 썸네일 추가하기](https://milooy.wordpress.com/2016/02/18/extend-django-user-model/)

[테리는당근을좋아해님 :: [Django] 회원가입 기능 만들기](https://dheldh77.tistory.com/entry/Django-%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85-%EA%B8%B0%EB%8A%A5-%EB%A7%8C%EB%93%A4%EA%B8%B0)
