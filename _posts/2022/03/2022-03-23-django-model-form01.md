---
layout: post
date:   2022-03-23 13:27:18 +0900
title:  "[DJANGO] 회원 정보 기존 정보에 덮어 수정하기"
author: Kimson
categories: [ django ]
image: assets/images/post/covers/TIL-django.png
tags: [ basic, til ]
description: "기존 정보에 수정된 정보를 덮어쓰기

회원정보를 수정하다보면 초기에는 `request.POST['datatype']`으로 하나씩 받아와 데이터베이스를 조회해서 user를 가져오고 하나 씩 담았습니다.

위의 형식이 꽤 번거로웠습니다. 스프링에서는 form data를 전송하면 request를 보낼 때 알아서 객체에 담아줬습니다. 분명 장고에도 있을 거라는 예감은 틀리지 않았습니다."
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

# 기존 정보에 수정된 정보를 덮어쓰기

회원정보를 수정하다보면 초기에는 `request.POST['datatype']`으로 하나씩 받아와 데이터베이스를 조회해서 user를 가져오고 하나 씩 담았습니다.

```python
def update(request, num):
    user = User.objects.filter(pk=num).get(pk=num)

    nickname = request.POST['nickname']
    email = request.POST['email']
    password = request.POST['password']
    profile = request.POST['profile']

    user.nickname = nickname
    user.email = email
    user.password = password
    user.profile = profile

    user.save()
```

위의 형식이 꽤 번거로웠습니다. 스프링에서는 form data를 전송하면 request를 보낼 때 알아서 객체에 담아줬습니다. 분명 장고에도 있을 거라는 예감은 틀리지 않았습니다.

## 모델 폼

modelForm을 쓰다보면 `create`, `update`가 단 몇 줄에 끝납니다. 그렇게 편하게 쓰던 중에 고민이 하나 생겼습니다.

### 공백은 무시하고 작성한 데이터만 받기

게시글을 수정할 때는 모든 데이터를 받아 업데이트 폼으로 연결하면 해당 데이터들이 pk값 빼고는 다 나타나는 구조였습니다.

```python
from django.db import models
from django.utils import timezone
class Post(models.Model):
    num = models.AutoField(primary_key=True)
    title = models.CharField(max_length=45, null=False, unique=True)
    content = models.CharField(max_length=1000, null=False)
    author = models.CharField(max_length=45, null=False)
    regdate = models.DateTimeField('created', default=timezone.now, editable=False, null=False, blank=False)
    updates = models.DateTimeField('updated', default=timezone.now, editable=False, null=False, blank=False)
```

대략 위와 같은 컬럼은 가진 모델로 작성했습니다. 그런데 만일 변경하지 않아도 되는, 즉, 기존 값을 유지하되 새로운 값이 있으면 덮어써야 하는 경우가 발생하는 때가 있습니다.

예를들면 이미지같은 경우입니다.

```python
class Post(models.Model):
    # 코드 상동
    """
    이미지 필드 추가
    """
    cover = models.ImageField(upload_to="", null=True, blank=True)
    # ...
```

이렇게 이미지 필드가 추가된 경우에는 `html input`태그의 `file`타입 특성상 `value`값 설정이 안 됩니다.

태그에 `value`를 지정해도 `form`데이터에 넘겨도 [보안상 이유](https://jkorpela.fi/forms/file.html#value){:target="_blank"}로 값이 넘어가지 않습니다.

그리고 `cover` 필드 추가와 함께 저는 `forms.py`에 작성된 패스워드 필드와 커버 필드에 속성을 변경했습니다.

```python
class UserForm(ModelForm):
    """ 추가 """
    cover = ImageField(widget=FileInput(attrs={'type': 'file'}))
    password = CharField(widget=PasswordInput(attrs={'type': 'password', 'autocomplete': 'current-password'}))
    """ 추가 """
    class Meta:
        model = User
        fields = [
            'profile', 'nickname', 'email', 'password'
            ]
        widgets = {
            'email': EmailInput(attrs={'autocomplete': 'username'}),
        }
```

> cover type을 또 지정해 준 이유는 django에서 기본적으로 fileInput에 현재와 변경 정보를 함께 띄워줍니다. 그게 싫어서 file input만 나타나게 하기 위함입니다.  
> password는 charfield이지만 암호화되어 보여야하니 type을 변경한 것 입니다.

```python
import .models from User
import .forms from UserForm
import rest_framework.decorators from api_view

@api_view(['GET', 'POST'])
def update(request, num):
    user = User.objects.filter(num=num).get(num=num)

    if request.method == 'GET':

        context = {
            'path_type': path_type(request),
            'userForm': UserForm(instance=user),
        }

        return render(request, 'scheduler/signup.html', context)

    else:
        userForm = UserForm(request.POST or None,
                            request.FILES or None,
                            instance=user)

        if userForm.is_valid():
            uf = userForm.save(commit=False)
            request.session['sign'] = uf.pk
            uf.save()

        return redirect('account:update', user.pk)
```

위 코드처럼 `UserForm`에 `instance`와 `request`를 넣어줬습니다. `cover`라는 `field`도 추가를 했구요. 이대로 `form`을 작성하고 `post`요청하게 되면 데이터가 변경/저장 되지 않습니다. `is_valid`에서 `Falsy`한 값을 받아 `save`되지 않게 됩니다.

이유는 `request.FILES['profile']`이 빈 값이고, 비밀번호는 `password`타입으로 변경하면 instance에 유저 정보를 넣고 form을 출력해도 `value`에 회원 비밀번호가 들어가지 않습니다.

이렇게 빈 값이 발생하면 `is_valid`에서 막히게 되는데 찾아보니 간단하게 해결할 수 있는 문제였습니다.

`forms.py`에 있던 `password`와 `cover`에 `requied`를 `False`로 변경해줍니다.

```python
# forms.py
class UserForm(ModelForm):
    cover = ImageField(required=False, widget=FileInput(attrs={'type': 'file'}))
    password = CharField(required=False, widget=PasswordInput(attrs={'type': 'password', 'autocomplete': 'current-password'}))

    # Meta ...
```

이제 `cover`는 필수로 받는 항목이 아니기 때문에 이미지 파일을 새로 업로드 하지 않아도, 빈값으로 form `data`가 전송되어져도 기존의 값 그대로 유지 됩니다.

하지만 `password`는 아닙니다. 무엇 때문인지 자세히 모릅니다. <span class="text-danger fw-bold">어디까지나 추측입니다만</span>, `type`에 `password`가 설정되면서 `value`에 값이 들어가지 않는 점이 문제라 생각됩니다.

즉, 애초에 `password type`의 `input`은 보안상 `value`에 값이 들어가지 않으니 `form data`가 `POST`로 전송된다면, 일반적으로 패스워드는 로그인에 사용하기 때문에 필수 항목으로 보고 가져와 적용하는 것으로 생각됩니다. 자세한 원리는 찾아서 포스팅 내용을 수정하도록 하겠습니다. 어디까지나 제 생각입니다.

그래서 cover는 required를 False로 설정하면 해결됩니다. password는 is_valid하기 전에 User모델에서 pk값으로 가져온 데이터의 비밀번호를 변수에 담아두고 입력된 비밀번호가 빈 값일 때 저장해두었던 변수를 대신 저장시키는 방식으로 하면 됩니다.

```python
# 생략

@api_view(['GET', 'POST'])
def update(request):
    # 생략
    user = User.objects.filter(num=num).get(num=num)
    origin_password = user.password         # +
    
    if request.method == 'GET':
        # 생략

    else:
        # 생략

        if userForm.is_valid():
            uf = userForm.save(commit=False)
            if not uf.password:             # +
                uf.password = origin_pass   # +

            # 생략

            uf.save()
        return redirect('account:update', user.pk)
```

찾아보면 분명히 간결하고 편리한 방법이 있을 것이라 생각합니다. 포스팅에 포함된 추측성 내용은 추후에 알게되면 정정해서 다시 게재할 예정입니다.

-----

📚 함께 보면 좋은 내용

[해리님 :: Django 24 - 유저 정보 수정 & 삭제](https://tothefullest08.github.io/django/2019/06/19/Django24_accounts4_update_delete_password/){:target="_blank"}

[sosin님 :: Django Validator / 장고 유효성 검증 / Form에서 유효성 검증하기](https://programmers-sosin.tistory.com/entry/Django-Validator-%EC%9E%A5%EA%B3%A0-%EC%9C%A0%ED%9A%A8%EC%84%B1-%EA%B2%80%EC%A6%9D-Form%EC%97%90%EC%84%9C-%EC%9C%A0%ED%9A%A8%EC%84%B1-%EA%B2%80%EC%A6%9D%ED%95%98%EA%B8%B0){:target="_blank"}

[반원_SemiCircle님 :: django - 로그인 처리 (세션 이용)](https://gosmcom.tistory.com/143){:target="_blank"}

[Stackoverflow :: django - Show initial value for FileField in django-template](https://stackoverflow.com/questions/37475302/show-initial-value-for-filefield-in-django-template){:target="_blank"}