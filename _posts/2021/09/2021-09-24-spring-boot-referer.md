---
layout: post
modified: 2022-01-19 15:55:53 +0900
date:   2021-09-24 22:22:32 +0900
title:  "[SPRINGBOOT] 헤더 리퍼러(referer) 사용하기"
author: Kimson
categories: [ TIL, SPRINGBOOT ]
tags: [referer, policy, header]
image: assets/images/post/covers/TIL-spring.png
description: "referer란

Referer 요청 헤더는 어디에서 사용자가 유입되었는지 알 수 있습니다. `#blah`나 `username`, `password`는 포함 할 수 없다고 합니다. `origin`, `path`, `query문`등이 포함된다고 하니 잘 사용하면 유용할 것 같습니다."
featured: false
hidden: false
rating: 4.5
toc: true
profile: false
keysum: false
keywords: ""
---

# referer란

Referer 요청 헤더는 어디에서 사용자가 유입되었는지 알 수 있습니다. `#blah`나 `username`, `password`는 포함 할 수 없다고 합니다. `origin`, `path`, `query문`등이 포함된다고 하니 잘 사용하면 유용할 것 같습니다.

[MDN Referer 참고](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Referer){:target="_blank"}

## referer Policy 알아두기

1. Referrer-Policy: no-referrer
2. Referrer-Policy: no-referrer-when-downgrade
3. Referrer-Policy: origin
4. Referrer-Policy: origin-when-cross-origin
5. Referrer-Policy: same-origin
6. Referrer-Policy: strict-origin
7. Referrer-Policy: strict-origin-when-cross-origin
8. Referrer-Policy: unsafe-url

[MDN Referrer-Policy 참고](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy){:target="_blank"}

자세한 내용은 다음에 보충해서 올릴 예정입니다. 다만 이 중에서 `strict-origin-when-cross-origin`은 오늘 겪었던 내용을 알려드리자면, 같은 페이지에서 `referer`를 받을 때 `null`값을 뱉어 내는 점입니다.

```java
// 예제입니다.

// annotations ...
public class TestController {
	// ...
	@ModelAttribute("referer")
	public String getReferer(HttpSession session){
		return session.getHeader("referer")
		.split(session.getHeader("host"))[1];
	}
	// ...
}
```

대충 위의 상황이었습니다. `referer`을 참조해서 로그인 하고 난 후 이전에 있던 페이지로 `redirect`하려는데 의도치않게 500 에러가 발생했습니다.

같은 페이지에서 새로고침 할 때마다 에러가 나서 `referer`문제인 것 같아 콘솔 찍어보니 `null`값이 떴습니다.

```java
// annotations ...
public class TestController {
	// ...
	@ModelAttribute("referer")
	public String getReferer(HttpSession session){
		if(session.getHeader("referer")!=null){
			return session.getHeader("referer")
			.split(session.getHeader("host"))[1];
		}
		return null;
	}
	// ...
}
```

`null`값을 한 번 걸러주고 쓰는 방식으로 쓰고는 있습니다만, 다른 분의 비슷한 코드라도 봐야 어떻게 쓰는 게 맞는지 알 것 같습니다. 지금은 이렇게 쓰는 걸로...

## referer의 쓰임

관련 글들을 읽다보니 referer가 굉장히 중요한 요소였고, 보안과 많이 관련되어 있는 것을 알았습니다. referer의 쓰임에 대해서는 더 공부해볼 생각입니다.

-----