---
layout: post
date:   2021-12-13 17:16:37 +0900
title:  "[SPRING] MyBatis 사용하기 01"
author: Kimson
categories: [ SPRING, TIL ]
image: assets/images/post/springboot/mybatis/batis03.png
tags: [ java configuration, mybatis, SqlSessionFactory ]
description: ""
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

# Spring에서 MyBatis를 빠르게 사용해보자

기록용이라 다소 내용이 부실한 점 양해바라며 참고한 사이트의 링크를 남겨두겠습니다.

## MyBatis 적용 문제

> 사용된 의존성

```xml
<!-- ${org.springframework-version} === 5.3.6 -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>${org.springframework-version}</version>
</dependency>
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>2.0.6</version>
</dependency>
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.7</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.24</version>
</dependency>
<!-- 참고로 롬복 사용 중 입니다. -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.22</version>
    <scope>provided</scope>
</dependency>
```

의존성 추가할 때 발생하는 오류는 `mybatis-spring`과 `mybatis`의 버전에 따라 발생할 수 있으니 `maven repository`에서 확인하시기 바랍니다.

`Spring-Boot`에서는 `application.properties`로 
`mybatis.type-aliases-package='package.path'`만 설정해주면 `@Mapper` 어노테이션을 곧바로 사용해서 간단하게 사용했었습니다.

`spring`도 되겠거니하고 달랑 `Mapper` 어노테이션을 붙였더니 엄청나게 긴 빨간글들을 뱉어냈습니다...

오류들을 쭉 읽다보니 발견한 문제점 4가지!

1. `Autowired`가 안되용 (핵심은 이게 아니었습니다)
2. sqlSessionFactory 어쩌고가 없어용
3. mapper라는 Bean을 생성하지 못했어요!(라고 영어로 적혀있어요)
4. mysql.cj 어쩌고가 메모리누수 어쩌고...

보통 보면 에러 중에서 제일 윗 녀석이 원초적인 문제인 경우가 많더라구요.

![에러 이미지]({{site.baseurl}}/assets/images/post/springboot/mybatis/batis04.png)

## MapperScan과 SqlSessionFactory

> mapper를 설정하는 방법을 모르신다면 블로그에 있는 [SPRING BOOT MyBatis 시작하기](https://kkn1125.github.io/spring-boot-mybatis01){:target="_blank"}를 참고해주세요!

두 가지가 필요합니다. `MapperScan`과 `SqlSessionFactory`인데요.

`MapperScan`은 `basePackage` 기준으로 존재하는 `@Mapper` 어노테이션을 명시한 `interface`를 스캔합니다.

이때 해당되는 `interface`를 스프링 `Bean`으로 주입받아 `DB`에 접근하게 됩니다.

`@Mapper`만 달아두었다고 되는 건 아닌 듯 합니다.

`MapperScan`으로 어디 있는지 알려주고, sqlSessionFactory를 세팅해서 dataSource를 넘깁니다.

```java
// RootConfig.java
@Configuration
@MapperScan(basePackages = {"com.springStudy.web"},
annotationClass = org.apache.ibatis.annotations.Mapper.class)
public class RootConfig {
    @Bean
	public DataSource dataSource() {
		DriverManagerDataSource mysql = new DriverManagerDataSource();
		mysql.setDriverClassName("com.mysql.cj.jdbc.Driver");
		mysql.setUrl("jdbc:mysql://localhost:3306/yourDbName");
		mysql.setUsername("name");
		mysql.setPassword("pass");
		return mysql;
	}

    @Bean
    public SqlSessionFactory sqlSessionFactory() throws Exception {
            SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
            sessionFactory.setDataSource(dataSource());
            return sessionFactory.getObject();
    }
}
```

`@MapperScan` 어노테이션의 주석에 있는 예제를 들고 왔습니다. 잘 실행됩니다.

이렇게 `SqlSessionFactory`와 `MapperScan`을 설정하니 오류도 해결되고 `Autowired`했던 `Service`객체도 잘 받아와서 `DB`내용을 잘 출력합니다.

## mysql.cj 어쩌고

기존에 사용하던 `mysql`드라이버 클래스가 `deprecated`되었으니 `com.mysql.jdbc.Driver`에서 `com.mysql.cj.jdbc.Driver`로 사용하라는 에러 메세지였습니다

-----

함께 보면 좋은 내용

[MySQL 페이지 - Connecting to MySQL Using the JDBC DriverManager Interface](https://dev.mysql.com/doc/connector-j/8.0/en/connector-j-usagenotes-connect-drivermanager.html){:target="_blank"}

[쥬니님 개발블로그](https://juntcom.tistory.com/44){:target="_blank"}

[Choi님 블로그 - 맵퍼 설정방식](https://cho1-w0n-san9.tistory.com/32){:target="_blank"}

[honinbo님 블로그 - @MapperScan이란?](https://cho1-w0n-san9.tistory.com/32){:target="_blank"}

[linked2ev님 블로그 - MapperScan를 통한 Mapper 주입 방식](https://cho1-w0n-san9.tistory.com/32){:target="_blank"}

[매운코딩님 블로그 - Mybatis 연동 시 오류 해결방법](https://cho1-w0n-san9.tistory.com/32){:target="_blank"}

[코딩노잼님 블로그 - @Mapper는 언제 사용하는걸까?](https://cho1-w0n-san9.tistory.com/32){:target="_blank"}

[mumuni님 velog - MyBatis를 Springboot에서 사용해보자](https://cho1-w0n-san9.tistory.com/32){:target="_blank"}