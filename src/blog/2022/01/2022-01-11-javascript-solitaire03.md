---
slug: "/javascript-solitaire03"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2022-01-11 16:05:43 +0900
title:  "[JAVASCRIPT] Solitaire를 만들어 보자 03"
author: Kimson
categories: [ javascript ]
image: /images/post/solitaire/solitaire04.png
tags: [ game, solitaire, card, tim ]
description: "솔리테어를 만들어 보자 3편

얼른 기록하고 다른 공부를 하려다보니 급하게 올리게 되었습니다. 이전에 다음 포스팅에서 다룰 3가지를 먼저 알려드렸습니다.

1. 카드 이동 (묶음/단일)
2. 솔리테어 규칙 적용
3. 자동 카드 뒤집기

간단한 카드 뒤집기부터 해서 카드이동, 규칙 적용으로 대부분의 기능을 마무리 하도록 하겠습니다. 이후 주제는 타이머, 점수, 이동횟수, 자동완성이기 때문에 천천히 포스팅하려합니다."
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

# 솔리테어를 만들어 보자 3편

얼른 기록하고 다른 공부를 하려다보니 급하게 올리게 되었습니다. 이전에 다음 포스팅에서 다룰 3가지를 먼저 알려드렸습니다.

1. 카드 이동 (묶음/단일)
2. 솔리테어 규칙 적용
3. 자동 카드 뒤집기

간단한 카드 뒤집기부터 해서 카드이동, 규칙 적용으로 대부분의 기능을 마무리 하도록 하겠습니다. 이후 주제는 타이머, 점수, 이동횟수, 자동완성이기 때문에 천천히 포스팅하려합니다.

## 카드 자동 뒤집기

2편에서 다룬 내용 중에 카드를 뽑고, 모으는 영역에 올리는 기능을 구현했는데요. 카드를 이동시키고나면 카드가 여전히 뒤집어진 채로 있습니다. 이러면 게임이 되지 않습니다.

카드를 클릭해서 뒤집는 방법도 있지만 저는 자동으로 뒤집히도록 하겠습니다. 코드를 부분만 미리 보여드리자면 2편에서 했던 코드중 일부 입니다.

```javascript
// app.js::Model
this.cardRender = function () {
    this.autoBackFlip(); // ++
    views.cardRender(cardStock, cardPlaying, cardStack);
}

this.autoBackFlip = function () {
    cardPlaying.forEach(col=>{
        if(col.length>0) col[col.length-1].isBack = false;
    });
}
```

`Model`영역의 `autoBackFlip`입니다. 2번 라인의 `cardRender`는 2편에서 작성한 `view`단에 위임하는 메서드입니다. 항상 어떤 영역을 수정하던 `cardRender`메서드를 거치기 때문에 `view`로 넘어가기전 초기화 개념으로 코드를 넣었습니다.

`cardPlaying`배열의 마지막 카드 요소의 `isBack`속성을 `false`로 해주면 카드를 모으건 이동시키건 간에 마지막에 뒤집혀있던 카드를 자동으로 보이게 해줍니다.

`if`문을 사용한 이유는 카드를 옮기면서 생기는 공백에서 `isBack`속성을 바꾸는 부분에 에러가 발생하기 때문에 `column`의 길이가 있을 때만 카드를 뒤집습니다.

## 카드 이동

예전에 만들었던 솔리테어와 비교해서 필요없는 부분을 없애려고 노력은 했습니다만, 아직까지 만족스럽지 못합니다. 카드 이동이 먼저 되어야 제약을 걸기 쉽기 때문에 우선 카드를 이동하게 만들고, 카드가 이동이되면 이때 하나씩 제약을 걸어 솔리테어의 규칙을 구현하게 되었습니다.

추가된 코드가 조금 있어서 아래의 코드를 보면서 설명하겠습니다.

```javascript
// app.js::Controller
function Controller(){
    this.init = function (model) {
        models = model;

        this.cardRender();
        window.addEventListener('click', this.cardDraw);
        window.addEventListener('click', this.cardMove); // ++ 추가되었습니다.
        window.addEventListener('click', this.cardCollect);
    }

    // ... draw, collect ...

    // ++ 추가되었습니다.
    this.cardMove = function (ev) {
        const target = ev.target;
        if(target.classList.contains('back')) return;
        if(!target.classList.contains('card')) return;
        if(!target.parentNode.classList.contains('stacking')) return;

        models.cardMove(target);
    }
}

// app.js::Model
function Model() {
    // 변수, 상수들

    const cardStack = Array.from(new Array(4), () => []); // ++ 배열 생성 방법을 조금 바꿨습니다.

    // 변수, 상수들

    // ... init ...

    this.cardSettings = function () {
        this.initCardSetting(); // ++ 추가 되었습니다.
        // 카드 배열을 초기화 시켜주는 역할입니다.
        this.generateCardSuits(parts.card);
        this.shuffleCard();
        this.handOutCard();
    }

    this.generateCardSuits = function ({
        suits,
        list
    }) {
        [...suits].forEach(type => {
            return [...list].forEach(num => {
                cardStock.push({
                    // 속성등
                    isBack: false, // 개발용으로 전부 보이게 했습니다.
                    // 속성등
                });
            });
        });
    }

    // ++ 카드 자동 뒤집기
    this.autoBackFlip = function () {
        cardPlaying.forEach(col=>{
            col[col.length-1].isBack = false;
        });
    }

    // ++ 카드 이동
    this.cardMove = function (elCard) {
        const isLast = [...elCard.parentNode.children].slice(1);
        if(Model.selectBundle.length==0 && !elCard.classList.contains('front')) return;
        if(elCard.closest('.stock') && isLast[isLast.length-1] != elCard) return;
        this.cardSelecter(elCard);

        this.cardRender();
    }
    
    // ++ 카드 선택
    this.cardSelecter = function (elCard) {
        const card = this.findCard(elCard);
        const parent = elCard.parentNode;
        const col = [...parent.parentNode.children].indexOf(parent);
        const idx = [...parent.children].indexOf(elCard);
        const pick = {
            idx: idx,
            card: card,
        };

        if(!card && parent.parentNode.classList.contains('row')) {
            // 카드를 빈칸으로 움직일 때
            this.cardMoveToEmpty(Model.selectBundle.pop(), col, idx);
            this.initSelectedCard();
            return ;
        } else if(!card && !parent.parentNode.classList.contains('row')){
            this.initSelectedCard();
            return ;
        }
        
        if(card.$parent[0] instanceof Array) Object.assign(pick, {
            col: col
        })

        if(!this.validBundle(card)) {
            this.initSelectedCard();
            return;
        }

        pick.card.isSelected = true;
        
        Model.selectBundle.push(pick);

        if(Model.selectBundle.length==2){
            const first = Model.selectBundle.shift();
            const second = Model.selectBundle.shift();
            const firstCol = first.card.$parent[first.col];
            const secondCol = second.card.$parent[second.col];

            if(this.isStackable([first.card, second.card])){
                const temp = [];
                if(first.card.$parent[0] instanceof Array){
                    for(let i=firstCol.length; i>0; i--){
                        if(i>=first.idx) {
                            const last = firstCol.pop();
                            last.$parent = second.card.$parent;
                            temp.push(last);
                        }
                    }
                } else {
                    const last = first.card.$parent.splice(first.card.$parent.indexOf(first.card), 1).pop();
                    last.$parent = second.card.$parent;
                    temp.push(last);
                }

                temp.reverse();

                secondCol.push(...temp);
            } else {
                console.log('불가능');
            }
            this.initSelectedCard();
        }
    }

    // ++ 두번째 선택 카드가 빈 카드면 king만 이동 가능하게 한다.
    // 첫번째 선택이 묶음이라면 선두의 카드가 king이어야 한다.
    this.cardMoveToEmpty = function (card, col, idx) {
        if(card.card.deno!=13) return;
        const temp = [];
        const cardCol = card.card.$parent[card.col];
        if(card.card.$parent[0] instanceof Array){
            for(let i=cardCol.length; i>0; i--){
                if(i>=card.idx) {
                    const last = cardCol.pop();
                    last.$parent = cardPlaying;
                    temp.push(last);
                }
            }
        } else {
            const last = card.card.$parent.splice(card.card.$parent.indexOf(card.card), 1).pop();
            last.$parent = cardPlaying;
            temp.push(last);
        }
        temp.reverse();

        cardPlaying[col].push(...temp);
    }

    // ++ 첫번째 선택한 카드 묶음/단일을 솔리테어 규칙으로 판별
    this.validBundle = function (card) {
        /**
         * 1. 단일일 때 - true 반환
         * 2. 묶음일 때 - 순차 && 교차
         *  1. 순차관계인지 - true/false
         *  2. 교차관계인지 - true/false
         */
        const temp = [];
        if(card.$parent[0] instanceof Array){
            for(let col of card.$parent){
                const idx = col.indexOf(card);
                if(idx>-1){
                    temp.push(...col.slice(idx));
                    break;
                }
            }
        } else {
            temp.push(card.$parent.filter(card=>card.isStaged).shift());
        }

        if(temp.length>1){
            temp.forEach(card=>card.isSelected=true);
            return this.isCascade(temp.reverse());
        } else {
            return true;
        }
    }

    // ++ 묶음일 때 순차 && 교차관계 검사
    this.isCascade = function(validList){
        for(let card=0; card<validList.length-1; card++){
            if(this.isStackable([validList[card], validList[card+1]])){
                continue;
            } else {
                return false;
            }
        }
        return true;
    }

    // ++ 순차관계검사 + 교차관계 검사
    this.isStackable = function ([first, second]) {
        if(parseInt(first.deno)+1 == parseInt(second.deno) && this.isCrossable(first.$suit, second.$suit)){
            return true;
        } else {
            return false;
        }
    }

    // ++ 교차관계인지 검사
    this.isCrossable = function (first, second) {
        const isLeft = (type) => parts.card.suits.slice(0,2).indexOf(type)>-1;
        const isRight = (type) => parts.card.suits.slice(2).indexOf(type)>-1;

        return (isLeft(first) && isRight(second)) || (isRight(first) && isLeft(second));
    }

    // ++ 선택된 카드 리셋
    this.initSelectedCard = function () {
        Model.selectBundle = [];
        [].concat([...cardStock],[].concat(...cardStack),[].concat(...cardPlaying)).map(card=>{
            card.isSelected = false;
            return card;
        });
    }

    this.cardCollect = function (elCard) {
        const card = this.findCard(elCard);
        if(!this.validNextCard(card)) return ;
        let getCard;
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
        this.initSelectedCard();
        this.cardRender();
    }
}
```

### 카드 이동

주석에 `++`가 붙어있는게 새로 추가되거나 변경된 내용입니다. 35라인 `autoBackFlip`은 위에서 말했다시피 카드를 자동으로 뒤집는 기능입니다.

42줄 `cardMove`는 `click`이벤트를 추가로 생성해서 선택한 카드를 제어문을 통해 첫번째 선택일 때와 두번째 선택일 때를 구분합니다. 46줄 `cardSelecter`에 선택한 카드를 넘겨주고, 52줄에서 이전에 만들어뒀던 `findCard`로 카드정보를 불러와 카드의 선택된 위치 정보를 `pick`객체로 만들어 비교합니다. 판별 기준은 만들어두었던 3가지 영역의 배열 중 하나만 `$parent`가 1차원 나머지 2개의 `$parent`가 2차원 이기 때문에 분기문이 조금 많아졌습니다.

76줄 처음 선택한 카드가 묶음일 때 `validbundle`로 순차, 교차관계를 검사하고 묶음이 규칙에 위반되면 `return`시키고 선택카드 배열을 초기화합니다. 통과하게되면 `pick.card`의 `isSelected`는 `true`로 변경해서 선택을 활성화하고, 코드에는 없지만 `Model`객체 내에 `Model.selectBundle`프로퍼티를 배열로 미리 만들었습니다.

83줄에 나오는 `Model.selectBundle`에 선택되는 카드를 넣습니다. 번들의 길이가 2가 되면 매칭이 되는지 검사를 시작합니다. `isStackable`로 선택된 단일 또는 묶음의 선두카드와 옮길 카드를 대조합니다.

이때 솔리테어의 규칙을 적용한 분기문을 작성하면 색상이 교차되고, 숫자가 등차관계인 카드끼리 겹쳐지게 됩니다.

마지막으로 113줄에서 `initSelectCard`로 초기화시켜줍니다.

### 솔리테어 규칙

먼저 교차관계인지 검사하는 `isCrossable`을 만들었습니다. 192줄에서 `first`, `second`는 각 카드의 `suit`입니다. 미리 설정해둔 카드의 `suits`에는 ['spades', 'clubs', 'hearts', 'diamonds']가 있습니다. 이때 절반 쪼개면 흑과 적으로 나뉘고 흑에서 `first`가, 적에서 `second`가 있거나 반대로 흑에서 `second`, 적에서 `first`가 있다면 교차, 둘 다 아니라면 교차가 되지 않도록 합니다.

183줄은 `isCrossable`과 더해서 쌓기 가능한지 검사하는 `isStackable`입니다. 추가되는 조건은 첫번째 선택한 카드의 수가 두번째 선택한 카드의 수보다 1 작은지 입니다.

그렇게 조합된 분기문으로 묶음 선택 시 묶음이 솔리테어 규칙에 타당한지 `isCascade`메서드를 만들어 쉽게 검사할 수 있습니다.

200줄 `initSelectedCard`는 모든 카드의 선택을 풀기 위해 1차원 배열로 변환해서 모두 `false`로 만들었습니다.

이렇게 솔리테어 규칙을 설정하고 카드를 이동하고, 카드를 자동으로 뒤집는 기능을 해보았습니다. `view`는 이미 렌더링 부분을 구현했기 때문에 이미지만 잘 연결되어 있다면 문제없이 실행됩니다.

이제 모델영역을 건드리는 것도 끝이 보입니다.

다음 4편에서는 이제 남은 자잘한 기능을 완성시키려합니다. 남은 기능은 리셋, 타이머, 점수, 이동횟수, 자동완성입니다.

-----

<figure class="text-center">
<span class="w-inline-block">
   <img class="w-100" src="{{site.baseurl}}/assets/images/post/solitaire/solitaire04.png" alt="결과물" title="결과물">
   <figcaption>현재까지 결과물</figcaption>
</span>
</figure>

-----

📚 함께 보면 좋은 내용

[DevKimson::[JAVASCRIPT] Solitaire를 만들어 보자 01]({{site.baseurl}}/javascript-solitaire01)

[DevKimson::[JAVASCRIPT] Solitaire를 만들어 보자 02]({{site.baseurl}}/javascript-solitaire02)