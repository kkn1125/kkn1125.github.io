---
layout: post
date:   2021-08-23 18:38:35 +0900
title:  "[SPRING] Hidden Method 사용"
author: Kimson
categories: [ TIL, SPRINGBOOT ]
tags: [hidden, method]
image: assets/images/post/covers/TIL-spring.png
description: "Hidden Method

요즘 자바스크립트만 만지다 보니 spring을 점점 잊어가는 느낌이 듭니다. hidden method를 잘 쓰다가 multipart를 쓸 상황이 생겨 같이 쓰다보니 여러가지 오류나는 부분을 체크하는데 많이 미흡해서 기록으로 남깁니다."
featured: true
hidden: false
rating: 3.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
---

# Hidden Method

요즘 자바스크립트만 만지다 보니 spring을 점점 잊어가는 느낌이 듭니다. hidden method를 잘 쓰다가 multipart를 쓸 상황이 생겨 같이 쓰다보니 여러가지 오류나는 부분을 체크하는데 많이 미흡해서 기록으로 남깁니다.

## 오타를 조심하자

매번 뭘 만들다보면 느끼는게 오타때문에 대부분의 시간을 보내는 느낌이 듭니다.

1. `enctype="multipart/form-data"` 확인하기
2. `HiddenHttpMethodFilter`설정 했는지 확인하기
    - Spring Boot에서는 `apllicationwebstart.java`에 Bean으로 만들어 줘야하는 것을 알았습니다.

```java
@SpringBootApplication
public class StartwebApplication {

	public static void main(String[] args) {
		SpringApplication.run(StartwebApplication.class, args);
	}

	@Bean
	public HiddenHttpMethodFilter hiddenHttpMethodFilter() {
		return new HiddenHttpMethodFilter();
	}
}
```

## VO프로퍼티와 잘 매칭되었는가

1. VO를 만들어 사용할 때 프로퍼티와의 이름이 다르면 `not allow method`가 발생합니다.
2. `MultipartFile`타입 선언시 VO에서 `String`으로 받는데 `MultipartFile`타입으로 변수를 받아 사용하게 되면 오류가 발생합니다. `input`의 `name`을 다르게해서 받아오고 `originalFileName`을 `setter`로 다시 VO에 집어넣는 방식으로 저는 해결했습니다.

## properties파일 설정은 되었는가

```properties
# multipart 설정
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB
spring.servlet.multipart.location=c:\\temp\\upload
```

제일 많이 봤던 부분이 오타 확인과 타입이 꼬이는 부분이었습니다. 저와 같은 실수를 하지말기를...