---
slug: "/javascript-data-study"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-08-16 13:50:20 +0900
title:  "[JAVASCRIPT] LinkedList 만들기"
author: Kimson
categories: [ javascript ]
tags: [ linkedlist, datastructure, til ]
image: /images/post/covers/TIL-javascript.png
description: "LinkedList 구현
이해한대로 만든 것이기 때문에 정확하지 않을 수 있습니다.

LinkedList는 `node`의 연결로 이루어져있습니다. `node`는 데이터 값과 `next`, 혹은 `prev`값을 가지며, 이번 주제에서는 `next`만 있는 `node`를 가진 `LinkedList`를 만들어보려합니다."
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

# LinkedList 구현

> 이해한대로 만든 것이기 때문에 정확하지 않을 수 있습니다.

LinkedList는 `node`의 연결로 이루어져있습니다. `node`는 데이터 값과 `next`, 혹은 `prev`값을 가지며, 이번 주제에서는 `next`만 있는 `node`를 가진 `LinkedList`를 만들어보려합니다.

`new LinkedList(data)`의 형식으로 구현하는 방법은 추후에 따로 포스팅하겠습니다.

## LinkedList의 모양

![LinkedList](/images/post/datastudy/linkedlist/linkedlist01.png '도식')
[이미지 출처](https://habr.com/en/post/506660/)

모양은 이렇습니다. 각 `node`는 `data`, `next` 프로퍼티를 가지고, 첫 요소는 `head`에 그 다음 추가되는 요소는 이전 요소의 `next`에도 저장이 되면서 쌓여갑니다.

아직 이해도가 높지 않아 잘못된 정보를 퍼뜨리기보다 현재 이해한 내용을 토대로 작성했음을 다시 한 번 알려드립니다.

## LinkedList 객체 구현

```javascript
// 포스팅하면서 지금 보니 굳이 datas라는 배열을 만들 필요는 없습니다. next로 순회해서 전체 출력 가능한 점 알려드립니다.
function LinkedList(){
    this.datas = []; // 필요없을 것 같습니다.
    this.head = null; // 첫 요소입니다.
    this.size = 0; // 배열 크기
    this.Node = function(data, next=null) {
        // 노드 객체
        this.data = data; // 담기는 데이터
        this.next = next; // 해당 데이터의 다음 데이터 (Node type)
    }
    this.add = function(data) { // node 추가
        this.datas = [...this.datas, new this.Node(data)];
        if(this.size>0){
            this.datas[this.size-1].next = this.datas[this.size];
            this.head = this.datas[0];
        }
        this.size++;
    }
    this.get = function(data){
        for(let item of this.datas){
            if(item.data==data)
                return item;
        }
    }
    this.set = function(data, change){
        this.datas.forEach((item,index,list)=>{
            if(item.data==data){
                item.data = change;
                list[index-1]
                ?list[index-1].next = item:null;
            }
        });
    }
    this.remove = function(data) {
        let change = new Array();
        for(let item of this.datas){
            if(item.data != data){
                change=[...change, item];
            }
        }
        this.datas = change;
        this.head = this.datas[0];
        this.size--;
        return data;
    }
    this.toString = function() {
        return this.datas.map(x=>x.data);
    }
}
```

## 구문 해석

### node 객체

```javascript
this.head = null;
this.size = 0;
this.Node = function(data, next=null) {
    this.data = data;
    this.next = next;
}
```

`head`는 기본 `null`값이 됩니다. `size`는 당연히 0입니다. 이 부분에서는 크게 2가지 기능이 필요하게 됩니다.

1. 처음 추가 시
2. 1회 이상 추가 시

처음 추가 할 때는 head에 값이 들어가게 되고, next는 null을 가지며 data에 입력 값이 들어가게 됩니다.

```javascript
// 최초 추가
const arr1 = {data:'kimson', next: null}

// 1회 이상 추가
const arr2 = {data:'papa', next: null}
// arr1.next = arr2가 되야 하는 조건
```

### add, set, remove 메서드

이제 나머지 메서드를 구현한 방식을 살펴보겠습니다.

```javascript
function LinkedList(){
    this.datas = []; // 사실상 필요 없는 변수
    this.head = null;
    this.size = 0;
    this.Node = function(data, next=null) {
    this.data = data;

    this.add = function(data) {
        this.datas = [...this.datas, new this.Node(data)];
        if(this.size>0){
            this.datas[this.size-1].next = this.datas[this.size];
            this.head = this.datas[0];
        }
        this.size++;
    }
    this.set = function(data, change){
        this.datas.forEach((item,index,list)=>{
            if(item.data==data){
                item.data = change;
                list[index-1]
                ?list[index-1].next = item:null;
            }
        });
    }
    this.remove = function(data) {
        let change = new Array();
        for(let item of this.datas){
            if(item.data != data){
                change=[...change, item];
            }
        }
        this.datas = change;
        this.head = this.datas[0];
        this.size--;
        return data;
    }
}
```

`add`메서드는 단순합니다. `this.datas`는 필요가 없습니다만 설명을 위해 남겨두었습니다. 여기서 기능은 `data`를 받아 `node`를 추가하면서 이전 `node`의 `next`에 들어가도록 합니다.

`size`값으로 분기문을 작성하여 최초 추가가 아닐 때와 1회 이상일 때를 나누어 저장되는 형태를 바꾼 밖에 없습니다.

`set`메서드는 `forEach`메서드를 사용했습니다만, `for`문으로 충분합니다. `forEach`를 쓴 이유는 `index`변수를 따로 만들지 않으려하다보니 쓰게 되었습니다. `if`를 통해 기존 `data`가 있으면 해당 `node`의 `data` 값에 변경하는 `change`값을 저장하고, 이전요소의 `next`에도 값을 바꾸어줍니다.

> 왜 `datas`가 필요없냐면 `head`에서부터 계속 `next`로 타고 가는 형태이기 때문에 굳이 다시 배열에 따로 저장해서 꺼내오는 것을 필요없다 생각됩니다. `set`의 경우도 굳이 `next`값을 바꾸지않아도 변경되는 것인데 소모적이라 생각되어 코드 구조를 전체적으로 손봐야할 것 같습니다.

`remove`메서드는 새로운 배열을 만들어 해당 `data`가 아닌 것만 골라냅니다. `size`를 줄이고 `head`가 삭제되거나 바뀔 수도 있기 때문에 `head`를 다시 업데이트합니다.

## 결론

이미지만 보고 대충 감으로 만들어 본 결과 엉망인 부분이 포스팅하면서 눈에 띕니다. 항상 포스팅 할 때마다 이런저런 부분들이 눈에 띄어서 코드를 새로 짜고 다시 올리고를 반복하다보니 이제는 먼저 포스팅을 하고, 시간이 날 때 고쳐서 정리하자는 생각을 하게 됩니다.

linkedlist를 이해하는 것도 아직은 어려운듯 합니다. 계속해서 다른 자료구조를 살쳐보면서 더 견고하게 준비해서 올리도록 노력하겠습니다.

틀린 부분이나 조잡한 부분은 과감하게 말씀해주시면 감사하겠습니다.