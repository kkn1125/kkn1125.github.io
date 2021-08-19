---
layout: post
date:   2021-08-18 19:54:48 +0900
sitemap :
    lastmod : 2021-08-18 19:54:48 +0900
    changefreq :
    priority : 1.0
title:  "[SPRING] SPRING BOOT MyBatis 시작하기"
author: Kimson
categories: [ TIL, SPRINGBOOT ]
tags: [mybatis]
image: assets/images/post/covers/TIL-spring.png
description: "MyBatis

ToDoList에도 올려두었던 녀석을 이제야 합니다. 여지껏 수동으로 작성하는 방법에 길들여져서 새로운 방법을 저도 모르게 멀리하려고 핑계댔는지도 모르겠습니다.

최근에 롬복을 설치하고 사용해보니 굉장히 편리함을 느꼈습니다. 이제는 편리한 기능들을 계속 찾게 되는 것 같습니다.  
아직 lombok을 안 써보신 분은 Spring Boot 시작하기 02를 참고해주세요."
featured: true
hidden: false
rating: 4.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
---

# MyBatis

ToDoList에도 올려두었던 녀석을 이제야 합니다. 여지껏 수동으로 작성하는 방법에 길들여져서 새로운 방법을 저도 모르게 멀리하려고 핑계댔는지도 모르겠습니다.

최근에 롬복을 설치하고 사용해보니 굉장히 편리함을 느꼈습니다. 이제는 편리한 기능들을 계속 찾게 되는 것 같습니다.  
아직 lombok을 안 써보신 분은 [Spring Boot 시작하기 02](https://kkn1125.github.io/spring-boot-start02/){:target="_blank"}를 참고해주세요.

## 설정

> 작업환경은 spring boot입니다.

`dependency`를 먼저 추가해줍시다. 저는 아래의 버전으로 사용했습니다.

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.2.0</version>
</dependency>
```

참고로 Spring에서 쓰던 RootConfig.java가 필요가 없어졌습니다. 이유는 아래의 프로퍼티파일 설정때문입니다.

```properties
# mysql settings
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/sample?useUnicode=yes&characterEncoding=UTF-8&allowMultiQueries=true&serverTimezone=Asia/Seoul
spring.datasource.username=mysqlID
spring.datasource.password=mysqlPW
# DB의 조회 결과 데이터를 담을 클래스들의 패키지 경로 지정
mybatis.type-aliases-package=com.bootstart.startweb.entity
# 단 mapper.xml를 작성할때만 이 줄을 사용한다. 그 외 방법에는 안써도 됨
```

기존에 RootConfig.java에서 설정해두었던 데이터베이스 연결 구문이 대체되어 필요가 없게 되었습니다.

![mybatis backup]({{site.baseurl}}/assets/images/post/springboot/mybatis/batis01.png)
{:.text-center}
<span class="text-muted">- 불쌍한 config</span>

이제는 힘겹게 `Connection`하고 select, insert, update, delete 하나하나 `try catch` 써가면서 노가다를 안해도 되는 상황이 됐습니다. 이런 수고스런 녀석들을 `back`확장자로 감금시켜두겠습니다.

필요한 설정은 두가지 남았습니다. `interface`구현과 `service`구현입니다.

## Mapper Interface구현

Interface 구현은 간단한 예제를 가져왔습니다.

```java
@Mapper // mapper.xml을 대체
public interface UserMapper {
    @Select("SELECT * FROM user")
    List<User> findAll();

    @Select("SELECT * FROM user WHERE num = #{num}")
    // #{foo}
    User findByUserIdx(@Param("num") int num);
    // @Param("...")의 이름과 #{...}의 이름이 같아야함
    // #{foo} ... @Param("foo") int bar 여도 가능

    @Insert("INSERT INTO user(id,pw,email,comment,profileImg,name,birth,gender,phone,address,zip,question,answer) VALUES(
        #{id}, #{pw}, #{email}, #{comment}, #{profileImg}, 
        #{name}, #{birth}, #{gender}, #{phone}, #{address}, 
        #{zip}, #{question}, #{answer}
    )")
    // @Options(useGeneratedKeys = true, keyProperty = "num")
    int save(@Param("user") final User user);
}
```

## Service 구현

작성한 후 UserService를 작성합시다.

```java
@Service
public class UserService {
    
    @Autowired
    private UserMapper userMapper;

    // public UserService(UserMapper userMapper) {
    //     this.userMapper = userMapper;
    // }

    public List<User> getAllUsers() {
        final List<User> list = userMapper.findAll();
        if(list.isEmpty()){
            return null;
        }
        return list;
    }

}
```

DI로 UserMapper를 땡겨옵니다. `@Autowired`로 간편하게 하는 방법이 있지만 저는 공부를 위해 주석처리로 남겨만 두었습니다.

> DI에 관한 이해는 포스팅 맨 아래의 링크를 참고해주세요.

## 출력 테스트

마지막으로 테스트 해보겠습니다.

```java
// @ResponseBody
@GetMapping(value="test", produces = "application/json; charset-utf8")
public String AllUsers(Model model) {
    List<User> list = userService.getAllUsers();
    model.addAttribute("list", list);
    return "root.test";
}
```

만일 json으로 전송해서 확인하시는거면 produces 값을 위와 같이 하고 보시기바랍니다. db에 테스트용 정보를 3개정도 담고 출력해보겠습니다.

```java
@ResponseBody
@GetMapping(value="test", produces = "application/json; charset-utf8")
public String AllUsers(Model model) {
    List<User> list = userService.getAllUsers();
    ObjectMapper mapper = new ObjectMapper();
    String result = null;
    try {
        result = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(list);
    } catch (JsonProcessingException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
    }
    return result;
}
```

`list`에 받아서 보기 좋게 `pretty`먹이고, 뿌려보겠습니다. 결과는 `Postman`을 참고하겠습니다.

![mybatis backup]({{site.baseurl}}/assets/images/post/springboot/mybatis/batis02.png)
{:.text-center}

`Postman`은 `Json`이 깔끔하게 나와서 `json`출력 보기용으로 자주 사용하고 있습니다. (원래 이 용도가 아닐텐데...)

오늘은 `select`구문만 해보았습니다. `MyBatis`를 시작했다는 것에 만족을 하고 `CRUD`를 구현하면서 고급 SQL적용까지 공부해서 다시 포스팅하겠습니다.

-----

[DI에 관한 이해 - HeeJeong Kwon님의 블로그](https://gmlwjd9405.github.io/2018/11/09/dependency-injection.html)