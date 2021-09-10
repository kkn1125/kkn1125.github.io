---
layout: post
date:   2021-09-10 19:07:12 +0900
title:  "[JAVASCRIPT] 수평 사이즈 조절 바 구현하기"
author: Kimson
categories: [ TIL, JAVASCRIPT ]
tags: [resize, horizental]
image: assets/images/post/covers/TIL-javascript.png
description: ""
featured: true
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: false
keywords: ""
---

# 수평 사이즈 조절

오늘 리트코드를 시작하다가 수평으로 왔다갔다 할 수 있는 조절바가 눈에 들어왔습니다.

물론 프로그래머스나 문서화 페이지들을 보면 많이 보이지만 문득 만들어 보고 싶다는 생각이 스쳐서 만들게 됐습니다.

## 구조 잡기

자세히 뜯어보지는 않았지만 대략 flex를 사용하는 것을 보고 `wrapper` `div`안에 3개의 `div`를 더 만듭니다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div class="d-flex h-100">
            <div class="window_module overflow-hidden" data-window-num="1">
                <div class="h-100 overflow-auto">
                    ...
                </div>
            </div>
            <div id="resize" class="window_module" data-window-num="2">
                <span class="point"></span>
                <span class="point"></span>
                <span class="point"></span>
            </div>
            <div class="window_module" data-window-num="3">
                <div class="container h-100 overflow-auto">
                    ...
                </div>
            </div>
        </div>
</body>
</html>
```

구성은 세 가지 입니다. 겉으로 한번 감싸고 3개의` div`를 생성하여 `window_module1, 3`이 양측 뷰, `window_module2`가 리사이즈 바가 됩니다.

## 스타일 설정

```css
body{
    padding-top: 56px;
    height: 100vh;
}

.window_module:nth-child(1){
    max-width: 800px;
    flex: 0 0 300px;
}
.window_module:nth-child(3){
    flex: 0 1 100%;
    width: 100%;
}
.window_module:nth-child(2){
    width: 0.7rem;
    max-width: 0.7rem;
    min-width: 0.7rem;
    border: 1px solid rgba(0,0,0,.05);
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
    cursor: col-resize;
    background-color: rgba(0, 0, 0, 0.041);
    border: 1px solid rgba(0, 0, 0, 0.082);
    z-index: 1000;
}
.window_module:nth-child(2) .point{
    width: .35rem;
    height: .35rem;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
    display: inline-block;
    margin: 0.2rem 0;
    background-color: rgba(0, 0, 0, 0.5);
}
```

css는 간단하게 작성했습니다. 저는 참고로 부트스트랩도 당겨왔습니다.

## 기능 구현

```javascript
/**
 * 기능은 간단합니다.
 * 먼저 클릭을 감지하고 클릭한 채로 드래그할 때 드래그를 활성화 합니다.
 * 클릭을 떼는 순간 드래그를 비활성화합니다.
 * 
 * 드래그 활성화 시 리사이즈 바가 움직입니다.
 * 이때 실질적으로 속성이 변하는 것은 리사이즈 바가 아닌 window_1의
 * 너비가 변경됩니다.
 */
const RESIZE = document.getElementById('resize');
const window_1 = document.querySelector('[data-window-num="1"]');
const sizeLimit = 300;
let click = false;
```

사용할 태그는 두 가지이고 사이즈 제한 설정과 클릭 여부만 있으면 됩니다.

```javascript
RESIZE.addEventListener('mousedown', mouseDownHandler);
window.addEventListener('mousemove', mouseMoveHandler);
window.addEventListener('mouseup', mouseUpHandler);
```

구현할 핸들러들은 3개 입니다.  
`mousedown`은 `RESIZE`노드 대상으로 해서 조절바 영역 외에서 작동을 방지하기 위해서 입니다. `mousemove`는 `window`대상으로 마우스 위치가 `window_1`의 너비에 적용이 되야하기 때문입니다.
`mouseup`은 `window`대상으로 어디서든 조절이 끝났을 때 클릭을 초기화 하기 위함입니다.

```javascript
let mouseDownHandler = function(ev){
    ev.preventDefault();
    click = true;
}
let mouseUpHandler = function(ev){
    ev.preventDefault();
    click = false;
}
let mouseMoveHandler = function(ev){
    ev.preventDefault();
    if(click){
        let value = ev.screenX-7;
        if(value<=20){
            window_1.style.cssText = `flex: 0 0 0px;`
        } else {
            !(20< value && value < sizeLimit)?
            window_1.style.cssText = `flex: 0 0 ${value}px;`:
            window_1.style.cssText = `flex: 0 0 ${sizeLimit}px;`;
        }
    }
}
```

`click`이 `true`일 때 실행 되고 드래그 중이면 `ev.screenX`값을 받아 조절바의 너비 절반을 뺀 값을 변수에 저장합니다.

`value`가 20이하이면 `window_1`이 완전 닫힌 형태가 됩니다. `value`가 20초과일 때는 20이하 또는 300이상일 때 `window_1`의 너비에 드래그 중인 `X`값을 적용하게 되고, 20에서 300사이 드래그라면 300으로 고정하여 더이상 축소되지 않는 효과를 구현합니다.

-----

> 아래는 적용의 예제입니다. 반응형 설정을 하지 않았기 때문에 PC버전에서 보시는 것을 권장합니다.
> 화면의 드래그 위치에 영향을 받기 때문에 아래에 있는 예제는 삽입된 것이기 때문에 리사이즈 범위가 오작동 할 수 있습니다.

<div id="exsize" class="container">
    <style>
    .window_module:nth-child(1){
        max-width: 800px;
        flex: 0 0 300px;
    }
    .window_module:nth-child(3){
        flex: 0 1 100%;
        width: 100%;
    }
    .window_module:nth-child(2){
        width: 0.7rem;
        max-width: 0.7rem;
        min-width: 0.7rem;
        border: 1px solid rgba(0,0,0,.05);
        display: flex;
        flex-flow: column wrap;
        justify-content: center;
        align-items: center;
        cursor: col-resize;
        background-color: rgba(0, 0, 0, 0.041);
        border: 1px solid rgba(0, 0, 0, 0.082);
        z-index: 1000;
    }
    .window_module:nth-child(2) .point{
        width: .35rem;
        height: .35rem;
        border-radius: 50%;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        -ms-border-radius: 50%;
        -o-border-radius: 50%;
        display: inline-block;
        margin: 0.2rem 0;
        background-color: rgba(0, 0, 0, 0.5);
    }
    </style>
    <div class="d-flex" style="height: 500px; max-width: 100%">
        <div class="window_module overflow-hidden" data-window-num="1">
            <div class="overflow-auto">
                <nav id="navbar-example3" class="navbar navbar-light bg-light flex-column align-items-stretch p-3"
                    style="width: 300px;">
                    <a class="navbar-brand" href="#">Navbar</a>
                    <nav class="nav nav-pills flex-column">
                        <a class="nav-link" href="#item-1">Item 1</a>
                        <nav class="nav nav-pills flex-column">
                            <a class="nav-link ms-3 my-1" href="#item-1-1">Item 1-1</a>
                            <a class="nav-link ms-3 my-1" href="#item-1-2">Item 1-2</a>
                        </nav>
                        <a class="nav-link" href="#item-2">Item 2</a>
                        <a class="nav-link" href="#item-3">Item 3</a>
                        <nav class="nav nav-pills flex-column">
                            <a class="nav-link ms-3 my-1" href="#item-3-1">Item 3-1</a>
                            <a class="nav-link ms-3 my-1" href="#item-3-2">Item 3-2</a>
                        </nav>
                    </nav>
                </nav>
            </div>
        </div>
        <div id="resize" class="window_module" data-window-num="2">
            <span class="point"></span>
            <span class="point"></span>
            <span class="point"></span>
        </div>
        <div class="window_module" data-window-num="3">
            <div class="container-fluid h-100 overflow-auto">
                <div data-bs-spy="scroll" data-bs-target="#navbar-example3" data-bs-offset="0" tabindex="0">
                    <h4 id="item-1">Item 1</h4>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id totam nihil enim dolore? Minima
                        beatae eligendi voluptas eius consequatur facilis quidem natus omnis architecto commodi sed
                        incidunt obcaecati, in perspiciatis itaque laudantium suscipit voluptates nulla asperiores
                        non ad nisi. Pariatur consequatur quam voluptatum enim adipisci libero itaque blanditiis
                        perspiciatis provident dolore! Blanditiis excepturi expedita voluptatibus, quaerat illum
                        sint quas, iure accusamus repellat, culpa nobis quis ipsum possimus eum. Exercitationem ipsa
                        doloribus itaque ducimus dignissimos provident molestias dolor pariatur. Dolore voluptas
                        itaque dolores quam quisquam. Placeat esse exercitationem vero quibusdam sint, dolorum non!
                        Quis explicabo aspernatur doloremque eos. Cum, vero soluta.</p>
                    <h5 id="item-1-1">Item 1-1</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, minus. Aperiam nostrum,
                        velit animi esse mollitia sunt fuga aliquid repudiandae! Voluptatum, sit repellendus.
                        Numquam impedit at tempore dolor sit enim porro voluptate exercitationem hic saepe molestias
                        modi neque dolorem natus similique perspiciatis, molestiae eligendi incidunt vel qui! A
                        magnam tenetur quae ex neque dolorem, architecto corporis sit ab laborum nostrum eligendi
                        adipisci ea totam sequi minima impedit doloribus. Ipsam doloremque eligendi labore suscipit
                        tempora. Nihil, incidunt, ut ea velit quisquam ipsa provident et architecto, nesciunt
                        placeat est officiis quod. Quia et dignissimos id assumenda dolorum illo cupiditate nam
                        totam ea?</p>
                    <h5 id="item-1-2">Item 1-2</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, minus. Aperiam nostrum,
                        velit animi esse mollitia sunt fuga aliquid repudiandae! Voluptatum, sit repellendus.
                        Numquam impedit at tempore dolor sit enim porro voluptate exercitationem hic saepe molestias
                        modi neque dolorem natus similique perspiciatis, molestiae eligendi incidunt vel qui! A
                        magnam tenetur quae ex neque dolorem, architecto corporis sit ab laborum nostrum eligendi
                        adipisci ea totam sequi minima impedit doloribus. Ipsam doloremque eligendi labore suscipit
                        tempora. Nihil, incidunt, ut ea velit quisquam ipsa provident et architecto, nesciunt
                        placeat est officiis quod. Quia et dignissimos id assumenda dolorum illo cupiditate nam
                        totam ea?</p>
                    <h4 id="item-2">Item 2</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, minus. Aperiam nostrum,
                        velit animi esse mollitia sunt fuga aliquid repudiandae! Voluptatum, sit repellendus.
                        Numquam impedit at tempore dolor sit enim porro voluptate exercitationem hic saepe molestias
                        modi neque dolorem natus similique perspiciatis, molestiae eligendi incidunt vel qui! A
                        magnam tenetur quae ex neque dolorem, architecto corporis sit ab laborum nostrum eligendi
                        adipisci ea totam sequi minima impedit doloribus. Ipsam doloremque eligendi labore suscipit
                        tempora. Nihil, incidunt, ut ea velit quisquam ipsa provident et architecto, nesciunt
                        placeat est officiis quod. Quia et dignissimos id assumenda dolorum illo cupiditate nam
                        totam ea?</p>
                    <h4 id="item-3">Item 3</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, minus. Aperiam nostrum,
                        velit animi esse mollitia sunt fuga aliquid repudiandae! Voluptatum, sit repellendus.
                        Numquam impedit at tempore dolor sit enim porro voluptate exercitationem hic saepe molestias
                        modi neque dolorem natus similique perspiciatis, molestiae eligendi incidunt vel qui! A
                        magnam tenetur quae ex neque dolorem, architecto corporis sit ab laborum nostrum eligendi
                        adipisci ea totam sequi minima impedit doloribus. Ipsam doloremque eligendi labore suscipit
                        tempora. Nihil, incidunt, ut ea velit quisquam ipsa provident et architecto, nesciunt
                        placeat est officiis quod. Quia et dignissimos id assumenda dolorum illo cupiditate nam
                        totam ea?</p>
                    <h5 id="item-3-1">Item 3-1</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, minus. Aperiam nostrum,
                        velit animi esse mollitia sunt fuga aliquid repudiandae! Voluptatum, sit repellendus.
                        Numquam impedit at tempore dolor sit enim porro voluptate exercitationem hic saepe molestias
                        modi neque dolorem natus similique perspiciatis, molestiae eligendi incidunt vel qui! A
                        magnam tenetur quae ex neque dolorem, architecto corporis sit ab laborum nostrum eligendi
                        adipisci ea totam sequi minima impedit doloribus. Ipsam doloremque eligendi labore suscipit
                        tempora. Nihil, incidunt, ut ea velit quisquam ipsa provident et architecto, nesciunt
                        placeat est officiis quod. Quia et dignissimos id assumenda dolorum illo cupiditate nam
                        totam ea?</p>
                    <h5 id="item-3-2">Item 3-2</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, minus. Aperiam nostrum,
                        velit animi esse mollitia sunt fuga aliquid repudiandae! Voluptatum, sit repellendus.
                        Numquam impedit at tempore dolor sit enim porro voluptate exercitationem hic saepe molestias
                        modi neque dolorem natus similique perspiciatis, molestiae eligendi incidunt vel qui! A
                        magnam tenetur quae ex neque dolorem, architecto corporis sit ab laborum nostrum eligendi
                        adipisci ea totam sequi minima impedit doloribus. Ipsam doloremque eligendi labore suscipit
                        tempora. Nihil, incidunt, ut ea velit quisquam ipsa provident et architecto, nesciunt
                        placeat est officiis quod. Quia et dignissimos id assumenda dolorum illo cupiditate nam
                        totam ea?</p>
                </div>
            </div>
        </div>
    </div>
    <script>
    'use strict';
    let plus = 200;
    console.log(plus)
    const RESIZE = document.getElementById('resize');
    const window_1 = document.querySelector('[data-window-num="1"]');
    const sizeLimit = 300;
    // const window_3 = document.querySelector('[data-window-num="3"]');
    let click = false;
    let mouseDownHandler = function(ev){
        ev.preventDefault();
        click = true;
    }
    let mouseMoveHandler = function(ev){
        ev.preventDefault();
        if(click){
            let value = ev.screenX-7+plus;
            if(value<=20){
                window_1.style.cssText = `flex: 0 0 0px; max-width: 80%`
            } else {
                !(20< value && value < sizeLimit)?
                window_1.style.cssText = `flex: 0 0 ${value}px; max-width: 80%`:
                window_1.style.cssText = `flex: 0 0 ${sizeLimit}px; max-width: 80%`;
            }
        }
    }
    let mouseUpHandler = function(ev){
        ev.preventDefault();
        click = false;
    }
    RESIZE.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', mouseUpHandler);
    </script>
</div>