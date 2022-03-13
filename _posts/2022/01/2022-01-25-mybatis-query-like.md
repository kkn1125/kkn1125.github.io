---
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2022-01-25 15:42:46 +0900
title:  "[SPRING] MyBatis Like 쿼리 작성"
author: Kimson
categories: [ spring ]
image: assets/images/post/covers/TIL-spring.png
tags: [ like, query, til ]
description: "MyBatis Like

`api`를 만들면서 카테고리 검색이 필요해졌습니다. 페이징 처리할 때 사용했던 `like`구문이 막상 떠오르지 않아 시간을 버렸네요.

기본 사용 형식

기본적으로 `LIKE`는 아래와 같이 3가지 형식을 사용합니다."
featured: true
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# MyBatis Like

`api`를 만들면서 카테고리 검색이 필요해졌습니다. 페이징 처리할 때 사용했던 `like`구문이 막상 떠오르지 않아 시간을 버렸네요.

## 기본 사용 형식

기본적으로 `LIKE`는 아래와 같이 3가지 형식을 사용합니다.

```sql
-- abc가 들어가는 데이터
SELECT * FROM testboard WHERE `column` LIKE '%abc%';

-- abc로 시작하는 데이터
SELECT * FROM testboard WHERE `column` LIKE 'abc%';

-- abc로 끝나는 데이터
SELECT * FROM testboard WHERE `column` LIKE '%abc';
```

## 유의사항

`MyBatis`에서 사용할 때는 `#`과 `$`만 주의하면 됩니다. 추가로 공백이 포함될 여지가 있는 값인지도 확인합니다.

## #과 $의 차이

`#`은 문자에 자동으로 따옴표를 씌어 쿼리에 담아줍니다. `$`는 따옴표 없이 값 그대로를 쿼리에 담습니다. 더 자세한 차이점은 타블로그에 잘 정리된 내용을 참고하시는 것이 빠릅니다.

## 예제

```java
// restcontroller
@RestController
@RequestMapping("/test")
public class testRestController{
   @Autowired
   private TestService testService;

   @GetMapping("/category/{category}")
   public List<Test> findByCategory(@PathVariable("category") String category){
      return testService.findByCategory(category);
   }

}
```

카테고리 값을 경로에서 받아오고 매퍼에는 아래의 구문으로 처리합니다. (서비스단은 생략하겠습니다.)

```java
// mapper
@Mapper
public interface TestMapper {
   @Select("SELECT * FROM test WHERE column LIKE '%${category}%'")
   public List<Test> findByCategory(@Param("category") String category);
}
```

혹은

```java
// mapper
@Mapper
public interface TestMapper {
   @Select("SELECT * FROM test WHERE column LIKE CONCAT('%', #{category}, '%')")
   public List<Test> findByCategory(@Param("category") String category);
}
```

두 방법 중 택하여 사용하면 됩니다.