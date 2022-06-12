---
slug: "/javascript-iterable01"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-08-24 14:35:35 +0900
title:  "[JAVASCRIPT] Iteration 알아보기"
author: Kimson
categories: [ javascript ]
tags: [ symbol, iterable, iterator, til ]
image: assets/images/post/covers/TIL-javascript.png
description: "Iterable 알아보기 Iteration Protocols ECMAScript 2015(ES6)에 추가되었으며 2개의 protocol이 있습니다. 먼저 심볼에 대해 알아보려합니다. 이전에 투두리스트에 올려두었던 `Iterable`은 `Object.defineProperty`를 사용하다가 Enumerable과 함께 설명하려고 체크해두었는데 이제야 작성하게 됩니다."
featured: false
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: true
keywords: "
@@Iterator, [Symbol.iterator] : iterator를 만드는 메서드중 하나
_.next() : iterator가 사용할 수 있는 메서드
_Symbol : 원시형 데이터의 일종
_Symbol.iterator : 객체 기본 반복자를 반환하는 메서드 (for..of)에 사용
"
published: true
---

# Iterable 알아보기

## Iteration Protocols

> ECMAScript 2015(ES6)에 추가되었으며 2개의 protocol이 있습니다.

먼저 심볼에 대해 알아보려합니다. 이전에 투두리스트에 올려두었던 `Iterable`은 `Object.defineProperty`를 사용하다가 Enumerable과 함께 설명하려고 체크해두었는데 이제야 작성하게 됩니다.

1. iterable protocol
2. iterator protocol

큰 주제는 Iteration입니다. iteration동작을 정의나, for..of의 loop, 사용자 정의 등을 허용합니다. 그 안에 주요한 개념인 2개의 protocol이 있습니다. `Iterator(반복자)`와 `Iterable(반복가능한)`인데요.  

어떤 내용인지 천천히 살펴보겠습니다.

### Iterable protocol

`iterable protocol`은 `javascript`객체들이 for..of 구조에서 `iteration`동작을 정의하거나 사용자 정의하는 것을 허용합니다.

즉, `iterable`한 객체라는 것은 `@@iterator`메서드를 구현해야하며, `object` 또는 `prototype chain` 오브젝트 중 하나가 `Symbol.iterator` key 속성을 가져야 한다는 것을 의미하고, 자기자신(`iterator`)를 리턴해야합니다.

> 참고로 @@iterator는 메서드이기때문에 함수호출구문으로 적습니다.

#### 사용예제

```javascript
let someWords = "im a test";
console.log(typeof someWord[Symbol.iterator]); // function
console.log(someWord[Symbol.iterator]()); // StringIterator {}

let iterator1 = someWords[Symbol.iterator]();
// iterator를 변수에 담지않고 그대로 .찍어서 출력하면 정상실행되지 않습니다.

// 잘못된 사용 ❌
console.log(someWords[Symbol.iterator]().next()) // {value: "i", done: false}
console.log(someWords[Symbol.iterator]().next()) // {value: "i", done: false}

// 올바른 사용 ✅
console.log(iterator1.next()) // {value: "i", done: false}
console.log(iterator1.next()) // {value: "m", done: false}
```

위의 코드는 `String`의 `built-in` `iterable`객체의 예시입니다. `String`은 기본적으로 `iterable`합니다.

```javascript
let arr = ['test','kimson','tomson','tomcat'];
console.log(arr.entries());//  Array Iterator {}
console.log(arr.entries()[Symbol.iterator]()); // Array Iterator {}
console.log(arr.entries() === arr.entries()[Symbol.iterator]()) // true

// entries()와 entries()[Symbol.iterator]()는 동일합니다.
```

`javascript`에서 몇몇의 `iterator(반복자)`들은 `iterable(반복가능한)`입니다.

#### 내장 iterable

`String`, `Array`, `Map`, `Set은` 내장 `iterable`입니다. 이 객체들의 `prototype`은 모두 `@@iterable` 메서드를 가지고 있기 때문입니다.

```javascript
let arr33 = [5,6,7,8,9,0]
let obj={};
console.log(new Map([[0,"kimson"],[1,'mota'],[2,'gero']]));
console.log(new Map([['name','tom']]));
console.log(new Set("123"));
console.log(new Set([1,2,3]));
console.log(new Set([...arr33]));
console.log(new Array(1,2,3,4,5));

// iterable에 사용되는 문법
let someWords = "im a test";
console.log([...someWords]); // (9) ["i", "m", " ", "a", " ", "t", "e", "s", "t"]
function f() {
  // 브라우저가 for...of 반복문과
  // for 반복문 안의 let 범위의 변수를 지원해야 합니다.
  // 즉, 브라우저마다 함수 동작은 다릅니다.
  for (let letter of arguments) {
    console.log(letter);
  }
}
```

`Map`과 `Set`은 프로토타입으로 `Entries`가 내장되어 있고, `Array`는 `entries()`메서드가 내장되어 있어 모두 `iterable`입니다.

### Iterator Protocol

영어로 되어 있어서 그런지 굉장히 헷갈리는데요. 나중에 표로 정리해둘 예정이니 표를 보시면 좀 더 한 눈에 들어오실 것이라 생각합니다.

`Iterator`는 `next()`메서드를 가지고 있고, `object`를 반환하며 `done`과 `value` 프로퍼티를 가집니다.

```javascript
let str1 = 'kimson';
let str2 = new String('kimson');

console.log(str1 == str2) // true
console.log(str1 === str2) // false
console.log(typeof str1) // string
console.log(typeof str2) // object

// str1의 @@iterator를 재정의 하는 경우는 에러가 발생한다.
// Uncaught TypeError: Cannot create property 'Symbol(Symbol.iterator)' on string 'test some'
str2[Symbol.iterator] = function(){
  return {
    next: function(){
      if(this._first){
        this._first = false;
        return {
          value: "test", done: false
        };
      }
    },
    _first: true
  }
}

let iterator1 = str1[Symbol.iterator]();
let iterator2 = str2[Symbol.iterator]();

console.log(iterator1.next()); // {value: "k", done: false}
console.log(iterator1.next()); // {value: "i", done: false}
console.log(iterator1.next()); // {value: "m", done: false}
console.log(iterator1.next()); // {value: "s", done: false}
console.log(iterator1.next()); // {value: "o", done: false}
console.log(iterator1.next()); // {value: "n", done: false}
console.log(iterator1.next()); // {value: "undefined", done: true}

console.log(iterator2.next()); // {value: "test", done: false}
console.log(iterator2.next()); // undefined
```

위의 예시는 `Iterator`의 예시입니다. `@@Iterator`메서드를 재정의 하고 출력해보니 정상작동이 됩니다.

MDN에 정리된 내용을 보면 무한 `iterator`를 만들 수 있습니다.

> MDN에서 알려주는 idMaker함수 예제

```javascript
function idMaker(){
    var index = 0;

    return {
       next: function(){
           return {value: index++, done: false};
       }
    };
}

var it = idMaker();

console.log(it.next().value); // '0'
console.log(it.next().value); // '1'
console.log(it.next().value); // '2'
// ...
```

잘 사용하면 쓰임의 폭이 넓을 듯 합니다. 가령 짝수로 값을 객체에 나누어 담는다던지 for문의 index값과 다르게 뭔가 국한된 사용범위가 아니어서 활용은 자유자재일듯 합니다.

-----

> 정리해봅시다

|구분|명칭|내용|
| :---------: | :------: | :-----------------------------------------------------------------------------: |
| :         : | Iterable | object or prototype chain 중 어느 하나는 Symbol.iterator 키 속성을 가져야 한다.    |
| ^^ Iteration| Iterator |next()메서드를 가지고 있어야한다. next()메서드를 가진 객체를 Iterator라 한다.         |
| ^^          | : Object의 @@iterator메서드가 자신(Iterator)을 리턴하면 잘 정의된 iterable 이라 할 수 있다. : ||
{:.table.table-bordered.table-hover.text-dark.bg-white}

그 외 for문을 사용하다가 조건부에 함수가 사용될 수도 있는 것을 알았습니다.

```javascript
let i = 0;

function check(data){
  if(i<data){
    return true;
  }
  return false;
}

for(;check();){
  console.log(i);
  i++;
}
```

for문 작성 시 함수에 다른 함수를 섞어 쓰거나 할 때 사용하면 될 것 같습니다.

> 추후에 `Enumerable`에 대해서도 포스팅을 하겠습니다. 자세한 일정은 메인페이지의 `TodoList`를 참고해주시기 바랍니다.