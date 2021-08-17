---
layout: post
date:   2021-08-17 15:02:11 +0900
title:  "[JAVASCRIPT] 스크롤 애니메이션 구현하기"
author: Kimson
categories: [ TIM, JAVASCRIPT ]
tags: [no-scroll, slide]
image: assets/images/post/covers/TIM-none.png
description: ""
featured: true
hidden: false
rating: 4.5
toc: true
profile: false
istop: true
keysum: false
keywords: '스크롤 애니메이션 구현

이번 시간에는 스크롤바를 없애고 슬라이드방식의 페이지를 구현해보려합니다. 남의 코드를 계속 염탐하다보니 정작 나중에 다시 보면 이해가 안되는 경우가 더러 있었습니다.

좋은 버릇도 아닐뿐더러 생각하는 힘을 기르는데는 좋은 것 같습니다.

원래는 화면 뷰포트를 감지하는 코드를 참고해서 만들고자 하였지만 이 또한 만들고나서 참고해보자는 마음에 구현된 기능을 정리하여 올립니다.'
---

# 스크롤 애니메이션 구현

이번 시간에는 스크롤바를 없애고 슬라이드방식의 페이지를 구현해보려합니다. 남의 코드를 계속 염탐하다보니 정작 나중에 다시 보면 이해가 안되는 경우가 더러 있었습니다.

좋은 버릇도 아닐뿐더러 생각하는 힘을 기르는데는 좋은 것 같습니다.

원래는 화면 뷰포트를 감지하는 코드를 참고해서 만들고자 하였지만 이 또한 만들고나서 참고해보자는 마음에 구현된 기능을 정리하여 올립니다.

## 스크롤바 없애기

간단합니다. 그저 `css`에서 `body`(혹은 대상 요소)의 `overflowY`를 `hidden`값만 주면 사라집니다. 설정한 후가 문제입니다.

## 스크롤 구현하기

먼저 필요한 기능부터 살펴보겠습니다.

1. 휠을 굴릴 때 상하 감지
   - 해당 방향으로 섹션 이동
2. 상하 이동
3. 새로고침 or 페이지 이동 시 초기화

간단하게 약 3가지의 기능을 구현해보겠습니다. 이정도 기능이면 충분히 슬라이드 페이지를 조잡하게라도 흉내낼수 있었습니다.

### 샘플 만들기

```html
<div id="btns">
    <button>Up</button>
    <button>Down</button>
</div>

<!-- 3~4개 정도의 샘플 section 태그 -->
<section>
    <h1>Test1</h1>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, tenetur blanditiis distinctio consequatur quos vitae iure impedit a quibusdam facere aspernatur nam veritatis quae iusto similique dolores quam earum perferendis.</p>
</section>
```

```css
/* 필요하다면 다른 태그들 초기화 해주시기바랍니다. */
html,
body,
section,
h1,
div{
    margin: 0;
    padding: 0;
}

/**
 * 반응형을 고려하여 body의 overflow를
 * 특정 사이즈에서만 사라지도록 했습니다.
 */
@media screen and (min-width: 768px) {
    body{
        overflow: hidden;
    }
}

html,
body,
section{
    height: 100%;
    width: 100%;
}

/**
 * 테스트를 위한 색상 구별
 */
section:nth-child(odd){
    background: lightgray;
}

section{
    /** 
     * js에서 top 속성으로 컨트롤하기 때문에
     * relative 로 하였습니다.
     */
    position: relative;
}

#btns{
    position: fixed;
    bottom: 10%;
    right: 5%;
    z-index: 100;
}
```

이렇게 기본적으로 눈으로 확인할 수 있게 샘플 준비는 끝났습니다. 본격적으로 js로 구현해봅시다.

### 변수 설정

```javascript
/**
 * 필요한 변수입니다.
 * 1. 상하버튼의 wrapper를 지정 children으로 뽑아 쓰기 위함
 * 2. section은 section태그 전체입니다.
 * 3. height는 section하나의 높이입니다.
 * 4. scrolling은 스크롤바가 없기때문에 이 변수가 스크롤 바 역할을 합니다.
 * 5. responsive는 reload나 redirect시 초기화하는 변수입니다.
 */ 
const upBtn = document.getElementById('btns').children[0];
const downBtn = document.getElementById('btns').children[1];
const section = document.getElementsByTagName('section');
const height = section[0].clientHeight;
let scrolling = 0;
let responsive = window.innerWidth<768?false:true;
```

### 슬라이드 기능 구현 - 스크롤

> 스크롤을 했을 때 슬라이드가 일어나도록 하는 부분 작성입니다.

```javascript
// 스크롤 범위 제한
function scrollLimit(){
    if(scrolling<0){
        // 0보다 작으면 0으로 유지.
        scrolling = 0;
    } else if (scrolling>(section.length-1)*height){
        // section.length-1의 총 높이보다 크면
        // section.length-1의 총 높이로 유지.
        scrolling = (section.length-1)*height;
    }
}

// 스크롤 움직이는 기능
function scrollHandler(){
    // 스크롤 증가에 따라 높이로 나누어 소수점을 버리고
    // 딱 떨어지는 퍼센트값으로 움직이게 합니다.
    Object.values(section).forEach(el=>{
        el.style.top = `-${100*Math.floor(scrolling/height)}%`;
    });
}

window.addEventListener('wheel', (e)=>{
    responsive?
    e.deltaY>0
    // wheel down
    ?scrolling+=150
    // wheel up
    :scrolling-=150:
    null
    scrollLimit();
    scrollHandler();
});

window.addEventListener('resize', function(e){
    // resize toggler
    responsive = window.innerWidth<768?false:true;
});

/* 이 코드는 위의 삼항연산자를 풀어쓴 예제입니다. */
if(responsive){
    if(e.deltaY>0){
        scrolling+=150;
    } else {
        scrolling-=150;
    }
}
/* 이 코드는 위의 삼항연산자를 풀어쓴 예제입니다. */
```

`resize`를 감지하여 responsive가 작동여부를 결정하는 열쇠 역할을 합니다. 그러기 위해서 윈도우 사이즈에 따라 `boolean`값을 할당받고, `wheel`을 감지하는 이벤트를 추가하여 true일때만 기능을 작성합니다.

`wheel`을 `up`, `down`의 조건을 알기 위해 `event`의 `deltaY`값의 양과 음으로 구분합니다.

스크롤을 올리면 `deltaY`가 음수, 내리면 `deltaY`가 양수입니다. 좀 전에 선언한 `scrolling`변수가 스크롤 역할을 한다했습니다. 그래서 `scrolling`에 `150단위`의 값으로 조정합니다. 여기서 `150단위`를 높이게 되면 휠에 반응하는 슬라이드의 민감도가 높아집니다.

### 슬라이드 기능 구현 - 버튼

> 버튼을 클릭 했을 때 슬라이드가 일어나도록 하는 부분 작성입니다.

```javascript
function upScroll(){
    scrolling -= height;
    scrollLimit();
    scrollHandler();
}

function downScroll(){
    scrolling += height;
    scrollLimit();
    scrollHandler();
}

upBtn.addEventListener('click', () => {
    responsive?
    upScroll():null
});

downBtn.addEventListener('click', () => {
    responsive?
    downScroll():null
});
```

업, 다운 버튼에 클릭 이벤트를 추가하였습니다. 스크롤과 마찬가지로 `responsive`를 주어 사이즈에 따라 기능 활성 제어를 하였습니다.

`upScroll`함수는 만들었던 `scrollLimit()`을 주고, `scrollHandler()`를 주었습니다. 스크롤이벤트 부분과 다른 점은 `scrolling`에 `height`를 뺀다는 점입니다. `downScroll`함수는 `height`를 더하는 부분외 같습니다.

`upDownScroll`이라는 이름으로 만들고 싶지만 보기 쉽게 함수를 쪼개어 두었습니다.

### 초기화

> 초기화가 없으면 `reload`나 `redirect`할 때 어중간한 섹션에서부터 0으로 시작하게 됩니다. 이를 방지하고 최상단으로 섹션을 유지하게 만들어 줍시다.

```javascript
function init(){
    Object.values(section).forEach(el=>{
        el.style.top = `-${100*(section.length-1)}%`;
    })
    
    setTimeout(()=>{
        Object.values(section).forEach(el=>{
            el.style.top = `-${0}%`;
        });
    },100);
    
    setTimeout(()=>{
        let style = document.createElement('style');
        style.innerHTML = "section{transition:.5s cubic-bezier(1,0,0,1)}";
        document.head.appendChild(style);
    },200)
}

init();
```

초기화 함수는 이렇게 구현했습니다. 초기화 함수가 없을 때 중간 섹션이 먼저 보이고, 상단의 섹션으로 올라가지 않게 되어서 맨 아래 섹션으로 갔다가 `limit`에 한 번 걸려야지 정상작동 되는 현상이 발생합니다.

그것을 조금 조잡하지만 `limit`값으로 먼저 주고, `setTimeout`을 이용해 딜레이를 주어 최상단 섹션으로 이동후 `transtion`을 주도록 하였습니다.

빠르게 초기화 작업이 이루어지기 때문에 봤을 때 크게 휘리릭 지나는 느낌은 잘 안듭니다. `transition`을 마지막 딜레이에 넣은 이유도 이 때문입니다.

필요하다면 최상단으로 올라가는 버튼을 만드는 것은 `init`함수를 재활용하면 가능합니다. 스크롤이 있을 때는 `a`태그에 `href` 값을 #으로 주면 해결이 되었지만 스크롤이 없는 상황에서, 그리고 현재 구현해본 상황에서는 이것이 방법 중 방법인 것 같습니다.

샘플로 아래에 구현한 슬라이드를 올려두겠습니다.

-----

> 아래 샘플은 마우스를 영역 내에 두고 슬라이드하셔야 합니다. 버튼 작동합니다. 작은 영역이고 스크롤 민감도를 그대로 둔 상태여서 조금 스크롤해도 슬라이드가 움직이는 점 참고 바랍니다.

<html class="html" lang="en" >
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .html,
        .body,
        .section,
        .h1,
        .div{
            margin: 0;
            padding: 0;
        }
        .body{
            position: relative;
        }
        @media screen and (min-width: 768px) {
            .body{
                overflow: hidden;
            }
        }
        .html,
        .body,
        .section{
            height: 300px;
            width: 100%;
        }
        .section:nth-child(odd){
            background: lightgray;
        }
        .section{
            position: relative;
        }
        #btnss{
            position: absolute;
            bottom: 3.5%;
            right: 5%;
            z-index: 100;
        }
    </style>
    <title>Document</title>
</head>
<div class="body" style="box-shadow: 0 0 0 3px salmon; margin: 3rem 0;">
    <div class="divs" id="btnss">
        <button>Up</button>
        <button>Down</button>
    </div>
    <section class="section">
        <div style="font-size:54px; color: black !important;">Test1</div>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, tenetur blanditiis distinctio consequatur quos vitae iure impedit a quibusdam facere aspernatur nam veritatis quae iusto similique dolores quam earum perferendis.</p>
    </section>
    <section class="section">
        <div style="font-size:54px; color: black !important;">Test2</div>
        <p style="color: black !important;">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, tenetur blanditiis distinctio consequatur quos vitae iure impedit a quibusdam facere aspernatur nam veritatis quae iusto similique dolores quam earum perferendis.</p>
    </section>
    <section class="section">
        <div style="font-size:54px; color: black !important;">Test3</div>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, tenetur blanditiis distinctio consequatur quos vitae iure impedit a quibusdam facere aspernatur nam veritatis quae iusto similique dolores quam earum perferendis.</p>
    </section>
    <section class="section">
        <div style="font-size:54px; color: black !important;">Test4</div>
        <p style="color: black !important;">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, tenetur blanditiis distinctio consequatur quos vitae iure impedit a quibusdam facere aspernatur nam veritatis quae iusto similique dolores quam earum perferendis.</p>
    </section>
    <section class="section">
        <div style="font-size:54px; color: black !important;">Test5</div>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, tenetur blanditiis distinctio consequatur quos vitae iure impedit a quibusdam facere aspernatur nam veritatis quae iusto similique dolores quam earum perferendis.</p>
    </section>
    <script>
        const btns = document.getElementById('btnss').children;
        const section = document.getElementsByClassName('section');
        const height = section[0].clientHeight;
        let scrolling = 0;
        let responsive = window.innerWidth<768?false:true;
        // reload init
        function init(){
            Object.values(section).forEach(el=>{
                el.style.top = `-${100*(section.length-1)}%`;
            })
            setTimeout(()=>{
                Object.values(section).forEach(el=>{
                    el.style.top = `-${0}%`;
                });
            },100);
            setTimeout(()=>{
                let style = document.createElement('style');
                style.innerHTML = "section{transition:.5s cubic-bezier(1,0,0,1)}";
                document.head.appendChild(style);
            },200)
        }
        function scrollLimit(){
            if(scrolling<0){
                scrolling = 0;
            } else if (scrolling>(section.length-1)*height){
                scrolling = (section.length-1)*height;
            }
        }
        function scrollHandler(){
            Object.values(section).forEach(el=>{
                el.style.top = `-${100*Math.floor(scrolling/height)}%`;
            });
        }
        function upScroll(){
            scrolling -= height;
            scrollLimit();
            scrollHandler();
        }
        function downScroll(){
            scrolling += height;
            scrollLimit();
            // if(Math.floor(scrolling/height)==section.length){
            //     scrolling -= height;
            // }
            scrollHandler();
        }
        btns[0].addEventListener('click', () => {
            responsive?
            upScroll():null
        });
        btns[1].addEventListener('click', () => {
            responsive?
            downScroll():null
        });
        window.addEventListener('resize', function(e){
            // resize toggler
            responsive = window.innerWidth<768?false:true;
        });
        let body = document.querySelector('div.body');
        body.addEventListener('mouseenter',(e)=>{
            window.addEventListener('wheel', (e)=>{
                responsive?
                e.deltaY>0
                // wheel down
                ?scrolling+=150
                // wheel up
                :scrolling-=150:
                null
                scrollLimit();
                scrollHandler();
            });
            responsive = true;
            document.body.style.overflowY = 'hidden';
        });
        init();
        body.addEventListener('mouseleave',(e)=>{
            responsive = false;
            document.body.style.overflowY = '';
        });
    </script>
</div>
</html>