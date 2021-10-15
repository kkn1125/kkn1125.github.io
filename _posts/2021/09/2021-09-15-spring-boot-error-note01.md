---
layout: post
date:   2021-09-15 21:26:12 +0900
title:  "[SPRING] 에러노트 - mybatis syntax error"
author: Kimson
categories: [ TIL, SPRINGBOOT ]
tags: [mybatis, error, note]
image: assets/images/post/covers/TIL-spring.png
description: "에러노트 - MyBatis Syntax Error

폰트 사이즈를 작게 해서 넓게 보려는 습관 때문에 자주 에러와 만납니다.

너무 작다보니 오타를 놓치고 지나가기 마련인데요. 저와 같은 이유로 찾는 분이라면 해결 되시기를..."
featured: false
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: false
keywords: ""
---

# 에러노트 - MyBatis Syntax Error

폰트 사이즈를 작게 해서 넓게 보려는 습관 때문에 자주 에러와 만납니다.

너무 작다보니 오타를 놓치고 지나가기 마련인데요. 저와 같은 이유로 찾는 분이라면 해결 되시기를...

![error]({{site.baseurl}}/assets/images/post/error/error02.png){:draggable="false"}
{:.text-center}

코드의 일부 모습은 이랬습니다.

![error]({{site.baseurl}}/assets/images/post/error/error03.png){:draggable="false"}
{:.text-center}

`select`로 `email`을 검색해서 `member`테이블의 정보를 가져오는데 도대체 무슨 문법 오류인지 이해하지 못 했습니다. 이틀 전 접종 맞고 이상해진건가 했지만 그냥 제가 오타 낸거였습니다...

![error]({{site.baseurl}}/assets/images/post/error/error04.png){:draggable="false"}

<del class="badge">악마의 실체</del>
<span class="badge">오타 발견</span>