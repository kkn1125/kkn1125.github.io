---
slug: "/javascript-new-target01/"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-08-26 15:07:42 +0900
title:  "[JAVASCRIPT] new target 알아보기"
author: Kimson
categories: [ javascript ]
tags: [ new, target, til ]
image: /images/post/covers/TIL-javascript.png
description: "new.target을 써보자

인스턴스를 만들 때나 보던 new에 점을 찍고 target이라는 것을 사용하는게 굉장히 생소했습니다. 아직 배울게 많은가 봅니다.

new.target은 new연산자를 사용했는지 여부를 감지하는 것인데요. 인스턴스화된 생성자와 함수에서 new.target은 생성자 or 함수참조를 반환합니다."
featured: false
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# new.target을 써보자

인스턴스를 만들 때나 보던 new에 점을 찍고 target이라는 것을 사용하는게 굉장히 생소했습니다. 아직 배울게 많은가 봅니다.

new.target은 new연산자를 사용했는지 여부를 감지하는 것인데요. 인스턴스화된 생성자와 함수에서 new.target은 생성자 or 함수참조를 반환합니다.

## 함수호출에서 new.target

```javascript
function kimson() {
    if(!new.target){
        console.log("new를 사용하지 않았다!");
        console.log("new.target 값 : " + new.target);
    } else {
        console.log("new를 사용했다!");
        console.log("new.target 값 : " + new.target);
    }
}

kimson();
// new를 사용하지 않았다!
// new.target 값 : undefined
new kimson();
// new를 사용했다!
// new.target 값 : function kimson() {
//     if(!new.target){
//         console.log("new를 사용하지 않았다!");
//         console.log("new.target 값 : " + new.target);
//     } else {
//         console.log("new를 사용했다!");
//         console.log("new.target 값 : " + new.target);
//     }
// }

function A(name, age){
    this.name = name;
    this.age = age;
    return new.target;
}

let kim1 = new A('kimson', 29);
let kim2 = A('kimson', 29);

console.log(kim1);
// ƒ A(name, age){
//     this.name = name;
//     this.age = age;
//     return new.target;
// }
console.log(kim2);
// undefined
```

> `new`를 사용하지 않았을 때의 결과값이 `undefined`이고, 여기에 느낌표가 붙어 `!undefined`이면 `undefined`는 `false`로 보기때문에 값이 `true`가 됩니다.

코드에서 보듯이 `new.target`은 조건식에 느낌표를 붙여 `true`가 되었다해서 `boolean`으로 값을 리턴하는 것이 아닙니다. `new.target`은 형태가 `객체.속성명`으로 되어있지만 `new.`이 실제 객체는 아닙니다.

MDN Web Docs의 `new.target`설명에 따르면 `new.`는 가상 문맥이고, `new.target` 속성은 모든 함수가 이용할 수 있는 메타 속성이라 합니다.

## 클래스생성자에서 new.target

```javascript
class Kimson{
    constructor(){
        console.log(new.target);
        console.log(new.target.name)
    }
}

class Tomson extends Kimson{
    constructor(){
        super();
    }
}

let a = new Kimson();
// class Kimson{
//     constructor(){
//         console.log(new.target);
//         console.log(new.target.name)
//     }
// }
// Kimson

let b = new Tomson();
// class Tomson{
//     constructor(){
//         console.log(new.target);
//         console.log(new.target.name)
//     }
// }
// Tomson

// let c = Kimson(); 에러 발생 class는 new 연산자 없이 호출이 불가
```

클래스는 함수와 다르게 `new` 연산자 없이는 호출이 불가하므로 `new`를 사용했을 때 `new.target`의 값에만 주목하였습니다.

`new.target`을 사용하면 인스턴스화 된 클래스 자신을 반환하였습니다.

## new.target의 활용

위의 내용을 토대로 간단하게 응용을 해보겠습니다.

### new 사용 강제하기

```javascript
function test(name){
    if(!new.target) throw 'new 연산자를 사용하세요.';
    this.name = name;
}

let a;
try{
    a = test("kimson");
} catch(ex){
    console.error(ex); // new 연산자를 사용하세요.
}
console.log(a); // undefined
```

`new`를 쓰지 않고 실수로 함수를 바로 호출했을 때 그것을 방지하도록 막을 수도 있습니다.

### new 미사용시 인스턴스화 해주기

```javascript
function A(name, age){
    if(!new.target){
        console.log("new를 사용하지 않아 자동으로 인스턴스를 생성합니다.")
        return new A(name, age);
    }
    this.name = name;
    this.age = age;
}

let kim1 = new A('kimson', 29); // 인스턴스 생성
let kim2 = A('kimson', 29); // 함수 내에서 인스턴스를 리턴
// new를 사용하지 않아 자동으로 인스턴스를 생성합니다.

console.log(kim1); // A {name: "kimson", age: 29}
console.log(kim2); // A {name: "kimson", age: 29}
```

만일 함수 내 `if`문이 없다면 받는 게 없고 그저 `A`라는 함수를 호출만 했으니 `kim2`는 `undefined`일 것입니다. 그리고 `return`에서 `new`를 뺀다면 무한루프에 빠지게 됩니다. 계속해서 `A`함수를 호출하는 형식이 되어 버립니다.

-----

아래의 표는 함수,생성자별로 호출 또는 인스턴스화 했을 때 반환되는 new.target의 값을 정리한 겁니다.

{:.table.table-hover.text-dark.bg-white}
|**구분**|**invoke**|**new**|
|:---:|:---:|:---:|
|함수|undefined|function(자신)|
|생성자|에러발생(new 없이 호출 불가)|class(자신)|

예제를 만들어보면서 정리해보았는데요. new.target은 new연산자의 제어에 많이 사용될 것으로 보입니다. 특히나 라이브러리를 만들때 조건으로 많이 달 듯 합니다.