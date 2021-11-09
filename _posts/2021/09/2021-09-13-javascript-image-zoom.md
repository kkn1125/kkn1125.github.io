---
layout: post
date:   2021-09-10 19:07:12 +0900
title:  "[JAVASCRIPT] 이미지 줌 구현하기"
author: Kimson
categories: [ TIL, JAVASCRIPT ]
tags: [image, zoom]
image: assets/images/post/covers/TIL-javascript.png
description: "이미지 줌 구현
사용 할 이미지는 저작권 영향을 받지 않는 픽사베이의 이미지를 사용했는데요. 크기가 다양해서 이미지가 필요할 때 자주 애용합니다.

이미지를 두 개 구했습니다. `img`태그는 크기조절을 위해 `span`으로 한 번 감싸면 됩니다."
featured: false
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: false
keywords: ""
---

# 이미지 줌 구현

> 주요 기능

1. 클릭 시 팝업
2. 팝업 된 이미지 클릭 시 줌인
3. 최대 배율까지 확대 후 원본 크기로 복구
4. 닫기

```html
<h1>Zoom In/Out</h1>
<div class="container text-center d-flex flex-wrap">
    <span class="wrap">
        <img src="test.jpg" alt="test">
    </span>
    <span class="wrap">
        <img src="test2.png" alt="test">
    </span>
</div>
```

사용 할 이미지는 저작권 영향을 받지 않는 픽사베이의 이미지를 사용했는데요. 크기가 다양해서 이미지가 필요할 때 자주 애용합니다.

이미지를 두 개 구했습니다. `img`태그는 크기조절을 위해 `span`으로 한 번 감싸면 됩니다.

```css
*{
    box-sizing: border-box;
}

body.noScroll{ /* 이미지 팝업 시 이중 스크롤 방지 */
    overflow: hidden;
}

.wrap{ /* 이미지 사이즈 */
    overflow: hidden;
    width: 600px;
    height: 350px;
    display: inline-flex;
    align-items: center;
}

.wrap>img{ /* 커서 모양 바꿈 */
    cursor: pointer;
}

img{ /* 이미지 배율 증가 시 부드럽게 */
    width: 100%;
    object-position: center;
    object-fit: contain;
    transition: .3s;
    -webkit-transition: .3s;
    -moz-transition: .3s;
    -ms-transition: .3s;
    -o-transition: .3s;
}

.zoomIn{ /* 줌인 커서 모양 */
    cursor: zoom-in;
}

.zoomOut{ /* 중아웃 커서 모양 */
    cursor: zoom-out;
}

.popup{ /* 팝업 배경 */
    background-color: rgba(0, 0, 0, 0.877);
    width: 100%;
    height: 100vh;
    overflow: auto;
    position: fixed;
    opacity: 0;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 2rem 0;
    transition: .3s;
    -webkit-transition: .3s;
    -moz-transition: .3s;
    -ms-transition: .3s;
    -o-transition: .3s;
    opacity: 0;
    pointer-events: none;
}

.popup.show{ /* 팝업 보이기 */
    opacity: 1;
    pointer-events: unset;
}
```

![view]({{site.baseurl}}/assets/images/post/zoom/zoom01.png)

```javascript
const imgs = document.querySelectorAll('img');
let click = false; // 클릭 여부
let zoomLayer = 100; // 줌 배율 기본 값
let moved; // 움직임 여부
let moving = false; // 움직이는 중인지 여부
let click_position_X = 0; // 이미지 클릭한 위치
let click_position_Y = 0; // 이미지 클릭한 위치
let originX = 0; // 클릭한 이미지의 현재 left 값
let originY = 0; // 클릭한 이미지의 현재 top 값

let downListener = (ev)=>{ // 클릭 시
    moved = true;
    moving = false;

    originX = parseInt(getComputedStyle(ev.target)['left'].slice(0,-2));
    originY = parseInt(getComputedStyle(ev.target)['top'].slice(0,-2));
    click_position_X = ev.clientX;
    click_position_Y = ev.clientY;
}

let upListener = () => { // 마우스는 떼면 움직임 멈춤
    moved = false;
}

imgs.forEach(img=>{ // 이미지 마다 설정하기
    img.draggable = false; // 이미지 드래그 방지
    img.addEventListener('click', (ev)=>{
        document.body.classList.add("noScroll");
        if(!click){
            let copy = img.cloneNode();
            let pop = document.createElement('div');
            let zoom = document.createElement('div');
            let btn = document.createElement('button');
            copy.classList.add("zoomIn");
            pop.id = "pop";
            pop.classList.add("popup");
            pop.prepend(zoom);
            zoom.classList.add('zoom');
            zoom.prepend(copy);
            zoom.prepend(btn);
            btn.innerHTML = "&times;";
            btn.classList.add('btn','btn-danger', 'close');

            btn.addEventListener('click', ()=>{
                pop.classList.remove("show");
                setTimeout(()=>{
                    pop.remove();
                    click = false;
                    document.body.classList.remove("noScroll");
                }, 300);
            });

            copy.addEventListener('click', (evt)=>{
                if(!moved && !moving){
                    if(copy.classList.contains("zoomOut")){
                        copy.classList.replace("zoomOut","zoomIn");
                    }
                    let zoomIn = evt.target;
                    zoomIn.style.cssText = `
                        width: ${zoomLayer}%;
                        top: ${evt.target.style.top};
                        left: ${evt.target.style.left};
                    `;
                    if(zoomLayer == 150){
                        copy.classList.replace("zoomIn","zoomOut");
                    }
                    if(zoomLayer>150){
                        zoomLayer = 100;
                        zoomIn.style.cssText = `
                            width: ${zoomLayer}%;
                            top: 0;
                            left: 0;
                        `;
                    }
                    zoomLayer+=10;
                }
            });

            copy.addEventListener('mousedown', downListener);
            copy.addEventListener('mousemove', evt=>{
                if (moved) {
                    moving = true;
                    let oX = evt.clientX;
                    let oY = evt.clientY;
                    evt.target.style.cssText = `
                        top: ${originY + (oY-click_position_Y)}px;
                        left: ${originX + (oX-click_position_X)}px;
                        width: ${evt.target.style.width};
                    `;
                } else {
                    moving = false;
                    moved = false;
                }
            });
            window.addEventListener('mouseup', upListener);

            document.body.prepend(pop);
            setTimeout(()=>{
                pop.classList.add('show');
            }, 300);
            click = true;
        }
    });
});
```

`downListenter`와 `upListenter`로 클릭 여부와 움직임 여부를 감지합니다.

`popup`되는 요소들은 `createElement`로 만들어 `append` 시키는 방식이고, 이미지는 클릭된 이미지 노드를 `clone`해서 사용하게 됩니다.

닫기 버튼은 클릭시 `transition`으로 300ms후 투명도 0이되고 `setTimeout`으로 `popup`은 `remove`로 삭제 됩니다.

`copy(이하 이미지 노드)`는 또 다시 마우스 이벤트 3가지를 가집니다.

1. 클릭
2. 움직일 때
3. 뗐을 때

클릭하면 줌 배율이 증가하고, 특정 배율(150)까지 갔을 때 커서 모양이 변하면서 한 번 더 클릭하면 원래 배율인 100으로 돌아옵니다.

클릭 상태로 움직이면 클릭 했을 때 이미지 노드의 `top`, `left` 값과 `clientX`, `Y`값을 구하고, 움직일 때의 `client`값을 받아 클릭 시의 `client`값을 빼고 `top`, `left`값과 더합니다.

아직 이미지 드래그를 구현하는 것을 다 이해하지는 못 했지만 `stackoverflow`의 은혜로운 글을 보고 만들었습니다...

![view]({{site.baseurl}}/assets/images/post/zoom/zoom02.png)

이미지를 클릭하니 검은 배경에 닫기 버튼이 생겼습니다.

![view]({{site.baseurl}}/assets/images/post/zoom/zoom03.png)

여러 번 클릭하니 확대가 잘 됩니다. 지금은 스크롤 바가 있는 상태이지만 드래그까지 구현했기 때문에 필요없다 하시면 스크롤 비활성화 해도 됩니다.

아래는 `gif`입니다.

![view]({{site.baseurl}}/assets/images/post/zoom/zoom04.gif)
