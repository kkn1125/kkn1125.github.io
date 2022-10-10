---
slug: "/javascript-object-assign/"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-08-19 20:01:02 +0900
title:  "[JAVASCRIPT] Object assign 활용하기"
author: Kimson
categories: [ javascript ]
tags: [ object, assign, multi-set, til ]
image: /images/post/covers/TIL-javascript.png
description: "Object assign 메서드

`assign`이라는 메서드는 이렇습니다. 대상 객체로부터 열거 가능한 하나 이상의 속성들을 목표 객체로 복사합니다. 수정된 객체를 반환하는 특징이있습니다.
기본적으로 사용방법은 위와 같이 간단합니다. 만일 특정 요소에 `style`이나 `attribute`를 여러개 설정하려면 `setAttribute('property','value')`로 단일 요소를 작성하거나, `el.style.property = value`로 스타일을 단일로 지정하였습니다."
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

# Object assign 메서드

`assign`이라는 메서드는 이렇습니다. 대상 객체로부터 열거 가능한 하나 이상의 속성들을 목표 객체로 복사합니다. 수정된 객체를 반환하는 특징이있습니다.

```javascript
const foo = { a: 1, b: 2 };
const bar = { b: 4, c: 7 };

const result = Object.assign(foo, bar);

console.log(result); // { a: 1, b: 4, c: 7 }
```

기본적으로 사용방법은 위와 같이 간단합니다. 만일 특정 요소에 `style`이나 `attribute`를 여러개 설정하려면 `setAttribute('property','value')`로 단일 요소를 작성하거나, `el.style.property = value`로 스타일을 단일로 지정하였습니다.

이제 `jquery`처럼 여러 속성을 더 단순하게 설정할 수 있게 됐습니다. 

```javascript
const element = document.getElementById('test');

Object.assign(element.style,{
    backgroundColor: 'blue',
    color: 'coral',
    fontSize: '14px',
    // ...
});

Object.assign(element, {
    class: "test awesome",
    id: "first",
    style: `
        color: blue;
        background: yellow;
    `
});

// setAttributes 함수 생성
function setAttributes (el, options={}){
    Object.keys(options).forEach(x=>{
            console.log(options[x])
            el.setAttribute(x, options[x])
        }
    );
}

setAttributes(document.body, {
    class: 'test',
    id: 'tom'
});
```

`style`설정은 `style`이 `CSSStyleDeclaration` 객체에 설정값이 담겨있습니다. 참고로 위의 방식으로 `style` 설정한다면 `camelCase`로 속성값을 작성해야합니다.

`Element`의 속성에 클래스와 아이디를 주는 등 요소의 프로퍼티를 설정 할 수도 있습니다. 물론 `style`도 같이 설정해줄 수 있습니다.

함수를 만드는 방법 또한 있습니다만 새로 함수를 만들기보다는 기존에 있는 assign을 활용하는게 저는 마음에 듭니다.

또 다른 방법이 있습니다. `cssText`라는 프로퍼티에 여러 `style`속성을 `css`파일에서 적듯이 적을 수도 있습니다.

```javascript
document.body.style.cssText = `
    background-color: red;
    color: blue;
    opacity: .5;
`
```

> 참고 사이트

[stack overflow 다중 속성 설정](https://stackoverflow.com/questions/12274748/setting-multiple-attributes-for-an-element-at-once-with-javascript)

[stack overflow 다중 스타일 설정](https://stackoverflow.com/questions/3968593/how-can-i-set-multiple-css-styles-in-javascript)