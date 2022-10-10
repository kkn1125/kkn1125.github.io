---
slug: "/spring-boot-cors01/"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-08-19 20:02:35 +0900
title:  "[SPRINGBOOT] Method Not Allowed 405 에러 발생과 해결"
author: Kimson
categories: [ spring boot ]
tags: [ cors, "405", post, til ]
image: /images/post/covers/TIL-spring.png
description: "Method Not Allowed 405

아주 골치 아픈 현상을 겪었습니다. 3시간 정도 이것 저것 수정하다가 드디어 원인을 발견하고 고쳤습니다. 저와 같은 상황인 분에게 도움이 되고자, 그리고 제가 까먹지 않게 포스팅으로 남기려합니다."
featured: false
hidden: false
rating: 3.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# Method Not Allowed 405

> 블로그에서 가장 인기 있는 글이라서 보시는 분들에게 좀 더 명확하게 알려드리고자 내용을 수정하였습니다.

아주 골치 아픈 현상을 겪었습니다. 3시간 정도 이것 저것 수정하다가 드디어 원인을 발견하고 고쳤습니다. 저와 같은 상황인 분에게 도움이 되고자, 그리고 제가 까먹지 않게 포스팅으로 남기려합니다.

로그인 처리 도중에 발생한 문제로 여러 블로그나 커뮤니티를 참고해도 소용이 없어서 포기하려던 찰나에 해결이 됐습니다.

## 문제 상황

1. `Spring Boot Security` 설정
2. `Ajax`로 `post`요청으로 로그인 계정 유효성 검사
3. 검사 결과에 따른 분기처리

## 원인

`csrf`설정이 잘못되어있었습니다. `Ajax`에서와 `form`데이터를 다룰 때 `csrf`를 조금 다르게 사용합니다. 저 같은 경우는 `Ajax`를 사용하면서 `form`데이터에서 처리하는 `_csrf.parameterName`을 그대로 두었기 때문입니다.

### csrf 설정

```javascript
$.ajax({
    url: "/login",
    method:'post',
    data:{
        id: id.value,
        pw: pw.value,
        role: role.value,
    },
    beforeSend:(xhr)=>{
        xhr.setRequestHeader('${_csrf.parameterName}','${_csrf.token}')
    },
    success:function(data){
        console.log(data);
    },
    error:function(xhr,err){
        console.error(err);
    }
});
```

골머리를 앓던 부분이 바로 앞서 말한 `Ajax`였습니다. 해결책을 읽던 중에 `form`과 `Ajax`요청시 `security`는 서로 다른 방법을 적용해야 함을 알게 되었고, 따라해도 안 되었습니다.

문제는 위의 `beforeSend`메서드를 잘 보면 `_csrf`의 `prarmeterName`을 받아오고 있습니다. 이것이 대단히 잘못되었습니다. 그저 `_csrf` 프로퍼티명을 `headerName`으로 적혔는지 잘 확인을 했으면 됐는데 참 아쉬웠습니다. (사실 극대노)

```javascript
// 코드들
beforeSend:(xhr)=>{
    xhr.setRequestHeader('${_csrf.headerName}','${_csrf.token}');
},
// 코드들
```

일부만 떼어서 해결한 예로는 위의 코드입니다. 무언가 당연한 얘기이고 잘 알고 있는 내용이라면 틀리지 않을텐데 이제 막 시작한 제 눈에는 이게 보이지 않았습니다...

직접 찍어보니 이름 자체가 다르게 나왔습니다. 이러한 부분을 조심해서 쭉 공부해나가면 될 것 같습니다...

-----

## 이상한 문장 수정 후

현재 포스팅을 수정 중인 시점에서 봤을 때 `Security`를 여전히 놓고 있는 게 참 부끄럽습니다. 그동안 포트폴리오다 면접준비다 하는 핑계로 다른 것을 공부했습니다.

이 포스팅에 관심을 가져주신 분들께 감사드리며 도움이 조금이나마 되시기를 :)

> 참고 사이트

[OKKY 질문 답글](https://okky.kr/article/487431)