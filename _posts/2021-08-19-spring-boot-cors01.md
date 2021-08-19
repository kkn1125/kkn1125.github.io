---
layout: post
date:   2021-08-19 20:02:35 +0900
title:  "[SPRING] Method Not Allowed 405 에러 발생과 해결"
author: Kimson
categories: [ TIL, SPRINGBOOT ]
tags: [cors, "405", post]
image: assets/images/post/covers/TIL-spring.png
description: "Method Not Allowed 405

아주 골치 아픈 현상을 겪었습니다. 3시간 정도 이것 저것 수정하다가 드디어 원인을 발견하고 고쳤습니다. 저와 같은 상황인 분에게 도움이 되고자, 그리고 제가 까먹지 않게 포스팅으로 남기려합니다."
featured: true
hidden: false
rating: 3.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
---

# Method Not Allowed 405

아주 골치 아픈 현상을 겪었습니다. 3시간 정도 이것 저것 수정하다가 드디어 원인을 발견하고 고쳤습니다. 저와 같은 상황인 분에게 도움이 되고자, 그리고 제가 까먹지 않게 포스팅으로 남기려합니다.

## 원인

먼저 상황은 이렇습니다. Spring Boot Security를 설정하고나서 ajax로 유효성 검사와 계정 확인을 하고 로그인 처리를 생각하고 있었습니다.

여러 블로그나 커뮤니티를 참고해도 소용이 없어서 포기하려던 찰나에 해결이 됐습니다.

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

골머리를 앓던 부분이 바로 ajax였습니다. 해결책을 읽던 중에 form과 ajax요청시 security의 경우는 서로 다른 방법이라는 것을 알게 되었고, 따라해도 안되었습니다.

문제는 위의 `beforeSend`메서드를 잘 보면 `_csrf`의 `prarmeterName`을 받아오고 있습니다. 이것이 대단히 잘못되었습니다.

```javascript
    // 코드들
beforeSend:(xhr)=>{
    xhr.setRequestHeader('${_csrf.headerName}','${_csrf.token}');
},
    // 코드들
```

일부만 떼어서 제가 해결한 방법으로 고쳤습니다. 무언가 당연한 얘기이고 잘 알고 있는 내용이라면 틀리지 않을텐데 이제 막 시작한 제 눈에는 이게 보이지 않았습니다...

직접 찍어보니 이름 자체가 다르게 나왔습니다. 이러한 부분을 조심해서 쭉 공부해나가면 될 것 같습니다...

-----

> 참고 사이트

[OKKY 질문 답글](https://okky.kr/article/487431){:target="_blank"}