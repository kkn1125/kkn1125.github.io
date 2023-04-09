---
slug: "/spring-boot-el-header/"
layout: post
modified: 2022-03-14 00:09:35 +0000
date:   2021-08-20 19:55:35 +0000
title:  "[SPRINGBOOT] header referer EL로 가져오기"
author: Kimson
categories: [ spring boot ]
tags: [ el, header, referer, til ]
image: /images/post/covers/TIL-spring.png
description: "EL(Expression Language)

EL에 대해서 사용하면서 header의 referer가 필요한 상황이 생겼습니다. 물론 getHeader메서드로 불러오는 방법도 있지만 굳이 변수에 담아서 하기에 번거로워질 것 같아 EL을 요즘 자주 쓰고 있습니다."
featured: false
hidden: false
rating: 3.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# EL(Expression Language)

EL에 대해서 사용하면서 header의 referer가 필요한 상황이 생겼습니다. 물론 `getHeader`메서드로 불러오는 방법도 있지만 굳이 변수에 담아서 하기에 번거로워질 것 같아 `EL`을 요즘 자주 쓰고 있습니다.

## header 가져오기

```jsp
<div>
    <a href="${header.referer}">이전페이지</a>
</div>
```

이렇게 하면 header에 있는 referer를 받아와 이전페이지로 안내하기 간단해졌습니다.

## 그 외 사용

표로 정리해보겠습니다. 찾아보니 사용가능한 타입들이 많았습니다.

|     No    | : Implicit Object  :| :       Desc.    : |
| :-------: | :------------------ | :----------------- |
|     1     | pageScope           | 페이지 범위 변수    |
|     2     | requestScope        |request 범위 변수    |
|     3     | sessionScope        |session 범위 변수    |
|     4     | applicationScope    |application 범위 변수|
|     5     | param               |파라미터 정보        |
|     6     | paramValues         |파라미터 전체        |
|     7     | header              |헤더 정보            |
|     8     | headerValues        |쿼리식으로 request headers 전체 출력|
|     9     | initParam           |컨텍스트 초기화 파라미터 출력|
|     10    | cookie              |쿠키 값              |
| :       : | pageContext         | :                   |
|^^   11    | .request.queryString|^^ 현재 페이지의 JSP PageContext 객체  |
|^^         | .session.queryString|^^                   |
|^^         | .response           |^^                   |
{:.table.text-dark.table-hover.text-center.bg-white}

아래에 참고한 사이트를 링크하였습니다. 참고 바랍니다.

[JSP EL에 관한 참고 자료](https://www.tutorialspoint.com/jsp/jsp_expression_language.htm)