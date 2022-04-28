---
layout: post
date:   2022-04-28 15:42:45 +0900
title:  "[DJANGO] ModelForm 03. Bootstrap5 Library와 Form Error 제어"
author: Kimson
categories: [ django ]
image: assets/images/post/covers/TIL-django.png
tags: [ error, css, til ]
description: ""
featured: true
hidden: false
rating: 3.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

<!-- 
Bootstrap5로 Form Error를 제어 해보자
1. bootstrap5와 bootstrap v5
   1. bootstrap5 기준으로 설명
2. bootstrap_form과 bootstrap_alert 사용법
   1. form 속성
   2. alert 속성
3. django에서 Form의 속성
   1. non_field_errors
   2. error_css_class와 required_css_class
   3. error_class의 이해
 -->

# Bootstrap5로 Form Error 제어

> `bootstrap5`로 생성된 `alert`에 클래스를 추가하는 내용에 대한 글이 1도 없어서 악착같이 찾았습니다 😥

3월에 `ModelForm`관련 포스팅을 한 기억이 있습니다. 이번에는 `ValidationError`를 통해 생성되는 `Error message`를 제어하는 이야기를 하려 합니다.

사용된 라이브러리는 `django-bootstrap5`이고, 이야기할 상황은 "로그인 처리"입니다.

```python
# forms.py

# AbstractUser를 상속받은 Profile 클래스의 clean 메서드
def clean(self):
        email = self.cleaned_data.get('username')
        input_password = self.cleaned_data.get('password')
        find_user = Profile.objects.filter(email=email)
        
        if (not email) or (not input_password):
            raise ValidationError('이메일과 비밀번호 중 빈 칸이 있습니다.')
        
        hashed_password = find_user.get(email=email).password
        if not re.fullmatch(r'[\w\d\_\-]+@[A-z]+\.[A-z]+', email):
            raise ValidationError('잘못된 이메일 형식입니다.')
        if not find_user.exists():
            raise ValidationError('없는 회원 정보입니다.')
        if not check_password(input_password, hashed_password):
            raise ValidationError('회원정보가 일치하지 않습니다. 이메일과 비밀번호를 확인하세요.')
            
        return self.cleaned_data
```

## bootstrap5 vs bootstrap-v5

> 모르시는 분을 위해 먼저 알아야할 것이 있습니다.

예시를 보다보면 `bootstrap5` 혹은 `django_bootstrap5`로 라이브러리를 사용하는 경우를 볼 수 있습니다.

`github`저장소를 보면 `ZOSTERA B.V`에서 만든 `django-bootstrap5`가 원본이고, `django-bootstrap-v5`라는 문서는 한 개발자가 `fork`하고 수정한 복사본 입니다.

{%raw%}

```html
{% load django_bootstrap5 %} ⇐ django-bootstrap5   ✅
{% load bootstrap5 %}        ⇐ django-bootstrap-v5 ❌
```

{%endraw%}

`django-bootstrap5`를 사용해서 이야기를 이어나가겠습니다.

> `bootstrap5`를 사용하지 말라는 뜻이 아닙니다!

## bootstrap_form 사용법

`bootstrap_form`에는 3가지 인자가 있고 `layout`인자를 사용할 수 있습니다.

{%raw%}

```html
{% load django-bootstrap5 %}

{% bootstrap_form form %}

{% bootstrap_form form exclude="" %}

{% bootstrap_form form exclude="" alert_error_type="" %}

{% bootstrap_form form exclude="" alert_error_type="" layout="inline" %}
```

{%endraw%}

사용예시는 위와 같습니다. `form`은 `modelForm`객체를 말합니다. `exclude`는 필드 중에서 제외하고자 하는 필드의 이름을 적습니다. `username`과 `password`를 모두 제외하고 싶다면, "username,password"라고 적으면 됩니다. `password`하나만 쓰면 아래와 같이 `email`만 표시됩니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://user-images.githubusercontent.com/71887242/165701707-5c4fa5f5-5207-4000-b289-9c795bdce814.png" alt="sample" title="sample">
   <figcaption>exclude - password</figcaption>
</span>
</figure>

`alert_error_type`은 정해진 값이 있습니다. `all`, `fields`, `non_fields` 세가지 이고, 기본 값이 `non_fields`입니다. 빈 칸으로 두게 되면 `error` 메시지가 사라집니다.

아래 이미지는 차례대로 적용한 예시입니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://user-images.githubusercontent.com/71887242/165687894-ca2114fa-8bca-4063-949e-99c075231a35.png" alt="sample" title="sample">
   <figcaption>alert_error_type - all</figcaption>
</span>
</figure>

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://user-images.githubusercontent.com/71887242/165688025-ea624d1d-20ac-4c85-8f09-2d2eaee42373.png" alt="sample" title="sample">
   <figcaption>alert_error_type - fields</figcaption>
</span>
</figure>

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://user-images.githubusercontent.com/71887242/165688163-cd740007-e676-46b6-8a08-cc8da6e053ce.png" alt="sample" title="sample">
   <figcaption>alert_error_type - non_fields</figcaption>
</span>
</figure>

## bootstrap_alert 사용법

`bootstrap_alert`에는 4가지 인자가 있고, 사용예시는 아래와 같습니다.

{%raw%}

```html
{% load django-bootstrap5 %}

{% bootstrap_alert "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit, quia?" %}

{% bootstrap_alert content %}

{% bootstrap_alert form.errors alert_type="" %}

{% bootstrap_alert form.errors alert_type="" dismissible=True %}

{% bootstrap_alert form.errors alert_type="" dismissible=False %}

{% bootstrap_alert form.non_field_errors.as_text alert_type="danger" dismissible=False extra_classes="pt-5" %}
```

{%endraw%}

`content`영역에는 텍스트를 받습니다. `alert`으로 받은 내용을 표시해줍니다. `alert_type`은 `bootstrap`이 지정한 색상이름 모두 사용가능합니다. info, success, primary, warning, danger 등등

`dismissible`은 닫을 수 있는지 여부를 설정하며, 기본 값 `True`입니다. `False`로 지정하면 닫기 버튼 없는 `alert`이 표시됩니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://user-images.githubusercontent.com/71887242/165704520-df4c0a8f-3ea5-4443-ae23-749370e84d28.png" alt="sample" title="sample">
   <figcaption>dismissible - False</figcaption>
</span>
</figure>

`extra_classes`는 `alert`이 붙은 태그의 `class`속성에 추가할 클래스 이름을 적습니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://user-images.githubusercontent.com/71887242/165705065-919d9237-89b2-4954-81fc-85d459046975.png" alt="sample" title="sample">
   <figcaption>extra_classes - pt-5</figcaption>
</span>
</figure>

이 글을 쓰기 전까지 "찾아 헤메던 문제"가 이렇게 허무하게 해결됐습니다 😂

## error-*class

`django` 문서를 찾다보니 `error_css_class`와 `required_css_class` 속성을 발견했습니다. 원하던 문제는 해결했지만 유용한 내용이라 생각합니다.

```python
class SigninForm(AuthenticationForm):

    # 에러가 발생한 행에 클래스를 추가합니다.
    error_css_class = 'err'
    # 필수 항목인 행에 클래스를 추가합니다. 에러와 관계 없이 지정됩니다.
    required_css_class = 'kimson'
```

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://user-images.githubusercontent.com/71887242/165706663-b700a572-b815-4278-aae3-d44b2f79a627.png" alt="sample" title="sample">
   <figcaption>extra_classes - pt-5</figcaption>
</span>
</figure>

`required_css_class`는 `required` 속성이 있는 행에 클래스를 추가하고, `error_css_class`는 에러가 발생한 행에만 클래스 명이 붙습니다.

## *errors와 error_class

앞서 말한 `bootstrap_alert`을 쓰지 않고 `error`메시지를 커스터마이징 한다면 어떻게 해야할까요?

`bootstrap_form`의 인자에서 `alert_error_type`을 사용해야하는데요. 아무 설정 없이 사용한다면 아래와 같이 `ul`태그에 감싸여 표시됩니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://user-images.githubusercontent.com/71887242/165708132-21c68685-01bb-40e8-ad88-97eaee001a85.png" alt="sample" title="sample">
   <figcaption>bootstrap_form - alert_error_type</figcaption>
</span>
</figure>

알아낸 내용으로는 래핑하거나 `text`로 꺼내는 등의 방법은 모르겠습니다만 `ul`태그에 클래스를 지정하는 방법은 있습니다.

`views.py`에서 클래스 명을 추가하는 방법이고, 아래와 같습니다.

```python
def signin(request):
    if request.method == 'POST':
        # ...
    elif request.method == 'GET':
        # ...

    form.non_field_errors().error_class = "list-unstyled errorlist nonfield"

    return render(request, 'account/signin.html', {'form':form})
```

`error_class`에 값을 지정 혹은 누적시키면 에러 메시지를 둘러싼 `ul`태그의 클래스에 추가 혹은 덮어씁니다.

## 마무리

유용한 정보가 부족하다 생각됩니다. 문서를 보면 바로 나오는 내용이지만 사용해보고 정리하면 누군가는 편하게 접하지 않을까 싶습니다.

모델폼 관련된 내용은 계속해서 업데이트할 예정입니다 😁

-----

📚 함께 보면 좋은 내용

[Django Docs::Styling required or erroneous form rows](https://docs.djangoproject.com/en/4.0/ref/forms/api/#django.forms.ErrorList.error_class){:target="_blank"}

[django-bootstrap5::Docs](https://django-bootstrap5.readthedocs.io/en/latest/templatetags.html#bootstrap-form){:target="_blank"}