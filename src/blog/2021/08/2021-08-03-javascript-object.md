---
slug: "/javascript-object"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-08-03 20:32:27 +0900
title:  "[JAVASCRIPT] 객체와 프로토타입"
author: Kimson
categories: [ javascript ]
tags: [object, property, prototype, til]
image: assets/images/post/covers/TIL-javascript.png
description: "Object (객체)

자바스크립트가 객체기반의 스크립트 언어인 만큼 중요하다 생각이 됩니다.

객체만 잘 써도 간단한 기능을 하는 라이브러리를 곧바로 만들 수 있을 것이라 생각이 듭니다. (정말 간단히...)

오늘 배운 객체에 대해 정리하고자 합니다."
featured: false
hidden: false
rating: 5
toc: true
profile: false
istop: true
keysum: true
keywords: '.create(protoType [, null]) # 객체 생성
_.getPrototypeOf(object) # 객체 프로토타입 반환
_.keys(object) # 객체 열거 가능 프로퍼티 조회
_.getOwnPropertyNames(object) # 객체 고유 프로퍼티 전체 조회
_.defineProperty(object, "propName", {opt:optVal}) # 객체에 프로퍼티 추가'
published: true
---

# Object (객체)

자바스크립트가 객체기반의 스크립트 언어인 만큼 중요하다 생각이 됩니다.

객체만 잘 써도 간단한 기능을 하는 라이브러리를 곧바로 만들 수 있을 것이라 생각이 듭니다. (정말 간단히...)

오늘 배운 객체에 대해 정리하고자 합니다.

>자바스크립트의 기본 타입(data type)은 객체(Object)이다.

## 객체 기본

객체는 name과 value로 구성된 property(속성)의 비정렬 집합입니다.
프로퍼티 값에 문자, 숫자, 함수가 올 수 있습니다.
이때 함수인 프로퍼티는 method라고 합니다.

```javascript
let person = "kimson";

let human = {
  name: "kimson",
  friend: "tomson",
  age: 29,
  weight: "secret"
};

person // kimson
human.name // kimson
```

<p class="m-0">person은 일반적 선언된 변수의 하나이고, 객체인 human은 많은 프로퍼티를 가진 변수의 하나입니다.</p>
<footer class="blockquote-footer mb-3">수, 문자, 불리언, indefined 타입 외 모든 것이 객체</footer>

## 객체 사용

```javascript
let obj = {
  name: "til",
  age: 5,
  intro: function(){
    return "제 이름은" + this.name + "이고, 나이는 " + this.age + "살 입니다.";
  }
};

obj.name; // til
obj["name"]; // til 대괄호에서 속성 이름을 변수로 지정해서 사용할 수도 있다.

let propName = "name"; // 어딘가에 쓰일 수 있을 것 같다.
obj.[propName]; // til

obj.intro(); // 제 이름은 til이고, 나이는 5살 입니다.
obj.["intro"](); // 제 이름은 til이고, 나이는 5살 입니다.

let propInt = "intro"; // 어딘가에 쓰일 수 있을 것 같다.
obj.[propInt](); // 제 이름은 til이고, 나이는 5살 입니다.

/* 함수명만 적고 괄호 붙이지 않으면 함수호출이 아닌 함수 정의를 뱉어낸다. */
obj.intro; // function(){ return "제 이름은"+this.name + "이고, 나이는 " + this.age + "살 입니다."; }
```

## 객체 생성

### 객체 생성 방법

1. 리터럴 표기
2. 생성자 함수
3. `Object.creat()` 메소드

#### 리터럴 표기

>가장 쉬운 방법 (Literal Notation)

```javascript
let obj = {
  prop1: value1,
  prop2: value2
  [, ...prop]
};

/* example */
let pen = {
  name:"woodPen",
  type:"wood",
  length: 10
};

document.write(`name is ${pen.name}, type is ${pen.type}, length is ${pen.length}`);
// name is woodPen, type is wood, length is 10
```

#### 생성자 함수

>new 연산자를 사용해서 객체 생성, 초기화 가능 (Constructor Function)

```javascript
let date = new Date(); // new로 Date타입 객체 생성

document.write(date.getFullYear()) // 2021
```

객체 생성자 함수를 작성해서 사용할 수 있습니다. 자세한 내용은 프로토타입 공부 후 링크를 걸도록 하겠습니다.

#### `Object.create()` 메소드

```javascript
Object.create(
  propType, { ...prop}
);
```

Object.create()의 첫번째 인수로 프로토타입으로 사용할 객체를 전달하고, 두번째는 새 객체의 프로퍼티 정보를 전달합니다.

```javascript
let obj = Object.create(null, // null 프로토타입 사용
{
  x: { // x 좌표 프로퍼티
    value: 100,
    enumerable: true
  },
  y: { // y 좌표 프로퍼티
    value: 250,
    enumerable: true
  }
});

obj.x; // { value: 100, enumerable: true }
obj.y; // { value: 250, enumerable: true }
Object.getPrototypeOf(obj); // null
// 객체 프로토 타입 반환
```

## 프로토 타입

>javascript는 객체를 상속하기 위해 프로토타입이라는 방식을 사용합니다.

java에서 사용하던 implements, extends의 js버전인것 같습니다.
원형이 되면서 자동으로 새로운 객체에 상속이 되는 것으로 이해했습니다.

### 상속(inheritance)

>새로운 클래스에서 기존 클래스의 모든 프로퍼티와 메소드를 사용할 수 있는 것을 의미합니다.

즉, javascript에서는 모든 객체가 프로토타입이라는 객체를 가지고 있으며, 그 프로토타입으로부터 property와 method를 상속 받습니다.  

```javascript
function Person(name, age, hair){
  this.name = name;
  this.age = age;
  this.hair = hair;
}

let kimson = new Person("kimson", 29, "long");
// kimson객체가 Person이라는 프로토타입을 가짐

kimson.name; // kimson
// name이라는 프로퍼티를 공통으로 사용가능
```

자바로 예를 들면 공통적으로 바로 사용가능하다는게 느껴집니다.

```java
package com.example.web;

import org.junit.Test;

public class test2Class extends Person
// 상속
{
 @Test
 public void testing() {
  System.out.println(info()); // name is kimson, age is 15, hair is long
    // info()라는 메소드 new나 static지정 없이 사용가능
 }
}

class Person{
 protected String name = "kimson";
 protected int age = 15;
 protected String hair = "long";
 
 Person(){}

 public Person(String name, int age, String hair) {
  super();
  this.name = name;
  this.age = age;
  this.hair = hair;
 }
 
 public String info() {
  return "name is "+this.name+", age is "+this.age+", hair is "+this.hair;
 }
 
 // getter, setter...
}
```

### 프로토타입 체인

>javascript에서는 객체 이니셜라이저를 사용해서 생성된 같은 타입 객체들은 모두 같은 프로토타입을 가집니다.  
new연산자를 통해 생성된 객체는 생성자 프로토타입을 자신의 프로토타입으로 상속받습니다.

```javascript
function Dog(name, age){
  this.name = name;
  this.age = age;
}

let myDog = new Dog(); // myDog 객체의 프로토타입은 Dog.prototype
Object.getPrototypeOf(myDog);
// constructor, prototype: Object
// 기본적으로 Object는 프로토타입으로 상속받고
// constructor>prototype은 Dog객체가 된다.
```

#### 프로토타입 생성

```javascript
/** 
 * 보통 객체 생성자 함수 작성 시 관례상 이름 첫문자를
 * 대문자로 작성한다고 합니다.
 */

/* Pen Prototype */
function Pen(color, meterial, brand){
  this.color = color; // color property
  this.meterial = meterial; // merterial property
  this.brand = brand; // brand property
}

let myPen = new Pen("white", "wood", "monami");
document.write("펜 색상은 " + myPen.color + "이고, 재질은 " + myPen.meterial + "이며, " + myPen.brand + "의 제품입니다.");
// 펜 색상은 white이고, 재질은 wood이며, monami의 제품입니다.
```

#### 프로퍼티, 메소드 추가

>프로퍼티, 메소드는 간단하게 생성할 수 있습니다.

```javascript
function Pen(color, meterial, brand){
  this.color = color; // color property
  this.meterial = meterial; // merterial property
  this.brand = brand; // brand property
}

let myPen = new Pen("red", "carbon", "monami");

myPen.price = 10000;

myPen.info = function(){
  // 여기서 this는 Pen 프로토타입에 상속된 myPen객체을 가리킨다. [Object object]
  return "My " + this.constructor.name + " is "
  + this.color + " and costs " + this.price + " won. It is made of " + this.meterial + " and the brand is " + this.brand;
  // this.constructor은 myPen객체의 프로토타입(Pen)을 가리킨다. function Pen(color, mreterial, ...) { ... }
}

myPen.info() // My Pen is red and costs 10000 won. It is made of carbon and the brand is monami
```

위 예제에서 price 프로퍼티 와 info() 메소드는 myPen 인스턴스에만 추가되며, Pen객체나 이후 생성되는 Pen객체에도 추가되지 않습니다.

#### Prototype 프로퍼티, 메소드 추가

>이번에는 인스턴스가 아닌 Prototype의 프로퍼티, 메소드를 추가하는 것입니다.

```javascript
function Pen(color, meterial, brand){
  this.color = color; // color property
  this.meterial = meterial; // merterial property
  this.brand = brand; // brand property
}

let myPen = new Pen("gray", "plastic", "kimson");
myPen.price; // undefined

Pen.prototype.price = 5000;

myPen.price; // 5000

Pen.price; // undefined

Pen.prototype.price; // 5000
```

여기서 prototype에 price를 추가했더니 생성되는 인스턴스에서 곧바로 price를 출력할 수 있습니다.  
하지만 Pen에서 price를 꺼내려하니 되지 않고, prototype.price를 해야 불러올 수 있습니다.

즉, 객체는 프로토타입을 상속받게 되는데 상속받은 프로퍼티는 위의 자바 예제를 든 부분과 같이 직접 부모의 프로퍼티를 사용할 수 있었습니다.

새로 추가되는 프로토타입의 프로퍼티 또한 자식객체가 바로 사용가능 하고, 부모객체는 프로토타입에 price가 지정되었기 때문에 Pen.prototype.price로 가져오기가 가능합니다.

#### 프로퍼티 삭제

>객체 프로퍼티 삭제는 간단합니다. 먼저 객체 프로퍼티 참조 방법을 다시 보겠습니다.

```javascript
Obj.propName;

Obj["propName"]; // or Obj[var] var라는 변수에 문자를 담아 사용 가능합니다.

/* 삭제 */

delete Obj.propName;
// delete Obj["propName"] 동일

function Cat(color, name){
  this.color = color;
  this.name = name;
}

let meow = new Cat("white", "mimi");

meow.color; // white

delete meow.color; // color prop 삭제

meow.color; // undefined
```

### 객체 프로퍼티 열거

#### 프로퍼티 추가

>javascript에서 for in 문을 사용하여 프로퍼티 순회가 가능합니다.
이때 열거 가능인지 아닌지에 따라 순회 결과가 달라집니다.

for in 문 외에 객체 프로퍼티 순회 방법

- `Object.keys()` 열거 가능 프로퍼티 조회
- `Object.getOwnPropertyNames()` 고유 프로퍼티 전체 조회

```javascript
function Cat(color, name){
  this.color = color;
  this.name = name;
}

let newCat = new Cat("gray", "coco");

Object.defineProperty(newCat, 'color', {
  // enumerable 외 지정된 속성이 있습니다.
  // configurable, value, writable, get, set ...
  enumerable: false // 열거 거부
});

Object.defineProperty(newCat, 'age', {value:2});

/* enum false 설정된 프로퍼티 외 전부 출력 */
Object.key(newCat); // name

/* 모든 프로퍼티 출력 */
Object.getOwnPropertyNames(newCat); // color,name

/* define된 color값 호출 (enum은 내용 안나옴) */
newCat.color; // gray
newCat.color.enumerable; // 

/* define된 age값 호출 */
newCat.age; // 2
// value속성의 값만 newCat의 프로퍼티로 하여 호출가능
// 나머지 enum, conf, 등의 속성 값 조회는 다음에 다루겠습니다.
```

문득 드는 생각으로 설정페이지를 만들때 enumerable을 사용하면 편리하겠다는 생각이 들었습니다.

```javascript
let Board = function(title, contents, author){
    this.title = title;
    this.contents = contents;
    this.author = author;
    this.hidden = false;
    this.option = function(target, name, hidden){
        this[target] = Object.defineProperty(this,'author',{[name]: !hidden});
        return this.hidden;
    }
    this.redefine = function(option){
        this.option(option.target,option.name,option.value);
    };
}

let nb = new Board("테스트", "컨텐트", "kkn1125");

console.log(nb.title)
console.log(nb.contents),
console.log(nb.author);

nb.redefine({
  target:'author',
    name: 'enumerable',
    value: true // 값이 반대로 설정되므로 false 값입니다.
}); // 설정 페이지에서 on/off 기능 구현

console.log(nb.hasOwnProperty("author")); // true
console.log(nb.propertyIsEnumerable('author')); // false
```

spring이나 동적 웹에 활용한다면 회원설정메뉴 페이지를 만들고, 쿠키설정이나 ajax활용 등으로 view단에서 회원별로 쉬운 게시판 커스터마이징이 구현될 것으로 보입니다.

-----

객체의 특징을 알아보았습니다. 사용해보고 응용해보면 무궁무진한 기능을 구현할 수 있을 것이라 생각됩니다. 이러한 내용을 토대로 기존에 만들어두었던 달력을 업데이트하는데 사용 가능할 것 같습니다.

아래에 Object(객체)의 중요 함수를 나열해두었습니다. 참고바랍니다.

[defineProperty - MDN mozilla 설명 참조](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty 'defineProperty 상세'){:target="_blank"}