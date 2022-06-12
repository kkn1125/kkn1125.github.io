---
slug: "/javascript-scroll-control"
layout: post
modified: 2022-04-11 11:01:41 +0900
date:   2021-08-17 15:02:11 +0900
title:  "[JAVASCRIPT] 스크롤 애니메이션 구현하기"
author: Kimson
categories: [ javascript ]
tags: [ no-scroll, slide, tim ]
image: assets/images/post/covers/TIM-none.png
description: "스크롤 애니메이션 구현

코드가 이상한 부분이 많아서 아예 새로 짰습니다. 정말 엉망인 글인데 검색 결과 상위에 올라있어 부끄럽습니다. 계속해서 글을 정기적으로 검열하고 수정하고 있습니다. 재방문해서 보시는 분에게 감사드립니다 🙇‍♂️

이전 코드를 대폭 수정했습니다. 이전 내용을 보시고 싶으시면 블로그의 저장소에 있는 커밋내용을 참조바랍니다. 스크롤을 감지해서 애니메이션을 구현하는 것이 목적입니다.

화면이 슬라이드 방식으로 전환되듯이 스크롤링하는 효과를 기대하고 있습니다. 참고로 기존의 스크롤 바를 가리고자 한다면, `css`에서 `body`(혹은 대상 요소)의 `overflow`를 `hidden`값만 주면 사라집니다."
featured: false
hidden: false
rating: 4.5
toc: true
profile: false
istop: true
keysum: false
keywords: ''
published: true
---

# 스크롤 애니메이션 구현

> 코드가 이상한 부분이 많아서 아예 새로 짰습니다. 정말 엉망인 글인데 검색 결과 상위에 올라있어 부끄럽습니다. 계속해서 글을 정기적으로 검열하고 수정하고 있습니다. 재방문해서 보시는 분에게 감사드립니다 🙇‍♂️

이전 코드를 대폭 수정했습니다. 이전 내용을 보시고 싶으시면 블로그의 저장소에 있는 커밋내용을 참조바랍니다. 스크롤을 감지해서 애니메이션을 구현하는 것이 목적입니다.

화면이 슬라이드 방식으로 전환되듯이 스크롤링하는 효과를 기대하고 있습니다. 참고로 기존의 스크롤 바를 가리고자 한다면, `css`에서 `body`(혹은 대상 요소)의 `overflow`를 `hidden`값만 주면 사라집니다.

## 스크롤 구현하기

먼저 필요한 기능부터 살펴보겠습니다.

1. 휠을 굴릴 때 상하 감지
   - 해당 방향으로 섹션 이동
2. 상하 이동
3. 새로고침 or 페이지 이동 시 초기화

간단하게 약 3가지의 기능을 구현해보겠습니다. 이정도 기능이면 충분히 슬라이드 페이지를 흉내낼 수 있습니다.

### 샘플 만들기

```html
<div class="divs controlBtn">
    <button class="btndir">Up</button>
    <button class="btndir">Down</button>
</div>

<!-- 3~4개 정도의 샘플 section 태그 -->
<section class="section">
    <div style="font-size:54px; color: black !important;">Test1</div>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, tenetur blanditiis distinctio consequatur
        quos vitae iure impedit a quibusdam facere aspernatur nam veritatis quae iusto similique dolores quam
        earum perferendis.</p>
</section>
```

```css
/* 필요하다면 다른 태그들 초기화 해주시기바랍니다. */
.html,
.body,
.section,
.h1,
.div {
    margin: 0;
    padding: 0;
}

.body {
    position: relative;
    overflow: hidden;
}

.html,
.body,
.section {
    height: 300px;
    width: 100%;
}

.section:nth-child(odd) {
    background: lightgray;
}

.section {
    position: relative;
}

.body .section {
    position: absolute;
    transition: 500ms cubic-bezier(1, 0, 0, 1);
}

.controlBtn {
    position: absolute;
    bottom: 3.5%;
    right: 5%;
    z-index: 100;
}
```

### 변수 설정

```javascript
const opt = {
    scrollGauge: 0,
    // 스크롤 수동 값
    bodyClass: document.querySelector('div.body'),
    // 섹션을 감싸는 태그
    section: document.getElementsByClassName('section'),
    // 섹션 노드 배열
    sectionHeight() {
        return this.section[0].clientHeight
    },
    // 섹션 기본 높이
    maxValue() {
        return (this.section.length - 1) * this.sectionHeight()
    },
    // 섹션 개수에 따른 최대 높이
    currentSection() {
        return parseInt(opt.scrollGauge / opt.sectionHeight())
    },
    // 현재 섹션 위치 (인덱싱)
    limitValidate() {
        if (this.scrollGauge < 0) this.scrollGauge = 0;
        else if (this.scrollGauge > this.maxValue()) this.scrollGauge = this.maxValue();
    },
    // 스크롤 범위 체크
    applyHeightValue(elem, idx, value) {
        elem.style.bottom = -(this.sectionHeight() * idx) + value + 'px'
    },
    // 높이 값 적용
    initialTopValue(value) {
        [...this.section].forEach((elem, idx) => this.applyHeightValue(elem, idx, value))
    },
    // 섹션 전체에 높이 값 적용
    scrollValue(value) {
        return this.sectionHeight() * value
    },
    // 섹션 높이 값
    controlSections(value) {
        this.initialTopValue(this.scrollValue(value));
    },
    // 섹션 전체에 높이 값 적용
    changeSection(val) {
        return (opt.currentSection() - val) * opt.sectionHeight();
    },
    // 섹션 위치 값 변경 - 버튼 이벤트
}

let scrollHandler, btnHandler;
// 이후 변수에 대한 내용이 나옵니다.
```

### 슬라이드 기능 구현 - 스크롤

> 스크롤을 했을 때 슬라이드가 일어나도록 하는 부분 작성입니다.  
> 내용 모두 새로 작성해서 업로드 했습니다. 이전 코드보다 가독성을 높이는데 초점을 두고 작성했습니다.

```javascript
scrollHandler = function (e) {
    if (!e.target.closest('div.body')) return;

    opt.scrollGauge += e.deltaY;

    opt.limitValidate();
    opt.controlSections(opt.currentSection());
}

// 휠 이벤트 등록
window.addEventListener('wheel', scrollHandler);
```

코드를 새로 짜고 작성해서 변수, 함수의 이름 등과 기능 일부가 변경되면서, 내용자체를 다시 쓰게 좋을 것 같아 새로 쓰게 되었습니다.

스크롤 관련 변수와 함수는 `opt`객체에 정의하고 `handler`만 따로 정의했습니다. 함수는 가급적 하나의 기능만을 담당하게 작성되었습니다.

`scrollHandler`는 `deltaY`값을 기본 스크롤 증감 단위로 해서 `scrollGauge`에 누산합니다. 이후 범위 체크를 해서 최소/최대 값을 벗어날 시 유지 시켜줍니다. `controlSections`에 현재 섹션 인덱스 값을 전달, 호출하고 전체 섹션의 `top` 위치 값을 변경시킵니다.

### 슬라이드 기능 구현 - 버튼

버튼으로 스크롤을 관리하고자 할 경우 `btnHandler`를 통해 작성해둔 함수를 재사용해서 쉽게 제어 가능합니다.

```javascript
btnHandler = function (e) {
    const target = e.target;

    if(!target.classList.contains('btndir')) return;

    switch(target.textContent.toLowerCase()){
        case 'up': opt.scrollGauge = opt.changeSection(1); break;
        case 'down': opt.scrollGauge = opt.changeSection(-1); break;
    }

    // 중복 부분!
    opt.limitValidate();
    opt.controlSections(opt.currentSection());
}

window.addEventListener('click', btnHandler);
```

뭔가 중복되는 느낌이 있는 부분이 있어 이 부분만 정리를 해보자면 아래와 같습니다.

```javascript
const opt = {
    // ...
    moveSectionWithinLimit() { // +
        this.limitValidate();
        this.controlSections(this.currentSection());
    }
    // ...
}

scrollHandler = function (e) {
    if (!e.target.closest('div.body')) return;

    opt.scrollGauge += e.deltaY;


    opt.moveSectionWithinLimit(); // +
}

btnHandler = function (e) {
    const target = e.target;

    if(!target.classList.contains('btndir')) return;

    switch(target.textContent.toLowerCase()){
        case 'up': opt.scrollGauge = opt.changeSection(1); break;
        case 'down': opt.scrollGauge = opt.changeSection(-1); break;
    }

    opt.moveSectionWithinLimit(); // +
}
```

이전에 거창했던 설명보다는 함수를 하나씩 쪼개고 합쳐서 사용하면 오히려 설명이 줄어드는 것 같습니다. 기존에 엉망이던, 말도 안되던 코드를 다듬고 재작성하다보니 감회가 새롭습니다.

변경된 코드로 아래 샘플을 교체했습니다.

-----

> 아래 샘플 영역 내에 마우스를 두고 슬라이드하셔야 합니다. 버튼 작동합니다.

<style>
    .html,
    .body,
    .section,
    .h1,
    .div {
        margin: 0;
        padding: 0;
    }

    .body {
        position: relative;
        overflow: hidden;
    }

    .html,
    .body,
    .section {
        height: 300px;
        width: 100%;
    }

    .section:nth-child(odd) {
        background: lightgray;
    }

    .section {
        position: relative;
    }

    .body .section {
        position: absolute;
        transition: 500ms cubic-bezier(1, 0, 0, 1);
    }

    .controlBtn {
        position: absolute;
        bottom: 3.5%;
        right: 5%;
        z-index: 100;
    }
</style>
<div class="body" style="box-shadow: 0 0 0 3px salmon; margin: 3rem 0;">
    <div class="divs controlBtn">
        <button class="btndir">Up</button>
        <button class="btndir">Down</button>
    </div>
    <section class="section">
        <div style="font-size:54px; color: black !important;">Test1</div>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, tenetur blanditiis distinctio consequatur quos vitae iure impedit a quibusdam facere aspernatur nam veritatis quae iusto similique dolores quam earum perferendis.</p>
    </section>
    <section class="section">
        <div style="font-size:54px; color: black !important;">Test2</div>
        <p style="color: black !important;">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, tenetur blanditiis distinctio consequatur quos vitae iure impedit a quibusdam facere aspernatur nam veritatis quae iusto similique dolores quam earum perferendis.</p>
    </section>
    <section class="section">
        <div style="font-size:54px; color: black !important;">Test3</div>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, tenetur blanditiis distinctio consequatur quos vitae iure impedit a quibusdam facere aspernatur nam veritatis quae iusto similique dolores quam earum perferendis.</p>
    </section>
    <section class="section">
        <div style="font-size:54px; color: black !important;">Test4</div>
        <p style="color: black !important;">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, tenetur blanditiis distinctio consequatur quos vitae iure impedit a quibusdam facere aspernatur nam veritatis quae iusto similique dolores quam earum perferendis.</p>
    </section>
    <section class="section">
        <div style="font-size:54px; color: black !important;">Test5</div>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, tenetur blanditiis distinctio consequatur quos vitae iure impedit a quibusdam facere aspernatur nam veritatis quae iusto similique dolores quam earum perferendis.</p>
    </section>
    <script>
        const opt = {
            scrollGauge: 0,
            bodyClass: document.querySelector('div.body'),
            section: document.getElementsByClassName('section'),
            sectionHeight() {
                return this.section[0].clientHeight
            },
            maxValue() {
                return (this.section.length - 1) * this.sectionHeight()
            },
            currentSection() {
                return parseInt(opt.scrollGauge / opt.sectionHeight())
            },
            limitValidate() {
                if (this.scrollGauge < 0) this.scrollGauge = 0;
                else if (this.scrollGauge > this.maxValue()) this.scrollGauge = this.maxValue();
            },
            applyHeightValue(elem, idx, value) {
                elem.style.bottom = -(this.sectionHeight() * idx) + value + 'px'
            },
            initialTopValue(value) {
                [...this.section].forEach((elem, idx) => this.applyHeightValue(elem, idx, value))
            },
            scrollValue(value) {
                return this.sectionHeight() * value
            },
            controlSections(value) {
                this.initialTopValue(this.scrollValue(value));
            },
            changeSection(val) {
                return (opt.currentSection() - val) * opt.sectionHeight();
            },
            moveSectionWithinLimit() {
                this.limitValidate();
                this.controlSections(this.currentSection());
            }
        }
        let scrollHandler, btnHandler;
        scrollHandler = function (e) {
            if (!e.target.closest('div.body')) return;
            opt.scrollGauge += e.deltaY;
            opt.moveSectionWithinLimit();
        }
        btnHandler = function (e) {
            const target = e.target;
            if (!target.classList.contains('btndir')) return;
            switch (target.textContent.toLowerCase()) {
                case 'up':
                    opt.scrollGauge = opt.changeSection(1);
                    break;
                case 'down':
                    opt.scrollGauge = opt.changeSection(-1);
                    break;
            }
            opt.moveSectionWithinLimit();
        }
        opt.initialTopValue(opt.currentSection());
        window.addEventListener('wheel', scrollHandler);
        window.addEventListener('click', btnHandler);
        document.querySelector('div.body').addEventListener('mouseenter', e => {
            document.body.classList.add('noscroll');
        });
        document.querySelector('div.body').addEventListener('mouseleave', e => {
            document.body.classList.remove('noscroll');
        });
    </script>
</div>