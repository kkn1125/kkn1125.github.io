---
layout: post
date:   2021-08-13 13:50:20 +0900
title:  "[JAVASCRIPT] 정적웹에 다크모드 적용하기 03"
author: Kimson
categories: [ TIL, JAVASCRIPT ]
tags: [setTimeout]
image: assets/images/post/covers/TIL-javascript.png
description: ""
featured: true
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: false
keywords: ''
---

# 다크모드 부드러운 전환

[다크모드 1편](https://kkn1125.github.io/javascript-dark-mode01/){:target="_blank"}이 단순하게 다크모드를 구현하는 주제였으면, [다크모드 2편](https://kkn1125.github.io/javascript-dark-mode02/){:target="_blank"}은 "**언제 `body`태그에 `dark`클래스를 넣는가**"였습니다.

그런데 문제는 `transition`을 주는 것이었습니다. `transition`을 주게 되면 `dark`클래스로 저장하여 여는 것 아니면 켤때마다 까매지고, 하얘지는 현상이 계속 됐습니다.

## 의문점

### 태그위치

> 태그의 위치가 문제인가

태그 위치를 여기저기 옮겨가며 테스트를 해봤습니다.

```html
<!DOCTYPE html>
<html>

    <head>
        <!-- body가 생기기 전이므로 탈락 -->
        <script src="path/path/if-01.js"></script>
    </head>

    <!-- 상동 그리고 규칙에 어긋나므로 탈락 -->
    <script src="path/path/if-02.js"></script>

    <body>
        <!-- 버튼보다 먼저 생성되서 탈락 -->
        <script src="path/path/if-03.js"></script>
        <div>
            <button id="DM">DarkMode</button>
        </div>

        <!-- tags ... -->

        <!-- 기존 사용 위치 -->
        <script src="path/path/if-05.js"></script>
    </body>

</html>

```

위치는 비교해보나마나였지만 혹시나하는 마음에 시도해봤습니다. 그렇다면 콘솔에서 어떤 차이 점이 있는지 보겠습니다.

### 클래스 적용 시점

> 언제 body에 클래스를 적용하는가

이제 `script`의 위치는 가닥이 잡힙니다. 그렇다면 body에 클래스를 언제 부여해야 할까요.

테스트 해봅시다.

```html
<html>
    <head>
        <!-- ... -->
    </head>

    <body>
        <div>
            <button id="toggleBtn">Dark Mode Toggle</button>
        </div>

        <!-- body tag에 dark class 부여 -->
        <script src="main.js"></script>
    </body>

</html>
```

`html`은 대략 이렇게 둡니다. 문제는 `transition`을 설정하면 리로드나 페이지 이동에서 생기는 화면 변환입니다. 그대로 검정색이 유지되고 버튼을 클릭할 때만 자연스럽게 변해야한다는 점입니다.

`javascript`를 통해서 몇가지 `readyState`를 찍어봤습니다.

```javascript

console.debug("========== html script ==========");
console.debug("========== 01 html origin ==========");
// 이때는 이제 막 바디태그를 읽어들이는 시점
console.log(document.readyState); // loading
console.log(document.body) // 바디태그 존재
console.log(document.body.classList) // DOMTokenList [value: ""]
console.log(document.querySelector('#darkMode')); // null

window.addEventListener('DOMContentLoaded',()=>{
    // DOM전체를 읽고 전체 페이지를 읽은 시점
    console.debug("========== 02 html DOM Loaded ==========");
    console.log(document.readyState) // interactive
    console.log(document.body) // 바디태그 존재
    console.log(document.body.classList) // DOMTokenList ["dark", value: "dark"]
    console.log(document.querySelector('#darkMode')) // 존재
});

window.addEventListener('load',()=>{
    // 문서 전체 다 읽고 소스를 다 로드 한 시점
    console.debug("========== 03 html Load ==========");
    console.log(document.readyState) // complete
    console.log(document.body) // 존재
    console.log(document.body.classList) // DOMTokenList ["dark", value: "dark"]
    console.log(document.querySelector('#darkMode')) // 존재
});

// body에 dark class 부여 하는 구문
// ...
// body에 dark class 부여 하는 구문
```

여기서 알 수 있는 부분은 `DOMLoaded`가 되기 전에 `body`에 `dark`가 지정되야 합니다. 그리고 중요한 것은 `style`에는 `body.dark`라는 선택자로 `transition`이 적용되어있습니다.

즉, `transtion`이 적용되었으면 css를 늦게 로드(setTimeout 등)하더라고 결국 delay를 가지고 화면이 변하는 모션이 생깁니다.

그렇다면 `style`이 적용되고, `body`가 생성되는 시점에 곧바로 `class`를 `dark`로 지정해줘야합니다.

다크모드는 `localStorage`에 지정된 값을 읽어 반영해주기만 하면 되고, 클릭 시 변경하는 것은 DOM이던 페이지던 로드가 완료 되고 작동 되도 무방하기 때문에, 다크모드를 읽고 지정하는 구문을 `body`가 시작한 후 바로 `script`태그를 열어 `localStorage`값을 읽어 `dark`를 지정합니다.

```html
<html>
    <head>
        <!-- meta ... -->
    <head>
    <body>
        <script>
            let darkMode = localStorage.getItem("darkMode");
            darkMode==="Y"
            ?document.body.classList.add("dark")
            :document.body.classList.remove("dark");
        </script>

        <!-- 다른 내용 -->
        <!-- ... -->
    </body>
</html>
```

당연한 이야기였습니다만 가능한 빠르게 body 태그에 클래스 지정하는 방법으로 소개한 것입니다.

하지만 이러한 방법이 저는 마음에 들지는 않았습니다. 그래서 요소를 만들어 스타일을 시간차를 두어 `transition`만 따로 주는 방법입니다.

```javascript
let style = document.createElement("style");
let css = document.createTextNode(`
    body{
        transition: .5s ease;
    }
`)
style.appendChild(css);
setTimeout(()=>{
    document.head.appendChild(style);
}, 50)

// darkMode 코드들 ...
// body에 dark클래스 추가하는 코드
```

이렇게 하면 transition만 시간차로 추가되어 리로드나 페이지 이동시에는 화면 변화 모션이 사라집니다. 버튼 클릭을 할 때만 부드럽게 변하는 효과가 생기니 이제 원하던 결과물을 얻는 방법이 두가지 생겼습니다.

## 결론

조금만 생각해봐도 금방 알 수 있는 내용이지만 한 번 콘솔도 찍어보고 미세한 차이들을 염탐해봤습니다.

1. `body` 오픈 태그 바로 밑에 `script`를 열어 `class`를 추가하는 방법
2. `style node`를 만들어 `body.dark`에 `transition`만 넣어 `head`에 시간차로 추가하는 방법

> chrome의 slow 3G 테스트 결과

최종적으로 블로그에 적용된 방법은 결론의 1번 방법 입니다. 적용이유는 slow 3g로 테스트한 결과 눈으로 보여지는 시점에서 `dark`가 적용된 상태로 렌더되는 것이 보였고, 2번 방법으로는 setTimeout과 소스들의 로드되는 시점들이 제각각이어서 1번이 가장 빠르고 최적의 방법이라 생각되었습니다.

-----

> 참고 사이트

[웹 렌더링 - jay님의 블로그](https://velog.io/@jay/html-101-rendering){:target="_blank"}

[DOM Tree](https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/#Main_flow_examples){:target="_blank"}