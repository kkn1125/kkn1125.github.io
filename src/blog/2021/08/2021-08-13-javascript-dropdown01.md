---
slug: "/javascript-dropdown01"
layout: post
modified: 2022-04-12 15:49:25 +0900
date:   2021-08-13 13:50:20 +0900
title:  "[JAVASCRIPT] 드롭다운 메뉴 구현"
author: Kimson
categories: [ javascript ]
tags: [ dropdown, til ]
image: /images/post/covers/TIL-javascript.png
description: "간단한 드롭다운 메뉴 만들기

css-tricks 사이트의 Philip Walton의 포스트의 내용을 보고 만들어졌습니다. 수정하는 시점에서 불필요한 내용과 횡설수설하는 부분을 재작성했음을 알립니다.

먼저 포스팅을 검열하면서 드는 생각입니다만, 확실히 시간이 지나고보면 제가 쓴 글이지만 도대체 무얼 말하는지 모를 때가 많습니다. 이 포스팅 또한 그렇고요. 이런 수준의 포스팅이 검색결과 상위에 있는 것도 참 부끄럽습니다.

드롭다운 메뉴

포스팅에서 말하고자하는 드롭다운 메뉴는 bootstrap에서 지원하는 드롭다운과 같은 형태를 말합니다. bootstrap에서 지원하는 드롭다운을 모르신다면 boostrap 홈페이지의 컴포넌트를 참고하시길 바랍니다."
featured: false
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: false
keywords: ''
published: true
---

# 간단한 드롭다운 메뉴 만들기

> css-tricks 사이트의 Philip Walton의 포스트의 내용을 보고 만들어졌습니다. 수정하는 시점에서 불필요한 내용과 횡설수설하는 부분을 재작성했음을 알립니다.

먼저 포스팅을 검열하면서 드는 생각입니다만, 확실히 시간이 지나고보면 제가 쓴 글이지만 도대체 무얼 말하는지 모를 때가 많습니다. 이 포스팅 또한 그렇고요. 이런 수준의 포스팅이 검색결과 상위에 있는 것도 참 부끄럽습니다.

## 드롭다운 메뉴

포스팅에서 말하고자하는 드롭다운 메뉴는 bootstrap에서 지원하는 드롭다운과 같은 형태를 말합니다. bootstrap에서 지원하는 드롭다운을 모르신다면 boostrap 홈페이지의 컴포넌트를 참고하시길 바랍니다.

## 기능 설계

1. 메뉴 버튼 클릭
   1. (if 메뉴가 닫혀있으면)
      1. 메뉴 컨테이너를 show로 변경한다.
   2. (else if 메뉴가 열림 && 메뉴 버튼 이외 클릭)
      1. (if 메뉴 컨테이너가 show 일 때)
         1. 메뉴 컨테이너를 hide로 변경한다.
   3. (else 메뉴 열려있을 때)
      1. 메뉴 컨테이너를 hide로 변경한다.
   4. 메뉴 리스트 클릭
      1. (if 체크박스 기능일 때)
         1. 메뉴를 닫지 않고 체크박스 동작.
      2. (else)
         1. 메뉴 리스트의 기능 동작.
         2. 메뉴를 닫는다.

토글방식으로 메뉴를 열고 닫기는 간단합니다. 하지만 메뉴가 열린 상태에서 리스트나 외부를 클릭 할 때 동작을 조작하려면 좀 더 작업해야합니다.

해당 포스팅에서 참고했던 [stackoverflow](https://stackoverflow.com/questions/152975/how-do-i-detect-a-click-outside-an-element)의 글은 열린 메뉴를 어떻게 조작하는 지에 대한 팁을 다룹니다.

참고한 글에 있는 팁을 설명하기 위해 예제를 작성해봅시다.

```javascript
// 외부 클릭 시 메뉴를 닫는 행위를 작성할 때
dropdown.addEventListener('click', e => {
    // hide the menus
});
```

조금 예를 들기 위해 아래와 같은 상황을 만들었습니다.

```html
<div id="app">
    <ul class="dropdown">
        <li class="toggle">📘</li>
        <ul class="menu hide">
            <li class="item">1</li>
            <li class="item">2</li>
            <li class="item">3</li>
        </ul>
    </ul>
</div>
```

<figure class="text-center">
<span class="w-inline-block">
   <img src="/images/post/dropdown/dropdown01.png" alt="sample" title="sample">
   <figcaption>kimson</figcaption>
</span>
</figure>

책모양이 있는 `toggle`을 통해 메뉴를 접고, 펼치는 것을 목표로 한다고 가정하겠습니다.

```javascript
const $ = e =>
    document.querySelectorAll(e).length > 1 ?
    [...document.querySelectorAll(e)]:
    document.querySelector(e),

    app = $('#app'),
    dropdown = $('.dropdown'),
    toggle = $('.toggle'),
    menu = $('.menu'),
    item = $('.item'),

    isHide = () => menu.classList.contains('hide'),
    classNameMirror = toggler => {
        toggle.textContent = toggler ? '📖' : '📘';
        menu.classList.add(toggler ? 'show' : 'hide');
        menu.classList.remove(!toggler ? 'show' : 'hide');
    },
    handleDropdownToggle = e => classNameMirror(isHide());

toggle.addEventListener('click', handleDropdownToggle);
```

위 코드에서 보면 `handleDropdownToggle`이 제어하는 것을 볼 수 있습니다. 하지만 외부를 클릭하면 대부분의 드롭다운은 접히도록 하는데 아무리 외부를 클릭해도 접히지 않습니다.

그렇다면 외부를 클릭했을 때 닫아주는 기능이 토글보다 먼저 실행된다면 초기화 개념으로 열린 메뉴를 닫고 토글을 클릭했을 때 메뉴를 열고 닫는 방법이 좋을 것 같습니다.

```javascript
const /* ... */,
    handleDropdownOnlyHide = e => {
        if(!e.target.closest('.menu')) classNameMirror(false);
    }, // +
    handleDropdownToggle = e => classNameMirror(isHide());

window.addEventListener('click', handleDropdownOnlyHide); // +
toggle.addEventListener('click', handleDropdownToggle);
```

코드 두 줄을 추가 했습니다. 작성해둔 `classNameMirror`는 `boolean`값으로 열고 닫기 해줍니다. `handleDropdownOnlyHide`라는 단지 닫는 기능만 하는 함수를 작성했습니다.

이제 된 것 같습니다. 클릭을 해보면 어떻게 될까요?

결론은 열리지 않습니다. 왜냐하면 이벤트가 거의 동시에 일어나기 때문에 계속 닫혀진 상태로 유지가 됩니다. 이는 이벤트의 `bubbling`과 `capture`에 관한 내용을 알아야 합니다.

이벤트 버블링으로 작동하는 예제이기 때문에 이벤트가 등록된 것이 `window` 그리고 `toggle`이며 `toggle`은 `window`의 하위 요소입니다.

버블링은 이벤트 전파가 상위로 전달되는 형태이기 때문에 `toggle`이벤트가 먼저 실행되고 `window`이벤트가 나중에 실행됩니다. 콘솔 트레이스를 찍어보면 쉽게 알 수 있습니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="/images/post/dropdown/dropdown02.png" alt="sample" title="sample">
   <figcaption>kimson</figcaption>
</span>
</figure>

이제 버블링에 대한 이야기도 했으니 전파되는 것을 막기만 하면 해결이 됩니다. 이 내용을 [stackoverflow](https://stackoverflow.com/questions/152975/how-do-i-detect-a-click-outside-an-element)에서 하고 있습니다.

```javascript
const /* ... */,
    handleDropdownToggle = e => {
        e.stopPropagation(); // +
        classNameMirror(isHide());
    };
```

<figure class="text-center">
<span class="w-inline-block">
   <img src="/images/post/dropdown/dropdown03.png" alt="sample" title="sample">
   <figcaption>kimson</figcaption>
</span>
</figure>

> 마무리로 `stopPropagation`과 `preventDefault`의 차이는 단순히 말하자면 전자는 이벤트 전파를 막는 것이고, 후자는 고유한 동작을 중단하는 것입니다.

내용 수정하면서 계속해서 검토하고 읽기 좋은 글을 쓰기위해 노력하고 있습니다. 내용이 알찬 글은 아니지만 이러한 방법을 기록에 남기고, 외부 클릭 감지를 찾으시는 분들에게 조그마한 도움이 되었으면 합니다.

-----

📚 함께 보면 좋은 내용

[Stackoverflow::How do I detect a click outside an element?](https://stackoverflow.com/questions/152975/how-do-i-detect-a-click-outside-an-element)