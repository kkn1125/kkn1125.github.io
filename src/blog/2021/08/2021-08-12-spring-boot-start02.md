---
slug: "/spring-boot-start02/"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-08-12 13:50:20 +0900
title:  "[SPRINGBOOT] SPRING BOOT 시작하기 02"
author: Kimson
categories: [ spring boot ]
tags: [spring, lombok, thymeleaf, til]
image: /images/post/covers/TIL-spring.png
description: "lombok 설정

spring boot 시작하기 01에서 설치, 구동이 주제였다면 setter와 getter등의 <del>자질구레한</del> 것들을 간소화해주는 lombok을 설정하는 방법을 소개합니다.

그 다음 tiles를 사용하는 방법을 이번 시간에 알아보겠습니다."
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

# lombok 설정

spring boot 시작하기 01에서 설치, 구동이 주제였다면 setter와 getter등의 <del>자질구레한</del> 것들을 간소화해주는 lombok을 설정하는 방법을 소개합니다.

그 다음 tiles를 사용하는 방법을 이번 시간에 알아보겠습니다.

## lombok 설치

lombok은 의존성 추가로 끝나는게 아니고 lombok.jar를 설치해야 사용가능합니다. 처음에 의존성만 추가하고 자꾸 안된다고 헤메이다가 고마운 분들의 정보로 2시간 만에 해결할 수 있었습니다.

![롬복 설치](/images/post/springboot/lombok/lombok01.png)


1. [lombok 다운로드](https://projectlombok.org/download)를 해줍니다.
2. jar파일이 받아지면 해당 디렉토리에 가서 bash 또는 cmd를 켭니다.
3. `java -jar fileName.jar`라고 입력하면 jar파일이 실행됩니다.
4. 자동으로 IDE를 찾아 냅니다.
5. install/Update를 클릭하고, 설치완료되면 닫아줍니다.

Eclipse는 재시작해주시고, 만들던 VO로 돌아와 getter/setter 어노테이션을 등록해줍니다.
@Data로 한번에 등록가능합니다.

이때 outline 탭을 확인해보면 lombok이 알아서 setter와 getter를 만들어 줍니다... 심지어 toString까지... 와우..

> 배포할때 lombok이 유효한지는 계속 찾고 있습니다. 만일 방법이 따로 있다면 다음에 포스팅하겠습니다.

# Tiles 설정하기

tiles는 의존성 추가 먼저 해줍니다. 이때 tiles는 mdnrepository에서 찾으실 때 아래의 artifactId에 유의해주세요.

```xml
<dependency>
	<groupId>org.apache.tiles</groupId>
	<artifactId>tiles-jsp</artifactId>
	<version>3.0.8</version>
</dependency>
```

![tiles 폴더구조](/images/post/springboot/tiles/tiles01.png)


tiles.xml을 위 이미지와 같이 경로에 생성합니다.
xml의 내부코드는 아래와 같습니다. tiles.xml의 기본 설정은 [tiles 홈페이지](https://tiles.apache.org/)에도 나와있습니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE tiles-definitions PUBLIC
       "-//Apache Software Foundation//DTD Tiles Configuration 3.0//EN"
       "http://tiles.apache.org/dtds/tiles-config_3_0.dtd">
<tiles-definitions>

  <definition name="root.*" template="/WEB-INF/views/inc/layout.jsp">
    <put-attribute name="title" value="Tiles Test" />
    <put-attribute name="header" value="/WEB-INF/views/inc/header.jsp" />
    <put-attribute name="body" value="/WEB-INF/views/{1}.jsp" />
    <put-attribute name="footer" value="/WEB-INF/views/inc/footer.jsp" />
  </definition>
  
</tiles-definitions>
```

ServletConfig라는 java파일을 만들어 tiles.xml의 위치를 알려주면서 tiles에서 definition이 가리키는 경로로 매핑되게 하는 작업입니다.

![tiles 폴더구조](/images/post/springboot/tiles/tiles02.png)


```java
@Configuration
@EnableWebMvc
@ComponentScan(basePackages = {"com.bootstart.startweb"})
public class ServletConfig implements WebMvcConfigurer
{
	
	@Bean // tiles.xml 위치 지정
	public TilesConfigurer tilesConfigurer()
	{
		final TilesConfigurer configurer = new TilesConfigurer();
		configurer.setDefinitions(new String[] {"/WEB-INF/tiles.xml"});
		return configurer;
	}
	
	@Bean // tiles ViewResolver 설정
	public TilesViewResolver tilesViewResolver()
	{
		final TilesViewResolver resolver = new TilesViewResolver();
		resolver.setViewClass(TilesView.class);
		resolver.setOrder(1);
		return resolver;
	}
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry)
	{
		registry.addResourceHandler("/resources/**") // 매핑 URI 설정
		.addResourceLocations("/resources/"); // 정적 리소스 위치 설정
	}
	
}
```

이제 마지막으로 layout.jsp와 나머지 페이지를 만듭시다. views폴더에 inc폴더를 만듭니다. inc폴더 네이밍은 자유이고, inc폴더 내에는 layout라는 템플릿이 될 jsp와 header, footer라는 공통으로 사용될 jsp가 추가됩니다.

```html
<!-- layout.jsp 입니다. -->

<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<!-- taglib은 꼭 입력해야 tiles태그를 사용할수있습니다. -->
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title><tiles:insertAttribute name="title" /></title>
</head>
<body>

	<!-- header -->
	<tiles:insertAttribute name="header" />
	<!-- header -->
	
	<!-- body -->
	<tiles:insertAttribute name="body" />
	<!-- body -->
	
	<!-- footer -->
	<tiles:insertAttribute name="footer" />
	<!-- footer -->
	
</body>
</html>
```

```html
<!-- header.jsp 입니다 -->

<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<header>
	<h1>Hellow</h1>
</header>

<!-- 이어서 footer.jsp 입니다. -->

<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<footer>
	<h3>footer</h3>
</footer>
```

```html
<!-- home.jsp 입니다 -->

<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div>
	<h2>test</h2>
</div>
```

tiles의 방식은 간단합니다.

1. tiles.xml에 지정한 name의 이름은 value에 지정된 경로의 파일을 참조한다.
2. layout.jsp에서 xml에 참조된 name이 일치하는 insert부분에 참조된 파일이 들어간다.
3. name이 body인 부분은 xml에서 `{1}.jsp`로 처리했기때문에 유동적으로 바뀌어서 들어간다.

즉, tiles.xml에서 a라는 이름이 A.jsp를 참조하면, layout에 a라는 이름으로 insert하여 A.jsp가 그 부분에 위치되어 렌더링되고, `definition name="root.*"`의 `*`표시가 body의 value에 `/WEB-INF/views/{1}.jsp`의 `{1}`과 상호작용하여 `*`이 home이면 `home.jsp`, board면 `board.jsp`를 꺼내오게 됩니다.

tiles는 3.0.8버전까지 있고, 2016년부터 retired된 상황입니다. 하지만 꾸준히 많은 사용자가 쓰고 있고, thymeleaf나 sitemesh로 대체할 수 있을까 고민해서 thymeleaf를 사용해보았지만 아직 tiles가 기능이 강력하고, 익숙하다보니 thymeleaf로 대체하여 쭉 사용하기가 애매한부분이 있습니다.

여기까지 tiles설정의 기본 부분이었습니다.

-----

> lombok 설정참고 사이트

[효기미나님의 블로그](https://lee1535.tistory.com/27)

[코드힐러님의 블로그](https://binit.tistory.com/21)

[ojava님의 블로그](https://ojava.tistory.com/131)

[중년개발자님의 블로그](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=sharplee7&logNo=221674229726)

[VSCode에서 롬복 사용하기 - glshlee님의 블로그](https://planbsw.tistory.com/109)

<!-- <span class="text-muted">*- 구동준비된 상태의 폴더구조입니다.*</span>

![스프링부트 구동](/images/post/springboot/springboot11.png)
 -->