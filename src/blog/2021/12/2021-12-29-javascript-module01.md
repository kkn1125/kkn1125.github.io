---
slug: "/javascript-module01"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-12-29 16:17:41 +0900
title:  "[JAVASCRIPT] Vanilla JavaScript에서 Module사용하기"
author: Kimson
categories: [ javascript ]
image: assets/images/post/covers/TIL-javascript.png
tags: [ module, vanilla javascript, til ]
description: "Vanilla Javascript에서 Module 사용하기

기능들이 한 파일에 모두 모여있어 제가 짠 코드지만 매우 보기 불편해서 모듈화가 필요하게 되었습니다. 그래서 사용법을 짧게 기록하기 위해 포스팅하게 되었습니다."
featured: false
hidden: false
rating: 3.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# Vanilla Javascript에서 Module 사용하기

기능들이 한 파일에 모두 모여있어 제가 짠 코드지만 매우 보기 불편해서 모듈화가 필요하게 되었습니다. 그래서 사용법을 짧게 기록하기 위해 포스팅하게 되었습니다.

이번 포스팅 주제를 검색하다보니 여러 블로그에서 소개하는 방식을 사용하려 했지만 실패였습니다. 물론 제 이해력이 이만저만해서 좋은 글을 두고도 해결하지 못한 것 같습니다. 😅

## 사용법

예를 들어 계산기 기능을 모듈화 하고 싶다고 가정한다면 아래와 같은 코드가 있다고 생각해봅시다.

```javascript
// calculator.js
function Calculator(){
	this.plus = function(a, b){
		return a + b;
	}
	this.minus = function(a, b){
		return a - b;
	}
	// ... 등등
}

const myCalc = new Calculator();

myCalc.plus(4, 5); // 9
```

이때 이런 저런 기능을 끌어와서 쓴다면 `calculator.js`는 아주 단순해지겠지요.

그렇다면 모듈화를 진행해봅시다.

`html`에서는 아래와 같이 `script`태그에 `type`속성을 달아 `module`이라는 값을 줍니다.

```html
<script src="calculator.js" type="module"></script>
```

이제 모듈화 시킬 기능을 분리합니다.

```javascript
// calc-base.js
function plus(a, b){
	return a + b;
}

function minus(a, b){
	return a - b;
}
// ... 등등

export {plus, minus}; // 내보낼 함수가 많으면 콧수염 괄호에 넣습니다.
```

그럼 이제 모듈화 되었으니 기존에 `calculator.js`에서 `import`합니다.

```javascript
// calculator.js

// from의 경로에는 확장자 명이 있어야 합니다.

import * as calcBase from './calc-base.js'
// 1. 모두 불러오려면 아스트릭을 사용하고 as로 명칭을 부여합니다.
// ex) calcBase.plus ...

import {plus, minus} from './calc-base.js';
// 2. 함수명을 기입해서 특정 함수들만 불러올 수 있습니다.
// ex) plus ...

// 1. 아스트릭을 사용해서 모두 불러올 때 사용 예시
function Calculator(){
	this.plus = calcBase.plus;
	this.minus = calcBase.minus;
	// ... 등등
}

// 2. 특정 함수만을 불러올 때 사용 예시
function Calculator(){
	this.plus = plus;
	this.minus = minus;
	// ... 등등
}

const myCalc = new Calculator();

myCalc.plus(4, 5); // 9
```

이렇게 모듈화를 해봤습니다. `from`경로와 `html`에서 `script`의 `type`을 제대로 `module`값을 주었는지 확인만 한다면 쉽게 사용할 수 있습니다.

복잡하게만 느껴졌는데 막상 사용해보니 매우 단순합니다. 모듈화하면 `script`태그에 `defer`를 준 것과 같다고 하는 이야기를 봤는데 실제 개발자 도구를 열어 확인해 보니 `module`타입을 먹인 `script`가 아닌 `export`로 내보내져서 `import`로 사용되는 모듈들이 나중에 로드 됨을 알 수 있었습니다.

아래는 제가 참고한 사이트입니다.

-----

📚 함께 보면 좋은 내용

[MDNWeb Docs::Import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import){:target="_blank"}

[TAMI님 - [JavaScript] Uncaught SyntaxError: Cannot use import statement outside a module 오류](https://rrecoder.tistory.com/166){:target="_blank"}