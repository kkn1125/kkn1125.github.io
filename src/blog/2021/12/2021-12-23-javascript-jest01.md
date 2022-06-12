---
slug: "/javascript-jest01"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-12-23 21:09:22 +0900
title:  "[JAVASCRIPT] Jest를 사용해보자"
author: Kimson
categories: [ javascript ]
image: /images/post/covers/TIL-javascript.png
tags: [ unit test, jest, test code ]
description: "Jest 사용하기

오늘 올렸던 [JAVA] TDD를 알아보자 포스팅과 관련한 툴의 하나인데요. `node`가 설치되어 있어야 사용할 수 있습니다."
featured: true
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# Jest 사용하기

오늘 올렸던 [[JAVA] TDD를 알아보자]({{site.baseurl}}/java-tdd01) 포스팅과 관련한 툴의 하나인데요. `node`가 설치되어 있어야 사용할 수 있습니다.

자주 보던 유튜브 채널에 `TDD`와 어떻게 테스트 코드를 구현하는지에 대한 내용을 보고 따라하면서 기록으로 남기게 되었습니다.

## 설치 및 설정

> 실행 IDE는 vscode입니다.

### 설치

1. 우선 `node.js`를 설치해주셔야 합니다.
2. `bash` 혹은 `vscode`의 터미널을 열고
3. $ `npm init -y` 입력 후 `package.json`이 생기는지 봅니다.
4. `package.json`이 생겼다면
5. $ `npm install --save-dev jest` 를 입력하여 jest를 설치합니다.

### 설정

`npm init -y`를 입력하면 아래처럼 `package.json`이 생깁니다.

```json
{
  "name": "test01",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

`npm install --save-dev jest` 입력 후 아래와 같이 내용이 바뀌게 됩니다. 이때 `scripts`의 `test`에 `jest`라고 입력 합니다.

```json
{
  "name": "test01",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "scripts": {
    "test": "jest"
  },
  "keywords": [],
  "license": "ISC",

  "author": "",
  "devDependencies": {
    "jest": "^27.4.5"
  }
}
```

위와 같이 `author`와 `devDependencies`가 생기고, `scripts`의 `test`의 값에는 `jest`라고 바꿔줍니다.

그렇게 수정이 끝나면 테스트 실행은 터미널에서 `npm test`라고 하면 `scripts`의 `test` 값을 실행하게 됩니다.

`jest`가 실행되면 초기에는 아무런 테스트코드를 쓰지 않았기 때문에 `fail`이 뜹니다.

## 간단한 테스트

예를 들어 계산기를 만들어야 한다고 가정해봅시다.

기능은 더하기, 빼기, 나누기, 곱하기로 생각하고 더하기부터 코드를 작성합니다.

```javascript
// sum.js
function sum (a, b){
  return a + b;
}

module.exports = sum;
```

이때 `sum.js`에는 `sum`함수가 자리하고 있습니다. `sum`함수는 인자로 `a`와 `b`를 받아 두 인자 값을 더한 값이 반환됩니다.

```javascript
// sum.test.js
const sum = require('./sum');
```

이제 테스트 코드를 작성할텐데요. `sum.test.js`라는 이름으로 파일명을 주면 `jest`가 테스트를 실행할 때 파일을 인지하고 내용의 결과를 나타내주게 됩니다.

테스트 코드를 작성하게 된다면 아래의 코드로 가정할 수 있습니다.

```javascript
// sum.test.js
const sum = require('./sum');

test('[계산기 기능] 더하기 테스트, 숫자와 숫자가 주어질 때', ()=>{
  expect(sum(1, 2)).toEqual(3);
});
```

우리는 `sum`이라는 함수에 인자 값 1과 2가 주어지면 3이 나오는 결과 값을 기대합니다. `expect`함수에 테스트할 함수를 넣고 `toEqual`메서드에 기대하는 결과 값을 주게 되면 맞으면 `pass`, 틀리면 `fail`을 출력해줍니다.

```javascript
// sum.test.js
const sum = require('./sum');

test('[계산기 기능] 더하기 테스트, 숫자와 숫자가 주어질 때', ()=>{
  expect(sum(1, 2)).toEqual(3);
});
```

그렇다면 `fail`을 유도하려면 `toEqual`에 3이 아닌 수를 넣으면, 혹은 문자를 넣으면 `fail`이 발생하게 됩니다.

완성된 코드는 실제 코드로 옮깁니다.

그런데 누군가 `sum`함수의 인자로 문자 "1"의 형태가 와도 계산이 되게 하고싶어 한다면, `a`와 `b`를 `isNaN` 등을 사용해서 검증하고 파싱하는 구문만 추가해서 테스트코드를 작성합니다.

그렇게되면 요구사항을 충족한 코드가 완성이 됩니다.

이 외의 빼기, 나누기, 더하기 기능도 같은 방식으로 테스트 코드를 구현해서 리팩토링하는 등의 과정을 거치고 실제 코드로 옮겨 개발하는 방법론을 `TDD`라고 합니다!

`TDD`가 생각나서 `Jest`를 사용하는 김에 기록을 했습니다.

-----

📚 함께 보면 좋은 내용

[jest.js 홈페이지](https://jestjs.io/)