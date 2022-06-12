---
slug: "/javascript-code-style"
layout: post
modified: 2022-03-23 22:47:05 +0900
date:   2021-08-08 14:19:05 +0900
title:  "[JAVASCRIPT] 내 코드는 왜 이렇게 난잡할까"
author: Kimson
categories: [ javascript ]
tags: [array, coding, pattern, til]
image: assets/images/post/covers/TIL-javascript.png
description: "깔끔한 코드는 무엇일까

설계사무소에 다닐 때 자주 하던 말이 있었습니다. 도면을 정말 군더더기 없이 잘 그렸을 때 도면에서 빛이 난다고 자주 표현합니다.

파일관리, 선 정리, 정치수로 자리 잡은 텍스트들, 누가봐도 알아보는 레이어정리 등이 '빛나는 도면'의 조건인 셈입니다.

그러면 프로그래밍에서 깔끔한 코드는 무엇일까요? 아직 실무를 경험하지도 못했지만 감히 얕은 지식으로 방법론을 알아보고자 합니다."
featured: false
hidden: false
rating: 5
toc: true
profile: false
istop: true
keysum: true
keywords: '
A instanceof B # A가 B의 인스턴스이면 true, 아니면false
_typeof A # A의 타입이 무엇인지 반환
_!boolean # boolean값을 반대로
_Array.filter() # 배열의 구성을 조정하여 재구성한다.
_Array.slice() # 배열을 잘라내어 배열로 리턴한다 (원본 보존)
_보기쉬운 # 변수와 메서드의 네이밍으로 가독성 향상
_조립가능한 # 변수와 메서드의 독립성 부여
_반환하는 # 메서드의 리턴값을 활용한 변수 선언 최소화
'
published: true
---

# 깔끔한 코드는 무엇일까

설계사무소에 다닐 때 자주 하던 말이 있었습니다. 도면을 정말 군더더기 없이 잘 그렸을 때 도면에서 빛이 난다고 자주 표현합니다.

파일관리, 선 정리, 정치수로 자리 잡은 텍스트들, 누가봐도 알아보는 레이어정리 등이 '빛나는 도면'의 조건인 셈입니다.

그러면 프로그래밍에서 깔끔한 코드는 무엇일까요? 포스팅을 전면 수정하는 시점인 지금에도 잘 모르겠습니다.

## 주석을 달면 좋을까

유명한 생활코딩의 이고잉님 강좌로 프로그래밍을 시작했습니다. 적절한 이론과 실습, 무엇보다도 스스로 찾아서 해결해야한다는 강조를 합니다.

그때는 아무것도 모르는 시기였기에 기능 구현에만 오로지 몰두하던 시기였습니다. 그러면서 주석을 많이 달게 되었습니다. 제가 쓴 코드에 이해한 내용을 정리하던 식이었습니다.

주석은 명확히 기능이나 내용을 알리고자 요약하는 것인데 아이러니하게도 주석이 있는 코드는 그만큼 설명하지 않으면 이해하기 어렵다는 뜻으로 반증됩니다.

지금까지 작업해본 코드들을 보면서 느끼는 점이 있습니다. 주석을 작성할 때 있어서 해당 함수가 어떤 행위를 하는지 정도는 괜찮다고 생각합니다.

## 어제, 오늘의 코드

시간이 지나서 제가 쓴 포스트를 가끔씩 보다보면 많은 것을 느낍니다. 내가 많이 모르는 상태였구나, 신기하게도 꾸역꾸역 기능 구현을 열심히 했구나 싶습니다.

이전에는 기능을 구현하는데에만 초점을 두다보니 어떤 변수가 몇 개 있어야하고, 어떤 함수가 있어야하면 무엇을 리턴하는지 안중에 없었습니다. 단지 기능이 작동되는지, 코딩 중에 변수가 바뀌면 해당 값을 모두 바꾸는 하드코딩을 하기도 했습니다.

```javascript
let t = document.querySelector('#output');

function inValue(a){
    t.value += a;
}

function outTargetVal(){
    t.value = eval(t.value);
}

let testbtn ...
// ...
```

위의 코드는 예전에 계산기를 만들때 썼던 코드 일부입니다.

현재도 그렇지만 이전 코드를 보면 굉장히 많은 중복된 코드와 알수없는 네이밍들이 많았습니다. 즉흥적으로 변수를 만들어 쓰고, 위치 또한 정리가 되어있지 않아 나중에는 제가봐도 모를 지경인 코드가 많았습니다.

시간이 지난 지금도 보면 정리한다고 작업한 결과를 보면 아직도 너저분해보이는 것은 마찬가지 입니다.

## 코드에 규칙 만들기?

이 포스팅의 내용을 많이 지웠습니다. 처음 포스팅할 때의 기억을 더듬어 보면 아무것도 모르는 상태를 벗어나기 위한 불안에서 오는 정리였던게 아닌가 싶습니다.

이미 수 많은 디자인 패턴이나 모델 개념들이 많은데 굳이 코드 규칙을 제가 만들 필요가 있는가 하는 생각도 들면서 저만의 규칙을 만든다기보다, 제가 코딩을 할 때의 스타일을 만들 수는 있다 생각이 듭니다.

어느 회사를 가던 회사만의 규칙과 약속이 있습니다. 하지만 그 규칙을 준수하면서 사소한 부분에서는 각자의 스타일로 나뉩니다.

예를 들면, 그림을 그릴 때 붓으로 그림을 그리는지 연필로 그리는지가 규칙이라면 각자 어떤 색상을 쓰는지는 스타일에 따라 다르듯이 말이죠.

코드를 작성하는데 스타일이라하면, 습관적으로 쌍따옴표가 아닌 따옴표를 쓴다던지, 의사코드를 먼저 작성하거나, 손그림으로 대강의 흐름을 그려 작업하는 등의 것이 될 것 같습니다.

지운 내용 중에 처음에 생각했던 규칙이 3가지가 있었습니다.

1. 보기 쉬운
2. 조립식
3. 반환

만들었던 기나긴 예제도 지웠습니다. 지금보니 무슨 이야기를 하고 싶은건지 저도 모르겠네요. 처음보시는 분은 의미없는 코드들이 있었다고 생각하시면 됩니다.

### 새로 쓰는 예제

#### 보기 쉬운

지금 생각으로 예제를 조금 만들자면 아래와 같습니다. 모듈 패턴을 구성한 자바스크립트 코드입니다. 예를 들어 도서 관리 애플리케이션을 만들 때 필요한 최소한의 기능을 생각해볼 때 대출과 반납을 가정했습니다.

```javascript
// main.js

/**
 * 도서관리 애플리케이션
 * 1. 도서 대출
 * 2. 도서 반납
 * 이 두 가지 기능만 있다고 가정합니다.
 */
(function () {
    function Controller(){
        // codes ...
    }
    function BookCheckout(){
        // codes ...
    }
    function BookReturn(){
        // codes ...
    }
    return {
        const controller = new Controller();
        const bookCheckout = new BookCheckout();
        const bookReturn = new BookReturn();

        bookReturn.init();
        bookCheckout.init();
        controller.init();
    }
})
```

Controller를 통해 이벤트 관리와 checkout, return 등의 기능을 호출하는 구조로 사용합니다. 주석처리된 codes가 만일 여러 줄 작성되어 3천 줄 1만 줄, 3만 줄이 된다면 이제 찾는데 시간이 슬슬 걸립니다.

지금의 시점에서 본다면 import를 이용해 모듈로 찢어야겠다는 생각이 듭니다. 찢어보면 아래와 같이 정리될 것 같습니다.

```javascript
// src/core/book-controller.js
export function Controller(){
    // codes ...
}
```

컨트롤러를 나눕니다.

```javascript
// src/core/book-checkout.js
export function BookCheckout(){
    // codes ...
}
```

대출도 분리하고

```javascript
// src/core/book-return.js
export function BookReturn(){
    // codes ...
}
```

반납도 분리합니다.

```javascript
// src/book-modules.js
import {Controller} from 'src/core/book-controller.js';
import {BookCheckout} from 'src/core/book-checkout.js';
import {BookReturn} from 'src/core/book-return.js';

export {controller: Controller}
export {checkout: BookCheckout}
export {return: BookReturn}
```

분리한 모듈들을 한 파일에서 모두 불러와 다시 export합니다. 한 번에 묶음으로 사용하기 위함입니다.

```javascript
// main.js
import * as BookModule from 'src/core/book-modules.js';
(function () {
    return {
        init() {
            const controller = new BookModule.controller();
            const bookCheckout = new BookModule.checkout();
            const bookReturn = new BookModule.return();

            bookReturn.init();
            bookCheckout.init();
            controller.init();
        }
    }
})().init()
```

이제 기능별로 파일이 분리되고 깔끔해진 모습입니다. 파일명도 잘 지어두면 굳이 설명없이 이해되는 파일 구조와 코드가 될 것이라 생각합니다.

다시 파일 내에서 중복되거나 공통되는 부분, 혹은 거대한 기능이 연결되어 있으면 `모듈화`해서 정리하면 이후에 관리하는데 `편리`해지더라구요.

쪼개면서 결합이 강했던 부분을 자연스럽게 느슨하게 조정하는 기회도 생기고, 여러 장점이 생겨서 블로그나 위키, 만들었던 프로젝트 등을 한 번씩 돌아볼 때마다 이렇게 정리하고는 합니다.

#### 조립식

만일 위의 예제에서 첨가해보자면 대출과 반납에서 공통되는 과정을 찾아봅니다. 대출할 때 회원을 조회하고 저장하고 반납할 때도 회원을 조회하고 저장한다고 가정하겠습니다.

1. 대출 : 회원 정보를 조회해서 있으면 대출 정보를 기록하고 저장한다.
2. 반납 : 회원 정보를 조회해서 있으면 반납 정보를 기록하고 저장한다.

이때 정보를 기록하고 저장하는 공통되는 기능이 있다고 합니다. 이 내용을 코드로 작성을 해보면 아래와 같을 것 입니다.

```javascript
// src/store/store.js

export function Store() {
    const store = {}
        
    this.init = function(){
        // 초기화
        store.userInfo = loadUserInfo(); // 모든 유저 정보를 가져온다고 가정합니다.
    }
        
    this.recordInfo = function(userNum, replaceInfo, bookExistence){
        // 회원정보 조회
        // 정보 수정
        // 기록 저장
        store.userInfo.map(u => {
            if(u.num != userNum) return u;

            u.info = replaceInfo;
            u.hasBook = bookExistence;
            return u;
        });
    }

    // 더 많은 공통 함수들 (libs)
}
```

Store를 아까 만들었던 main.js에서 import하고, Store를 new연산자로 인스턴스를 생성하고 사용하면 상태관리를 할 수 있게 됩니다.

```javascript
// main.js
import * as BookModule from 'src/core/book-modules.js';
import {Store} from 'src/store/store.js'; // +

(function () {
    return {
        init() {
            const store = new Store();      // + 상태관리 store 인스턴스 생성
            const controller = new BookModule.controller();
            const bookCheckout = new BookModule.checkout();
            const bookReturn = new BookModule.return();

            bookReturn.init(store);         // + 상태관리 store를 초기화 함수에 전달
            bookCheckout.init(store);       // + 상태관리 store를 초기화 함수에 전달
            controller.init(bookReturn, bookCheckout); // + 컨트롤러는 반납, 대출 기능을 초기값으로 받습니다.
        }
    }
})().init();
```

아까 만들었던 코드 예제에서 `대출(BookCheckout)`, `반납(BookReturn)` 인스턴스를 컨트롤러의 초기화 함수에 전달했습니다.

이렇게 조립식으로 해당 기능이 담긴 객체를 더 상위 개념의 객체에게 전달하면서 수직으로 명령을 내리는 구조를 만들 수 있게 됩니다.

초기화 함수(init)에 여러 개를 주면 문어다리 형식으로 기능을 구현할 수도 있습니다.

#### 반환

반환하는 함수를 만드는 것인데요. 여기서 지금의 생각은 조금 다릅니다. 여러 디자인 패턴이 존재하고 방법론이 존재하는 것으로 압니다.

함수 내부에서 원본 객체의 데이터를 변경시키는 것이 좋은지, 순수함수로 작성해서 외부 상태 의존을 없애야하는지 아직 잘은 모르겠습니다.

자바스크립트로 작업할 때 자주 사용하는 모듈 패턴을 활용할 때 기억을 떠올려보면 대부분이 함수를 통해서 상태관리를 했습니다.

반환에 대한 이야기는 크게 없지만 예를 들면 아래와 같습니다.

{%raw%}

```javascript
const store = {
    data: 'marco-polo,test wow'
}

const capital = str => str.replace(\/[^\-\_\,\.\s]+\/g, a => a[0].toUpperCase()+a.slice(1));
capital(store.data);
// 'Marco-Polo,Test Wow'
console.log(store.data);
// 'marco-polo,test wow'

const capitalize = str => store.data = str.replace(\/[^\-\_\,\.\s]+\/g, a => a[0].toUpperCase()+a.slice(1));

capitalize(store.data);
// 'Marco-Polo,Test Wow'
console.log(store.data);
// 'Marco-Polo,Test Wow'
```

{%endraw%}

위의 `capital`함수는 인자 값을 무엇을 대입해도 원본 데이터가 변하지 않는 순수함수이다. 그리고 몇 번을 실행해도 같은 결과를 나타냅니다.

원본 데이터를 바로 수정하지 않고 반환된 결과를 대입하는 `capital`방식과 함수 내부에서 원본 객체의 내용을 수정하는 `capitalize`방식을 보면, 전자가 훨씬 오류도 적을 것이고 어디서 수정이 이루어지는지 명확하게 구분 할 수 있게 됩니다.

만일 오류가 발생하면 함수를 호출하면 `void`가 아닌 함수 부분만 확인하면 된다는 것입니다. 반대로 함수 호출로 원본 데이터를 수정하는 방식이라면 어디서 오류가 나는지 가늠조차 어렵습니다.

오랜만에 본인이 쓴 글을 재해석하려니 횡설수설 중이지만 지금 달라진 생각을 전부 정리했다고 생각합니다.