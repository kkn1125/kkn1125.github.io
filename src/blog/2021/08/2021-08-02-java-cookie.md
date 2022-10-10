---
slug: "/java-cookie/"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-08-02 17:06:27 +0900
title:  "[JAVA] Cookie에 관한 고찰"
author: Kimson
categories: [ java ]
tags: [cookie, til]
image: /images/post/cookie/cookie.PNG
description: "Cookie 사용
쿠키의 특징을 간단하게 알아보면서 내용을 정리하였습니다. 주로 웹 서버에 의해 만들어지고, 서버가 HTTP 응답헤더의 Set-Cookie에 내용을 넣어 전달하면, 이 내용을 브라우저에 저장합니다."
featured: false
hidden: false
rating: 4.5
toc: true
published: true
---

# Cookie 사용

쿠키의 특징을 간단하게 알아보면서 내용을 정리하였습니다.

## Cookie란

> 주로 웹 서버에 의해 만들어지고, 서버가 HTTP 응답헤더의 Set-Cookie에 내용을 넣어 전달하면, 이 내용을 브라우저에 저장합니다.
>식별이나 인증 등에 사용되고 브라우저에서도 document.cookie로 접근 가능합니다.

## Cookie 생성

```java
Cookie cookie = newCookie("name", "value"); // 이것만으로 쿠키 생성이 완료된 것이 아닙니다.
​
cookie.setMaxAge(0);
// -1은 expires/max-age 값이 sesison으로 되며, 브라우저 종료하기 전까지 쿠키가 남아있게 됩니다.

cookie.setDomain("/path");
// 쿠키에 접근가능한 주소를 지정합니다. localhost면 localhost에서 조정이 가능하다는 이야기입니다.

cookie.setPath("/admin");
// 도메인과 헷갈렸는데요. 기본값은 현재 경로이고, /admin이라 지정하면 /admin에서 볼수있지만
// /customer등등의 경로에서는 볼 수 없습니다.
// 절대경로여야하는 특징이 있습니다.

cookie.setSecure(boolean);
// 쿠키 보안과 관련해서 사용하며, 쿠키의 samesite가 none으로 설정될때는
// 무조건 secure이 true가 되어야 쿠키가 생성됩니다.

response.addCookie(cookie);
// 응답에 쿠키를 추가해야 쿠키가 담겨집니다.
// 이후 응답된 페이지를 브라우저가 받을때 쿠키가 생성되게 됩니다.
```

## Cookie 읽기

```java
Cookie[] cookies = request.getCookies();
// 요청된 쿠키들을 불러오기위해 request에서 꺼내옵니다.

String tmp = "";
for(Cookie cookie : cookies) {
    tmp += cookie.getName()+":"+cookie.getValue()+",";
}
// tmp에 쿠키들이 저장되어 쭉 나오게 됩니다.
// 이외에도 getPath(), getSecure(), getMaxAge()등이 있습니다.
```

## Cookie 수정/삭제

```java
Cookie[] cookies = request.getCookies();
// 수정하기 위해 쿠키들을 불러옵니다.

for(Cookie cookie : cookies) {
    if(cookie.getName("name").equals()) {
        cookie.setMaxAge(-1); // session으로 max-age값 변경
        // cookie.setMaxAge(0); 0으로 맞추면 쿠키가 삭제된다.
        // cookie.setValue(null); 값은 null 또는 ""
        cookie.setValue("value2"); // 쿠키 값 변경
        response.addCookie(cookie);
    }
}
```

# Javascript와 Java에서의 쿠키 읽기 특징

>HttpOnly는 특히 브라우저와 서버측에서 가져올수 있는지의 여부가 쟁정이 되지 않나 싶습니다. 즉, 가져오는 주체의 허용 범위라고 이해하였습니다.

아무리 찾아도 쉽게 설명 된 사이트가 없어 정리하려합니다. 먼저, 자바 코드 입니다.

```java
Cookie[] cookies = request.getCookies();
for(Cookie cookie : cookies) {
    cookie.getName(); // 쿠키의 이름 ex) JSESSION
    cookie.getValue(); // 쿠키의 값 ex) EH3EQWE2135ED8D7D54434GHJGS...
}
// 특히나 JSESSIONID라는 쿠키는 HttpOnly로 설정되어 있어서
// 서버 측에서 쿠키 조회가 가능합니다.
```

그 다음 자바스크립트 코드 입니다.

```javascript
document.cookie;
// "" 빈 값
```

-----

크롬기준으로 설명드리겠습니다.

f12 개발자도구를 열었을때 application 탭에서 쿠키를 보면 다른도메인의 쿠키나 secure, httponly 등의 속성이 있는것과 없는 것이 많습니다.

이때 httponly속성이 없거나 domain이 해당 사이트와 동일 해야지만 자바스크립트에서 document.cookie로 쿠키를 가져올수 있고,

httponly속성이 true이거나 domain이 다르다면 document.cookie로 값을 가져오지 못하는 것을 알게 되었습니다.

-----

[Python2 - HttpOnly 속성 참고](https://www.python2.net/questions-200084.htm)