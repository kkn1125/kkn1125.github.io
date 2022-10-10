---
slug: "/javascript-solitaire02/"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2022-01-10 15:42:05 +0900
title:  "[JAVASCRIPT] Solitaire를 만들어 보자 02"
author: Kimson
categories: [ javascript ]
image: /images/post/solitaire/solitaire03.png
tags: [ game, solitaire, card, tim ]
description: "솔리테어를 만들어 보자 2편

이전 편에 틀을 잡고 끝냈습니다. 이 다음은 저번 편에서 마지막 줄에 알려드린 카드 출력과 뽑기, 모으기를 구현하려합니다.

카드를 뽑고 모으고 출력하기만 하면 이제 규칙을 만들어 제어만 하면 완성이 됩니다.

이전에 만들었던 코드를 정제하면서 기록하려하니 시간이 배로 걸리는 느낌이 들지만 하나하나 만들어 봅시다."
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

# 솔리테어를 만들어 보자 2편

이전 편에 틀을 잡고 끝냈습니다. 이 다음은 저번 편에서 마지막 줄에 알려드린 카드 출력과 뽑기, 모으기를 구현하려합니다.

카드를 뽑고 모으고 출력하기만 하면 이제 규칙을 만들어 제어만 하면 완성이 됩니다.

이전에 만들었던 코드를 정제하면서 기록하려하니 시간이 배로 걸리는 느낌이 들지만 하나하나 만들어 봅시다.

## 카드 3가지 기능

> 이전 코드와 다른 코드가 있습니다. 표시해두었으니 참고바랍니다.

카드 정보를 이전에 작성 해둬서 출력하는데는 무리가 없을 것입니다. 템플릿 형태로 `render`함수를 만들어 사용하기 때문에 정보만 있으면 다양한 형태로 출력가능하게 됩니다.

```javascript
// app.js :: Controller
function Controller () {
    this.init = function(){
        // ...
    
        window.addEventListener('click', this.cardDraw); // ++
        // 카드 뽑기
        window.addEventListener('click', this.cardCollect); // ++
        // 카드 모으기
    }
    
    this.cardRender = function () { // ++
        // 카드를 렌더링하는 메서드입니다.
        models.cardRender();
    }
    
    this.cardCollect = function (ev) { // ++
        // 카드를 모으는 메서드입니다.
        const target = ev.target;
        if(!target.classList.contains('front')) return; // 클래스가 프론트가 아니면
        if(!target.parentNode.classList.contains('stacking') || target.parentNode.lastElementChild != target) return; // 부모가 stacking 클래스가 아니거나 마지막 요소가 아니라면
        // 함수를 멈춥니다.
    
        models.cardCollect(target); // model에 위임합니다.
    }
    
    this.cardDraw = function (ev) { // ++
        const target = ev.target;
        if(!target.classList.contains('card') || !target.parentNode.classList.contains('stock')) return;
        // 타겟이 card 또는 타겟의 부모가 stock클래스를 가지지 않으면 멈춥니다.
        // 카드이고 부모가 스톡이어야 실행하도록 합니다.
    
        models.cardDraw(target); // model에 위임합니다.
    }
}
```

이벤트를 등록했습니다. 둘 다 클릭이벤트이고, 카드를 뽑을 때 한 장씩 출력해주는 기능과 앞으로 나열된 카드 중 곧바로 카드를 모을 수 있을 때 stack에 올려버리는 기능입니다.

`cardRender`는 모든 메서드들이 작동하고나서 공통으로 실행되도록 함수를 별도 만들려합니다.

1. `stock`수정 -> `cardRender`
2. `stack`수정 -> `cardRender`
3. `playing`수정 -> `cardRender`

`cardRender`는 `stack`, `stock`, `playing` 영역을 모두 다시 렌더하게 됩니다.

```javascript
// app.js :: Model

function Model(){
    // ... init

    this.generateCardSuits = function ({
        suits,
        list
    }) {
        [...suits].forEach(type => {
            return [...list].forEach(num => {
                cardStock.push({
                    id: Model.count++,
                    $suit: type,
                    deno: num,
                    $parent: cardStock, // ++
                    imgSuit: num>10?type+2:type, // ++
                    imgNum: num==1?'ace':num==11?'jack':num==12?'queen':num==13?'king':num, // ++
                    shape: parts.card.shape[type],
                    isBack: true,
                    isStaged: false,
                    isSelected: false,
                });
            });
        });
    }

    this.handOutCard = function () {
        for (let col = 0; col < 7; col++) {
            for (let row = 0; row <= col; row++) {
                // cardPlaying[col].push(cardStock.pop()); --
                const last = cardStock.pop(); // ++
                cardPlaying[col].push(last); // ++
                last.$parent = cardPlaying; // ++
                last.isStaged = true; // ++
            }
            cardPlaying[col].slice(-1).pop().isBack = false;
        }
    }

    this.cardRender = function () { // ++
        views.cardRender(cardStock, cardPlaying, cardStack);
    }

    this.cardCollect = function (elCard) { // ++
        const card = this.findCard(elCard); // findCard메서드로 카드 정보를 찾아 반환합니다.
        let getCard;

        if(!this.validNextCard(card)) return;
        
        if(card.$parent[0] instanceof Array){
            for(let col of card.$parent){
                for(let row of col){
                    if(row == card){
                        getCard = col.splice(card.$parent.indexOf(card), 1).pop();
                        break;
                    }
                }
            }
        } else {
            getCard = card.$parent.splice(card.$parent.indexOf(card), 1).pop();
        }
        
        card.$parent = cardStack;
        cardStack[parts.card.suits.indexOf(card.$suit)].push(getCard);
        this.cardRender();
    }

    // 모인 카드 중 마지막 카드 다음의 카드에 적합한지 판별
    this.validNextCard = function(card){ // ++
        if(card.deno == 1) return true;
        else if(card.deno == cardStack[parts.card.suits.indexOf(card.$suit)]?.slice(-1)?.pop()?.deno+1) return true;
    }

    // 카드를 한 장 뽑습니다.
    this.cardDraw = function (elStock) { // ++
        const notStaged = cardStock.filter(s=>!s.isStaged);
        for(let card in notStaged){
            if(card == notStaged.length-1){
                notStaged[card].isStaged = true;
                notStaged[card].isBack = false;
            }
        }

        this.cardRender();
    }

    this.findCard = function (card) { // ++
        return [].concat([...cardStock],[].concat(...cardStack),[].concat(...cardPlaying)).filter(c=>c.id == card.dataset.cardId).pop();
    }
}
```

### 카드 모으기 메서드 cardCollect

`cardCollect`메서드는 선택한 카드 요소를 데이터에서 찾아 모을 수 있는 카드인지 판별하고 카드를 모읍니다. 이때 `validNextCard`메서드로 카드 넘버가 1 또는 마지막으로 모은 카드보다 `denomination(deno)`이 1 높다면 `true`를 반환합니다. `cardCollect`에서 `validNextCard`가 통과되면 `stack`, `playing`은 2차, `stock`은 1차 배열이기 때문에 분기문으로 카드를 뽑는 방식을 달리하고, 카드가 속한 부모 배열에서 해당 카드를 뽑아 `stack`배열에 해당하는 `suit`로 `push`하게 됩니다.

이전에 만들었던 솔리테어의 카드 옮기기 방식은 `temp`변수를 만들어 이동시켰는데 생각해보니 변수를 만들 필요가 없다는 생각이 들어 변경하였습니다. 변수를 만들지 않고 객체의 속성을 이용해서 `parent`를 두면 더 이용에 폭이 넓어진다고 생각합니다.

### 카드 뽑기 메서드 cardDraw

`cardDraw`는 카드의 `isStaged`속성을 이용해 구분합니다. `isStaged`가 `true`이면 뽑은 카드, 아니면 아직 뽑지 않은 카드입니다.

`cardDraw`의 `notStaged`는 뽑지 않은 카드 중 마지막 카드를 뒤집고 `staged`를 `true`로 변경하면서 카드를 뽑는 기능을 하게 됩니다. 이렇게 되면 뒤에서부터 차례로 `staged`되고 카드를 뽑는 형태가 됩니다.


이제 카드의 정보 조작은 완료되었으니 출력 단계입니다. 코드가 이전 편과 달라진 점이 있으니 포스팅 하단의 `return`부분을 참고하시기 바랍니다.

```javascript
function View() {
    let parts = null;
    let options = null; // ++
    let elStock = null; // ++
    let elStack = null; // ++
    let elColumns = null; // ++

    // ... init, getparts

    this.renderFrames = function () {
        // document.body.insertAdjacentHTML('afterbegin', parts.template.render());
        document.body.insertAdjacentHTML('afterbegin', parts.template.frame.render()); // ++
        document.body.insertAdjacentHTML('afterbegin', parts.template.option.render()); // ++

        options = document.querySelector('.title'); // ++
        elStock = document.querySelector('.stock'); // ++
        elStack = document.querySelector('.stack'); // ++
        elColumns = document.querySelector('.ground .row:last-child'); // ++

        elStack.insertAdjacentHTML('beforeend', parts.template.stack.render()); // ++
        elColumns.insertAdjacentHTML('beforeend', parts.template.play.render()); // ++
    }

    this.cardDraw = function (cardStock) { // ++
        this.clearStock(elStock);
        const staged = cardStock.filter(s=>s.isStaged);
        const notStaged = cardStock.filter(s=>!s.isStaged);
        staged.reverse().forEach((s, idx)=>{
            elStock.querySelector('.stacking').insertAdjacentHTML('beforeend', parts.card.render(s));
        });

        [...elStock.querySelector('.stacking').children].slice(1).slice(-3).forEach((el, idx)=>{
            el.style.left = (idx*30)+'px';
        });

        if(notStaged.length==0) elStock.firstElementChild.classList.add('stop')
    }

    this.cardCollect = function (cardStack) { // ++
        this.clearStack(elStack);
        cardStack.forEach(stack=>{
            stack.forEach((s, idx)=>{
                [...elStack.children][parts.card.suits.indexOf(s.$suit)].insertAdjacentHTML('beforeend', parts.card.render(s));
            });
        });
    }

    this.cardPlaying = function (cardPlay) { // ++
        this.clearPlaying(elColumns);
        for(let col in cardPlay){
            for(let row in cardPlay[col]){
                [...elColumns.children][col].insertAdjacentHTML('beforeend', parts.card.render(cardPlay[col][row]));
                [...elColumns.children][col].lastElementChild.style.top = row*20+'px';
            }
        }
    }

    this.cardRender = function (cardStock, cardPlay, cardStack) { // ++
        this.cardPlaying(cardPlay);
        this.cardCollect(cardStack);
        this.cardDraw(cardStock); 
    }

    this.clearPlaying = function (el) { // ++
        el.innerHTML = parts.template.play.render();
    }

    this.clearStack = function (el) { // ++
        el.innerHTML = parts.template.stack.render();
    }

    this.clearStock = function (el) { // ++
        el.innerHTML = parts.template.stock.render();
    }
}
```

카드의 속성추가로 `return`할때 몇가지 달라진 점이 있습니다. `renderFrames`메서드가 기존에 단일 템플릿을 출력하던 부분이 여러 개로 나뉘어 렌더됩니다. 렌더 후에는 `el*`변수에 엘레멘트가 할당됩니다.

`cardDraw`는 `Model`에서 `isStaged`가 변경된 `cardStock`을 받습니다. `clearStock`으로 `view`를 초기화 시키고 `staged`배열을 역순으로 출력시키고 출력된 요소에 `left` 스타일 속성을 줘서 카드가 겹치면서 이격되도록 합니다.

나중에 카드가 다 소진되었을 때를 준비해서 모든 카드가 `staged`되면 `stop`클래스를 부여하도록 합니다. `stop`클래스가 부여되면 `css`로 `pointer-events`를 `none`하거나 아까 만들었던 `controller`영역에서 `stop`클래스를 필터합니다. 이미 `card`와 `front`만 선별하므로 따로 필터 작업은 이렇게 따라오셨다면 안하셔도 됩니다.

`cardCollect`도 `Model`에서 처리된 `cardStack`을 받습니다. 똑같이 `clear`메서드로 초기화하고 `cardStack`을 순회해서 컬럼을 얻고 컬럼을 순회해서 카드의 `suit`정보로 스택되는 컬럼의 인덱스를 찾아 `insert`합니다.

`cardPlaying`메서드도 `cardCollect`와 마찬가지로 컬럼을 순회해서 해당 영역을 렌더하고 `cardDraw`와 같이 `top` 스타일을 증가시켜 위에서 아래로 겹치도록 합니다.

앞서 말씀드린 `cardRender`메서드로 모든 영역을 하나의 메서드로 렌더링하도록 묶습니다.

`Model`영역에서 데이터 변화가 있는 메서드에서는 모두 `models.cardRender`로 호출하여 `view`를 계속 업데이트 합니다.

<figure class="text-center">
<span class="w-inline-block">
   <img class="w-100" src="/images/post/solitaire/solitaire03.png" alt="결과물" title="결과물">
   <figcaption>현재까지 결과물</figcaption>
</span>
</figure>

여기까지 위 이미지처럼 ace부터 차례로 해당 위치에 스택된다면 성공입니다.

카드를 뽑으면 하나 씩 밀리면서 최대 3장만 보여야합니다.

여기까지 읽어주셨다면 감사드릴 따름입니다😁

다음 포스팅 3편에서는 아래의 3가지를 구현할 예정입니다.

1. 카드 이동 (묶음/단일)
2. 솔리테어 규칙 적용
3. 자동 카드 뒤집기

아래는 모듈 패턴의 `init`함수의 바뀐 부분입니다. 참고 바랍니다.

-----

```javascript
(function(){
    // Controller, Model, View ...
    return {
        init() {
            const parts = {
                card: {
                    // suit, shape
                    list: new Array(13).fill(0).map((num, idx) => idx + 1),
                    render(card) {
                        const side = card ?.isBack == undefined ? 'empty' : card.isBack ? 'back' : 'front';
                        return `
                            <div class="card ${side}"
                            data-card-id="${card?.id??'-1'}" 
                            data-card-suit="${card?.$suit??'none'}"
                            data-card-deno="${card?.deno??'none'}"
                            style="background-image: url('./src/img/${card.imgNum}_of_${card.imgSuit}.png')">
                            </div>
                        ` // ++ img 가 추가 되었습니다.
                    }
                },
                template: {
                    // ++ 기존 template의 score 등의 부분 분리
                    option: {
                        render(){
                            return `<div class="title" style="margin-bottom: 3em; width: 90%;">
                            <div align="center" style="margin-bottom: 1em; font-size: 150%;">Solitaire</div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>
                                    <span>Score</span>
                                    <span class="score">0</span>
                                </span>
                                <span>
                                    <span>Moved</span>
                                    <span class="moved">0</span>
                                </span>
                                <span>
                                    <span>Time</span>
                                    <span class="time">0</span>
                                </span>
                            </div>
                        </div>`;
                        }
                    },
                    // ++ ground내의 stock부분 분리
                    stock: {
                        render(){
                            return `
                            <div class="card back"></div>
                            <div class="stacking">
                                <div class="card"></div>
                            </div>
                            `;
                        }
                    },
                    // ++ ground내의 stack부분 분리
                    stack: {
                        render(){
                            return `
                            <div class="stacking">
                                <div class="card"></div>
                            </div>
                            <div class="stacking">
                                <div class="card"></div>
                            </div>
                            <div class="stacking">
                                <div class="card"></div>
                            </div>
                            <div class="stacking">
                                <div class="card"></div>
                            </div>
                            `;
                        }
                    },
                    // ++ ground내의 play부분 분리
                    play: {
                        render(){
                            const column = `<div class="stacking">
                                <div class="card"></div>
                            </div>`;
                            return new Array(7).fill(column).join('');
                        }
                    },
                    // ++ ground내의 틀부분 분리
                    frame: {
                        render(){
                            return `
                            <div id="app">
                                <div class="ground">
                                    <div class="row">
                                        <div class="stock">
                                        </div>
                                        <div class="stack">
                                        </div>
                                    </div>
                                    <div class="row">
                                    </div>
                                </div>
                            </div>
                            `;
                        }
                    }
                }
            }
    
            // instance, init ...
        }
    }
})().init();
```

-----

📚 함께 보면 좋은 내용

[DevKimson::[JAVASCRIPT] Solitaire를 만들어 보자 01](/javascript-solitaire01)

[DevKimson::[JAVASCRIPT] Solitaire를 만들어 보자 03](/javascript-solitaire03)