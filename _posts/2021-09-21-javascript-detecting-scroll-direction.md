---
layout: post
date:   2021-09-21 20:23:12 +0900
title:  "[JAVASCRIPT] 스크롤 방향 감지 (Detecting scroll direction)"
author: Kimson
categories: [ TIL, JAVASCRIPT ]
tags: [detect, scroll, direction]
image: assets/images/post/covers/TIL-javascript.png
description: "스크롤 방향 감지

`wheel` 이벤트를 쓰면 간단합니다만 저는 `wheel` 이벤트 말고 `scroll`로 감지를 하려합니다.

현재 작업 중인 프로젝트에 필요해서 생각하다보니 여기에 적용하는 중에 기록용으로 남깁니다."
featured: true
hidden: false
rating: 3.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
---

# 스크롤 방향 감지

`wheel` 이벤트를 쓰면 간단합니다만 저는 `wheel` 이벤트 말고 `scroll`로 감지를 하려합니다.

현재 작업 중인 프로젝트에 필요해서 생각하다보니 여기에 적용하는 중에 기록용으로 남깁니다.

## `scroll`은 왜?

아시다시피 `wheel`로 하려다 보니 스크롤 감지는 되는데 마우스 가운데 스크롤 버튼을 눌렀을 때는 감지가 안되더군요.

그래서 `scroll` 이벤트로 모든 스크롤을 감지하기 위해서 였습니다.

## 스크롤의 이전 값 비교

```javascript
let before = [];

window.addEventListener('scroll',(ev)=>{
	if(before.pop() < window.scrollY) console.log("Down Scroll");
	else console.log("Up Scroll");
	before.push(window.scrollY);
});
```

그저 이전 값을 배열에 저장해두고 현재 스크롤 값과 비교해주면 끝입니다. 배열이 아니고 그냥 변수여도 상관 없습니다. 변경은 아래와 같습니다.

```javascript
let before = 0;

window.addEventListener('scroll',(ev)=>{
	if(before < window.scrollY) console.log("Down Scroll");
	else console.log("Up Scroll");
	before = window.scrollY;
});
```