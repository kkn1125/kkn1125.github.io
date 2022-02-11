---
layout: post
modified: 2022-01-25 15:45:28 +0900
date:   2022-01-24 11:50:37 +0900
title:  "[VUE] 비동기 데이터 프로퍼티 null값 처리하기"
author: Kimson
categories: [ VUE, TIL ]
image: assets/images/post/covers/TIL-vue.png
tags: [ async, axios, 'null' ]
description: "비동기 데이터

비동기 데이터를 사용하는데 있어서 `promise`의 이해 부족으로 시간을 많이 잡아먹는 일이 종종 있었습니다.

핑계를 대자면 `vue`라는 새로운 환경에서 작업을 하다보니 더 우왕좌왕하는 느낌이 듭니다.

배열에 담긴 객체를 사용한다하면 for문으로 처리해서 에러구문 없이 출력하기란 쉽습니다."
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

# 비동기 데이터

비동기 데이터를 사용하는데 있어서 `promise`의 이해 부족으로 시간을 많이 잡아먹는 일이 종종 있었습니다.

핑계를 대자면 `vue`라는 새로운 환경에서 작업을 하다보니 더 우왕좌왕하는 느낌이 듭니다.

배열에 담긴 객체를 사용한다하면 for문으로 처리해서 에러구문 없이 출력하기란 쉽습니다.

주로 가져와서 사용하는 데이터는 배열에 동일한 속성을 가진 객체일 것입니다. 이때 `v-for`디렉티브를 사용하면 알아서 없을 때는 출력하지 않고 비동기로 받아오는 시점에 다시 렌더링 되기 때문에 큰 문제는 없습니다.

다만, 하나의 객체를 가져와 뿌린다면 `undefined`에서 속성을 가져오는 꼴이기 때문에 에러가 납니다.

## 배열 데이터

예를 들기 위해 [Sample APIs::Coffee](https://sampleapis.com/api-list/coffee){:target="blank"}의 샘플을 사용하겠습니다.

{% raw %}

```javascript
Vue.component('module-test', {
   data(){
      return {
         list: null,
         isError: false,
      }
   },
   created(){
      axios({
         method: 'get',
         url: 'https://api.sampleapis.com/coffee/hot',
      })
      .then(response=>this.list = response.data)
      .catch(e=> this.isError = true);
   },
   template: {
      `
         <div>
            <div v-for="i in list" :key="i.id">
               <span>{{i.title}}</span>
               <span>{{i.description}}</span>
               <span>({{i.ingredients.join(', ')}})</span>
               <hr>
            </div>
            <div v-if="list==null">
               no list
            </div>
         </div>
      `
   }
});
```

{% endraw %}

위의 경우 `if`로 데이터 로딩 처리를 선택적으로 한 다음 `for`문으로 돌리면 값을 받아오는 시점에서 데이터가 갱신되어 배열이 쭉 프린트됩니다.

## 단일 데이터

예로 단일 데이터를 가져올 때를 보겠습니다.

{% raw %}

```javascript
Vue.component('module-test', {
   data(){
      return {
         item: null,
         isError: false,
      }
   },
   created(){
      axios({
         method: 'get',
         url: 'https://api.sampleapis.com/coffee/hot/1',
      })
      .then(response=>this.item = response.data)
      .catch(e=> this.isError = true);
   },
   template: `
      <div>
         <div>
               <span>{{item.title}}</span>
               <span>{{item.description}}</span>
               <span>({{item.ingredients.join(', ')}})</span>
               <hr>
         </div>
         <div v-if="item==null">
               no item
         </div>
      </div>
   `
});
```

{% endraw %}

<figure class="text-center">
<span class="w-inline-block">
   <img class="w-100" src="{{site.baseurl}}/assets/images/post/vue/async/async01.png" alt="async01" title="async01">
   <figcaption>오류 트레이스1</figcaption>
</span>
</figure>

에러를 뱉어내면서 결과적으로는 데이터를 받아 출력해줍니다. 단일 데이터를 가져올 때 `axios`로 데이터를 꺼내오는 시점과 렌더링되는 시점이 다르기 때문에, 아직 데이터가 없는 시점에서 에러를 먼저 표시하고, 데이터를 받아온 시점에서 다시 갱신하므로 화면에는 결과가 출력이 됩니다.

## 비동기 null값 처리

방법은 여러가지겠지만 `computed`로 처리하는 것이 간단하고 수정하기 쉬운 것 같아 아래와 같이 기록을 합니다.

{% raw %}

```javascript
Vue.component('module-test', {
   data(){
      return {
         item: null,
         isError: false,
      }
   },
   created(){
      axios({
         method: 'get',
         url: 'https://api.sampleapis.com/coffee/hot/1',
      })
      .then(response=>this.item = response.data)
      .catch(e=> this.isError = true);
   },
   computed: {
      loadedItem(){
         return this.item??false;
      }
   },
   template: `
      <div>
         <div>
               <span>{{loadedItem.title}}</span>
               <span>{{loadedItem.description}}</span>
               <span>({{loadedItem.ingredients.join(', ')}})</span>
               <hr>
         </div>
         <div v-if="loadedItem==null">
               no item
         </div>
      </div>
   `
});
```

{% endraw %}

위의 방법 외에도 여러 방법은 있습니다만 `optional chainign`을 사용하는 것도 방법일 것 같습니다.

{% raw %}

```javascript
// ...
template: `
   <div>
      {{item?.title}}
      {{item?.content}}
      {{item?.regdate}}
   </div>
`
// ...
```

{% endraw %}

만일 수정이 필요하다면 손이 적게가는 것은 `computed`로 넘겨받는 것이 좋을 듯 합니다.

에러 없이 잘 출력이 되는 이유는 `undefined`나 `null`에 점이 붙게 되면 읽을수 없다는 에러를 발생시킵니다. 그러나 `true`나 `false`와 같은 `boolean`에 점을 붙여 프로퍼티를 읽으려하면 `undefined`를 반환합니다.

`vue`에서는 `null`, `undefined`는 출력되지 않습니다. 이를 이용해서 에러 없이 출력할 수 있고, 참고로 `true`, `false`는 그대로 출력이 됩니다.

작게나마 도움이 되기를 😁