---
layout: post
modified: 2022-01-19 15:48:20 +0900
date:   2021-07-13 15:35:27 +0900
title:  "[JAVASCRIPT] AJAX 전송 한글 깨짐 문제"
author: Kimson
categories: [ TIL, JAVASCRIPT ]
tags: [ajax, jquery, utf8]
image: assets/images/post/what.jpg
description: "사용법은 간단하면서도 복잡하다.
자주사용될 featured와 hidden을 잘 사용해야겠다. 커버 이미지는 image 경로를 주면 되고, hidden이지만 featured에 띄울 수도 있다."
featured: false
hidden: false
rating: 4.5
toc: false
---

# 1. Ajax 전송 한글 깨짐

블로그 작업중 ajax를 자주 사용하게 하다보니 물음표를 쏟아내는 현상이 발생합니다.

js decodeURI() 를 써도 소용없고, Cotroller에서 response로 contentType설정해도 효과를 보진 못했습니다.

그러던 중 RequestMapping의 속성에 produces로 해결 할 수 있었습니다.

```java
@GetMapping(value = "path/{param}", produces = "application/text; charset=utf8")
public String comment(@PathVariable("param") int param1, HttpServletResponse response)
{
    ...
}
```

2시간을 쩔쩔매다가 한 줄로 끝나다니 허무하네요...

[자료출처](https://stratosphere.tistory.com/207){:target="_blank"}