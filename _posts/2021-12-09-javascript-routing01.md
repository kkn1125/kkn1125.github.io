---
layout: post
date:   2021-12-09 17:44:58 +0900
title:  "[JAVASCRIPT] Vanilla JavaScript로 SPA를 구현해보자"
author: Kimson
categories: [ JAVASCRIPT, TIL ]
image: assets/images/post/covers/TIL-javascript.png
tags: [ spa, router, vanilla js ]
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

# Vanilla JavaScript로 SPA 구현

제목을 어떻게 지을까 하다가 임시로 아는 단어를 적어두었습니다...

`SPA`는 `Single Page Application`의 약자이고 하나의 페이지에 동적으로 화면을 바꿔가면서 상호작용하도록 합니다.

아직 라우터에 대해 제대로된 지식이 없어 지적을 주시면 곧바로 수정하도록 하겠습니다. 기록할 주요 내용은 이렇습니다. 

먼저 `ajax`를 사용하는 것은 제외했습니다. `ajax`로 하기에 아직 `fetch`와 `async`, `await`를 잘 다루지 못하는 시점이라 `javascript`로 `render`와 `component`를 구현해서 데이터를 만들어 적용하는 연습을 해보았습니다.

`SPA`에는 찾아보니 종류가 몇 가지 있었는데요.

1. Slash
2. Hash
3. Query

이 외에도 더 있겠죠? 아닌가? 제가 해 본 내용은 3가지 다 구현을 해봤습니다.

이중에서 마음에 드는 결과물을 주는 게 `hash`방식이었습니다.

## Slash 방식

`Slash`방식은 호기롭게 구현하다가 결국 리로드(새로고침)의 늪을 고민하게 되었습니다. 물론 `Slash`방식에서 새로고침시 보고있던 페이지의 내용을 다시 로드할 방법은 있습니다. 하지만 네이버나 구글의 서치콘솔에서 접근이 안되는 단점이 있습니다.

폴더를 만들어보거나 빈파일을 만드는 등의 테스트를 거쳤지만 아직 미천한 실력으로 해결이 안되는 부분이기도 하구요...

혹시나 `Slash`방식으로 구현하고 있는 분 중에 궁금해하시는 분을 위해 아래 예제 코드를 알려드리겠습니다.

```javascript
// router.js

let isFirst = false;
window.addEventListener('beforeunload', handleInitializePage);

function handleInitializePage(ev){
    ev.preventDefault();
    ev.returnValue = '';
    if(!isFirst){
        setTimeout(()=>{
            location.href = "/";
            getBeforePage(); // 적당히 구현하시면 됩니다.
        }, 10);
        isFirst = true;
    }
}
```

`beforeunload`이벤트를 사용한 예제입니다. `beforeunload`로 리로드되거나 종료될 때를 감지합니다. 크롬기준으로 이벤트 콜백함수 내에서 `alert()`을 사용하게되면 에러가 발생하고 실행되지 않는 것을 확인 할 수 있습니다. 물론 `location.href`도 그냥 쓰면 작동하지 않습니다.

찰나에 뜨는 오류를 보면 `beforeunload`이벤트가 작동 되는 때에는 함수의 실행 등을 막는 것 같습니다. 그리고 `getBeforePage`라는 함수로 이전 페이지 정보를 가져와 `history API`의 `pushState`로 변경해주면 `/test`라는 주소를 `/`로 바꿨다가 `/test`로 다시 순식간에 바꿔줍니다.

리로드 시 주소를 초기화했다가 바꿔주는 방식입니다. 이 방법을 사용하면 `Slash`방식으로 구현해도 잘 작동은 하지만 문제는 앞서 말한 것처럼 다른 곳에서 해당 `url`을 요청하면 페이지가 없다고 뜹니다.

서버를 구현한다면 위의 작업이 아예 필요 없겠지만요...

## Hash 방식

`hash`방식은 비교적 쉬웠습니다. 어떻게하면 `Slash`방식 처럼 번거롭지 않을까 하다가 스크롤 조정할 때 자주 사용한 `#`이 떠올랐습니다.

`hash`는 태그의 `id`선택자이기 때문에 리로드하지 않고 해당 `id`를 가진 태그로 스크롤 됩니다. 하지만 해쉬로 작업하면 외부 링크 이동이나 스크롤을 직접 구현해줘야 합니다.

### 스크롤, 외부링크, 페이징 처리

여러 방법이 있겠지만 제가 사용하는 방법은 아래와 같습니다.

```javascript
// scroll
window.addEventListener('click', handleAnchor);
function handleAnchor(ev){
    const anchor = ev.target;
    const name = anchor.tagName;
    const href = anchor.href;
    const hash = anchor.hash;
    const attrs = anchor.attributes;

    if(name == 'A') {
        ev.preventDefault();

        // 여기서 anchor.href로 안하는 이유는
        // anchor.href로 대조하면 #test로 지정했어도
        // 프로토콜 포함하여 나오게 되기 때문입니다.
        if(validHTTP(attrs['href'].value)) window.open(href); // 외부 링크 새창으로 열기
        else{
            if(hash!==''){
                changeCurrentPage(hash); // 페이징
            } else {
                scrollIntoRef(attrs['scroll-to'].value); // 스크롤링
            }
        }
    }
}

function validHTTP(url) {
    return url.match(/http/gm)?true:false;
}

function scrollIntoRef(target){
    document.getElementById(target).scrollIntoView(true);
}
```

위 예제는 한 번에 보여드리기 위함입니다. 작업할 때는 이벤트마다 기능을 하나 이상 잘 넣지 않습니다.

### 페이지 처리

초기에 했던 페이지 처리 보다 최근 구현한 페이지 처리가 더 좋지 않나 조심스레 생각해봅니다. 이전에는 페이지와 템플릿 등이 혼재되어 있었는데 점점 하다보니 정리가 되는 듯 합니다.

준비한 내용은 3가지 입니다.

1. `router.js`
2. `pages.js`
3. `main.js`

#### router

라우터 js는 딱 페이지를 구성하는 모체가 되겠습니다.

```javascript
// router.js
const router = {
    'home': {
        referrer: document.referrer,
        select: (page) => pages.type(page)
    }
}
```

페이지가 가지는 최상위 개념의 내용만을 가집니다. 페이지별 `title`을 저기에 줘도 됩니다. 저는 내용을 렌더하는 시점에 바꾸기위해 제외했습니다.

#### pages

페이지는 페이지를 렌더할 템플릿만을 가집니다.

```javascript
// pages.js
const pages = {
    type: (type)=>templates[type],
    item: (type)=>parts[type],
}

const templates = {
    'home': {
        render: function(){
            setInterval(()=>{
                if(document.querySelector('#timer')){
                    let base = new Date();
                    let h = base.getHours();
                    let m = base.getMinutes();
                    let s = base.getSeconds();
                    document.querySelector('#timer').textContent = `현재시간 ${h}:${m}:${s}`;
                    // textContent로 한 이유는 태그자체가 리렌더되는 게 아닌
                    // 텍스트만 리렌더되서 깔끔하기 때문에 사용했습니다.
                }
            });
            return `<div>home 입니다. <time id="timer"></time></div>`;
        }
    }
}

const parts = {
    'side-bar': {
        render: function(){
            return `<nav class="side-bar">
                <ul>
                    <li>home</li>
                    <li>blog</li>
                    <li>about</li>
                </ul>
            </nav>`;
        }
    }
}
```

`templates`와 `parts`는 다른 성격입니다. `templates`는 페이지 처리할 때마다 바뀌는 내용들이고, `parts`는 모든 페이지의 공통되는 요소만을 표현해두었습니다.

이후 페이지 처리에서 이 자료들을 어떻게 뿌려주고 관리하는지 간략하게 봅시다.

#### 페이지처리

이전에 [자바스크립트 디자인 패턴 - 모듈 패턴](https://kkn1125.github.io/javascript-design-pattern01)을 소개한 적이 있습니다. 자세한 내용은 해당 링크를 참조해주세요!

모듈 패턴으로 구현을 했습니다. 그래서 위 코드에서 벗어나지 않게 설명드릴 것이기 때문에 코드를 쭉 짜지는 않겠습니다.

> 이벤트 처리

이벤트는 위에서 분기해서 사용하는 것이 다 입니다.

물론 `pushState`로 주소를 변경해주어야하고, 좀 더 추가를 하자면 아래와 같습니다.

```javascript
// main.js
// controller 영역
let models = null;

this.init = function(model){ // 제일 먼저 실행
    // model받고
    models = model;

    window.addEventListener('mousedown', this.setBeforePage);
    window.addEventListener('mouseup', this.handlePaging);

    this.appInitialRender();
}

this.appInitialRender = function(){
    models.renderPage(); // 실행시 렌더
}

this.setBeforePage = function(ev){
    // 모델에 클릭 시점의 해쉬를 보냄
    // 제어문 작성후
    models.setBeforePage(location.hash);
}

this.handlePaging = function(ev){
    // 제어문 작성후
    // 페이지 처리
    // 예를 들어
    models.handlePaging(target.hash);
}

// model 영역
let views = null;
let pageList = null;
let currentPage = null;
let beforePage = null;

this.init = function(view){
    views = view;
    pageList = Object.keys(router);
}

this.handlePaging = function(hash){
    currentPage = hash;

    if(beforePage !== currentPage){
        // 페이징 처리하기 view로 위임
        this.renderPage();
    }
    // 이외 요청은 현재 페이지를 또 요청하므로 아무 동작 하지 않도록 함
}

this.setBeforePage = function(hash){
    beforePage = hash.slice(1);
}

this.renderPage = function(){ 
    // handlePaging메서드와 controller의 appInitialRender메서드가
    // renderPage메서드로 구동 됨

    // 현재 페이지 넘기면서 위임
    views.renderPage(currentPage);
}

// view 영역
let moduler = null;
let app = null;

this.init = function(components){
    moduler = components;

    app = document.body.insertAdjacentElement('beforeend', document.createElement('main'));
    // 생성하면서 변수에 저장 (insertAdjacentElement는 엘레멘트를 반환합니다.)

    this.renderPublicOptions(); // 페이지 공통 요소들 렌더
}

this.renderPage = function(){
    // 페이지 렌더
}

this.renderPublicOptions = function(){
    Object.keys(parts).forEach(part=>app.insertAdjacentHTML('beforeend', moduler.parts[part].render()));
}
```

현재 깃허브 저장소에 올라가 있는 초안의 일부를 작성해봤습니다. 더 자세히 보시려면 [router](https://github.com/kkn1125/router)를 보시기 바랍니다.

페이지를 핸들할 때 실행 했을 때와 해쉬링크를 클릭했을 때 모두를 충족하도록 중앙에서 페이지를 구동하는 `renderPage`메서드를 만들어 주면 편합니다.

간략하게 알아보고 기록해보았습니다.

## Query 방식

쿼리방식은 위 방법과 유사하지만 리로드가 되는 차이점이 있고, 해쉬를 사용하지 않아 `hash` 방식처럼 하나하나 링크를 직접 핸들 안해도 됩니다.

그리고 쿼리로 작업을 하게 되면 단순한 정보 전달에 있어 좋은 이점이 있다고 생각합니다.

이전에 쿼리로 구현했을 때 생각해보면 `page`라는 `key`값으로 페이징 처리하고 나머지 정보 전달은 쿼리문에 끼워서 사용했던 기억이 납니다.

## 마무리

무작정 생각만으로 "아 이게 이렇게 되겠지?" 상상하면서 만들어 본지 일주일 좀 되는 듯 합니다. 실수하면서 많이 느끼는게 지식이 정말로 부족하구나 하는 생각도 듭니다.

이게 `spa`라고 하기엔 찜찜하지만 혹시 관심이 있으신 분은 도움이 되시기를...