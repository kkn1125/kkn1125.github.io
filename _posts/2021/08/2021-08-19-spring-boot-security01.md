---
layout: post
modified: 2022-01-19 15:48:20 +0900
date:   2021-08-19 17:40:02 +0900
title:  "[SPRINGBOOT] SPRING BOOT Security 01"
author: Kimson
categories: [ TIL, SPRINGBOOT ]
tags: [mybatis]
image: assets/images/post/covers/TIL-spring.png
description: "Spring Boot Security 시작하기

시큐리티 시작해야지 했던 게 벌써 일주일이 지난 것  같습니다. 그 날 못한 일을 계속 꼼수로 수정해서 달력 저어~ 뒤로 미루던 것을 이제 그만 해야할 것 같습니다. TodoList를 만든 보람과 신뢰가 자신에게 사라지는 느낌이라 자제를...

`Security` 설정은 `Spring boot security`를 검색하면 스프링부트 가이드에 잘 나와있습니다. 하나하나 따라하면서 필요한 기능들을 검색해서 알아보았습니다.

잊을 것 같아 포스팅으로 기록을 남깁니다."
featured: false
hidden: false
rating: 5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: false
---

# Spring Boot Security 시작하기

시큐리티 시작해야지 했던 게 벌써 일주일이 지난 것  같습니다. 그 날 못한 일을 계속 꼼수로 수정해서 달력 저어~ 뒤로 미루던 것을 이제 그만 해야할 것 같습니다. TodoList를 만든 보람과 신뢰가 자신에게 사라지는 느낌이라 자제를...

`Security` 설정은 `Spring boot security`를 검색하면 [스프링부트 가이드](https://spring.io/guides/gs/securing-web/){:target="_blank"}에 잘 나와있습니다. 하나하나 따라하면서 필요한 기능들을 검색해서 알아보았습니다.

잊을 것 같아 포스팅으로 기록을 남깁니다.

## Security Config 설정

`MemberMapper`와 연결을 하겠습니다.
Mybatis 설정은 [SPRING BOOT MyBatis 시작하기](https://kkn1125.github.io/spring-boot-mybatis01/){:target="_blank"}을 참고하시기 바랍니다.

그리고 SecurityConfig.java입니다.

```java
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
// annotation 없으면 안 됨
public class SecurityConfig extends WebSecurityConfigurerAdapter{
    @Autowired
    private MemberServiceImpl service;
    
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/resources/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
        .antMatchers("/user/**").authenticated()
        .antMatchers("/admin/**").authenticated()
        .anyRequest().permitAll();

        http.formLogin()
        .loginPage("/login")
        .defaultSuccessUrl("/")
        .permitAll();

        http.logout()
        .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
        .logoutSuccessUrl("/login")
        .invalidateHttpSession(true);

        http.exceptionHandling()
        .accessDeniedPage("/denied");
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(service).passwordEncoder(passwordEncoder());
    }
}
```

`SecurityConfig`는 `WebSecurityConfigurerAdapter`를 상속받습니다. 3가지 `Configure`를 오버라이드하고 위와 같이 작성합니다.

## 

-----

> 참고 사이트

[망나니개발자님의 블로그](https://mangkyu.tistory.com/77){:target="_blank"}

[밤둘레님의 블로그](https://bamdule.tistory.com/53){:target="_blank"}
