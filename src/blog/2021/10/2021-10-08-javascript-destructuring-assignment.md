---
slug: "/javascript-destructuring-assignment"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-10-08 21:18:08 +0900
title:  "[JAVASCRIPT] 구조 분해 할당"
author: Kimson
categories: [ javascript ]
image: /images/post/covers/TIL-javascript.png
tags: [ destructuring assignment, til ]
description: "구조 분해 할당

이번에 DocumentifyJS(문서화 js)를 만들면서 자주 사용한 표현식입니다. 구조 분해 할당은 배열이나 객체 속성을 헤체해서 값을 변수마다 담아주는 기특한? 표현입니다."
featured: false
hidden: false
rating: 4.5
toc: true
profile: false
keysum: false
keywords: ""
published: true
---

# 구조 분해 할당

이번에 DocumentifyJS(문서화 js)를 만들면서 자주 사용한 표현식입니다. 구조 분해 할당은 배열이나 객체 속성을 헤체해서 값을 변수마다 담아주는 기특한? 표현입니다.

## 사용방법

```javascript
// 배열의 예
let a, b, c, obj, testObj, g;
let testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

[a, b, ...c] = testArray;

console.log(a, b, c);  // 1 2 (8) [3, 4, 5, 6, 7, 8, 9, 0]
console.log(testArray); // (10) [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

g = [...testArray];
g.pop();
console.log(g, testArray); // (9) [1, 2, 3, 4, 5, 6, 7, 8, 9] (10) [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
```

배열을 다루기가 매우 쉽습니다. 선택적으로 잘라내거나 특정 구간 잘라 객체의 인자로 줘야하거나 할 때 자주 썼습니다.

시작은 React를 공부하는데 이런 표현식으로 사용해서 익숙해지기 위해 이것저것 만들 때 꼭 사용합니다.

```javascript
// 객체의 예

const UserForm1 = ({
    name,
    age,
    gender
}) => {
    return {
        name: name,
        age: age,
        gender: gender,
    }
}

const UserForm2 = function (name, age, gender) {
    return {
        name: name,
        age: age,
        gender: gender
    };
}

function User1(name='', age=20, gender=1){
    this.name = name;
    this.age = age;
    this.gender = gender;
}

const User2 = function (name, age, gender) {
    this.name = name;
    this.age = age;
    this.gender = gender;
}

let user = new User1('james', 29, 'man'); // User2 동일
let user2 = UserForm2('kim', 30, 'man');
let user3 = UserForm2('john', 40, 'man');

console.log(user, user2, user3);
// User {name: 'kim', age: 29, gender: 'man'}
// {name: 'kim', age: 30, gender: 'man'}
// {name: 'kim', age: 40, gender: 'man'}
console.log(Form({name:'yom', age:31, gender:'man'}));
// {name: 'kim', age: 31, gender: 'man'}
console.log(new Forms('tom'));
// Forms {name: 'kim', age: 20, gender: 1}

let {name, age, gender} =  user;

function prints(data){
    console.log(data.name);
}

console.debug('====================')

console.log(name)
console.log(age)
console.log(gender)

prints(user2)

console.debug('====================')

user2.name = 'kolson';

console.log(user2 instanceof UserForm2, user instanceof User1); // false true
console.log(user2 instanceof Object, user instanceof Object); // true true
```

`UserForm1`, `UserForm2`는 객체입니다. `User1`, `User2`가 생성자 함수입니다. 콘솔 상에서도 다른 점을 바로 볼 수가 있는데요.

![예](/images/post/destructure/dest01.png)

위 이미지처럼 객체 앞에 네임의 여부부터 차이가 납니다.

`66`, `67`라인처럼 `instanceof`로 찍어봐도 알 수 있습니다. `UserForm2`의 `instance`가 아닙니다. `Object`의 `instance`입니다. `user`가 왜 `Object`의 `instance`인지는 알고 계실 것이라 생각합니다.

코드기록

-----