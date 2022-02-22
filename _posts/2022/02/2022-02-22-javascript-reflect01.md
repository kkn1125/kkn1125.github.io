---
layout: post
date:   2022-02-22 21:22:08 +0900
title:  "[JAVASCRIPT] Proxy와 Reflect 맛보기"
author: Kimson
categories: [ JAVASCRIPT, TIL ]
image: assets/images/post/covers/TIL-javascript.png
tags: [ proxy, reflect ]
description: "Proxy 와 Reflect Proxy 프록시 객체는 기본적인 동작의 새로운 행동을 정의할 때 사용한다고 MDN에 정리 되어 있습니다. 사용해보고 느낀 것은 동작되는 것을 가로채서 무언가 부수적인 일을 시킬 때 사용하는 것으로 보입니다."
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

# Proxy 와 Reflect

## Proxy

프록시 객체는 기본적인 동작의 새로운 행동을 정의할 때 사용한다고 MDN에 정리 되어 있습니다. 사용해보고 느낀 것은 동작되는 것을 가로채서 무언가 부수적인 일을 시킬 때 사용하는 것으로 보입니다.

`Proxy`는 `new` 연산자로 인스턴스를 만들어 사용합니다.

기본적인 구문은 아래와 같습니다.

```javascript
new Proxy(target, handler);
```

예제를 보면 `validate`나 함수 호출 감지 등의 예제가 많은데요. 간단하게 특정 함수 호출을 감지하는 것을 예제로 보겠습니다.

```javascript
const handler = {
   apply: function (target, thisArg, args){
      console.log('함수 호출!');
      return Reflect.apply(target, thisArg, args);
   }
}

function introduce(name, age){
   return `My name is ${name}, ${age} year-old!`;
}

const intro = new Proxy(introduce, handler);

console.log(intro('킴슨', 30));
// 함수 호출!
// My name is 킴슨, 30 year-old!
```

위의 예제에서 보면 `intro`라는 프록시는 함수가 호출될 때 `handler`의 `apply`가 `introduce`함수의 `apply`를 가로채서 내용을 조작 또는 수정 가능하게 합니다.

`handler`에서 `return`을 주는 이유는 `introduce`의 리턴 값을 원래 설정한 리턴 값으로 주기 위해서 입니다.

`Reflect`는 `Proxy`와 동일한 메서드를 가지고 있고, `Proxy` 내에서 사용될 때 `Reflect`를 반환하면 `Side effct(부작용)` 없이 사용 할 수 있습니다.

## Reflect

`Reflect`는 `Object`의 메서드들과 비슷합니다. 그 중에서 편리한 차이점을 가진 `defineProperty`를 보면

```javascript
Object.defineProperty({}, 'name', {value: 'test'});
// {name: 'test'}
Reflect.defineProperty({}, 'name', {value: 'test'});
// true
```

코드를 보면 `Object`의 `defineproperty`는 재정의된 객체를 반환하는 반면, `Reflect`의 `defineProperty`는 `boolean` 값을 반환합니다.

성공하면 `true`, 실패하면 `false`입니다. `Object`로 할 경우 실패하면 `Error`를 `throw`해서 `try...catch`로 에러를 처리해줘야 하지만 `Reflect`로 재정의 하면 `try...catch`문 쓸 필요 없이 `if...else`로 처리 가능하게 됩니다.

```javascript
// Object
try{
   Object.defineProperty({}, 'name', {value: data});
} catch(e){
   console.error(e.message);
}

// Reflect
if(Reflect.defineProperty({}, 'name', {value: data})){
   // 성공했을 때 !
} else {
   // 실패했을 때 !
}
```

아주 간단하게 사용법만 훑어보았습니다. 개인적으로 굉장히 유용하다고 생각이 됩니다. 아직 못 해본 기능을 테스트할 때 많이 활용해보고 제 것으로 만들어 봐야겠다는 생각이 듭니다 😁

이 다음 포스팅도 이어서 해보려 합니다. 기록은 여기까지고 더 폭 넓게 알아보시려면 아래에 참고한 링크를 보시면 되겠습니다 👋

-----

📚 함께 보면 좋은 내용

[MDN Web Docs :: proxy](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
[박성룡님 미디움](https://pks2974.medium.com/javascript-proxy-%EC%99%80-reflect-%EA%B0%84%EB%8B%A8-%EC%A0%95%EB%A6%AC%ED%95%98%EA%B8%B0-5f1ccaa51b2e)