---
layout: post
date:   2022-02-22 21:22:08 +0900
title:  "[JAVASCRIPT] Proxy와 Reflect 맛보기 02 - Todo List를 만들어보자"
author: Kimson
categories: [ JAVASCRIPT, TIL ]
image: assets/images/post/covers/TIL-javascript.png
tags: [ proxy, reflect ]
description: "Todo List를 만들어 보자 Proxy를 통한 내용 자동 업데이트

`Proxy`를 이용해서 변수 변경을 감지, 즉, 정확히 말해서 객체의 속성 값이 변경되는 것을 감지해서 자동으로 화면을 업데이트 하는 `Todo List`를 만들려고 합니다. 최근에 `Svelte`를 `Vue`와 다른 차이점을 접하기 위해 사용해보고 있는데요. 예전에 `Vue`가 어떻게 자동으로 변수를 업데이트하는지 `class`를 사용해 컴포넌트를 만들고, 컴포넌트가 생성될 때 로직을 짜 넣어 변수 업데이트를 했던 기억이 납니다."
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

# Todo List를 만들어 보자

## Proxy를 통한 내용 자동 업데이트

`Proxy`를 이용해서 변수 변경을 감지, 즉, 정확히 말해서 객체의 속성 값이 변경되는 것을 감지해서 자동으로 화면을 업데이트 하는 `Todo List`를 만들려고 합니다.

최근에 `Svelte`를 `Vue`와 다른 차이점을 접하기 위해 사용해보고 있는데요. 예전에 `Vue`가 어떻게 자동으로 변수를 업데이트하는지 `class`를 사용해 컴포넌트를 만들고, 컴포넌트가 생성될 때 로직을 짜 넣어 변수 업데이트를 했던 기억이 납니다.

우선 `Proxy`가 속성 값을 감지하는 방식은 `setter/getter`로 감지하고 후행되는 무언가를 작성하게 되는데요. 이는 `Object`의 `defineProperty`와 비슷하지만 명확한 차이가 있습니다.

### Object의 속성 감지

먼저 `Object`를 예로 들어봅시다.

```javascript
const autoValue = {};

Object.defineProperty(autoValue, 'watch', {
   set(data){
      console.log('Value has changed !');
      this._watch = data;
   },
   get(){
      console.log('This type is ' + typeof this._watch);
      return this._watch;
   }
});

autoValue.a = 1;
console.log(autoValue.a); // 1

autoValue.watch = 1; // Value has changed !
console.log(autoValue.watch);
// This type is number
// 1
```

여기 있는 예제를 보면 `autoValue`라는 객체에 `watch`라는 프로퍼티에 `setter`와 `getter`를 설정합니다. `watch` 프로퍼티에 값을 지정하면 "변경되었다"고 알려주고, 값을 가져오면 가져온 값의 타입을 알려주면서 값을 줍니다.

만일 `autoValue`라는 객체에 새로 생성되거나 현재 가지고 있는 속성들 전체에 대해 `setter`와 `getter`를 공통으로 적용하려면 어떻게 해야할까요?

### Proxy의 속성 감지

`Proxy`가 물론 이러한 쓰임새는 아닐거라 생각합니다. 더 폭 넓은 이유를 가졌을 것이고, Proxy를 다른 영역에 사용하면 더 많은 유용한 기능을 만들 수 있겠죠 :\)

각설하고, `Proxy`에서 setter와 getter를 지정하는 방법을 보겠습니다.

```javascript
let autoValue = {};
const autoValueHandler = {
   set(target, thisArg, args, proxy){

   },
   get(target, thisArg, proxy){
      return Reflect.apply(target, thisArg); // proxy는 뺍니다.
   }
};

autoValue = new Proxy(autoValue, autoValueHandler);
```

`autoValue`를 덮어쓰는 이유는 타깃 객체를 참조하는 코드가 만일 있다면 엉망이 될 확률이 높기 때문입니다.

`setter`는 인자로 타겟 되는 원본 객체와 `this`, `arguments`, `proxy`를 받습니다. 지금은 `proxy`를 쓸 일이 없지만 이런 것이 같이 온다는 것만 알고 있어도 됩니다.

그러면 이 `Proxy`로 `Todo List`를 하나 씩 만들어 보겠습니다.

> 배열을 `Proxy`로 사용한다면 `setter`에서 `return`값을 성공하면 `true`, 아니면 `false`를 명시해야합니다. `falsy`한 값이 오면 `TypeError`가 트리거 됩니다. 그리고 객체와 달리 배열은 `push`를 한 후에 `length`값을 자동으로 지정하기 때문에 마지막 `length`에 대해서 `true`를 반환해 줘야합니다.

## Todo List 만들기

먼저 `html`을 간단하게 짭니다. 저는 아래와 같이 했습니다.

```html
<div id="display">내용이 없습니다</div>
<div id="remaining">0개 중 0개 완료 구문 👍</div>
<input type="text" id="input">
```

`Todo List`의 데이터를 감지하는 `Proxy`를 만듭니다.

```javascript
const display = document.querySelector('#display');
const input = document.querySelector('#input');

let todoList = {};

todoList = new Proxy(list, {
   set(origin, propName, arg, proxy) {
      if(propName == 'todos') {
         if(!origin[`_${propName}`]) origin[`_${propName}`] = [];
         // todos가 없으면 배열로 값을 초기화합니다.
         if(arg instanceof Array) origin[`_${propName}`] = arg;
         // 배열이 들어오면 값을 배열로 대체합니다.
         else origin[`_${propName}`].push(arg);
         
         completionCountNotification(origin[`_${propName}`]);
         writeOnDisplay(origin[`_${propName}`]);
      }
      else origin[`_${propName}`] = arg;
      // todos 외에는
   },
   get(origin, propName, proxy) {
      if(propName == 'todos') return origin[`_${propName}`] || [];
      else return origin[`_${propName}`];
   }
});

function completionCountNotification(target) {
    return remaining.innerHTML = `${target.length}개 중 ${target.filter(t=>t.done).length}개 완료 👍`;
}

function writeOnDisplay(target) {
    return display.innerHTML = target.map((t, i) =>
        `<li>
            <span class="${t.done?'check':''}">${i+1}. ${t.text||''}</span>
            <button ${t.done?'class="checked"':''} onclick="checkHandler(${t.id})">Check</button>
            <button onclick="deleteHandler(${t.id})">&times;</button>
        </li>`)
        .join('');
}
```

`todoList`를 `Proxy`로 사용하고 데이터가 `set` 될 때마다 `writeOnDisplay`와 `completionCountNotification` 함수가 화면을 업데이트 해줍니다.

여기서 아직 구현하지 않은 것은 작성내용을 엔터키 했을 때 저장되는 것, 체크를 누르면 완료 되는 것, x버튼을 클릭하면 삭제되는 것 입니다.

화면은 데이터를 `todos`에 입력해주기만 하면 자동으로 되기 때문에 위 3가지 기능만 만들면 됩니다.

```javascript
function writeOnDisplay(target) {
   //  return display.innerHTML = target.map((t, i)=>
   //      `<li>
   //          <span class="${t.done?'check':''}">${i+1} ${t.text||''}</span>
   //          <button>Check</button>
   //          <button>&times;</button>
   //      </li>`)
   //  .join('');
   return display.innerHTML = target.map((t, i)=>
        `<li>
            <span class="${t.done?'check':''}">${i+1} ${t.text||''}</span>
            <button onclick="checkHandler(${t.id})">Check</button>
            <button onclick="deleteHandler(${t.id})">&times;</button>
        </li>`)
    .join('');
}

function checkHandler(id) {
    todoList.todos = todoList.todos.map(t => {
        if (t.id == id) t.done = !t.done;
        return t;
    })
}

function deleteHandler(id) {
    todoList.todos = todoList.todos.filter(t => t.id != id);
}

input.addEventListener('keyup', (ev) => {
    if (ev.key == 'Enter') {
        if(ev.target.value=='') return;

        todoList.todos = {
            id: [...todoList.todos].reduce((t, n) => t < n.id ? n.id : t, 0) + 1,
            text: ev.target.value,
            done: false,
        }

        ev.target.value = '';
    }
});
```

이어서 `writeOnDisplay`함수를 수정했습니다. `onclick`속성을 달아 checkHandler함수를 실행하는데 id값을 전달하도록 합니다. `deleteHandler`도 마찬가지입니다.

그리고 처음에 설정해둔 input에 이벤트 리스너를 `keyup` 타입으로 작성합니다. `Enter` 입력 때는 `todoList.todos`에 `todo`의 아이디가 가장 높은 값에 1을 더해 아이디 값을 부여하고, 텍스트를 적어 `done`을 `false`로 입력합니다.

마지막으로 `input` 값을 초기화하면 아까 사용한 `Proxy`로 데이터가 들어가고, 항목이 추가되어 화면이 업데이트 됩니다.

데이터를 저장하면서 쓰고 싶다면 `localStorage`를 사용하면 됩니다.

## 결과

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/proxy/proxy01.png" alt="결과" title="결과">
   <figcaption>결과</figcaption>
</span>
</figure>

## Scss로 조금 꾸민 후

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/proxy/proxy02.png" alt="꾸민 후" title="꾸민 후">
   <figcaption>꾸민 후</figcaption>
</span>
</figure>

-----

📚 함께 보면 좋은 내용

[MDN Web Docs :: proxy](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Proxy)