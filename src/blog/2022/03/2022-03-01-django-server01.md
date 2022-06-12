---
slug: "/django-server01"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2022-03-01 21:45:49 +0900
title:  "[DJANGO] Django 서버를 만들자 01"
author: Kimson
categories: [ django ]
image: assets/images/post/covers/TIL-django.png
tags: [ python, django, til ]
description: "Django 서버 구축

새로운 환경이라 아직 이해는 잘 안 됩니다. 많이 부족한 부분이 있으니 양해바랍니다."
featured: false
hidden: false
rating: 4.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# Django 서버 구축

새로운 환경이라 아직 이해는 잘 안 됩니다. 많이 부족한 부분이 있으니 양해바랍니다.

## django 프로젝트 생성

먼저 django를 설치합니다. 설치되어 있으면 버전을 확인해봅니다.

```bash
$ python -m django --version
```

이후 프로젝트를 생성합니다.

```bash
$ django-admin startproject sitename
```

- sitename
  - manage.py
  - sitename
    - \_\_init\_\_.py
    - settings.py
    - urls.py
    - asgi.py
    - wsgi.py

이렇게 생성되는데요. manage.py는 프로젝트 생성했던 `django-admin`이나 `python manage.py [...]`처럼 다양한 명령을 내릴 수 있게 하고, 프로젝트와 상호작용하는 커멘드라인 유틸리티(django의 명령줄 유틸리티)입니다.

프로젝트 생성 후 `sitename`으로 폴더가 생성되고, 내부에 같은 이름의 폴더가 더 생깁니다.

최상위 프로젝트 폴더는 vue나 react에서 프로젝트 만들고 나면 생기는 최상위 폴더처럼 이름을 바꾸거나 해도 상관없습니다.

내부에 있는 `sitename/`폴더는 python 패키지들이 저장되고, 디텍토리 이름을 이용해서 프로젝트 내에서 python 패키지들을 임포트 가능하게 합니다.

예를 들면, 데이터베이스를 만들고나서 `settings.py`에서 디렉토리를 등록할 때 `INSTALLED_APPS`에 명칭을 넣거나 `sitename/urls.py`에서 `urlpatterns`를 설정할 때 등에 사용이 됩니다.

`sitename/__init__.py`는 아직 잘 모르겠습니다. 패키지 관련 문서를 읽어라 되어 있지만 아직 중요하지 않으므로 패스.

`sitename/settings.py`는 `vue`로 따지면 `vue.config.js`와 유사합니다. 프로젝트의 환경이나 구성을 조정합니다.

그 외 나머지는 다음에 차차 알아보겠습니다.

## 페이지 생성

서버를 구축해서 필요하다고 생각 되는 것 위주로 단계를 건너뛰었습니다.

개인적으로 필요하다고 생각되는 기본이 페이지 생성과 연결, 데이터베이스 조작 및 연결 이라 생각합니다.

페이지는 `sitename/urls.py`에서 설정합니다.

```python
# sitename/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('blog.urls')),
    path('admin/', admin.site.urls),
]
```

위 처럼 생겼습니다. path 함수에 대한 인자들의 설명은 공홈에 잘 설명되어 있어서 현재 보이는 두 가지만 짚고 넘어가겠습니다.

첫 번째 인자로는 경로입니다. 앞에 "/"를 제외하고 붙입니다. 빈 문자열로 두면 `localhost:8000/`와 같습니다. `admin/`이면 `localhost:8080/admin/`이 됩니다. 이 인자를 `route`라고 합니다.

두 번째 인자는 `view`입니다. 장고에서 일치하는 패턴을 찾으면 특정 `view`함수를 호출한다고 합니다. 경로에 맞는 페이지 찾아서 보여준다고 생각하면 될 것 같습니다.

여기서 끝이 아닙니다. 다음으로 `urls.py`를 한 번 더 설정해줘야합니다.

장고에서 프로젝트는 환경으로 보고, `app`은 어떠한 작업을 수행하는 웹 애플리케이션을 말합니다. 예를 들어 `blog`라는 앱을 생성한다고 가정하겠습니다.

경로는 sitename/에서 아래의 명령을 하면 blog라는 폴더가 생성됩니다.

```bash
$ python manage.py startapp blog
```

`sitename/blog/` 폴더에는 루트에 있는 설정파일과 유사한 것들이 생성됩니다. 이때 우리가 만들어줘야 하는 것이 있는데요. `urls.py`와 `static/` 폴더(선택), `templates/blog/`("s" 누락 주의)입니다.

`templates/blog`에서 페이지들을 만들고 레이아웃을 짭니다.

`static`은 리소스들을 저장해두고, `urls.py`는 아까 루트의 `urls.py`설정에 이어서 설정해야하는 파일입니다.

```python
# sitename/blog/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.post_list, name = 'post_list'),
    path('a/', views.test, name = 'a'),
    path('post/<int:pk>/', views.post_detail, name = 'post_detail'),
]
```

아까 짰던 루트의 `urls.py`는 `baseurl`처럼 최상위 경로를 설정한 것이고, `blog/urls.py`는 `blog`앱의 하위 경로를 설정합니다. `''`으로 비워두면 루트의 `urls.py`가 만일 `admin/`일 때 `localhost:8000/admin/`이 되고 위의 경로와 같이 `''`일 때 하위 경로도 `''`이면 `localhost:8000/`이 됩니다.

`''`경로 아래 `'a/'`는 `localhost:8000/a/`가 됩니다. 그리고 `views.py`에 있는 `test`함수를 인자로 주는 것 입니다.

그리고 `<int:pk>`는 `spring`으로 볼 때 `@PathVariable("num")`과 유사합니다. `localhost:8000/post/1/` 경로에 꼬리를 물고 나갈 때 해당 경로 값을 pk로 사용할 수 있습니다.

이 pk를 사용하려면 아래 코드를 참고하면 됩니다.

{%raw%}

```html
<a href="{% url 'post_detail' pk=post.pk %}">{{ post.title }}</a>
```

html의 url 옆에 있는 텍스트는 

```python
# sitename/blog/urls.py

urlpatterns = [
  # ...
  path('post/<int:pk>/', views.post_detail, name = 'post_detail'),
]
```

`blog/urls.py`에서 라우트 설정할 때 지정한 `name`과 같아야합니다. 그러면 `pk=post.pk`라 할 때 a태그의 경로가 `/post/:pk/`가 됩니다.

```python
def post_detail(request, pk):
    post = get_object_or_404(Info, pk=pk)
    return render(request, 'blog/post_detail.html', {'post': post})
```

이제 `views.py`를 설정하겠습니다. 화면을 렌더링할 때 방법이 몇 가지 있는 것 같습니다. `Spring`을 예로 들면 `@ResponseBody`나 `@RestController` 혹은 `tiles`를 쓰지 않고 컨트롤러에서 `return`값을 텍스트로 주는 등의 방법들 처럼요.

> `pk`라는 명칭은 처음에 설정한 `<int:pk>`의 이름과 `views.py`에 지정한 인수의 명칭, 그리고 `a`태그에 `name`옆에 지정하는 `pk`명칭과 같아야 합니다. 셋 중 하나라도 틀리면 오작동 합니다.

```python
from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

# 방법 1 -> 단순히 텍스트를 응답해 줌
def post_list(request):
  return HttpResponse("<div>안녕, 세계!</div>")

# 방법 2 -> 컨텍스트 같이 보내줌
def post_list(request):
  context = {'name': 'kimson'}
  template = loader.get_template('blog/post_list.html')
  return HttpResponse(template.render(context, request))

# 방법 3 -> 더 보기 쉽게 request와 렌더링 할 파일 경로, 컨텍스트를 보내 줌
def post_list(request):
  context = {'name': 'kimson'}
  return render(request, 'blog/post_list.html', context)
# blog/post_list.html파일의 내용이 렌더링 됨
```

여기서 sqlite3를 사용한 예로 데이터베이스를 가져와 페이지에 전달하는 것을 적어두려합니다.

```python
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from .models import Info

def post_list(request):
  post = get_object_or_404(Info, pk=pk)
  return render(request, 'blog/post_list.html', context)
```

> get_object_or_404는 이후 404 페이지를 커스터마이징 할 때 사용한다고 합니다. 이 내용은 추후에.

## 장고 템플릿 문법

```html
{% extends "path/index.html" %} 해당 경로에 block을 넣는다.

{% block title %} {{ info.title }} {% endblock %}
{% block content %}
  {% for post in posts %}
    <h1>{{ post.title }}</h1>
    <a href="{{ post.url }}">{{ post.headline | upper }}</a>
    <p>
      {{ post.content | truncatewords: 100, '...' }}
    </p>
  {% endfor %}
{% endblock %}
```

`jekyll liquid`와 유사해서 좋네요. 대문자로 바꾼다던지, 문자열을 잘라낸다던지 등의 문법이 오히려 쉽게 접하기 쉽게 다가옵니다.

이제 다음으로 `sqlite`는 사용법을 좀 익히고나서 `postgre`를 알고자합니다. `mysql`이 익숙하지만 `django`가 `postgre`와 잘 맞는다는 이야기를 듣고 다음에는 `postgre`를 연동해서 간단한 게시판 페이지를 만들려합니다. 이상.

{%endraw%}

-----

📚 함께 보면 좋은 내용

[Django :: Documentation](https://docs.djangoproject.com/en/4.0/ref/templates/language/){:target="_blank"}

[Django tutorial :: 장고 템플릿](https://tutorial.djangogirls.org/ko/django_templates/){:target="_blank"}

[천사진수님 :: Django Template Does Not Exist](https://angel-jinsu.tistory.com/5){:target="_blank"}

[Tigercow.Door님 :: 장고(django) #3_ django에서 postgreSQL 사용하기](https://doorbw.tistory.com/183){:target="_blank"}