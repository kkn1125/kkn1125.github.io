---
layout: post
modified: 2022-03-23 15:57:33 +0900
date:   2021-07-13 15:35:27 +0900
title:  "[JAVASCRIPT] AJAX 전송 한글 깨짐 문제"
author: Kimson
categories: [ javascript ]
tags: [ajax, jquery, utf8, til]
image: assets/images/post/what.jpg
description: "사용법은 간단하면서도 복잡하다.
자주사용될 featured와 hidden을 잘 사용해야겠다. 커버 이미지는 image 경로를 주면 되고, hidden이지만 featured에 띄울 수도 있다."
featured: false
hidden: false
rating: 4.5
toc: false
---

# Ajax 전송 한글 깨짐

Ajax로 데이터를 전송하다보면 한글이 깨지는 경우가 발생합니다. 작업 중인 상황을 간단하게 설명드리자면, 아래와 같습니다.

1. 컨트롤러에서 데이터를 화면에 response해줄 때 발생했습니다.
2. 데이터의 내용은 한글이 섞여 있습니다.

`javascript`에서 `data form`을 전송할 때 문제가 있나 해서 `javascript`의 `decodeURI()`로 파싱해도 원하는 결과를 얻을 수 없었습니다. `Cotroller`에서 `response`할 때 `contentType`을 설정해도 결과는 같았습니다.

## RequestMapping의 produces 사용

찾던 중 `RequestMapping`의 produces를 사용하면 해결 할 수 있다고 합니다. 한글이 깨지는 상황은 현재 수정하는 시점에서 경험한 바는 아래와 같은 경우입니다.

1. POST요청할 때
2. API서버 구축할 때 @requestBody로 데이터를 응답할 때

GET요청에서는 한글이 깨지는 현상을 경험해보지는 못했지만 POST요청과 json형태로 응답하거나 ResponseBody어노테이션을 사용할 때 발생하는 경우가 더러 있습니다. 그 때 produces설정을 아래와 같이 설정하면 한글 깨짐 현상이 사라지는 것을 볼 수 있습니다.

```java
@GetMapping(value = "path/{param}", produces = "application/text; charset=utf8")
public @ResponseBody String comment(@PathVariable("param") int param1, HttpServletResponse response){
    ...
}
```

벌써 준비한 기간이 8개월이 지나고 있습니다. 게시글 전체 중간점검 중인데 다시 보니 글을 대충 적었던 것도 있고, 레퍼런스나 설명이 많이 부족했던 것을 새삼 느낍니다.

-----

[LunaStratos님 :: Spring + ajax 로 데이터 받을때 String이 물음표 ? 가 나오는 현상](https://stratosphere.tistory.com/207){:target="_blank"}