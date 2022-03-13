---
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-08-13 13:50:20 +0900
title:  "[JAVASCRIPT] 드롭다운 메뉴 구현"
author: Kimson
categories: [ javascript ]
tags: [ dropdown, til ]
image: assets/images/post/covers/TIL-javascript.png
description: "간단한 드롭다운 메뉴 만들기

css-tricks 사이트의 Philip Walton의 포스트의 내용을 보고 만들어졌습니다.

html과 css는 중요하지 않기 때문에 소스코드는 포스팅 맨 아래에 위치시켰습니다.

자바스크립트의 기능 구현이 목적이라 그 외에 것은 설명 배제하겠습니다.

html과 css를 보시면 bootstrap의 이름과 비슷합니다. bootstrap을 애용해서 그런지 이제 css 설정을 bootstrap처럼 안하면 작업이 안 될정도입니다... 이렇게 의존하면 안 될텐데..."
featured: false
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: false
keywords: ''
---

# 간단한 드롭다운 메뉴 만들기

> css-tricks 사이트의 Philip Walton의 포스트의 내용을 보고 만들어졌습니다.

html과 css는 중요하지 않기 때문에 소스코드는 포스팅 맨 아래에 위치시켰습니다.

자바스크립트의 기능 구현이 목적이라 그 외에 것은 설명 배제하겠습니다.

html과 css를 보시면 bootstrap의 이름과 비슷합니다. bootstrap을 애용해서 그런지 이제 css 설정을 bootstrap처럼 안하면 작업이 안 될정도입니다... 이렇게 의존하면 안 될텐데...

## 클릭 이벤트

큰 틀을 먼저 설명드리겠습니다.

### 기능

1. 메뉴버튼 클릭 시 show/hide
2. 메뉴가 show 상태일때만 외부 클릭 시 hide

찾다보니 [발견한 stackoverflow의 글](https://stackoverflow.com/questions/152975/how-do-i-detect-a-click-outside-an-element){:target="_blank"}의 내용은 이렇습니다.

```javascript
$(window).click(function() {
  //Hide the menus if visible
});

$('#menucontainer').click(function(event){
  event.stopPropagation();
});
```

하지만 이 작동 방식은 문제가 있다고 말합니다. 높은 추천 수에 비해 말이죠.

그래서 대안으로 [Philip Walton의 게시글](https://css-tricks.com/dangers-stopping-event-propagation/)에서 가져온 코드를 보여드리겠습니다.

```javascript
$(document).on('click', function(event) {
  if (!$(event.target).closest('#menucontainer').length) {
    // Hide the menus.
  }
});
```

`closest` 메서드는 해당 요소에서 가장 가까운 요소를 탐색합니다. 태그, 클래스, 아이디를 지정할 수 있습니다. 탐색후 존재하거나 조건에 부합하면 그 요소를 반환합니다.

클릭하고나서 event.target을 하면 클릭된 요소가 반환되는데, 이때 closest로 특정(클릭하고 싶은)요소 외에 클릭을 했을때 이벤트를 발생시킬 수 있습니다.

```javascript
const menuToggleButton = document.getElementById('menuToggleButton');
const navToggle = document.querySelector('.nav-wrap');
const menuTrigger = document.querySelector('.menu-trigger');

window.addEventListener('click', (e) => {
	// 네비게이션이 아닐 때 (메뉴버튼 등 navbar-wrap하위 요소 포함)
    if(!e.target.closest(".navbar-wrap")){
		// 클릭 요소가 navbar-wrap이 아닐때
        navToggle.classList.contains("show")
        ?(navToggle.classList.add("hide"),
        navToggle.classList.remove("show"))
        :"";
    }
	// 아래는 메뉴버튼의 애니메이션에 관련된 내용입니다.
    if(!e.target.closest(".navbar-wrap")){
        if(!e.target.closest(".menu-trigger")){
            for(let i of document.querySelector(".menu-trigger").children){
                i.classList.remove("show");
            }
        }
    }
});

// 메뉴버튼 클릭 시 show/hide
menuToggleButton.addEventListener('click', () => {
    navToggle.classList.contains("show")
    ?(navToggle.classList.add("hide"),
    navToggle.classList.remove("show"))
    :(navToggle.classList.add("show"),
    navToggle.classList.remove("hide"))
});

// 아래는 메뉴버튼의 애니메이션에 관련된 내용입니다.
menuTrigger.addEventListener('click', (e) => {
    if(e.target.closest(".menu-trigger")){
        for(let i of e.target.closest(".menu-trigger").children){
            i.classList.toggle("show");
        }
    }
})
```

모바일 환경에서 메뉴버튼을 클릭했는데 다른 요소를 클릭하면 저절로 닫히는 기능을 구현하고 싶었습니다.

메뉴버튼만 클릭하여 열고 닫기에는 불편한 감이 있었습니다.

내용이 알찬 글은 아니지만 이러한 방법을 기록에 남기고, 외부 클릭 감지를 찾으시는 분들에게 조그마한 도움이 되었으면 합니다.

-----

> html과 css 코드

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="main.css">
    <title>Document</title>
</head>
<body>
    
    <nav class="navbar-wrap bg-md-secondary h-100 h-md-auto">
        <span class="navbar-brand bg-secondary bg-md-none justify-content-between w-100 w-md-auto">
            <span class="brand-word"><a href="#">Brand</a></span>
            <!-- <img src="img/sample01.png" alt=""> -->
            <span class="menu d-block d-md-none">
                <button id="menuToggleButton" class="btn btn-info menu-trigger" type="button">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </span>
        </span>


        <ul class="nav-wrap w-100 w-md-auto flex-column flex-md-row bg-light state hide">
            <li>
                <a href="#">
                    menu-1
                </a>
            </li>
            <li>
                <a href="#">
                    menu-2
                </a>
            </li>
            <li>
                <a href="#">
                    menu-3
                </a>
            </li>
        </ul>
    </nav>
    <script src="main.js"></script>
</body>
</html>
```

```css
body,
a,
li,
ol,
ul,
h1,
h2,
h3,
h4,
h5,
h6,
span,
div {
    color: inherit;
    text-decoration: none;
    list-style: none;
    margin: 0 !important;
    padding: 0;
}

.navbar-wrap {
    height: 80px;
    color: black;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    width: auto;
    position: relative;
    z-index: 1000;
}

.navbar-brand{
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    height: 80px;
    z-index: 5;
}

.brand-word{
    text-transform: capitalize;
    font-weight: 600;
    font-size: 36px;
    padding: 0 1rem;
}

.nav-wrap{
    display: flex;
    flex-flow: row wrap;
    padding: 1rem 1rem;
    z-index: 3;
    /* opacity: 0; */
    position: absolute;
    top: 0%;
    left: 0%;
    transition: top .5s cubic-bezier(1,0,0,1);
}

.nav-wrap :nth-child(n){
    padding: .5rem 0.5rem;
}

.nav-wrap :nth-child(n){
    margin: 0 .2rem;
}

.nav-wrap.show{
    top: 100%;
}

.nav-wrap.hide{
    top: -100%;
}

@media screen and (min-width: 768px) {
    .nav-wrap.show,
    .nav-wrap.hide{
        position: relative;
    }
}

.menu-trigger{
    display: inline-block;
    position: relative;
    width: 50px;
    height: 40px;
    padding: 1rem;
    box-sizing: border-box;
}

.menu-trigger span{
    background-color: rgba(255,255,255,0.7);
    position: absolute;
    width: 30px;
    height: 4px;
    left: 50%;
    transform: translateX(-50%);
    transition: .3s cubic-bezier(1,0,0,1);
}

.menu-trigger span:nth-child(1){
    top: 5px;
}

.menu-trigger span:nth-child(2){
    top: 45%;
    animation: menuLineIn 1s both;
}

.menu-trigger span:nth-child(3){
    bottom: 5px;
}

.menu-trigger span.show:nth-child(1){
    transform-origin: left;
    transform: rotate(45deg) translateX(-50%);
    top: 45%;
}

.menu-trigger span.show:nth-child(3){
    transform-origin: left;
    transform: rotate(-45deg) translateX(-50%);
    top: 45%;
}

.menu-trigger span.show:nth-child(2){
    transform-origin: left;
    animation: menuLineOut 1s both;
    top: 45%;
}

@keyframes menuLineIn{
    0%{
        transform: translateX(200%);
        opacity: 0;
    }
    30%{
        transform: translateX(-150%);
    }
    100%{
        transform: translateX(-50%);
    }
}

@keyframes menuLineOut{
    0%{
        transform: translateX(-50%);
    }
    30%{
        transform: translateX(-150%);
    }
    100%{
        transform: translateX(200%);
        opacity: 0;
    }
}

.justify-content-center{
    justify-content: center;
}
.justify-content-end{
    justify-content: flex-end;
}
.justify-content-start{
    justify-content: flex-start;
}
.justify-content-between{
    justify-content: space-between;
}
.justify-content-around{
    justify-content: space-around;
}
.justify-content-evenly{
    justify-content: space-evenly;
}

.align-items-center{
    align-items: center;
}
.align-items-end{
    align-items: flex-end;
}
.align-items-start{
    align-items: flex-start;
}
.align-items-between{
    align-items: space-between;
}
.align-items-around{
    align-items: space-around;
}
.align-items-evenly{
    align-items: space-evenly;
}

.btn{
    border-radius: .3rem;
    border-width: 2px;
    border-style: solid;
    border-color: transparent;
    background-color: transparent;
    user-select: none;
    cursor: pointer;
}

button{
    outline: none;
    border-style: solid;
    border-color: gray;
    border-width: 1px;
    transition: 
    box-shadow .2s ease-in-out,
    background-color .2s ease-in-out;
}

.btn-info{
    color: white;
    background-color: rgb(13, 98, 255);
}

.btn-info:hover{
    background-color: rgb(13, 70, 255)
}

.btn-info:focus{
    box-shadow: 0 0 0 .3rem rgba(88, 131, 212, 0.548);
}

button:focus{
    box-shadow: 0 0 0 .3rem gray;
}

.menu{
    display: none;
    padding: 1rem;
    margin: .3rem;
}

.d-block{
    display: block;        
}
.d-none{
    display: none;        
}
.d-inline-block{
    display: inline-block;        
}
.d-flex{
    display: flex;        
}
.d-inline-flex{
    display: inline-flex;        
}

.bg-none{
    background-color: transparent;
}
.bg-light{
    background-color: lightgray;
}
.bg-secondary{
    background-color: rgb(109, 109, 109);
}

.w-auto{
    width: auto;
}
.w-100{
    width: 100%;
}
.h-auto{
    height: auto;
}
.h-100{
    height: 100%;
}

.flex-row{
    flex-flow: row wrap;
}
.flex-column{
    flex-flow: column wrap;
}

@media screen and (min-width: 768px){
    .d-md-block{
        display: block;        
    }
    .d-md-none{
        display: none;        
    }
    .d-md-inline-block{
        display: inline-block;        
    }
    .d-md-flex{
        display: flex;        
    }
    .d-md-inline-flex{
        display: inline-flex;        
    }
    .flex-md-row{
        flex-flow: row wrap;
    }
    .flex-md-column{
        flex-flow: column wrap;
    }
    .w-md-auto{
        width: auto;
    }
    .w-md-100{
        width: 100%;
    }
    .h-md-auto{
        height: auto;
    }
    .h-md-100{
        height: 100%;
    }
    .bg-md-light{
        background-color: lightgray;
    }
    .bg-md-secondary{
        background-color: rgb(109, 109, 109);
    }
    .bg-md-none{
        background-color: transparent;
    }
    .navbar-brand{
        height: 80px;
    }
    .nav-wrap{
        background-color: transparent;
    }
}
```