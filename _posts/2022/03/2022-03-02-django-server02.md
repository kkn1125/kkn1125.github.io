---
layout: post
date:   2022-03-02 15:54:40 +0900
title:  "[DJANGO] Django 서버를 만들자 02"
author: Kimson
categories: [ DJANGO, TIL ]
image: assets/images/post/covers/TIL-django.png
tags: [ python, django, mysql, rest ]
description: "Django MySQL연결과 Rest framework

이번 포스팅은 데이터베이스 연결과 rest api를 사용하는 것에 대해 기록하려합니다.

db는 spring을 다룰 때도 mysql을 사용했었기 때문에 익숙한 것을 선택했구요. spring에서 사용했던 `put`과 `delete` method를 사용하기 위해 `rest_framework.decorate`를 사용하려합니다."
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

# Django MySQL연결과 Rest framework

이번 포스팅은 데이터베이스 연결과 rest api를 사용하는 것에 대해 기록하려합니다.

db는 spring을 다룰 때도 mysql을 사용했었기 때문에 익숙한 것을 선택했구요. spring에서 사용했던 `put`과 `delete` method를 사용하기 위해 `rest_framework.decorate`를 사용하려합니다.

## 준비

데이터베이스를 사용하고 api_view를 사용하려면 아래와 같이 설치할 게 두 가지가 있습니다.

```bash
$ pip install mysqlclient
$ pip install djangorestframework
```

그리고 `settings.py`에 "나 이거 사용할거야"라고 등록을 해줍니다.

```python
# settings.py
INSTALLED_APPS = [
  # ...
  'rest_framework',
  # ...
]

import my_database # 외부 파일을 가져올 것이기에 미리 적습니다.

DATABASES = my_database.DATABASES # 가져온 것을 DATABASES에 넣어줍니다.
```


## 데이터베이스 연결하기

이렇게 세팅이 끝났다면 이제 `my_database`를 설정할 겁니다. 이제부터 편의상 프로젝트 최상위 폴더를 `root`라 칭하겠습니다.

`root/my_database.py`를 생성합니다.

```python
# root/my_database.py

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'py_board',
        'USER': 'mysql_id',
        'PASSWORD': 'mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

> 주의할 점은 password가 노출되는 것은 좋지 않으니, .gitignore에서 꼭 등록해주어야 합니다.

```sh
# .gitignore 예제
my_database.py
```

데이터베이스 연결이 스프링과 비교하자면 매우 쉬웠습니다. 이게 연결 끝입니다.

이제 이것을 활용하려면 `django`에서 지원하는 `query`에 대해 알아야합니다. 이부분은 제가 여기에 알려주고 기록한다해도 스스로가 하지않으면 안되는 영역이라 생각합니다.

자주 쓰이는 것은 `objects.all()`과 `objects.get()`이라는 것 밖에는 없네요.

## View 구현하기

여러가지 찾다보니 View를 구성하는 방식이 엄청 많았습니다. api_view를 사용해서 스프링의 어노테이션처럼 `@api_view(['GET', 'POST'])`이렇게 함수에 바로 붙여 설정하기도 하고, `api`를 만들 때에 `APIView`를 사용해서 `json`으로 출력하는 등의 방법이 많았습니다.

저는 그 중에서도 제가 사용하는데 거리낌없이 익숙한데 새로운 것들만 골라 정리하려합니다. `api_view`와 `View`를 사용해보겠습니다.

### django.views의 View 사용

View의 사용은 아직 알아볼게 많지만 정리해두겠습니다. 들어가기에 앞서 django에서는 `GET`과 `POST` 외의 요청은 `formdata`로 지원이 되지 않습니다.

`postman`으로 확인해보면 `PUT`과 `DELETE`요청이 받아들여지긴 하지만 이를 사용하려면 `ajax`를 이용하거나 스프링에서 사용하던 `_method`를 `hidden`으로 보내주고 `views.py`에서 조작하면 됩니다.

실제 `PUT`과 `DELETE`는 아니지만 유사하게 사용할 수는 있습니다.

먼저 `View`를 사용할 때를 보겠습니다.

```python
# views.py

# from django.shortcuts import redirect, render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.views import View

class PostView(View):
    def get(self, request, *args, **kwargs):
      print(kwargs.num) # num이라는 이름으로 파라미터를 넘겼을 때
      board = Board.objects.all()
      context = {
          'board': board
      }
      return render(request, 'blog/post_list.html', context)
      # return HttpResponse("get 요청!") <- 이것도 됩니다.
      # return JsonResponse({
      #   'dummy_name' : 'kimson',
      #   'dummy_age' : 30,
      #   'dummy_job' : 'no',
      # }) <- json데이터 뿌려줄 때
    
    def post(self, request, *args, **kwargs):
      print(request)
      context = {
          'post': 1
      }
      return render(request, 'blog/post_detail.html', context)
      # return HttpResponse("post 요청!") <- 이것도 됩니다.
  
    def put(self, request, *args, **kwargs):
      return render("""...""")
      # return HttpResponse("put 요청!") <- 이것도 됩니다.

    def delete(self, request, *args, **kwargs):
      return render("""...""")
      # return HttpResponse("delete 요청!") <- 이것도 됩니다.
```

`url` 세팅은 다음과 같습니다.

```python
from django.urls import path

from . import views

urlpatterns = [
  path('', views.PostView.as_view(), name = 'post_list'),
]
```

> 테스트 할 때 `postman`을 사용하신다면 `GET`요청 외에는 `csrftoken`값을 넘겨줘야 합니다. `csrftoken`은 쿠키에 보시면 있습니다.

공식 홈페이지에서 본 튜토리얼과는 좀 다른 형태입니다. 함수들을 타고타고 올라가서 구성된 내용을 보니 대강은 이해가 됩니다.

이렇게 보니 하나의 `path`에 4가지 메서드 요청을 처리해주고 있습니다. `api`를 만들고 `axios`로 나중에 프론트에서 만져주면 될 것 같다는 생각이 듭니다. 아직 익숙하지 않아서 **방법만 알고 넘어가려**합니다.

각 `path`별로 `class`를 만들고 `GET`, `POST`, `PUT`, `DELETE`를 따로 만들어 관리하면 직관적이라 관리할 때 용이 할 것 같습니다.

### rest_framework.decorates의 api_view 사용

현재 계속해서 사용중인 `api_view`입니다.

```python
from django.shortcuts import render, redirect
from rest_framework.decorators import api_view

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def post_control(request, num):
    print(request.method)
    if request.method == 'GET':
        post = get_object_or_404(Board, num=num)
        
        context = {
            'post': post
        }
    
        return render(request, 'blog/post_control.html', context)
    elif request.method == 'POST' and request.POST['_method'] == 'delete':
        board = Board.objects.get(num=num)
        board.delete()
        
        return redirect('post_list')
    elif request.method == 'DELETE':
      # ... axios, ajax로 요청보낼 때 등등
```

현재 게시판을 만들고 있는 `views.py`의 일부인데요. `request.POST`의 `QueryDict`에 담겨 전달되는 `_method`를 받아 분기문으로 처리하고 있습니다.

이 방법 외에 아래의 방법도 있습니다.

```python
# ref - 포스팅 최하단 링크 참조 [Stackoverflow]

class TestView(View):
  def dispatch(self, *args, **kwargs):
    method = self.request.POST.get('_method', '').lower()
    if method == 'put':
      return self.put(*args, **kwargs)
    if method == 'delete':
      return self.delete(*args, **kwargs)
    return super(TestView, self).dispatch(*args, **kwargs)

  def put(self, *args, **kwargs):
    print("나는 %s입니다." % self.request.POST.get('_method'))

  def delete(self, *args, **kwargs):
    print("나는 %s입니다." % self.request.POST.get('_method'))
```

여기까지 사용하는 형태만을 봤는데요. `class`로 `method`요청 처리를 하던, `api_view`로 처리하던 아직까지는 큰 차이점을 느끼지 못하겠습니다. 사용하다보면 더 좋은 방법이 있을테고 또 배워서 제 것으로 만들어야 겠지요.

### django 튜토리얼의 view 처리

`url` 세팅은 처음에 이랬죠.

```python
# blog/urls.py
from django.urls import path

from . import views

urlpatterns = [
  {path: '', views.post_list, name='post_list'},
  {path: '/post/<int:num>', views.post_detail, name='post_detail'},
]
```

기존에 사용하던 `views.py` 방식은 아래와 같았습니다.

```python
# views.py
# ... 생략

def post_list(request):
  if request.method == 'POST':
    # ... 저장, 삭제, 수정 등
    return render(request, 'blog/post_list.html', context)
  else:
    # ... 읽기
    return render(request, 'blog/post_list.html', context)

def post_detail(request):
    # ... 읽기
    return render(request, 'blog/post_list.html', context)
```

이제 각각의 차이점이 조금씩 보이기 시작합니다. `method`처리하는 것도 많이 부족하니 찾아봐야하고, 패턴에 대해서도 공부를 해야할 것 같습니다. `django`에서는 `mvc`패턴이 아닌 `mtv`나 `mvvm`패턴도 있다고 하니 다음에 다루어 볼 생각입니다.

-----

📚 함께 보면 좋은 내용

[Stackoverflow :: PUT and DELETE Django](https://stackoverflow.com/questions/36455189/put-and-delete-django){:target="_blank"}

[Django :: Documentation](https://docs.djangoproject.com/en/4.0/topics/db/queries/){:target="_blank"}

[Django REST framework :: api_view](https://www.django-rest-framework.org/api-guide/views/#api_view){:target="_blank"}

[BezKoder :: Django: POST, PUT, GET, DELETE requests example \| Rest Apis](https://www.bezkoder.com/django-rest-api/){:target="_blank"}

[naon님 :: Django Rest Framework 활용하기 2 - @api_view](https://naon.me/posts/til57){:target="_blank"}

[eungding님 :: HTTP Request를 받아서 응답해주기 (GET, POST, PUT, DELETE)](https://eunjin3786.tistory.com/133){:target="_blank"}

[Sunwoo Park님 :: API 그리고 Django REST framework View들 비교하기](https://parksunwoo.github.io/django/2020/12/25/api-rest-framework-view.html){:target="_blank"}

[ssung.k님 :: Cross Site Request Forgery, csrf 공격과 대응](https://ssungkang.tistory.com/entry/DjangoCross-Site-Request-Forgery-csrf-%EA%B3%B5%EA%B2%A9%EA%B3%BC-%EB%8C%80%EC%9D%91){:target="_blank"}

[woolbro님 :: 장고 (Django)를 사용한 CRUD 예제 만들기](https://woolbro.tistory.com/98){:target="_blank"}

[new_wisdom님 :: #4 Django로 CRUD하기](https://velog.io/@new_wisdom/django-4-Django%EB%A1%9C-CRUD%ED%95%98%EA%B8%B0){:target="_blank"}

[d-yong님 :: 간단한 REST API 서버 만들기4 - Class Based View에서 POST, GET, PUT, DELETE 구현](https://d-yong.tistory.com/61){:target="_blank"}

[swhan9404님 :: django rest api 게시글, 댓글 실습](https://velog.io/@swhan9404/django-rest-api-%EA%B2%8C%EC%8B%9C%EA%B8%80-%EB%8C%93%EA%B8%80-%EC%8B%A4%EC%8A%B5){:target="_blank"}