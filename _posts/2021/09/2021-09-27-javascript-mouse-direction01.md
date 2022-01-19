---
layout: post
modified: 2022-01-19 15:55:53 +0900
date:   2021-09-24 22:22:32 +0900
title:  "[JAVASCRIPT] 마우스 이동 방향 감지"
author: Kimson
categories: [ TIL, JAVASCRIPT ]
tags: [detect, direction, mouse]
image: assets/images/post/covers/TIL-javascript.png
description: "마우스 이동 방향 감지

얼마 전 취업활동 중 모 회사의 포트폴리오 페이지에서 신기한 효과를 보고 따라해보려 합니다.

각 포트폴리오가 카드형식으로 표시되고 카드에 마우스를 올리면 마우스가 들어온 방향으로 반투명의 커버가 덮히게 됩니다. 그러고나서 배경 색이 이미지의 색상과 동일하게 변경됩니다.

그래서 구현 할 기능을 정리하면

1. 마우스 방향 감지
2. 마우스가 들어온 방향에 따라 덮히는 커버
3. 이미지 색상 판별하여 배경 색 변경

3가지 입니다."
featured: false
hidden: false
rating: 4.5
toc: true
profile: false
keysum: false
keywords: ""
---

# 마우스 이동 방향 감지

얼마 전 취업활동 중 모 회사의 포트폴리오 페이지에서 신기한 효과를 보고 따라해보려 합니다.

각 포트폴리오가 카드형식으로 표시되고 카드에 마우스를 올리면 마우스가 들어온 방향으로 반투명의 커버가 덮히게 됩니다. 그러고나서 배경 색이 이미지의 색상과 동일하게 변경됩니다.

그래서 구현 할 기능을 정리하면

1. 마우스 방향 감지
2. 마우스가 들어온 방향에 따라 덮히는 커버
3. 이미지 색상 판별하여 배경 색 변경

3가지 입니다.

## 이동 방향을 감지해보자

예전에 스크롤로 위아래를 감지하는 방법을 포스팅 했었는데요. 그것과 같은 식으로 잡아내려합니다. 스크롤 방향이 궁금하시면 [스크롤 방향 감지](https://kkn1125.github.io/javascript-detecting-scroll-direction/){:target="_blank"}를 참고하시기 바랍니다.

```html
<div class="card mx-3" style="width: 15rem;">
	<div>
		<img class="img-fluid" src="cover01.jpg" alt="test">
	</div>
	<div class="d-flex justify-content-between card-title px-3 pt-3">
		<div class="h3">Title Of Card</div>
		<span>🙋‍♂️</span>
	</div>
	<div class="card-body">
		<p class="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Non veniam
			doloremque
			praesentium
			reprehenderit? Fugit quaerat nam error perferendis, ipsam sed.</p>
	</div>
	<div class="card-footer">
		kimson
	</div>
</div>
```

테스트용 카드입니다. bootstrap 5.0.2를 사용했습니다.

```javascript
'use strict';

let over = 0; // 마우스가 들어왔는지 체크
let beforeX = 0; // 마우스가 이전에 있던 X좌표 위치
let beforeY = 0; // 마우스가 이전에 있던 Y좌표 위치
```

3가지 변수로 카드에 마우스가 들어왔는지, 어느 방향인지 컨트롤하겠습니다.

```javascript
let movementHandler = (ev)=>{ // 움직임 감지
	let target = ev.target;
	if(target.classList.contains("card") && over==0){
        let rgb;
		let curX = ev.screenX;
		let curY = ev.screenY;
        if(target.querySelector("img")){
            // 타겟에 이미지태그가 있으면 배경색을 바꾸는 함수 실행
        }
        if(curX>beforeX && curY==beforeY){
            // 좌에서 우로
        } else if (curX==beforeX && curY>beforeY) {
            // 상에서 하로
            
        } else if(curX<beforeX && curY==beforeY){
            // 우에서 좌로
            
        } else if(curX==beforeX && curY<beforeY) {
            // 하에서 상으로
        }
        beforeX = curX;
        beforeY = curY;
    } else if(!target.classList.contains("card")){
        over = 0;
    }
}

let fadeCover = (target, direction, rgb)=>{
	let origin = document.querySelector(".cover");
    if(origin){ // 커버 초기화
        origin.remove();
    }
    let cover = document.createElement("div");
    cover.classList.add("cover", direction);
    cover.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
    target.append(cover);
    over = 1;
}
```

여기서 `cover`클래스와 `direction`인자를 받아 넣는데 `direction`은 미리 css에서 설정한 내용으로 방향에 따라 덮는 방향을 결정하려합니다.

```css
body{
    transition: background-color 1s;
    -webkit-transition: background-color 1s;
    -moz-transition: background-color 1s;
    -ms-transition: background-color 1s;
    -o-transition: background-color 1s;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    text-transform: capitalize;
}

.card::after{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: block;
}

.cover{
    position: absolute;
    background-color: rgba(0,0,0,0.5);
}

.cover.start,
.cover.end{
    animation: startEnd .5s cubic-bezier(1,0,0,1) both;
    -webkit-animation: startEnd .5s cubic-bezier(1,0,0,1) both;
}
.cover.end{
    right: 0;
}
.cover.top,
.cover.bottom{
    animation: topBottom 0.5s cubic-bezier(1,0,0,1) both;
    -webkit-animation: topBottom 0.5s cubic-bezier(1,0,0,1) both;
}
.cover.bottom{
    bottom: 0;
}

@keyframes startEnd{
    0%{
        width: 0%;
        height: 100%;
    }
    100%{
        width: 100%;
        height: 100%;
    }
}
@keyframes topBottom{
    0%{
        width: 100%;
        height: 0%;
    }
    100%{
        width: 100%;
        height: 100%;
    }
}
```

`keyframes`를 써서 상하, 좌우 두 묶음으로 한 이유는 서로 방향만 반대이기 때문에 두가지만 설정하였고, 우측에서와 아래측에서 커버가 늘어나는 방향을 주기위해 `end`, `bottom`은 `right`와 `bottom`값을 `0`으로 따로 주었습니다.

그리고 문제의 이미지 색상을 추출하는 함수는 `stackoverflow`의 힘을 빌려 아직 완전히 이해하지 못했지만 사용하였습니다.

글 아래에 코드와 출처가 있으니 참고바랍니다.

마우스 방향 감지가 아직 정확하지는 않습니다. 대각선으로 하면 각 방향 중 하나로 랜덤해지는 부분은 수정하여 다시 보완하려 합니다.

테스트용으로 아래 카드를 두겠습니다.

-----

<style>
.card::after{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: block;
	z-index: 100;
}

.cover{
    position: absolute;
    background-color: rgba(0,0,0,0.5);
}

.cover.start,
.cover.end{
    animation: startEnd .5s cubic-bezier(1,0,0,1) both;
    -webkit-animation: startEnd .5s cubic-bezier(1,0,0,1) both;
}
.cover.end{
    right: 0;
}
.cover.top,
.cover.bottom{
    animation: topBottom 0.5s cubic-bezier(1,0,0,1) both;
    -webkit-animation: topBottom 0.5s cubic-bezier(1,0,0,1) both;
}
.cover.bottom{
    bottom: 0;
}

@keyframes startEnd{
    0%{
        width: 0%;
        height: 100%;
    }
    100%{
        width: 100%;
        height: 100%;
    }
}
@keyframes topBottom{
    0%{
        width: 100%;
        height: 0%;
    }
    100%{
        width: 100%;
        height: 100%;
    }
}
</style>

<div class="d-flex justify-content-center">
	<div class="card mx-3" style="width: 15rem; overflow: hidden">
		<div class="position-absolute top-0 start-0 h-100">
			<img class="img-fluid h-100" style="object-fit: cover" src="{{site.baseurl}}/assets/images/post/mouseDirection/direction01.png" alt="test">
		</div>
		<div class="d-flex justify-content-between card-title px-3 pt-3" style="z-index: 1;">
			<div class="h3">Title Of Card</div>
			<span>🙋‍♂️</span>
		</div>
		<div class="card-body" style="z-index: 1;">
			<p class="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. At, vero.</p>
		</div>
		<div class="card-footer" style="z-index: 1;">
			kimson
		</div>
	</div>
</div>

<script type="text/javascript">
let over = 0;
let beforeX = 0;
let beforeY = 0;

let fadeCover = (target, direction, rgb)=>{
    let cover = document.createElement("div");
    cover.classList.add("cover", direction);
    cover.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
    target.append(cover);
    over = 1;
}

let movementHandler = (ev)=>{
    let target = ev.target;
    
    if(target.classList.contains("card") && over==0){
        let rgb;
        if(target.querySelector("img")){
            rgb = getAverageRGB(target.querySelector("img"));
            document.body.style.backgroundColor = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
        }
        if(ev.screenX>beforeX && ev.screenY==beforeY){
            // console.log("오");
            fadeCover(target, "start", rgb);
        } else if (ev.screenX==beforeX && ev.screenY>beforeY) {
            // console.log("아");
            fadeCover(target, "top", rgb);
            
        } else if(ev.screenX<beforeX && ev.screenY==beforeY){
            // console.log("왼");
            fadeCover(target, "end", rgb);
            
        } else if(ev.screenX==beforeX && ev.screenY<beforeY) {
            // console.log("위");
            fadeCover(target, "bottom", rgb);
        }
        beforeX = ev.screenX;
        beforeY = ev.screenY;
    } else if(!target.classList.contains("card")){
        over = 0;
    }
	if(!target.classList.contains("card") && over==0){
		document.body.style.backgroundColor = `#2a2b31`;
		let origin = document.querySelector(".cover");
		if(origin){
			origin.remove();
		}
	}
}



window.addEventListener("mousemove", movementHandler);

function getAverageRGB(imgEl) {

    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;
    if (!context) {
        return defaultRGB;
    }
    height = canvas.height = imgEl.naturalHeight;
	// || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth;
	// || imgEl.offsetWidth || imgEl.width;
    context.drawImage(imgEl, 0, 0);
    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    return rgb;

}
</script>

-----

> [stackoverflow :: Get average color of image via Javascript](https://stackoverflow.com/questions/2541481/get-average-color-of-image-via-javascript){:target="_blank"}

```javascript
function getAverageRGB(imgEl) {

    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    return rgb;

}
```