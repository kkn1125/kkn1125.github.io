---
slug: "/spring-boot-start01"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-08-12 12:38:19 +0900
title:  "[SPRINGBOOT] SPRING BOOT 시작하기 01"
author: Kimson
categories: [ spring boot ]
tags: [spring, lombok, thymeleaf, til]
image: assets/images/post/covers/TIL-spring.png
description: "Spring boot 시드 프로젝트

spring을 처음 시작했을 때 굉장히 당황스러웠던 기억이 납니다. 기본적인 컨트롤러 만드는 것과 연결하는 것조차 작동이 안되서 많이 좌절했습니다.

처음부터 기본 세팅까지 시간도 많이 걸릴뿐더러 전부 기억하지 못하기 때문에 시드 프로젝트를 계속해서 만들었습니다.

이번에는 Spring boot를 시작하면서 동시에 시드 프로젝트를 만들려고 합니다."
featured: false
hidden: false
rating: 5
toc: true
profile: false
istop: true
keysum: false
keywords: ''
published: true
---

# Spring boot 시드 프로젝트

spring을 처음 시작했을 때 굉장히 당황스러웠던 기억이 납니다. 기본적인 컨트롤러 만드는 것과 연결하는 것조차 작동이 안되서 많이 좌절했습니다.

처음부터 기본 세팅까지 시간도 많이 걸릴뿐더러 전부 기억하지 못하기 때문에 시드 프로젝트를 계속해서 만들었습니다.

이번에는 Spring boot를 시작하면서 동시에 시드 프로젝트를 만들려고 합니다.

> 사용된 dependency는 다음과 같습니다.  
> 1. lombok
> 2. 각종 starter들

## Spring boot 설치

> 현재 사용중인 IDE가 Eclipse라서 Eclipse기준으로 설명드립니다.  
> Maven을 사용중이며 이후에 Gradle에 관한 포스팅도 올릴 예정입니다.

![스프링부트 설치]({{site.baseurl}}/assets/images/post/springboot/springboot01.png)
{:.text-center}
<span class="text-muted">*- 노란박스는 legacy프로젝트를 생성하므로 boot는 아닙니다.*</span>

1. help > eclipsemarketplace로 들어갑니다.
2. springboot을 검색하고, 빨간박스로 표기된 것이 spring boot프로젝트를 생성해주기때문에 설치 이것을 설치합니다.

## Project 생성

설치가 완료되면 IDE를 restart하라는 문구가 뜨게 됩니다. restart해주시고, new 탭에서 spring starter를 찾습니다.

![스프링부트 프로젝트 생성]({{site.baseurl}}/assets/images/post/springboot/springboot02.png)
{:.text-center}

![스프링부트 프로젝트 생성]({{site.baseurl}}/assets/images/post/springboot/springboot03.png)
{:.text-center}

저는 이대로 설정하고 next를 누르겠습니다. ( 설명내용과 이미지에 네이밍차이가 있을 수 있습니다. )

![스프링부트 프로젝트 생성]({{site.baseurl}}/assets/images/post/springboot/springboot04.png)
{:.text-center}

이제 스타터 패키지들 중에 사용할 의존을 고르라고 합니다. spring boot를 배우면서 관심있었던 lombok과 tiles의 대체로 사용해볼 thymeleaf를 추가합니다.

lombok과 thymeleaf는 이후 자세히 다루고, 간단한 사용법만 같이 언급하겠습니다.

> eclipse에서 말고도 웹에서 스타터를 만들어 불러올수도 있습니다. [spring initializr](https://start.spring.io/){:target="_blank"}를 참고하시면 됩니다. 설정은 설명하는 내용과 차이가 거의 없습니다.

## Project File Tree

파일구조는 spring legacy와 차이가 있었습니다. legacy로 생성하면 webapp폴더와 그 안에 WEB-INF, web.xml 등이 자리잡는데 webapp자체가 없고, java 패키지에는 controller 대신 웹앱을 구동 시켜주는 artifactnameApplication.java가 있습니다.

### dependency 없이 생성한 경우

![스프링부트 구조]({{site.baseurl}}/assets/images/post/springboot/springboot06.png)
{:.text-center}

### thymeleaf dependecy가 포함된 경우

![스프링부트 구조]({{site.baseurl}}/assets/images/post/springboot/springboot05.png)
{:.text-center}
<span class="text-muted">*- 빨간줄은 처음 생성때에 없는 것입니다.*</span>

static과 templates도 빈 폴더입니다. templates와 static은 thymeleaf가 추가되면 자동으로 생성됩니다.

## Spring boot 구동하기

계속 쓰던 spring과 다른 점은 tomcat서버로 직접 구동했는데 application.java를 이용해 spring boot app이라는 것으로 구동시킵니다. cmd로 서버를 실행하는 방법이 있지만 eclipse에서 실행 하겠습니다.

![스프링부트 구동]({{site.baseurl}}/assets/images/post/springboot/springboot07.png)
{:.text-center}

이미지와 같이 Run as탭에 들어가시면 spring boot app이라는 새로운 것이 뜹니다. 이것을 누르면 대문짝만한 텍스트로 spring 어쩌고 하면서 구동됩니다.

아마 아무것도 뜨지 않고 짧은 메세지 몇개 있고 변화가 없습니다. 그래서 컨트롤러를 하나 만들겠습니다.

![스프링부트 구동]({{site.baseurl}}/assets/images/post/springboot/springboot08.png)
{:.text-center}

```java
@RestController
public class HomeController {
	@GetMapping("/home")
	public String home () {
		return "Hello!!";
	}
}
```

RestController로 먼저 경로에 잘 연결되는 지 테스트합니다.

![스프링부트 구동]({{site.baseurl}}/assets/images/post/springboot/springboot09.png)
{:.text-center}

이렇게 잘 뜨면 성공입니다. return에서 태그를 쓸 수는 없으니 자동으로 prefix와 suffix를 달아서 jsp파일을 매칭하게 합시다.

```java
@Controller // Rest뺐습니다. 주의해주세요.
public class HomeController {
	@GetMapping("/home")
	public String home () {
		return "home";
	}
}
```

jsp파일을 작성합니다.

```html
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
    <h1>Hello</h1>
</body>
</html>
```

컨트롤러의 코드를 고치고 실행하면 에러가 뜨게 됩니다. spring boot에서는 properties라는 파일이 있는데요. 이 부분에서 prefix와 suffix를 지정해줍니다.

resources에 있는 application.properties를 열어서 아래와 같이 작성합니다.

```text
spring.mvc.view.prefix=/WEB-INF/views/
spring.mvc.view.suffix=.jsp
```

![스프링부트 구동]({{site.baseurl}}/assets/images/post/springboot/springboot10.png)
{:.text-center}
<span class="text-muted">*- 구동준비된 상태의 폴더구조입니다.*</span>

![스프링부트 구동]({{site.baseurl}}/assets/images/post/springboot/springboot11.png)
{:.text-center}

위 이미지처럼 h1태그가 적용되어 나오면 성공입니다.

lombok은 2편에서 설명하겠습니다. 여기까지 spring boot설치에서 컨트롤러 생성, 구동까지였습니다.