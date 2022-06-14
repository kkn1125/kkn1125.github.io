---
slug: "/jekyll-theme01"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-10-15 15:24:13 +0900
title:  "[JEKYLL] jekyll theme를 만들자 01"
author: Kimson
categories: [ jekyll ]
image: /images/post/jekyll-theme/jekyll01.png
tags: [ jekyll, theme, til ]
description: "Jekyll Theme를 만들자

jekyll 테마들을 보면서 나도 만들어 보고싶다는 생각에 무턱대고 시작했습니다. ruby는 잘 모르지만 변수나 if, for는 쓰는 방법은 알지만 익숙하지 않고 liquid는 그나마 블로그를 꾸미면서 다큐먼트를 많이 본 적이 있어 도전할만 했습니다."
featured: false
hidden: false
rating: 4.5
toc: true
profile: false
keysum: false
keywords: ""
published: true
---

# Jekyll Theme를 만들자

jekyll 테마들을 보면서 나도 만들어 보고싶다는 생각에 무턱대고 시작했습니다. ruby는 잘 모르지만 변수나 if, for는 쓰는 방법은 알지만 익숙하지 않고 liquid는 그나마 블로그를 꾸미면서 다큐먼트를 많이 본 적이 있어 도전할만 했습니다.

## 활동명 정하기

less, more라고 정했습니다. 건축하시는 분들을 아시겠지만 현대건축 3대 거장 중 한 사람인 "미스 반 데어 로에"라는 유명한 건축가가 한 말에 주요부분만 떼어놓은 것입니다.

<span class="text-decoration-line-through">이 사람의 건축물 중에 판스워드 주택은 아주 유명합니다.</span>

단편적으로 한 번 만들고 끝내지 않을 것이기에 활동명을 정해봤습니다. 그래도 jekyll theme를 전문적으로 만드는 사이트나 개개인이 있는 것으로 보아 최소한 부를 이름이라도 정해야겠다 싶었습니다.

> Less is More.
> 
> \- Ludwig Mies van der Rohe

## less, more의 테마 컨셉

1. Color
   - 색상은 무채색 계열로 베이스를 만들고, 포인트를 주고 싶은 theme에는 특별히 하나의 컬러를 선정해서 포인트를 주려합니다.

2. Layout
   - 레이아웃은 딱히 정하는 것 없이 만들어나가면서 각 theme 별로 다르게 만들고자 합니다.

3. Optional
   - 만들면서 선택적으로 테마에 넣을 항목들 입니다.
     - [x] 다크 모드
     - [x] 문의 채팅창
     - [x] 로그인 기능

아직 여러가지 추가할 유용한 기능을 생각 중 입니다. 혹시 어떤 기능이 있으면 블로그를 사용하는 사람이 편하겠다 하는 의견이 있으시면 깃허브나 댓글에 조언을 주시면 감사하겠습니다.

## less, more base theme 소개

이제 만들기 시작한 상태입니다. 완성이 되는데로 이 글은 수정이 될 예정입니다.  

![exImg](/images/post/jekyll-theme/jekyll01.png '샘플 이미지')

아래의 링크는 샘플 사이트와 깃허브입니다.

[lessmore-jekyll-theme :: sample site](https://kkn1125.github.io/lessmore-jekyll-theme/ 'less, more jekyll theme - 샘플 사이트')

[lessmore-jekyll-theme :: github](https://github.com/kkn1125/lessmore-jekyll-theme 'less, more jekyll theme - 깃허브')