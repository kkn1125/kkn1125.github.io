---
slug: "/vue-add-attributes"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2022-01-21 20:17:54 +0900
title:  "[VUE] 컴포넌트, 엘리먼트에 다중 속성 보내기"
author: Kimson
categories: [ vue ]
image: assets/images/post/covers/TIL-vue.png
tags: [ attributes, multi, component, til ]
description: "컴포넌트, 엘리먼트에 다중 속성 보내기
기억하고자 가볍게 올리는 것이니 참고 바랍니다.

최근 여러 포트폴리오를 양산하는게 아닌가 싶어서 제대로 하나만 파고자 기존에 만들었던 JSP포트폴리오 중 열심히 했던 프로젝트를 새로 습득한 기술을 적용하고 업데이트 하고자 리뉴얼 중입니다."
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

# 컴포넌트, 엘리먼트에 다중 속성 보내기

> 기억하고자 가볍게 올리는 것이니 참고 바랍니다.

최근 여러 포트폴리오를 양산하는게 아닌가 싶어서 제대로 하나만 파고자 기존에 만들었던 JSP포트폴리오 중 열심히 했던 프로젝트를 새로 습득한 기술을 적용하고 업데이트 하고자 리뉴얼 중입니다.

간단히 상황을 알려드리자면 현재 프론트는 최근에 배운 `Vue`를 사용하고 `Spring framework`를 이용해 서버를 만들고 있습니다.

`vue`에 대한 감이 잡히는 시점에서 속성명 동적 바인딩이나 동적 컴포넌트를 로드하는 것도 알겠는데 여러 속성이 있고 각 엘리먼트마다 적용되는 속성이 다를 때 어떻게 한 번에 적용할까 생각을 했습니다.

## 문제 상황

```javascript
// module-signup.js
Vue.component('module-signup', {
    props: ['orders'],
    template: `
        <div
        style="min-height: 300px;"
        class="form-signup col-15 text-center mx-auto">
            <div
            v-for="item in orders"
            :class="['signup', item.show?'':'hide']"
            :key="item.id">
                <div>
                    <span class="h3">{{item.title}}</span>
                </div>
                <div class="w-flex flex-column">
                    <input
                    v-for="i in item.input"
                    :name="i.name"
                    v-bind="i.options" << 바로 이녀석
                    pattern=""
                    class="form-input form-input-lg"
                    :type="i.type??'text'">
                </div>
            </div>
        </div>
    `
});
```

`module-signup`이라는 전역 컴포넌트가 있습니다. 다른 페이지에서 재사용하기 위해서 전달되는 옵션들을 자동으로 넣으려하는 상황입니다. 이 모듈을 사용하는 곳은 아래와 같습니다.

```javascript
// app-signup.js
export default {
   data() {
      return {
         current: 0,
         btnStyle: ['btn', 'btn-info', 'btn-lg', 'px-2', 'rounded-0', 'btn btn-info', 'btn-lg', 'px-2', 'rounded-0'],
         signupOrder: '', // 여기서 값을 전달 하고자 했습니다
      }
   },
   // ... methods ...
   template: `
      <section class="fence-full fence-lg">
         <module-breadcrumb
         :current="current"
         :orders="signupOrder"></module-breadcrumb>
         <module-signup
         :orders="signupOrder"></module-signup>
         <div class="text-center">
               <button
               @click="prevOrder"
               :class="btnStyle">prev</button>
               <button
               @click="nextOrder"
               :class="btnStyle">{{isDone}}</button>
         </div>
      </section>
   `
}
```

대충 이렇게 생긴 곳에서 사용을 하는데 `signOrder`라는 배열 데이터가 전달되면 여러 속성을 담아 `module-signup`에 전달하고 싶었습니다.

## 이것만 기억하고자

`stackoverflow`에서 알아낸 방법은 아래와 같습니다.

```javascript
export default {
   data(){
      return {
         attributes: {
            name: 'testName',
            value: 'testValue',
         }
      }
   },
   template: `
      <input
      v-bind="attributes"
      >
   `
}
```

`v-bind`에 객체를 주게 되면 `vue`에서 객체의 키와 값을 분류하는 기능이 있는 듯 합니다. 그래서 일부러 오류를 띄어서 메서드를 확인해야겠다 생각했습니다. 아래 이미지는 해당 오류 트레이스와 오류 발생 메서드입니다.

<figure class="text-center">
<span class="w-inline-block">
   <img class="w-100" src="{{site.baseurl}}/assets/images/post/vue/attributes/attrs01.png" alt="attr01" title="attr01">
   <figcaption>오류 트레이스1</figcaption>
</span>
</figure>

<figure class="text-center">
<span class="w-inline-block">
   <img class="w-100" src="{{site.baseurl}}/assets/images/post/vue/attributes/attrs02.png" alt="attr02" title="attr02">
   <figcaption>오류 발생 메서드</figcaption>
</span>
</figure>

객체가 `v-bind`속성의 값에 전달되면 `key`와 `value`가 분류되고 속성 이름과 속성 값에 자동 할당되는 구조로 보입니다. `app-signup`에서 `data`부분만 따로 떼어 예제로 작성해보면

```javascript
data() {
   return {
      current: 0,
      btnStyle: ['btn', 'btn-info', 'btn-lg', 'px-2', 'rounded-0', 'btn btn-info', 'btn-lg', 'px-2', 'rounded-0'],
      signupOrder: [
         {
            id: 0,
            title: '이름과 생년월일을 입력해 주세요.',
            show: true,
            input: [
               {
                     name: 'name',
                     type: 'text',
                     options: { // 여기서 다중 속성을 넣고자 합니다.
                        name: 'test value1',
                        placeholder: 'test value2',
                     }
               }, 
            ]
         }
      ]
   }
},
```

`stackoverflow`에서 소개한 그대로 입니다만 원리를 짐작이라도 해서 쓰니 `v-bind`에 `:title` 등 콜론을 붙여 사용하는 형태가 어떤 원리인지 알 것도 같습니다.

`v-bind:title="value"`는 `v-bind`에 정해진 메서드가 실행되는데 콜론으로 속성명이 명시되면 해당 속성에만 `value`라는 값이 할당되고 콜론 없이 객체형태로 전달하면 객체의 유효한 속성이 모두 적용되는 원리로 생각됩니다. 배열에 담아 전달해도 적용됩니다.

```javascript
data() {
   return {
      current: 0,
      btnStyle: ['btn', 'btn-info', 'btn-lg', 'px-2', 'rounded-0', 'btn btn-info', 'btn-lg', 'px-2', 'rounded-0'],
      signupOrder: [
         {
            id: 0,
            title: '이름과 생년월일을 입력해 주세요.',
            show: true,
            input: [
               {
                  name: 'name',
                  type: 'text',
                  options: [ // 여기서 다중 속성을 넣고자 합니다.
                     {name: 'test value1'},
                     {placeholder: 'test value2'},
                  ]
               }, 
            ]
         }
      ]
   }
},
```

배열에 객체를 담아 전송해도 다중 속성이 잘 적용되는 것을 확인했습니다. 객체인지 배열인지의 차이는 아직 떠오르는 차별점은 없습니다만, 다중 속성을 적용하려는데 어려움을 겪으신다면 도움이 됐으면 합니다 😀

-----

📚 함께 보면 좋은 내용

[stackoverflow::How to add multiple attribute - vue.js](https://stackoverflow.com/questions/46741537/how-to-add-multiple-attribute-vue-js){:target="_blank"}