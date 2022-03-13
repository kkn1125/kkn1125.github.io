---
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-09-21 17:31:12 +0900
title:  "[JAVASCRIPT] 태그 입력 구현하기"
author: Kimson
categories: [ javascript ]
tags: [ tag, input, badge, til ]
image: assets/images/post/covers/TIL-javascript.png
description: "태그 입력 구현하기

최근 기억하기 힘든 내용이나 블로그 내용을 부분 발췌하거나 급하게 기록할 때 노션을 자주 애용하는데요. 그 중에서 태그를 이쁘게 만들어서 뱃지모양으로 띄우는 기능을 구현하려합니다."
featured: false
hidden: false
rating: 4
toc: true
profile: false
keysum: false
keywords: ""
---

# 태그 입력 구현하기

최근 기억하기 힘든 내용이나 블로그 내용을 부분 발췌하거나 급하게 기록할 때 노션을 자주 애용하는데요. 그 중에서 태그를 이쁘게 만들어서 뱃지모양으로 띄우는 기능을 구현하려합니다.

구상은 이렇습니다.

1. 태그가 담기는 배열 필요
2. `"Enter"`키 또는 `","`로 추가하고 공백이 있을 시 분리해서 태그 추가
3. 배열에서 태그내용을 뽑아 뿌려줄때 템플릿을 씌워서 뿌림
4. `x` 버튼을 눌러 해당 태그 삭제
5. 지우는 `backspace`키로는 뒤에 것부터 삭제
6. 전체 삭제

## 태그 출력부

`localStorage`를 사용한 예 입니다. `DB`에 연결하신다면 받아오는 부분만 수정하면 됩니다.

```html
<div>
    <h2>Test Tagging</h2>
    <div class="box">
        <span class="innerBox"></span>
        <input type="text" style="width: 5rem;">
    </div>
</div>
```

`box`를 클릭하면 `input`에 포커스 되고, 입력 후 엔터키를 누르면 태그가 `innerBox`에 생성 됩니다.

```javascript
'use strict';

const box = document.querySelector('.box');
const innerBox = document.querySelector('.innerBox');
const input = document.querySelector('input');
let tags = [];
```

기능은 크게 로컬스토리지 업데이트와 가져오기, 태그 추가, 태그 제거, 출력부 입니다.

```javascript
function initHandler(){ // 초기화
    let repo = localStorage.getItem("list_tag");

    if(typeof JSON.parse(repo) === "string"){
        localStorage.setItem("list_tag", "[]");
    }
    // Events
    box.addEventListener('click', ()=>{ input.focus() });
    box.addEventListener('click', removeTagHandler);
    input.addEventListener('keydown', addTagHandler);
    render();
}

// 로컬스토리지 가져오기
function getStorage(){
    tags = localStorage.list_tag?JSON.parse(localStorage.list_tag):[];
}

// 로컬스토리지 업데이트
function updateStorage(){
    localStorage.list_tag = JSON.stringify(tags);
    render();
}

// 태그 추가
function addTagHandler(ev){ // 태그 추가
    if(ev.key === "Enter"){
        tags.push(input.value);
        updateStorage();
        input.value = "";
    }
}

// 태그 제거
function removeTagHandler(ev){
    let target = ev.target;
    let textNode = target.previousElementSibling.innerText.trim();
    if(target.tagName === "SPAN" && target.className === "close"){
        tags = tags.filter(tag=> textNode !== tag);
        updateStorage();
    }
}

// 출력부
function render(){
    getStorage();
    let tmp = '';
    let template = tag => `<span class="tag"><span>${tag}</span><span class="close">&times;</span></span>`;
    tags.forEach(tag=>{
        tmp += template(tag);
    });
    innerBox.innerHTML = tmp;
}
```

초기화 기능을 하나 만들어 이미 저장되어 있을 수 있는 로컬스토리지를 긁어서 출력합니다.

만들고 보니 그렇게 어려운 부분은 없었습니다. 완전 똑같이 만들지는 못했지만 블로그에는 적용 시킬 수 있을 것 같습니다.

`css`는 그저 모양만 잡기 위함이라 언급 안했지만 아래에 코드를 남겨두었습니다.

```css
*{
    box-sizing: border-box;
}

html,body{
    margin: 0;
    padding: 0;
}

body{
    height: 100%;
}


input{
    border: none;
    outline: none;
    height: 2rem;
    padding: .3rem;
    font-size: 1rem;
}

body>div{
    width: 30rem;
    margin-left: auto;
    margin-right: auto;
}

.box{
    border: 1px solid rgba(0,0,0,0.2);
    padding: .3rem;
    border-radius: 0.3rem;
    -webkit-border-radius: 0.3rem;
    -moz-border-radius: 0.3rem;
    -ms-border-radius: 0.3rem;
    -o-border-radius: 0.3rem;
}

.tag{
    display: inline-block;
    text-align: center;
    height: 2rem;
    padding: .3rem .5rem;
    margin: auto;
    font-size: .9rem;
    background-color: rgba(29, 212, 105, 0.719);
    color: white;
    font-weight: 700;
    border-radius: 0.3rem;
    -webkit-border-radius: 0.3rem;
    -moz-border-radius: 0.3rem;
    -ms-border-radius: 0.3rem;
    -o-border-radius: 0.3rem;
    margin: 0.2rem;
    transition: .5s ease;
    -webkit-transition: .5s ease;
    -moz-transition: .5s ease;
    -ms-transition: .5s ease;
    -o-transition: .5s ease;
}

.close{
    cursor: pointer;
}
```

-----

아래는 테스트용으로 두었습니다.

<style>
.testCase input{
    border: none;
    outline: none;
    height: 2rem;
    padding: .3rem;
    font-size: 1rem;
    background-color: transparent;
}

.testCase>div{
    width: 30rem;
    margin-left: auto;
    margin-right: auto;
}

.testCase .box{
    border: 1px solid rgba(0,0,0,0.5);
    padding: .3rem;
    border-radius: 0.3rem;
    -webkit-border-radius: 0.3rem;
    -moz-border-radius: 0.3rem;
    -ms-border-radius: 0.3rem;
    -o-border-radius: 0.3rem;
}

.testCase .tag{
    display: inline-block;
    text-align: center;
    height: 2rem;
    padding: .3rem .5rem;
    margin: auto;
    font-size: .9rem;
    background-color: rgba(29, 212, 105, 0.719);
    color: white;
    font-weight: 700;
    border-radius: 0.3rem;
    -webkit-border-radius: 0.3rem;
    -moz-border-radius: 0.3rem;
    -ms-border-radius: 0.3rem;
    -o-border-radius: 0.3rem;
    margin: 0.2rem;
    transition: .5s ease;
    -webkit-transition: .5s ease;
    -moz-transition: .5s ease;
    -ms-transition: .5s ease;
    -o-transition: .5s ease;
}

.testCase .close{
    cursor: pointer;
}
</style>

<div class="testCase">
    <h2>Test Tagging</h2>
    <div class="box">
        <span class="innerBox"></span>
        <input type="text" style="width: 5rem;">
    </div>
</div>

<script type="text/javascript">
const box = document.querySelector('.testCase .box');
const innerBox = document.querySelector('.testCase .innerBox');
const input = document.querySelector('.testCase input');
let tags = null;
initHandler();

function initHandler(){ // 초기화
    let repo = localStorage.tagsList;

    if(repo == ''){
        localStorage.tagsList = `["테스트", "해보세요", "저장은됩니다", "다만", "이블로그는", "개발자도구가", "금지되어있습니다"]`;
    } else if(repo == '[]'){
        localStorage.tagsList = `["테스트", "해보세요", "저장은됩니다", "다만", "이블로그는", "개발자도구가", "금지되어있습니다"]`;
    }
    // Events
    box.addEventListener('click', ()=>{ input.focus() });
    box.addEventListener('click', removeTagHandler);
    input.addEventListener('keydown', addTagHandler);
    input.addEventListener('keydown', removeLastTagHandler);
    render();
}

// 로컬스토리지 가져오기
function getStorage(){
    tags = localStorage.tagsList?JSON.parse(localStorage.tagsList):[];
}

// 로컬스토리지 업데이트
function updateStorage(){
    localStorage.tagsList = JSON.stringify(tags);
    render();
}

// 태그 추가
function addTagHandler(ev){ // 태그 추가
    if(ev.key === "Enter"){
        let sp = input.value.split(' ');
        sp.forEach(tag=>{
            if(tag.length>0){
                tags.push(tag);
            }
        })
        updateStorage();
        input.value = "";
    }
}

// 태그 제거
function removeTagHandler(ev){
    let target = ev.target;
    if(target.tagName === "SPAN" && target.className === "close"){
        let textNode = target.previousElementSibling.innerText.trim();
        tags = tags.filter(tag=> textNode !== tag);
        updateStorage();
    }
}

function removeLastTagHandler(ev){
    let target = ev.target;
    if(ev.key === 'Backspace' && target.value.length == 0){
        tags.pop();
        updateStorage();
    }
}

// 출력부
function render(){
    getStorage();
    let tmp = '';
    let template = tag => `<span class="tag"><span>${tag}</span><span class="close">&times;</span></span>`;
    tags.forEach(tag=>{
        tmp += template(tag);
    });
    innerBox.innerHTML = tmp;
}
</script>