---
layout: post
modified: 2022-01-19 15:55:53 +0900
date:   2021-12-16 14:31:34 +0900
title:  "[JAVASCRIPT] 정적 웹에서 방문자 수 나타내기"
author: Kimson
categories: [ JAVASCRIPT, TIL ]
image: assets/images/post/covers/TIL-javascript.png
tags: [ visitors, counting ]
description: "정적 웹에서 방문자 수 나타내기

사실 오래 전부터 고민하면서 이것저것 시도를 했었는데요. 나름 꼼수를 사용한 방법을 소개해드리려 합니다. 만일 문제 될 시 해당 글은 삭제할 것 입니다.

이 글을 보시는 고수 분들은 어딘가에 저촉되는 부분이 있다면 알려주시기바랍니다 :)"
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

# 정적 웹에서 방문자 수 나타내기

사실 오래 전부터 고민하면서 이것저것 시도를 했었는데요. 나름 꼼수를 사용한 방법을 소개해드리려 합니다. 만일 문제 될 시 해당 글은 삭제할 것 입니다.

이 글을 보시는 고수 분들은 어딘가에 저촉되는 부분이 있다면 알려주시기바랍니다 :)

## 시도했던 기억

> 여담이 필요없으신 분은 아래로 스크롤하셔서 방법부터 보시기 바랍니다.

예전에 정적 웹에서 데이터베이스를 사용할 수 없을까 해서 올린 [[DATABASE] 정적 웹에서 데이터베이스 사용하기](https://kkn1125.github.io/database-use-db){:target="_blank"} 에서 이야기를 다룬 적 있습니다. 그런 생각들이 점점 꼬꼬무해서 방문자 표시를 하고 싶다는 생각이 들어 정말 여러가지를 해봤습니다.

1. IndexedDB
   1. 쓰기가 너무 번거롭습니다. 초반에 이해하는데 조금 시간이 걸렸고, 막상 써보니 제가 기대한 `데이터 공유`가 되지 않아 포기했습니다.
2. LocalStorage
   1. 이 방법은 보통 다크모드나 사용자의 정보를 담는데 사용하는 것으로 알고 있는데요. 다크모드 할 때 자주 사용했지만 이 또한 `데이터 공유`가 되지 않아 다른 방향으로 사용하고 있습니다.
3. SessionStorage
   1. 위와 같은 이유로 다른 쓰임으로 사용 중에 있고, 무엇보다도 브라우저가 켜져있을 때만 데이터가 유지되어 휘발성이 셋 중 가장 강합니다.
4. API서버
   1. `JAVA`로 `Restful API`를 공부하는 중에 실험삼아 `herokuapp`을 통해 `API`서버를 만들고 데이터를 `CRUD`하는 테스트를 했습니다. 아주 성공적이었지만 굳이 이렇게 할 바엔...`nodejs`나 루비기반 `jekyll`을 쓰는 편이 좋겠다 싶어 접어두었습니다. (물론 DB는 JawsDB라는 대여? DB를 사용해서 딱히 보안에 대한 위협은 없었습니다.)
5. 외부사이트 정보 가져오기
   1. 크롤링과는 다르지만 이전에 파이썬을 공부하다가 `SOUP`을 알게 되었고, 현재 `fetch`와 `async`를 공부하다보니 자연스레 해당 `URL`의 데이터를 긁어와 태그로 변환하는 등의 작업을 하다보니 응용하게 되었습니다. "아 요거를 긁어다가 쓰면 되겠구나?" 어떻게 보면 API서버에서 데이터를 끌어와 쓰던 것과 유사하지만 `CUD`를 제외하고 읽기만이라도 되면 가져와 활용 할 만 했습니다. 왜냐면 `CUD`는 해당 페이지에서 알아서 업데이트 되기 때문이죠.

## 방문자 수를 불러오자

우연히 [url.kr](https://url.kr/){:target="_blank"} 라는 사이트를 알았고, 주로 긴 `url`을 줄여주는 역할을 하는 것 같습니다. 호기심에 어떻게 줄여지고, 줄여진 주소가 작동하는지 테스트하던 중 방문자 수를 조회하는 페이지가 있었습니다.

그래서 이거다..!

```javascript
async function sendFing() {
    const visiteCount = await fetch('targetUrl', {
        method: 'get',
        mode: "no-cors",
        credentials: 'same-origin'
    });
    const getResponse = await visiteCount.text().catch(e=>console.error(e.message)).finally(e=>console.info('fing'));
}

sendFing();
```

해당 주소로 요청 될 때를 기준으로 방문자 수가 카운팅 되는 것으로 보아 `fetch`로 테스트 해보니 잘 카운팅 되었습니다. 이렇게 블로그나 특정 사이트에 접속하면 해당 주소를 요청시키도록 함수를 짭니다.

방문 카운팅이 된 후 결과 값을 가져와야하기 때문에 방문자 수를 표시해주는 `url`로 함수를 하나 더 만듭니다.

```javascript
async function getVisitorCount(){
    const response = await fetch(`yourUrl`, {
        // 설정들...
    });
    const data = await response.text();

    const parsedResponse = new DOMParser();
    const body = [...parsedResponse.parseFromString(data.contents, 'text/html').body.querySelectorAll('targetParent')];

    const total = body[1];
    const today = body[2];

    document.querySelector('#total').textContent = total.textContent+'명';
    document.querySelector('#today').textContent = today.textContent+'명';
}

getVisitorCount();
```

이렇게 가져온 데이터를 `DOMParser`를 사용해 엘리먼트로 변환하고, `querySelector`를 사용해 원하는 영역에 데이터를 가공해서 뿌려주면 됩니다.

## 마무리

여러가지를 쭉 배우기보다는 하나를 배워서 쭉 써보고 다음 것을 배우는 습관이 있습니다. 대단한 것을 소개하는 블로그가 아니지만 명확하지는 않더라도 저와 같은 입장에 있을 누군가에게 도움이 되었으면 하는 바람과 시간이 지나서 제가 볼 때 기억을 하기 위해 포스팅에 노력을 합니다.

만일 해당 포스팅에 문제가 있다면 깃허브 저장소에 이슈로 작성해주시면 감사하겠습니다.