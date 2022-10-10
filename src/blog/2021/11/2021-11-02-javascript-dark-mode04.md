---
slug: "/javascript-dark-mode04/"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-11-02 12:23:29 +0900
title:  "[JAVASCRIPT] 정적웹에 다크모드 적용하기 04"
author: Kimson
categories: [ javascript ]
image: /images/post/covers/TIL-javascript.png
tags: [ darkmode, dark, staticweb, til ]
description: "다크모드 적용

몇 달 전 다크모드에 대해 포스팅으로 기록한 적이 있습니다. 벌써 네번째 포스팅이라 거창한 내용은 아니지만 조금 더 나은 방법을 기록하고자 합니다."
featured: false
hidden: false
rating: 4
toc: true
profile: false
keysum: false
keywords: ""
published: true
---

# 다크모드 적용

몇 달 전 다크모드에 대해 포스팅으로 기록한 적이 있습니다. 벌써 네번째 포스팅이라 거창한 내용은 아니지만 조금 더 나은 방법을 기록하고자 합니다.

## 조금 더 빈틈을 줄이자

이전 포스팅까지는 동일 주제로 렌더 시점에 대해 알아본 바 있습니다. 그런데 마냥 `body`태그 시작부에 뒀다고 해서 끊김이 없지는 않았습니다. 꼼수를 생각해봤지만 너무나도 미흡한 탓에 그냥저냥 방치하고 있던 주제인데요. 이번에 `jekyll theme`를 만드는 중에 다크모드를 새로 구현하던 중에 다크모드 적용에 위화감? 이 없는 방식을 기록하려 합니다.

## requestAnimationFrame 사용

`body`태그 시작 부분에 스크립트를 당겨와 `body`태그에 `dark`클래스를 적용했었는데요. 직접 시점을 찾기보다 맡기는게 좋을 것 같다는 생각이 들어서 `requestAnimationFrame`을 사용하기로 했습니다.

이전에는 이랬습니다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Document</title>
</head>
<body>
    <script>
        // 코드
    </script>

    <!-- 태그들 -->
</body>
</html>
```

이번에 변경한 코드는 아래와 같습니다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="/path/darkMode.js"></script>
    <title>Document</title>
</head>
<body>

    <!-- 태그들 -->
</body>
</html>
```

위치는 `head`에 위치합니다. `body`시작 부분에 위치하는 것과 우선 차이가 있습니다.

```javascript
// darkMode.js

!function initMode() {
    // 최초 실행시 세션스토리지 읽고 값 적용
    let mode = getMode() || 'off';
    let label = document.createElement('label');
    let btn = document.createElement('span');
    label.htmlFor = 'mode';
    label.id = 'mtWrap';
    label.append(btn);
    let target = null,findTarget = null;
    findTarget = requestAnimationFrame(watchTarget.bind(target, {label, mode, findTarget}));
}();

function watchTarget({label, mode, findTarget}){
    target = document.querySelector(`[data-switch="${label.htmlFor}"]`);
    if(target) {
        target.insertAdjacentElement('beforebegin', label);
        updateMode.call(label, mode);
        window.addEventListener('click', modeHandler.bind(label));
        cancelAnimationFrame(findTarget);
    } else {
        requestAnimationFrame(watchTarget);
    }
}

window.addEventListener('load', ()=>{
    let findTarget = requestAnimationFrame(detectMode);
    function detectMode(){
        if(document.body.classList.contains('dark')) {
            setTimeout(()=>{
                document.body.style.transition = `0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            },100);
            cancelAnimationFrame(findTarget);
        } else {
            requestAnimationFrame(detectMode);
        }
    }
});

function modeHandler(ev) {
    let valid = ev.target;
    if (valid.tagName !== 'LABEL' || !valid.htmlFor) return;
    ev.preventDefault();
    let mode = this.classList.value == 'on' ? 'off' : 'on';
    updateMode.call(this, mode);
}

function updateMode(mode) {
    let shape = {
        on: `<i class="far fa-sun"></i>`,
        off: `<i class="fas fa-moon"></i>`
    }
    let body = document.body.classList;
    clearMode.call(this);
    this.classList.add(mode);
    this.children[0].innerHTML = shape[mode];
    if(mode=='off'){
        body.add('dark');
    } else {
        body.remove('dark');
    }
    setMode(mode);
}

function clearMode() {
    this.classList.value = '';
}

function getMode() {
    let mode = sessionStorage['mode'];
    return mode ? JSON.parse(mode).dark : null;
}

function setMode(status) {
    sessionStorage['mode'] = JSON.stringify({
        dark: status,
        toggleTime: new Date()
    });
}
```

`watchTarget`으로 `requestAnimationFrame`을 사용한 이유는 `DOMLoaded`가 될 때까지 태그가 로드 되었는지 감지하기 위해 사용했습니다.

곧바로 `querySelector`를 하면 `null`상태를 참조해서 실행되기 때문에 오류가 발생합니다. 아직 정확한 이유는 아니지만 현재 이것저것 돌려보고 해서 나온 추측입니다.

`line 27`에 있는 `detectMode`함수는 `body`에 `dark`클래스가 적용되었을 때 곧바로 `transition`이 적용되는 것을 막기 위해 클래스 추가 시점에서 조금 딜레이를 주기 위한 것 입니다.

-----