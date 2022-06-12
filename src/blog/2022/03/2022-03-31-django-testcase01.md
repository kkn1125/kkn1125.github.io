---
slug: "/django-testcase01"
layout: post
date:   2022-03-31 15:53:36 +0900
title:  "[DJANGO] 단위테스트 작성"
author: Kimson
categories: [ django ]
image: /images/post/covers/TIL-django.png
tags: [ unittest, til ]
description: "단위테스트 작성
위테스트 작성하는 것에 익숙해지기 위해서 이제 막 시작을 하고 있습니다. 확실하지 않지만 찾아가면서 시도하고 있는 상태라 정확한 이야기라고는 말 못합니다. 대신에 참고한 자료들이 링크되어 있으니 참고바랍니다.

이제 막 알아보기 시작한 시점에서 테스트 코드의 필요성을 언급하기엔 무리가 있다고 생각합니다. 단위 테스트에 대해서 쭉 알아보고 정리해나가려합니다."
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

# 단위테스트 작성

> 단위테스트 작성하는 것에 익숙해지기 위해서 이제 막 시작을 하고 있습니다. 확실하지 않지만 찾아가면서 시도하고 있는 상태라 정확한 이야기라고는 말 못합니다. 대신에 참고한 자료들이 링크되어 있으니 참고바랍니다.

이제 막 알아보기 시작한 시점에서 테스트 코드의 필요성을 언급하기엔 무리가 있다고 생각합니다. 단위 테스트에 대해서 쭉 알아보고 정리해나가려합니다.

## 테스트 코드 작성

```python
# myapp/tests.py

from django.test import TestCase #, Client

def plus(a, b):
    return a + b

class TestCodes(TestCase):
    def test_case_plus(self):
        self.assertEqual(plus(3,5), 8)

# 초기에는 비어있다.
```

코드를 실행할 때는 `python manage.py test`로 실행합니다. 자세한 옵션에 대해서는 `django` 문서를 참고하시기 바랍니다.

`tests.py`는 `app`을 생성하면 자동으로 생성되어 있습니다. 테스트 코드를 짜기 전에 알아보면 좋은 내용이 있습니다.

테스트 실행할 때 뭔가 `hook`스러운 메서드들이 제공됩니다. 실행 전/후, 한번 또는 테스트 코드가 실행될 때마다 실행되는 메서드들입니다.

```python
# myapp/tests.py

from unittest import skip, expectedFailure
from django.test import TestCase #, Client

class TestCodes(TestCase):
    def setUp(self):
        """_특징_
        테스트마다 매번 자동 호출
        예외가 발생하면 테스트 케이스를 실패로 취급
        """
        self.comment = 'kimson'

    @expectedFailure
    def test_case_name(self):
        """_테스트 명명규칙_
        def test_*(self):
            여러 개의 assert*가 가능합니다.
        """
        self.assertEqual(self.comment, 'kimson')
        self.assertIsNone(self.test)

    def tearDown(self):
        """_특징_
        setUp메서드가 성공하면,
        나머지 테스트의 성패 여부 관계없이 실행
        """
        self.comment = ''
```

간단하게 보면 위와 같습니다. 테스트 메서드를 정의할 때는 `test_`를 앞에 붙여야하는 명명규칙이 있고, `setUp`과 `tearDown`과 같은 메서드가 테스트 코드 실행 전과 후에 처리를 할 수 있도록 해줍니다.

흔한 예제로는 수의 합을 구하는 코드를 예제로 들 수 있습니다.

```python
# myapp/tests.py
from django.test import TestCase

def sum(a, b):
    return a + b

class TestCodes(TestCase):
    
    def test_sum(self):
        self.assertEqual(sum(5,3), 8)
```

## Client 사용

`Client`를 사용하면 login, logout과 get, post요청 등을 할 수 있습니다. 페이지를 테스트하고, 어떻게 동작되고, 로그인되지 않았는데 로그인을 요구하는 페이지를 요청한다면 어떻게 처리되는지 테스트를 하게 됩니다.

```python
# myapp/tests.py
from django.urls import reverse
from django.test import TestCase, Client
from django.contrib.auth import get_user_model

class TestClientRequestService(TestCase):
    def setUp(self):
        self.c = Client()
        # Client 인스턴스

        User = get_user_model()
        # 유저 모델 가져오기
        User.objects.create_user(
            username='kimson',
            password='1234'
        )
        # 유저 생성
    
    def test_login_user_request_signin_page(self):
        self.c.login(username='kimson', password='1234')
        # 로그인
        response = self.c.get(reverse('apps:index'))
        # apps:index에 대응하는 주소로 get요청을 보낸다
        self.assertEqual(response.status_code, 200)
        # 응답 코드가 200인가
        self.assertTemplateUsed(response, 'apps/index.html')
        # 응답 페이지가 apps/index.html을 참조하고 있는가
        self.assertContains(response, 'index')
        # 응답 내용에 "index"라는 문자가 포함되어 있는가
    
    def tearDown(self):
        self.c.logout()
        # 로그아웃
```

이러한 방식으로 페이지 처리에 대한 테스트 코드를 작성하게 됩니다. 페이지 요청 후 응답 내용을 보고 싶으시면, `response.content`로 확인하면 됩니다. 하지만 bytes코드로 되어 있기 때문에 `response.content.decode('utf-8')`로 디코드 해야 정상적으로 보이게 됩니다.

이외에도 로그인을 요구하는 페이지 접근 시 `redirect`되는지 확인 하는 방법도 있습니다.

```python
# myapp/tests.py
from django.urls import reverse
from django.test import TestCase, Client
from django.contrib.auth import get_user_model

class TestClientRequestService(TestCase):
    """
    참고로 DB가 존재해야 모델 생성이 됩니다. DB 없이 하는 방법이 존재는 하지만 저는 DB를 생성하고 했습니다.
    """
    def setUp(self):
        self.c = Client()
        # Client 인스턴스

        User = get_user_model()
        # 유저 모델 가져오기
        User.objects.create_user(
            username='kimson',
            password='1234'
        )
        # 유저 생성
    
    def test_redirect_if_non_members_visit_require_page(self):
        response = self.c.get(reverse('apps:login_require'))
        # apps:index에 대응하는 주소로 get요청을 보낸다
        self.assertEqual(response.status_code, 302)
        # ok
        self.assertRedirects(response, expected_url=reverse('apps:signin'), status_code=302)
        # ok : 다이렉트 된 예상 경로가 apps:signin인지와 status code가 302인지 확인
        self.assertTemplateUsed(response, 'apps/index.html')
        # FAIL : 302는 참조하는 템플릿이 없다고 뜬다. 이유를 아직 모른다.
        self.assertContains(response, 'index')
        # FAIL : 위의 템플릿 fail과 연관있는 듯 하다.
    
    def tearDown(self):
        self.c.logout()
        # 로그아웃
```

위 내용을 작성하다보니 `jestjs`는 `html`로 커버리지를 작성해주던게 생각나서 찾아보니 `django`도 지원한다는 것을 알았습니다!

## testcode coverage

coverage를 사용하기에 앞서 설치가 필요합니다.

```bash
$ pip install coverage
```

그리고 `.coveragerc` 라는 파일을 프로젝트폴더 바로 하위에 생성하고 내용을 아래와 같이 작성해야합니다. 즉, `manage.py`와 같은 경로를 말합니다.

```plaintext
[run]
include = `테스트 포함할 경로`
omit = `테스트 제외할 경로`
```

커멘드라인으로 작성하신다면 아래와 같습니다.

```bash
$ vi .coveragerc

[run]
include =
omit =
(esc)
:wq
(enter)
-----

저는 include와 omit 둘 다 비워두고 작성했습니다.

실행은 아래와 같이 합니다.

```bash
$ coverage run manage.py test
# or
$ coverage run --source='.' manage.py test app
```

테스트 후 결과를 확인 할 때는 커멘드라인에 출력되는 방식과 html, xml 등등의 방식이 있습니다. 커멘드라인과 html 두가지는 아래와 같습니다. 나머지 방식은 [coverage.py](https://coverage.readthedocs.io/en/6.3.2/)의 documents를 확인하세요.

```bash
$ coverage report # 커멘드라인 출력
$ coverage html # 커버리지를 html 파일 생성
```

생성된 `html`은 `manage.py`와 같은 경로에 `htmlcov`디렉토리가 생성됩니다. 그 안에 `index.html`을 실행하시면 잘 정리된 커버리지를 페이지로 볼 수 있습니다.

-----

📚 함께 보면 좋은 내용

[nuung님::Django Test - unit test, user test, coverage](https://velog.io/@qlgks1/Django-Test-unit-test-user-test-coverage)

[Stackoverflow::Django: test failing on a view with @login_required](https://stackoverflow.com/questions/2705235/django-test-failing-on-a-view-with-login-required)

[Django::Making queries-Updating multiple objects at once](https://docs.djangoproject.com/en/4.0/topics/db/queries/#updating-multiple-objects-at-once)

[Django::Testing tools-Overview and a quick example](https://docs.djangoproject.com/en/4.0/topics/testing/tools/#overview-and-a-quick-example)

[schoolofweb::파이썬 – 데코레이터 (Decorator)](https://schoolofweb.net/blog/posts/%ED%8C%8C%EC%9D%B4%EC%8D%AC-%EB%8D%B0%EC%BD%94%EB%A0%88%EC%9D%B4%ED%84%B0-decorator/)

[Stackoverflow::How to prevent user to access login page in django when already logged in?](https://stackoverflow.com/questions/55062157/how-to-prevent-user-to-access-login-page-in-django-when-already-logged-in)

[swhan9404님::django의 단위테스트(tests.py)](https://velog.io/@swhan9404/django%EC%9D%98-%EB%8B%A8%EC%9C%84%ED%85%8C%EC%8A%A4%ED%8A%B8tests.py)

[codechacha.com::bytes를 String으로 변환하는 방법](https://codechacha.com/ko/python-convert-bytes-to-string/)

[Django::Settings-LOGIN_URL](https://docs.djangoproject.com/en/4.0/ref/settings/#login-url)