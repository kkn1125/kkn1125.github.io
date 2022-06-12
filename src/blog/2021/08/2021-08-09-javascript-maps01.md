---
slug: "/javascript-maps01"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-08-09 13:19:05 +0900
title:  "[JAVASCRIPT] Map 객체 사용"
author: Kimson
categories: [ javascript ]
tags: [map, key, value, til]
image: /images/post/covers/TIL-javascript.png
description: "키 기반의 컬렉션

Set과 비슷하지만 Set은 중복값을 허용하지 않는다는 차이점이 있습니다.  
Set은 이번 주제가 아니니 다음에 다루도록 하고, Map 객체의 특징과 메서드에 대해 알아보겠습니다."
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

# 키 기반의 컬렉션

Set과 비슷하지만 Set은 중복값을 허용하지 않는다는 차이점이 있습니다.  
Set은 이번 주제가 아니니 다음에 다루도록 하고, Map 객체의 특징과 메서드에 대해 알아보겠습니다.

## Map 객체

> [Map][MDN]은 ECMAScript 6에서 소개하는 새로운 데이터 구조 중 하나입니다. key-value쌍으로 저장하며, 저장 순서대로 접근가능합니다. 

[MDN]: https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Keyed_collections 'MDN 참조'

### Map의 메서드

#### `set(key, value)`

{:.table.text-center.mb-5}
|Method|Params|Return|
|---|---|---|
|set|key, value|Map|
|**action**|:**key**와 **value**를 추가||

```javascript
let map = new Map();

map.set('name','kimson'); // value = kimson >> return Map
map.set('age'); // value = undefined >> return Map
```

`set(key, value)`는 `key`만 들어왔을때 `value`가 `undefined`로 지정됩니다.

#### `get(key)`

{:.table.text-center.mb-5}
|Method|Params|Return|
|---|---|---|
|get|key|string|
|**action**|:**key**의 **value**를 얻음||

```javascript
map.get('name'); // return kimson
map.get('age'); // return undefined
```

#### `delete(key)`

{:.table.text-center.mb-5}
|method|Params|Return|
|---|---|---|
|delete|key|boolean|
|**action**|:**key**를 삭제||

```javascript
map.delete('age'); // return true
map.delete('nation'); // return false
```

#### `has(key)`

{:.table.text-center.mb-5}
|method|Params|Return|
|---|---|---|
|has|key|boolean|
|**action**|:**key**가 있는지 여부||

```javascript
map.has('name'); // return true
map.has('age'); // return false
```

#### `clear()`

{:.table.text-center.mb-5}
|method|Params|Return|
|---|---|---|
|clear|-|void|
|**action**|:**Map**객체의 내용 모두 삭제||

```javascript
map.clear('name'); // return true
map.clear('age'); // return false
```

#### `forEach(callback)`

{:.table.text-center.mb-5}
|method|Params|Return|
|---|---|---|
|forEach|callback(val,key,map)|void|
|**action**|:**Map** 객체 순회||

```javascript
map.set('name','kimson');
map.set('age', 15);

map.forEach((value,key,map)=>{ // value, key, map 순서로 인자를 받음
    console.log(value); // kimson 15
    console.log(key); // name age
    console.log(map); // Map(2) {"name" => "kimson", "age" => 15}
});
```


### 그 외 메서드

keys, values, entries가 있으며 for of로 순회가능 합니다. 여기서 for of에 대한 Iterable의 주제는 다음에 Iteration이라는 주제로 포스팅하도록 하겠습니다.

## 정리

마치 사람들이 줄을 서있을 때 몇번째에 누가 있는가를 찾는 것 보다 이름(key)으로 식별하여 대상(value)를 찾는 것이 효율적인 것처럼 `key-value`기반 컬렉션을 다루는 것은 중요하다고 생각합니다.

[복잡한 코드, 규칙을 만들자](https://kkn1125.github.io/javascript-code-style/)편에서 다룬 내용에서는 Array를 주로 사용했습니다.

기능을 구현하는데 있어서 내가 자신있는 방식보다는 데이터를 효율적으로 다룰 수 있는 방식을 채택해서 깊게 공부해볼 필요가 있다고 생각됩니다.