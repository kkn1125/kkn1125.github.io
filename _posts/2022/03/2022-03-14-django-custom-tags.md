---
layout: post
date:   2022-03-14 18:54:26 +0900
title:  "[DJANGO] 커스텀 템플릿 태그를 사용하려면?"
author: Kimson
categories: [ django ]
image: assets/images/post/covers/TIL-django.png
tags: [ custom template, error note, til ]
description: ""
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

# 커스텀 템플릿 사용

데이터베이스에 태그를 저장할 때 1:n 관계로 테이블을 만들자니 내용 하나에 테이블을 하나 더 만드는게 비효율적인 것 같아 문자열로 콤마를 기준으로 구분했는데요.

django에서 템플릿 구문으로 뿌려주려고 split을 찾아보니 없더군요.

split등 필요한 함수들은 직접 사용자가 커스텀 템플릿 태그를 만들어야 합니다. 그러기 위해서 초기 세팅만 알아두면 그 뒤로는 필요한 커스텀 태그는 만들어 사용하면 됩니다.

필요한 세팅은 다음과 같습니다.

1. tempaltetags/ 디렉토리 생성 (폴더명 자유지만 이름을 바꿀 시 settings.py도 수정)
2. customs.py 함수 작성 (파일명 자유)

## templatetags 디렉토리

사용자화 할 함수를 작성하기 위해 함수들을 모아두는 라이브러리를 만드는데 있어서 현재 사용하고자 하는 앱 폴더 바로 하위에 templatetags/ 디렉토리를 생성합니다.

<div class="btn-bundle">
   <button class="btn btn-info" target="origin" group="one">templatetags</button>
   <button class="btn btn-info" target="change" group="one">my_tags</button>
</div>

{:page="origin" group="one"}
```python
# project_name/app_name/templatetags/customs.py
from django import template

register = template.Library()

@register.filter(name='split')
def split(value, key):
   return value.split(key)

# 만일 value가 None일 수 있는 상황에서 쓴다면 에러상황 처리도 해주셔야합니다.
@register.filter(name='split')
def split(value, key):
   if value != None:
      return value.split(key)
   else:
      return value
```

<div page="change" group="one">
   templatetags가 아닌 다른 이름으로 변경할 경우 settings.py에서 templates에 libraries를 추가해줘야 한다.
</div>

{:page="change" group="one"}
```python
TEMPLATES = [
    {
        # ...
        'OPTIONS': {
            'context_processors': [
                # ...
            ],
            'libraries': { # 여기에 아래와 같이 변경된 이름으로 추가
                'customs': 'todo.my_tags.customs',
            }
        },
    },
]
```

-----

이렇게 필요한 함수를 만들었다면 template에서 사용하면 되는데, 자신이 작성한 `python`파일 명을 `load`해서 사용해야 합니다.

<div class="btn-bundle">
   <button class="btn btn-info" target="first" group="two">for문</button>
   <button class="btn btn-info" target="second" group="two">단독</button>
</div>

{%raw%}

{:page="first" group="two"}
```html
<!-- layout.html -->
{% load customs %}
...
<div class="container">
   {% with todo.tags|split:',' as tags%}
      {% for tag in tags %}
         {{tag}}<br>
      {% endfor %}
   {% endWith %}
</div>
...
```

{:page="second" group="two"}
```html
<!-- layout.html -->
{% load customs %}
...
<span class="tag tag-info">
   {{ todo.tags|split:',' }} <!-- 배열 출력 -->
</span>
...
```

{%endraw%}

`with`에 관한 자세한 사항은 [여기](https://docs.djangoproject.com/en/4.0/ref/templates/builtins/){:target="_blank"}를 참고하세요.

이렇게 세팅하고나면 필요한 함수를 작성해서 사용하시면 됩니다. templatetags에 대해 더 알고 싶으시다면 django 공식 홈페이지의 docs를 읽어보시면 됩니다. 링크는 아래에 있습니다.

-----

📚 함께 보면 좋은 내용

[Djangoproject docs :: Code layout](https://docs.djangoproject.com/en/4.0/howto/custom-template-tags/#code-layout){:target="_blank"}

[SOUMITRA :: Creating custom template tags and filter in Django](https://roytuts.com/creating-custom-template-tags-and-filter-in-django/){:target="_blank"}

[Daidalos :: How to create a list of items from a string in a Django template ?](https://moonbooks.org/Articles/How-to-create-a-list-of-items-from-a-string-in-a-Django-template-/){:target="_blank"}

[Ozzie Liu :: Writing Liquid Template in Markdown Code Blocks with Jekyll](https://ozzieliu.com/2016/04/26/writing-liquid-template-in-markdown-with-jekyll/){:target="_blank"}

[linuxkathirvel :: split-filter-in-django-template.md - split string to array](https://gist.github.com/linuxkathirvel/8127c40fdad028bbb79bec24f36eee1c){:target="_blank"}

[Stackoverflow :: Django templates - split string to array](https://stackoverflow.com/questions/8317537/django-templates-split-string-to-array){:target="_blank"}