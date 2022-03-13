---
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2022-01-10 12:30:29 +0900
title:  "[JAVASCRIPT] Solitaire를 만들어 보자 01"
author: Kimson
categories: [ javascript ]
image: assets/images/post/solitaire/solitaire.png
tags: [ game, solitaire, card, tim ]
description: "솔리테어를 만들어 보자 1편

솔리테어는 대부분 컴퓨터에 설치되어 있는 것으로 알고 있습니다. 구글에서 솔리테어를 검색하면 나오는 게임이기도 하구요.

규칙과 카드를 짚거나 하는 등이 꽤 복잡하다고 생각이 듭니다만, 막상 게임을 하나하나 만들어 보니 어려운 작업은 딱히 없었다고 생각 됩니다.

솔리테어를 만들기에 앞서 규칙을 알아야합니다. 해본 사람들은 아실테지만 모르시는 분을 위해 규칙을 아래와 같이 나열해보겠습니다."
featured: false
hidden: false
rating: 4.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# 솔리테어를 만들어 보자 1편

솔리테어는 대부분 컴퓨터에 설치되어 있는 것으로 알고 있습니다. 구글에서 솔리테어를 검색하면 나오는 게임이기도 하구요.

규칙과 카드를 짚거나 하는 등이 꽤 복잡하다고 생각이 듭니다만, 막상 게임을 하나하나 만들어 보니 어려운 작업은 딱히 없었다고 생각 됩니다.

솔리테어를 만들기에 앞서 규칙을 알아야합니다. 해본 사람들은 아실테지만 모르시는 분을 위해 규칙을 아래와 같이 나열해보겠습니다.

## 솔리테어 규칙

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Set_of_playing_cards_52.JPG/800px-Set_of_playing_cards_52.JPG" alt="위키 백과 - 플레잉카드" title="위키 백과 - 플레잉카드">
   <figcaption>[출처] 위키 백과 - 플레잉카드</figcaption>
</span>
</figure>

카드는 트럼프카드를 사용하고 A(Ace) 부터 K(King)까지 각 문양에 맞춰 4 묶음을 차례로 모으는 게임입니다. 총 52장으로 구성되고, `Spade`, `Clover`(Club), `Heart`, `Diamond`로 네 가지 슈트로 구성되어 있습니다.

각 슈트당 13장 씩 다 모아야 게임이 끝나고, 어느정도 끝나게 되는 시점에는 자동완성 기능으로 빨리 끝낼 수도 있습니다.

아래 그림을 보면서 영역에 따른 규칙을 이야기하며 큰 규칙들을 정리하겠습니다.

<figure class="text-center">
<span class="w-inline-block">
   <img class="w-100" src="{{site.baseurl}}/assets/images/post/solitaire/solitaire01.png" alt="Solitaire 형태" title="Solitaire 형태">
   <figcaption>나중에 만들게 될 결과물</figcaption>
</span>
</figure>

1. 초록색 영역은 1장 씩 카드를 뽑는 곳 입니다. 아래 분홍영역을 맞추다가 맞출 카드가 없다면 뽑고, 계속 뽑을 수는 있지만 제일 마지막 뽑은 카드 포함 3개만이 노출됩니다.
2. 주황 영역은 왼쪽부터 `Spades`(♠), `Clubs`(♣), `Hearts`(♥), `Diamonds`(♦)를 쌓아 나갑니다.
3. 분홍 영역은 카드를 순서대로 맞추어 나가는 플레이 영역입니다. (단, 순서대로 카드를 겹칠때 룰이 있습니다.)
   1. k, q, j, 10 ...으로 맞추되 색상이 교차되도록 겹쳐야 합니다.
   2. 카드를 옮길 때 생기는 빈 열(column)에는 `King`만 배치할 수 있습니다.
   3. 분홍영역은 카드가 마지막 패 외에는 뒷면이어야 합니다. 마지막 패를 없애면 자동으로 뒤집히게 하거나 클릭하여 뒤집을 수도 있습니다.
4. 카드를 옮길 때 묶음으로 옮길 수 있습니다. 예를 들면 3(♥), 2(♣), a(♥)은 묶을으로 옮길 수 있고, 색상이 교차되지 않은 3, 2, a의 경우 불가합니다.
5. 카드를 단일로 옮길 수 있습니다.
6. 초록영역에서는 카드를 뺄 수만 있고, 주황영역에 모은 카드는 필요에 따라 분홍영역에 다시 둘 수 있습니다.

기능 구현에 있어서 만들어야 하는 기능은 모두 만들어야 하지만 주요하게 보면 카드를 이동하고 유효성 검토를 관심 있게 해주면 금방 만들 수 있습니다.

## 모양 잡기

위의 모양대로 안하셔도 되고 카드를 밑으로 뽑아도 무관합니다. 저는 이미 만들었던 위의 모양으로 코드를 작성하고 테스트할 예정입니다.

인덱스파일 하나를 만듭니다.

```html
<!DOCTYPE html>
<html lang="ko">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="./src/css/Solitaire.css">
        <script id="inject">
            // 이렇게 넣는 이유는 딱히 없습니다.

            cmt = document.createComment('Code injected By Solitaire');
            js = document.createElement('script');
            js.src = './src/js/Solitaire.js';
            js.type = 'module';
            injection = () => {
                if (document.readyState == 'interactive' && document.body) {
                    cancelAnimationFrame(injection);
                    document.body.append(cmt, js);
                    delete js;
                    delete cmt;
                    delete injection;
                    inject.remove();
                } else {
                    requestAnimationFrame(injection);
                }
            }
            requestAnimationFrame(injection);
        </script>
        <title>Document</title>
    </head>

    <body>
    </body>

</html>
```

그리고 기본적으로 필요한 카드 정보를 아래와 같이 작성합니다.

```javascript
// app.js
/**
 * 모듈 패턴으로 하겠습니다.
 */

(function(){

    function Controller(){
        let models = null;

        this.init = function(model){
            models = model;
        }
    }
    function Model(){
        let views = null;
        let parts = null;

        this.init = function(view){
            views = view;
            parts = views.getParts();
        }
    }
    function View(){
        let parts = null;

        this.init = function(part){
            parts = part;
        }

        this.getParts = function(){
            // model에서 사용하기 위해 getter를 만들었습니다.
            // init할 때 인자로 줘도 됩니다.
            return parts;
        }
    }

    return {
        init() {
            const parts = {
                card: {
                    suits: ['spades', 'clubs', 'hearts', 'diamonds'],
                    shape: {
                        spades:'♠',
                        clubs: '♣',
                        hearts: '♥',
                        diamonds: '♦',
                    },
                    list: new Array(13).fill(0).map((num, idx) => idx + 1),
                    render(card) {
                        const side = card ?.isBack == undefined ? 'empty' : card.isBack ? 'front' : 'back';
                        return `
                            <div class="card ${side}"
                            data-card-id="${card?.id??'-1'}" 
                            data-card-suit="${card?.$suit??'none'}"
                            data-card-deno="${card?.deno??'none'}">
                            </div>
                        `
                    }
                },
            }

            const view = new View();
            const model = new Model();
            const controller = new Controller();

            view.init(parts);
            model.init(view);
            controller.init(model);
        }
    }
})().init();
```

이제부터 컨트롤러와 모델, 뷰의 영역마다 코드를 작성하는 부분을 따로 떼어 하나씩 만들어 나가려합니다.

```javascript
// app.js :: Model

function Model(){
    const cardStock = []; // 카드를 한 장씩 뽑는 덱
    const cardPlaying = Array.from(new Array(7),()=>[]); // 카드를 맞추는 메인 덱
    const cardStack = [[],[],[],[]]; // 카드를 모으는 4가지 슈트 덱

    let views = null;
    let parts = null;

    Model.count = 0; // 카드의 아이디를 부여하기 위한 카운트

    this.init = function (view) {
        views = view;
        parts = views.getParts(); // 파츠 가져오기

        this.cardSettings(); // 카드 시작 세팅
    }

    this.cardSettings = function () {
        this.generateCardSuits(parts.card); // 카드 슈트 52장 생성
        this.shuffleCard(); // 카드 섞기
        this.handOutCard(); // 카드 나누어주기 >> cardPlaying(28) / cardStock(24)
    }

    this.generateCardSuits = function ({
        suits,
        list
    }) {
        [...suits].forEach(type => {
            return [...list].forEach(num => {
                cardStock.push({
                    id: Model.count++,
                    $suit: type, // 속성 이름을 위로 올리기 위해서 $를 붙인 것 뿐입니다.
                    deno: num,
                    shape: parts.card.shape[type],
                    isBack: true,
                    isStaged: false,
                    isSelected: false,
                });
            });
        });
    }

    this.shuffleCard = function () {
        for (let card in cardStock) {
            let random = parseInt(Math.random() * cardStock.length);
            let tmp = cardStock[random];
            cardStock[random] = cardStock[card];
            cardStock[card] = tmp;
        }
    }

    this.handOutCard = function () {
        for (let col = 0; col < 7; col++) {
            for (let row = 0; row <= col; row++) {
                cardPlaying[col].push(cardStock.pop());
            }
        }
    }
}
```

카드를 생성하고 `Play`할 카드를 할당해주었습니다. 카드를 맞추어나가는 플레이 덱에는 7개의 열이 있고, 왼쪽부터 1장 2장 ... 마지막 열 7장 규칙으로 나열 되어야 합니다.

이제 카드가 완성되었으니 view 단을 작성합니다. css는 포스팅 하단에 올려두도록 하겠습니다. 그리고 카드 이미지는 깃허브 저장소의 이미지를 받으시거나 따로 구하셔서 사용해도 됩니다.

```javascript
// app.js :: View

function View() {
    let parts = null;

    this.init = function (part) {
        parts = part;

        this.renderFrames();
    }

    this.renderFrames = function () {
        document.body.insertAdjacentHTML('afterbegin', parts.template.render());
    }

    this.getParts = function () {
        return parts;
    }
}

return {
    init() {
        const parts = {
            card: {
                // ...
            },
            template: { // ++
                render(){
                    const column = `<div class="columns">
                        <div class="card"></div>
                    </div>`;
                    return `
                    <div class="title" style="margin-bottom: 3em; width: 90%;">
                        <div align="center" style="margin-bottom: 1em; font-size: 150%;">Solitaire</div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>
                                <span>Score</span>
                                <span>0</span>
                            </span>
                            <span>
                                <span>Moved</span>
                                <span>0</span>
                            </span>
                            <span>
                                <span>Time</span>
                                <span>0</span>
                            </span>
                        </div>
                    </div>
                    <div id="app">
                        <div class="ground">
                            <div class="row">
                                <div class="stock">
                                    <div class="card back"></div>
                                    <div class="stacking">
                                        <div class="card"></div>
                                    </div>
                                </div>
                                <div class="stack">
                                <div class="card"></div>
                                <div class="card"></div>
                                <div class="card"></div>
                                <div class="card"></div>
                                </div>
                            </div>
                            <div class="row">
                                ${new Array(7).fill(column).join('')}
                            </div>
                        </div>
                    </div>
                    `;
                }
            }
        }
        // ... inits
    }
}
```

<figure class="text-center">
<span class="w-inline-block">
   <img class="w-100" src="{{site.baseurl}}/assets/images/post/solitaire/solitaire02.png" alt="틀" title="틀">
   <figcaption>구현된 틀</figcaption>
</span>
</figure>

이번 기록은 여기까지 입니다. 양이 많을 것 같아서 포스팅을 쪼개어 작성합니다.

다음 포스팅에서는 3가지를 다룰 예정입니다.

1. 카드 출력
2. 카드 한 장씩 뽑기
3. 카드 모으기

아래는 적용한 `css`입니다.

-----

```css
:root {
    --scard-width: 40px;
    --scard-height: calc(var(--scard-width) * 1.4);
    --scard-gap: 0rem;
}

@media (min-width: 768px) {
    :root{
        --scard-width: 70px;
        --scard-height: calc(var(--scard-width) * 1.445);
        --scard-gap: 1rem;
    }
}

/*
    저는 css reset을 사용했습니다.
*/

* {
    box-sizing: border-box;
}

html,
body {
    height: 100%;
}

body {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: url('../img/background.jpg');
    background-size: cover;
    background-origin: center center;
    background-repeat: no-repeat;
}

.title{
    font-weight: bold;
    color: white;
    font-size: 120%;
    text-transform: capitalize;
}

.restart{
    border: none;
    cursor: pointer;
    color: white;
    margin-left: 2em;
    font-weight: bold;
    padding: .3rem .6rem;
    background-color:rgb(147, 65, 255);
    border-radius: .3rem;
    -webkit-border-radius: .3rem;
    -moz-border-radius: .3rem;
    -ms-border-radius: .3rem;
    -o-border-radius: .3rem;
}

#app {
    max-width: 900px;
    width: 100%;
    height: 30em;
    padding: 1em;
    background-image: url('../img/ground.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 1em;
    -webkit-border-radius: 1em;
    -moz-border-radius: 1em;
    -ms-border-radius: 1em;
    -o-border-radius: 1em;
    border: 10px groove rgb(182, 86, 48);
    box-shadow: 0 0 1rem 0 rgba(0 0 0 / 50), inset 0 0 1rem 0 rgba(0 0 0 / 50);
}

#success{
    font-size: 5rem;
    line-height: 1.5;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1500;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
}

#success .restart{
    font-size: 3rem;
    margin-left: 0;
}

#success>:not(:nth(3)-child){
    font-weight: bold;
}

#app .ground {
    /* background-color: black; */
    width: 100%;
    /* height: 100%; */
    --scard-gap: 1em !important;
    display: flex;
    flex-direction: column;
    gap: var(--scard-gap);
}

#app .ground .row {
    /* background-color: red; */
    display: flex;
    gap: var(--scard-gap);
}

#app .ground .row:first-child {
    flex: 0 0 auto;
    min-height: 100px;
    height: 20%;
    flex-direction: column;
}

#app .ground .row:last-child {
    flex: 1 1 0%;
    min-height: 250px;
    height: auto;
    justify-content: space-around;
}

#app .ground .row .stock,
#app .ground .row .play,
#app .ground .row .stack {
    /* background-color: coral; */
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0.3rem;
}

#app .ground .row .play {
    justify-content: space-around;
    gap: var(--scard-gap);
    width: 100%;
}

#app .ground .row .stack{
    justify-content: space-around;
    --scard-gap: 1rem;
    gap: var(--scard-gap);
}

#app .ground .row .stock,
#app .ground .row .stack {
    width: 100%;
}

@media (min-width: 768px) {
    #app .ground .row:first-child {
        flex: 0 0 auto;
        min-height: 120px;
        flex-direction: row;
    }

    #app .ground .row .stock {
        width: 30%;
    }

    #app .ground .row .stack {
        width: 70%;
    }
}

#app .ground .row .card {
    cursor: pointer;
    width: var(--scard-width);
    height: var(--scard-height);
    background-color: white;
    border-radius: .3rem;
    -webkit-border-radius: .3rem;
    -moz-border-radius: .3rem;
    -ms-border-radius: .3rem;
    -o-border-radius: .3rem;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);
    position: relative;
    transition: 200ms ease-in-out;
    -webkit-transition: 200ms ease-in-out;
    -moz-transition: 200ms ease-in-out;
    -ms-transition: 200ms ease-in-out;
    -o-transition: 200ms ease-in-out;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

#app .ground .row .card::before {
    display: flex;
    justify-content: center;
    align-items: center;
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    -webkit-border-radius: inherit;
    -moz-border-radius: inherit;
    -ms-border-radius: inherit;
    -o-border-radius: inherit;
    pointer-events: none;
}

@keyframes show {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

#app .ground .row .card:hover::before {
    box-shadow: 0 0 0 5px rgb(157, 104, 255);
    animation: show 200ms ease-in-out both;
    -webkit-animation: show 200ms ease-in-out both;
    pointer-events: none;
}

#app .ground .row .card.active {
    box-shadow: 0 0 0.5rem 5px rgba(0, 0, 0, 0.5);
    animation: 150ms pick ease-in-out both;
    -webkit-animation: 150ms pick ease-in-out both;
}

#app .ground .row .card.active::before {
    content: '✅';
    box-shadow: 0 0 0 3px rgb(157, 104, 255);
    background-color: rgba(255, 255, 255, 0.5);
    pointer-events: none;
}

#app .ground .row .card.active:hover::before{
    animation: none;
    -webkit-animation: none;
}

@keyframes pick {
    0%{ transform:scale(1) ; -webkit-transform:scale(1) ; -moz-transform:scale(1) ; -ms-transform:scale(1) ; -o-transform:scale(1) ; }
    100%{ transform:scale(1.1) ; -webkit-transform:scale(1.1) ; -moz-transform:scale(1.1) ; -ms-transform:scale(1.1) ; -o-transform:scale(1.1) ; }
}

.stacking{
    position: relative;
    margin-left: 0.5rem;
}

.stacking .card{
    position: absolute !important;
}

.columns{
    position: relative;
    width: var(--scard-width);
}

.columns .card{
    position: absolute !important;
}

.card.back{
    background-image: url('../img/back.png') !important;
}

.card.active{
    transform: scale(1.1);
    -webkit-transform: scale(1.1);
    -moz-transform: scale(1.1);
    -ms-transform: scale(1.1);
    -o-transform: scale(1.1);
}

.card.stop{
    opacity: 0.5;
    border: 3px dashed rgba(0, 0, 0, 1);
}
```

-----

📚 함께 보면 좋은 내용

[DevKimson::[JAVASCRIPT] Solitaire를 만들어 보자 02]({{site.baseurl}}/javascript-solitaire02){:target="_blank"}

[DevKimson::[JAVASCRIPT] Solitaire를 만들어 보자 03]({{site.baseurl}}/javascript-solitaire03){:target="_blank"}

[위키백과::플레잉카드](https://ko.wikipedia.org/wiki/%ED%94%8C%EB%A0%88%EC%9E%89_%EC%B9%B4%EB%93%9C){:target="_blank"}

[위키백과::솔리테어](https://ko.wikipedia.org/wiki/%EC%86%94%EB%A6%AC%ED%85%8C%EC%96%B4){:target="_blank"}