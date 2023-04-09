---
slug: "/javascript-send-mail/"
layout: post
modified: 2022-03-14 00:09:35 +0000
date:   2021-09-02 13:35:47 +0000
title:  "[JAVASCRIPT] 자바스크립트 메일 보내기"
author: Kimson
categories: [ javascript ]
tags: [ send, mail, til ]
image: /images/post/covers/TIL-javascript.png
description: "메일 보내기

이메일을 보내는데 서버 측에서 보내자니 자바 밖에 모르고, 배포해서 서버를 돌리자니 여기저기 제약이 많아 정적 사이트에서 메일을 보내는 방법을 찾고 있었습니다.

현재 블로그는 운영 중이지만 포트폴리오를 정리한 페이지를 따로 만들어야 할 것 같아서 만드는 중에 궁금해져서 찾아봤습니다."
featured: false
hidden: false
rating: 4.5
toc: true
profile: false
keysum: false
keywords: ""
published: true
---

# 메일 보내기

이메일을 보내는데 서버 측에서 보내자니 자바 밖에 모르고, 배포해서 서버를 돌리자니 여기저기 제약이 많아 정적 사이트에서 메일을 보내는 방법을 찾고 있었습니다.

현재 블로그는 운영 중이지만 포트폴리오를 정리한 페이지를 따로 만들어야 할 것 같아서 만드는 중에 궁금해져서 찾아봤습니다.

## 구글의 스프레드 시트

참고 사이트의 설명이 너무 상세해서 이번에는 간략한 사용법과 테스트 결과를 보여드리고자 합니다.

### Sample Spreadsheet

링크에서 제공하는 스프레드시트를 사본으로 받습니다.
그리고 사본에서 `도구 > 스크립트 에디터`로 가서 `TO_ADDRESS`변수 주석을 풀고 값을 바꾸면 됩니다.

여기서 `TO_ADDRESS`는 메일을 받는 사람이어야 합니다. (착오 없으시길...)

### Version

내용 수정이 있을 시 꼭 버전을 새로 만들고 다시 배포하시기 바랍니다. 수정하고 적용이 안되어서 저는 한참 헤맸습니다.

## 전송 방식

### form 방식

```html
<form class="gform" action="[appURL]" method="post" data-email="yourmail@domain.com">
    <input type="name">
    <input type="email">
    <input type="message">
    <input type="submit" value="전송">
</form>
```

`action`에 `app url`을 복사하여 붙여넣습니다.

이때 `data-email`은 스프레드시트에서 스크립트 에디터에 `TO_ADDRESS`를 사용하지 않으면 위처럼 적고, 변수설정 했다면 `data-email`속성을 빼도 됩니다.

### Ajax 방식

```javascript
$.ajax({
    data: {
        name: name,
        message: message,
        email: email
    },
    url: 'Your app url',
    method: 'post',
    success: (data) => {
        console.log(data)
        // parsing = JSON.parse(data.data);
    },
    error: (xhr, err) => {
        console.log(err);
    }
});
```

마찬가지로 `form`에 있던 `data`와 같이 `name`, `message`, `email`를 설정합니다.

참고로 다른 속성으로 데이터를 보내면 스프레드시트에 추가되어 내용이 삽입됩니다.

success시 데이터 자체는 JSON이지만 data의 형태는 아래의 이미지와 같습니다.

![메일](/images/post/sendMail/mail01.png)

1. `data`, `result` 속성이 반환된다.
2. `result`는 성공하면 `success`, 아니면 `error`를 반환한다.
3. `data`는 내용이 `String` 이기 때문에 `JSON.parse`해야 `data`를 `JSON`으로 사용할 수 있다.

## 전송 결과

![메일](/images/post/sendMail/mail02.png)


-----

> 참고 사이트

[zzinise 님의 블로그 - 이메일 보내기](https://zzinise.tistory.com/12)

[털 업님의 저장소](https://kutar37.tistory.com/entry/%EC%A0%95%EC%A0%81-HTML-form%ED%83%9C%EA%B7%B8%EC%97%90%EC%84%9C-%EB%A9%94%EC%9D%BC%EB%B3%B4%EB%82%B4%EA%B8%B0-Google-Apps-Mail)