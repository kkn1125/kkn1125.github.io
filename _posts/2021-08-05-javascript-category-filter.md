---
layout: post
date:   2021-08-05 14:46:07 +0900
title:  "[JAVASCRIPT] 카테고리 필터"
author: Kimson
categories: [ TIM, JAVASCRIPT ]
tags: [filter, category, absolute]
image: assets/images/post/covers/TIM-none.png
description: "Category Filter

만들어 보고싶은게 한둘이 아니어서 가끔 몸이 모자라다는 생각도 듭니다.  

오늘 만들어 본 건 카테고리 필터인데요. 우연히 구직 중에 발견한 회사 홈페이지에 있는 카테고리 필터를 보고 만들어 봐야겠다는 생각이 들었습니다.

요즘 data-*속성에 익숙해져서 왠만하면 모든 기능 구현을 data-*를 사용하고 있습니다. 그래서 오늘 다룰 내용은 주로 data-*와 위 언급한 회사의 카테고리 필터에 적용된 absolute 방식 조정입니다."
featured: true
hidden: false
rating: 5
toc: true
profile: false
istop: true
keysum: true
keywords: '
Array.forEach(func(element,index,list)) : 배열객체에 사용
_element.dataset.* : 요소의 data-*속성 값을 반환
_element.client* : 객체의 너비, 높이 등 값 반환
_element.setAttribute(attrName, attrValue) : 요소의 속성 값 지정
_node.addEventListener(eventType,func(event)) : 이벤트 추가
'
---

# Category Filter

만들어 보고싶은게 한둘이 아니어서 가끔 몸이 모자라다는 생각도 듭니다.  

오늘 만들어 본 건 카테고리 필터인데요. 우연히 구직 중에 발견한 회사 홈페이지에 있는 카테고리 필터를 보고 만들어 봐야겠다는 생각이 들었습니다.

요즘 data-*속성에 익숙해져서 왠만하면 모든 기능 구현을 data-*를 사용하고 있습니다. 그래서 오늘 다룰 내용은 주로 data-*와 위 언급한 회사의 카테고리 필터에 적용된 absolute 방식 조정입니다.

>[투라인코드](https://www.twolinecode.com/)
><footer class="blockquote-footer mb-3">참고한 페이지라 링크를 남깁니다.</footer>

## 리스트 방식

예전에 만들던 필터 방식은 vertical 구조의 리스트방식이었습니다.

-----

![예전 필터 형태]({{site.baseurl}}/assets/images/post/filter/filter01.png)

-----

hide클래스 css 설정과 setTimeout만 있으면 간단하게 만들 수 있습니다.

단, 카드방식(앨범방식)으로 할때는 코드를 많이 수정해야 했습니다.

## 카드 방식

오늘 만든 필터는 absolute를 사용했습니다.  
먼저 transform을 어떻게 먹일 것인지가 문제였습니다.

### 필요한 기능

1. 버튼 이벤트
2. 카드 정렬
   1. 초기 정렬
   2. 클릭 시 정렬
3. show/hide

기능은 크게 세 가지가 전부 입니다.

```html
<!DOCTYPE html>
<html>
    <head>
        ...
    </head>
    <body>
        <div>
            <!-- 버튼 요소 -->
            <button data-value="all">all</button>
            <button data-value="a">1</button>
            <button data-value="b">2</button>
            <button data-value="c">3</button>
            <button data-value="d">4</button>
            <button data-value="e">5</button>
        </div>
        <div id="wrap">
            <!-- 카드가 되는 요소들 -->
            <!-- 그룹에는 값을 띄어쓰기로 구분하고 all은 공통으로 넣습니다 -->
            <a data-group="all a" href="#1">anchor1</a>
            <a data-group="all b a" href="#2">anchor2</a>
            <a data-group="all a" href="#3">anchor3</a>
            <a data-group="all d" href="#4">anchor4</a>
            <a data-group="all a b c" href="#5">anchor5</a>
            <a data-group="all e" href="#6">anchor6</a>
            <a data-group="all d" href="#7">anchor7</a>
            <a data-group="all c" href="#8">anchor8</a>
            <a data-group="all b" href="#9">anchor9</a>
            <a data-group="all c" href="#10">anchor10</a>
            <a data-group="all a" href="#11">anchor11</a>
            <a data-group="all d" href="#12">anchor12</a>
        </div>
    </body>
</html>
```

카드와 버튼을 만듭니다.  

```css
#wrap{
    display: flex;
    flex-flow: row wrap;
    justify-content: start;
    position: relative;
}
.show{
    transition: .3s ease;
    opacity: 1;
}

.hide{
    transition: .2s ease;
    opacity: 0;
}

[href^="#"]{
    /* href속성을 가진 태그 중 값이 #으로 시작하는 것 선택 */
    width: 100px;
    height: 150px;
    display: block;
    background-color: gray;
    margin: 1rem;
}

[data-group]{
    transition: .3s ease;
    position: absolute;
}
```

css는 테스트용으로 카드 크기와 색상만 주었습니다.  
hide와 show의 속도 및 공통 적용되는 투명도를 주었습니다.  
href속성과 data-group속성의 태그들은 카드들을 가리킵니다.

#### 버튼 이벤트

버튼에 data-value를 주었습니다. 각 버튼이 카테고리 값을 가질때 버튼의 value값을 data-group속성 태그들을 조회하여 맞는 값에 show/hide 클래스를 주는 역할입니다.

```javascript
let all = document.querySelectorAll('[data-group]');
let values = document.querySelectorAll("[data-value]");

el.addEventListener('click',function(event){
    values.forEach((el)=>{
        // 버튼 하나하나에 이벤트 적용
        console.log(event.target);
        // [button, button, button, ...]
        let val = event.target.dataset.value;
        // 버튼의 value값 저장
        all.forEach(el=>{
            // 카드리스트 순회
            let arr = el.dataset.group.split(' ');
            // 카드 데이터 그룹값 배열화
            for(let a of arr){
                // 각 그룹값 조회
                if(a==val){
                    // 그룹값 내에 클릭한 value 값과 동일하면 show
                    el.setAttribute("class","show");
                        /* 클릭시 정렬 기능 자리 */
                    break;
                    // break를 한 이유는
                    // ex) 그룹 값 a, c, b이고 클릭 값 c이면 b를 조회하고 else로 넘어가 show가 작동 안된다.
                } else {
                    // 일치하지 않으면 hide
                    el.setAttribute("class","hide");
                        /* 클릭시 정렬 기능 자리 */
                }
            }
        });
    });
});
```

여기까지가 버튼 이벤트 추가와 show/hide 입니다. 원래 classList.add와 replace를 쓰려했지만 오히려 더 코드가 길어지고 번거로워져서 쉽게 setAttribute로 작성했습니다.

#### 카드 정렬 - 초기 정렬

```javascript
/**
 * ... 위 코드들 ...
 */

let col = 0;
let row = -1;
// index를 4로 나눈 몫이 0이기 때문에 한자리 비워집니다.
// 원래 시작자리로 하기위해 -1부터합니다.

// 초기 정렬
all.forEach((item, index, list)=>{
    if(index%4==0) {
        // 달력에서 주단위로 줄바꿈과 같은 원리
        // 카드를 4열로 설정
        row++; // 열을 바꿀때 행 추가
        col=0; // 열 0으로 초기화
    }
    item.style.transform = 
    `scale3d(1,1,1) translate3d(${col*(item.clientWidth+10)}px, ${row*(item.clientHeight+10)}px, 0px)`;
    col++;
    // item(카드)의 너비와 높이값에 여백으로 10만큼 더 함
});
```

index의 값에 따라 줄바꿈과 시작부분 초기화 기능을 만들고, item(카드)의 너비와 높이 값을 주어 차례대로 나열되게하는 기능입니다.

#### 카드 정렬 - 클릭 시 정렬

초기 정렬과 원리는 같습니다. 버튼 이벤트 코드를 가져와 보기 쉽게 있던 주석을 지우고 코드를 추가하겠습니다.

```javascript
let all = document.querySelectorAll('[data-group]');
let values = document.querySelectorAll("[data-value]");
let rowid = 0;
let colid = 0;

el.addEventListener('click',function(event){
    values.forEach((el)=>{

        rowid=-1; // 동일하게 row값 -1
        colid=0; // 마찬가지로 col값 0
        let idx = 0; // show 되는 요소들의 인덱스 값

        let val = event.target.dataset.value;
        all.forEach(el=>{
            let arr = el.dataset.group.split(' ');
            for(let a of arr){
                if(a==val){
                    el.setAttribute("class","show");
                    /* 클릭시 정렬 기능 자리 */

                    if(idx%4==0){
                        // 초기 정렬과 동일함
                        rowid++;
                        colid=0;
                    }

                    el.style.transform = `scale3d(1,1,1) translate3d(${110*colid}px, ${160*rowid}px,0px)`;
                    // 보기 쉽게 item.clientHeight+10을 축약함 (초기정렬과 동일함)
                    colid++;
                    idx++; // 초기와 달리 show일때 수동으로 카운트해야하므로 1씩 증가

                    break;
                } else {
                    el.setAttribute("class","hide");
                        /* 클릭시 정렬 기능 자리 */
                    el.style.transform = `scale3d(0,0,1) translate3d(0px,0px,-1px)`;
                    // hide일때 시작점으로 모이게 함
                }
            }
        });
    });
});

/**
 * ... 초기 정렬 코드 ...
 */
```

원리는 정말 간단하다 생각이 됩니다. 클릭값에 해당하는 카드를 보이게 하고 나머지는 가리는 방식이라 코드가 길어보이지만 동일한 부분을 함수처리하면 더 깔끔해질 것 같습니다.

아래의 필터를 테스트 해보세요.

-----

<style>
#wrap1{
    display: flex;
    flex-flow: row wrap;
    justify-content: start;
    position: relative;
    height: 500px;
}

[data-group]{
    transition: .3s ease;
    position: absolute;
    width: 100px;
    height: 150px;
    display: block;
    background-color: lightgray;
    border: 1px solid gray;
    border-radius: 15px;
    margin: 1rem;
    text-align: center;
    box-sizing: border-box;
}

.show{
    transition: .3s ease;
    opacity: 1;
}

.hide{
    transition: .2s ease;
    opacity: 0;
}
</style>

<div class="btn-group d-flex">
    <button class="btn btn-dark" data-value="all">all</button>
    <button class="btn btn-dark" data-value="a">a</button>
    <button class="btn btn-dark" data-value="b">b</button>
    <button class="btn btn-dark" data-value="c">c</button>
</div>

<div id="wrap1">
    <span data-group="all a">Card<br><br>a</span>
    <span data-group="all b a">Card<br><br>a b</span>
    <span data-group="all a">Card<br><br>a</span>
    <span data-group="all a">Card<br><br>a</span>
    <span data-group="all a b c">Card<br><br>a b c</span>
    <span data-group="all b">Card<br><br>b</span>
    <span data-group="all c">Card<br><br>c</span>
    <span data-group="all c">Card<br><br>c</span>
    <span data-group="all b">Card<br><br>b</span>
    <span data-group="all c">Card<br><br> c</span>
    <span data-group="all a">Card<br><br>a</span>
    <span data-group="all b">Card<br><br>b</span>
</div>

<script>
    'use strict';

let col = 0;
let row = -1;
let ww = document.querySelector('#wrap1').clientWidth-16;
let count11 = Math.floor((ww)/116);
let middle = (ww-(116*count11))/2;
let all = document.querySelectorAll('[data-group]');
document.querySelector('#wrap1').style.transition = ".2s ease";

window.addEventListener('resize',function(){
    ww = document.querySelector('#wrap1').clientWidth-16;
	count11 = Math.floor(ww/116);
	middle = (ww-(116*count11))/2;
	row = -1;
	col = 0;
    
    initCard();
},true);

function initCard(){
    all.forEach((item, index, list)=>{ // 초기화
        if(index%count11==0) {
            row++;
            col=0;
        }
        let xw = item.clientWidth+2;
        let xh = item.clientHeight+2;
        item.style.transform = 
        `scale3d(1,1,1) translate3d(${middle+(col*(100+16))}px, ${row*(160)}px, 0px)`;
        col++;
    });
    document.querySelector('#wrap1').style.height = `${(row+1)*160}px`;
}

initCard();

let values = document.querySelectorAll("[data-value]");

let rowid = 0;
let colid = 0;
values.forEach((el)=>{
    el.addEventListener('click',function(event){
        rowid=-1;
        colid=0;
        let idx = 0;
        let val = event.target.dataset.value;
        
        all.forEach(el=>{
            let arr = el.dataset.group.split(' ');
            for(let a of arr){
                if(a==val){
                    el.setAttribute("class","show");
                    if(idx%count11==0){
                        colid=0;
                        rowid++;
                    }
                    el.style.transform = `scale3d(1,1,1) translate3d(${middle+(colid*(100+16))}px, ${rowid*(160)}px,0px)`;
                    colid++;
                    idx++;
                    document.querySelector('#wrap1').style.height = `${(rowid+1)*160}px`;
                    break;
                } else {
                    el.setAttribute("class","hide");
                    el.style.transform = `scale3d(0,0,1) translate3d(0px,0px,-1px)`;
                }
            }
        });
    });
});
</script>

-----

사용된 속성, 함수들은 아래의 키워드 리스트를 참고해주세요.