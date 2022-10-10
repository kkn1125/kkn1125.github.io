---
slug: "/java-jackson-databind/"
layout: post
modified: 2022-03-23 19:47:55 +0900
date:   2021-07-18 12:21:27 +0900
title:  "[JAVA] Json 기본 익히기"
author: Kimson
categories: [ java ]
tags: [Jacksondatabind, json, til]
image: /images/post/jacksonbind/jacksonbind01.png
description: "사용 dependency
junit : 4.12
spring-test : 5.3.6
jackson-databind : 2.12.3"
featured: false
hidden: false
rating: 5
toc: true
published: true
---

# Jackson data bind

> 사용 dependency
> 
> - [x] junit : 4.12
> - [x] spring-test : 5.3.6
> - [x] jackson-databind : 2.12.3

## ObjectMapper

```java
ObjectMapper mapper = new ObjectMapper(); /* 매퍼를 먼저 생성합니다. */

/* 객체를 JSON형태로 변환하는 방법 */
String stringInJSON01 = mapper.writeValueAsString(Object); /* 객체를 JSON String 으로 변환 :: String */
String stringInJSON02 = mapper.writeWithDefaultPrettyPrinter().writeValueAsString(Object); 
/* 객체를 JSON String 으로 변환 및 정렬 */

mapper.writeValue(new File("path"), Object); /* 객체를 JSON 파일로 변환 :: void */

/* JSON형태를 객체로 변환하는 방법 */
String jsonTest = "{"name":"whatson","age":15,"messages":["test","might"]}";
Class class = mapper.readValue(jsonTest, Class.class); /* JSON String을 객체로 변환 */
Class class = mapper.readValue(new File("path"), Class.class); /* JSON 파일을 객체로 변환 */
```

## List로 Json 다루기

```java
ObjectMapper mapper = new ObjectMapper(); /* 매퍼를 먼저 생성합니다. */

/* 객체를 JSON형태로 변환하는 방법 */
String stringInJSON01 = mapper.writeValueAsString(Object); /* 객체를 JSON String 으로 변환 :: String */
String stringInJSON02 = mapper.writeWithDefaultPrettyPrinter().writeValueAsString(Object); 

/* 객체를 JSON String 으로 변환 및 정렬
mapper.writeValue(new File("path"), Object); /* 객체를 JSON 파일로 변환 :: void */

/* JSON형태를 객체로 변환하는 방법 */
String jsonTest = "{"name":"whatson","age":15,"messages":["test","might"]}";
Class class = mapper.readValue(jsonTest, Class.class); /* JSON String을 객체로 변환 */
Class class = mapper.readValue(new File("path"), Class.class); /* JSON 파일을 객체로 변환 */
```

## Array로 Json 다루기

```java
ObjectMapper mapper = new ObjectMapper();
Class class = new Class();

/* 배열를 JSON 파일로 변환 */
Class[] list = new Class[1];
list[0] = class;
mapper.writeValue(new File("path"), list);
/* [{"key01":"value01","key02":"value02"}] 로 저장 */

/* JSON 파일(배열방식)을 배열로 변환 */
Class[] list2 = mapper.readValue(new File("path"), Class[].class);
System.out.println("List2 : " + Arrays.toString(list2)); /* [ ... 상동 ... ] */
/* list2[0] >> {"key01":"value01"} */
/* list2[1] >> {"key02":"value02"} */
```

기본적으로 `writeValue`와 `readValue`는 하나의 객체를 읽고 쓰는 것은 간단했지만 `List`와 배열로 주고 받을 일이 생겨 테스트해봤습니다.

`VO`내에 자신을 참조하는 `getList :: List` 를 만들어, `Controller`에서 받을 때 `VO`를 받아 `getList`를 써서 따로 `Json`으로 바꾸는 방법이 있었지만 개인적으로 다루기가 더 번거로워서 이렇게 사용하는게 더 쉽다고 판단됩니다.

- 아래 코드는 작업 중에 `List`로 `Json`파일 변환하게 되었던 것을 예제로 남기겠습니다.

```java
@PostMapping("post")
public String post(User user) {
    ObjectMapper mapper = new ObjectMapper();

    try {
        List list = mapper.readValue(new File("c:user.json"), new TypeReference<List<String>(){});
        list.add(user);
        mapper.writeValue(new File("c:user.json"), list);
    } catch (JsonGenerationException e) {
        e.printStackTrace();
    } catch (JsonMappingException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }

    return "redirect:/path";
}
```

### 참고 사이트

[Json파일 List타입으로 받아오기](https://becko.tistory.com/47)

[jackson databind의 기본 활용](https://tychejin.tistory.com/134)
