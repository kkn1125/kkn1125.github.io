---
layout: post
date:   2022-03-29 15:15:09 +0900
title:  "[DJANGO] User Authentication 사용하기 02"
author: Kimson
categories: [ django ]
image: assets/images/post/covers/TIL-django.png
tags: [ basic, til ]
description: "Authentication User 확장
용된 라이브러리나 템플릿 태그 등은 이전 포스팅을 참고하시기 바랍니다.
이어서 `User Authentication`을 확장해서 사용하는 것을 기록하려합니다. 찾아보니 4가지의 방법이 있습니다.

1. Proxy model
2. OneToOne 연결
3. `AbstractUser` model 사용
4. AbstractBaseUser model 사용

이번에 다룰 내용은 3번 `AbstractUser`이기 때문에 나머지는 추후에 다루도록 하겠습니다."
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

# Authentication User 확장

> 사용된 라이브러리나 템플릿 태그 등은 [이전 포스팅](https://kkn1125.github.io/django-authenticate/){:target="_blank"}을 참고하시기 바랍니다.

이어서 `User Authentication`을 확장해서 사용하는 것을 기록하려합니다. 찾아보니 4가지의 방법이 있습니다.

1. Proxy model
2. OneToOne 연결
3. `AbstractUser` model 사용
4. AbstractBaseUser model 사용

이번에 다룰 내용은 3번 `AbstractUser`이기 때문에 나머지는 추후에 다루도록 하겠습니다.

## 기본적인 설정

설정할 부분은 `settings.py`와 `models.py`입니다. 여기서 `models.py`에는 기본적으로 제공되는 `User`의 필드 외에 추가할 필드를 작성하게 됩니다.

기본적으로 10개의 필드가 있다면, `profile`, `gender`, `address`라는 필드 3개가 추가된다고 가정한다면 총 13개의 필드를 가진 `User`테이블을 만듭니다.

사용자화 하기 위해 우선 settings에 인증 유저 모델을 어떤 것을 참조하라고 설정해줘야 합니다.

```python
# auth_test/auth_test/settings.py

AUTH_USER_MODEL = 'myapp.MyUser'
```

현재 작업 중인 프로젝트 명과 클래스 이름을 예로들면 `apps.MyUser`이 됩니다. 파일 명 제외하고 파일 내에 있는 클래스명이 바로 붙습니다. 어차피 파일명을 실수도 붙이더라도 오류를 내면서 알려줍니다.

그 다음 `User`클래스에 `AbstractUser`를 상속합니다.

```python
# auth_test/apps/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class MyUser(AbstractUser):
    """
    models.Model이 아닌 AbstractUser입니다.
    """
    bio = models.CharField(max_length=300, null=True, blank=True)
```

`admin`을 사용하신다면 `admin`에서도 사용하기 위해 아래 처럼 내용을 작성합니다.

```python
# auth_test/apps/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import MyUser

admin.site.register(MyUser, UserAdmin)
```

`migrate`하기 전에는 `pgAdmin`을 확인할 때 아래와 같이 되어 있었습니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/django/authentication/auth08.png" alt="sample" title="sample">
   <figcaption>pgAdmin user</figcaption>
</span>
</figure>

## 수정 결과

특별한 데이터가 없기도 하고, 아직 커멘드라인으로 변경하는 방법을 몰라서 데이터베이스르 새로 만들고 `migrations`를 초기화했습니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/django/authentication/auth09.png" alt="sample" title="sample">
   <figcaption>makemigrations</figcaption>
</span>
</figure>

데이터베이스를 새로 생성하고 migrations하고 migrate하면

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/django/authentication/auth10.png" alt="sample" title="sample">
   <figcaption>migrate</figcaption>
</span>
</figure>

뭔가 주루룩 적용했다고 합니다. `pgAdmin`에서 확인해보면 아까 `user`테이블에는 `auth_`가 붙었는데 지금은 `앱이름_클래스이름`으로 테이블이 생성되어 있습니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/django/authentication/auth11.png" alt="sample" title="sample">
   <figcaption>pgAdmin user</figcaption>
</span>
</figure>

아까 추가했던 `bio`필드가 잘 들어갔습니다. 다른 방법을 아직 써보지 못해서 비교는 못하겠습니다만, 확장해서 사용하는 방식이 매우 단순해서 개인적으로는 손쉽게 적용가능한 방법이라 생각합니다. 단, 프로젝트를 시작하기 전에 하면 사용하면 좋을 것 같습니다.

이렇게 `bio`외에도 여러 필드를 추가해서 프로필 사진이나 주소지 등을 제어할 수 있게 되었습니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/django/authentication/auth12.png" alt="sample" title="sample">
   <figcaption>pgAdmin user</figcaption>
</span>
</figure>

위 이미지에 추가된 `bio`는 회원가입 폼을 `UserCreationForm`을 상속받아 `LoginForm`이라는 이름으로 따로 커스터마이징 했기 때문에 지정된 내용이 없이 출력 되었습니다.

앞서 말한 `AbstractUser`로 `User`클래스를 확장하는 부분은 다 보았습니다. 다음에는 `Authentication`에서 기본적으로 적용되는 `Validator`를 커스터마이징하고 필요에 따라 기능을 `활성`/`비활성` 시키는 내용을 정리하겠습니다.

-----

📚 함께 보면 좋은 내용

[Django::Customizing authentication in Django](https://docs.djangoproject.com/en/dev/topics/auth/customizing/#auth-custom-user){:target="_blank"}

[Yuda110님::[Django] Django 마이그레이션 초기화하기](https://yuda.dev/216){:target="_blank"}

[programcreek :: Python django.contrib.auth.forms.AuthenticationForm() Examples](https://www.programcreek.com/python/example/64448/django.contrib.auth.forms.AuthenticationForm){:target="_blank"}