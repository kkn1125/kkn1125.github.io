---
layout: post
date:   2021-08-08 14:19:05 +0900
title:  "[JAVASCRIPT] 코드 구조 생각"
author: Kimson
categories: [ TIL, JAVASCRIPT ]
tags: [code, structure, efficiency]
image: assets/images/post/covers/TIL-spring.png
description: ""
featured: true
hidden: false
rating: 5
toc: true
profile: false
istop: true
keysum: true
keywords: ''
---

# 깔끔한 코드는 무엇일까

설계사무소에 다닐 때 자주 하던 말이 있었습니다. 도면을 정말 군더더기 없이 잘 그렸을 때 도면에서 빛이 난다고 자주 표현합니다.

파일관리, 선 정리, 정치수로 자리 잡은 텍스트들, 누가봐도 알아보는 레이어정리 등이 '빛나는 도면'의 조건인 셈입니다.

그러면 프로그래밍에서 깔끔한 코드는 무엇일까요? 아직 실무를 경험하지도 못했지만 감히 얕은 지식으로 방법론을 알아보고자 합니다.

## 왜 주석을 달고 있을까

유명한 생활코딩의 이고잉님 강좌로 프로그래밍을 시작했습니다. 적절한 이론과 실습, 무엇보다도 스스로 찾아서 해결해야한다는 강조를 아직까지 잊지 않고 있습니다.

그때는 아무것도 모르는 시기였기에 기능 구현에만 오로지 몰두하던 시기였습니다. 그러면서 주석을 많이 달게 되었습니다. 제가 쓴 코드에 이해한 내용을 정리하던 식이었습니다.

주석은 명확히 기능이나 내용을 알리고자 요약하는 것인데 아이러니하게도 주석이 있는 코드는 그만큼 설명하지 않으면 이해하기 어렵다는 뜻으로 반증됩니다.

그렇다고해서 극단적으로 주석에 연연하여 안 넣겠다 하면 오히려 주석을 달지 않는 방법을 생각하는 시간이 길어질 것 같아 주석을 최소한으로 해야겠다는 규칙을 따르고 있습니다.

그래서이지 현재와 과거의 실수로부터 코딩하는 규칙을 하나씩 정하고 있습니다.

## 과거의 코드

기능을 구현하는데에만 초점을 두다보니 어떤 변수가 몇 개 있어야하고, 어떤 함수가 있어야하면 무엇을 리턴하는지 안중에 없었습니다.

단지 기능이 작동되는지, 코딩 중에 변수가 바뀌면 해당 값을 모두 바꾸는 중노동을 하기도 했습니다. 마치 for문을 만번 돌려야하는데 수동으로 만번을 치는 느낌이었습니다.

```javascript
let target = document.querySelector('#target');

function input(a){
	target.value += a;
}

function result(){
	target.value = eval(target.value);
}

let btn ...
// ...
```

위의 코드는 예전에 계산기를 만들때 썼던 코드 일부입니다.

현재도 그렇지만 이전 코드를 보면 굉장히 많은 중복된 코드와 알수없는 네이밍들이 많았습니다. 즉흥적으로 변수를 만들어 쓰고, 위치 또한 정리가 되어있지 않아 나중에는 제가봐도 모를 지경인 코드가 많았습니다.

# 나에게 깔끔한 코드는 무엇일까

누군가 옆에서 잔소리하며 알려주는 사람이 없다보니 여러 사이트에 있는 재미있는 기능을 따라하는 경우가 많습니다. 주소 api를 사용한다거나, 공공데이터로 페이지처리를 해보고, 사이트 js파일을 받아 코드를 분석하는 등의 방식으로 공부합니다.

그렇게 공부하다보니 몇가지 저만의 규칙이 생겼습니다.

- 보기쉽게
- 조립가능하게
- 반환하는

제가 취하고 있는 규칙에 대해 알아 보겠습니다.

## 보기쉽게

'코딩 팁'으로만 검색해도 수십에서 수백가지의 글이 나옵니다. 그 중에 자주 나오는 말이 가독성입니다. 그에 따라 나오는 것이 주석에 대한 이야기이고, 설명하기 위한 것이 주석인데 주석이 있으면 그만큼 설명이 필요한 복잡한 코드라는 반증이 되어버립니다.

하지만 코드가 복잡하지 않다고해서 주석을 배제하는 것도 아이러니한 상황이 될 것 같습니다.

주석을 없앤다는 말이 아닌 최소한으로 한다는 이야기가 아닌가 생각해봅니다.

예를 들면서 규칙을 정리하겠습니다.

#### **Template**(id, {options})

- **node** : 노드
- **this.storage** = "";
- **options** : 옵션(Map)
  - type
  - ...
- ***writeContents***() : id에 내용 출력 : `void`
- ***addContents***(...content) : 내용 추가 : `void`
- ***getContents***() : 내용 읽기 : `Array`
- ***getCount***() : 내용 개수 : `int`
- ***remove***(content) : 내용 삭제 : `int`
- ***whereIs***(content) : 내용 순번 확인 : `int`
- ***validTagId***() : 노드아이디 검증 : `boolean`
- ***isContain***(content) : 내용 포함 여부 : `boolean`

> 템플릿 객체는 태그ID와 설정 값을 받습니다. 입력받은 데이터를 화면에 출력하고 조립가능하게 만들고자 합니다.

```javascript
function Template(id, options, ...content){
	this.node;
	this.storage = [];
	this.options = !(options instanceof Array)&&options instanceof Object?options:{};
	this.theme = function(content){
        switch(this.options.type){
            case 'card':
                return = `<div>
                    <h2>Card</h2>
                    <span>${content}</span>
                </div>`;
                break;
        }
    }

	// 태그아이디 적합여부 검사
	this.validNode = function(){
        try{
            if(typeof id == 'string' && id.length>0){
                try{
                    if(document.querySelector(`#${id}`)){
                        this.node = document.querySelector(`#${id}`);
                        return true;
                    } else {
                        throw '[Template] Info : 노드가 존재하지 않아 기본 타겟으로 설정됩니다. (id: wrap)';
                    }
                } catch (e) {
                    console.debug(e);
                }
            } else {
                throw '[Template] Error : 최소 1자리 이상 문자가 입력되어야 합니다.';
            }
        } catch (ex) {
            console.error(ex)
        }
        this.node = document.querySelector(`#wrap`);
        return false;
	}

	// 화면에 내용출력
	this.writeContents = function(){
        for(let i of this.getContents()){
            this.node.innerHTML += i;
        }
	}

}
```

저는 눈에 먼저 보이게 하는 기능부터 만듭니다. CRUD에서 R부터합니다.  
간단하게 태그 아이디를 검사하고 타겟을 저장하여 내용을 타겟에 뿌리는 기능 먼저 구현했습니다.

코드를 짜다보면서 문득 생각이 든 것이 함수 하나에 여러기능이 있으면 제가 헷갈려서 이제는 레고 조립하듯 분리하기로 했습니다.

위의 validNode도 더 세분화 할 수 있지만 넘어가겠습니다.

```javascript
/**
 * 변수, 메서드 정의...
 */

// 내용 추가
this.addContents = function(...contents){
	for(let content of contents){
		this.storage += this.theme(content);
	}
}

    
// 내용 읽기
this.getContents = function(){
	return this.storage;
}

// 내용 갯수
this.getCount = function(){
	return this.storage.length;
}
```

내용 추가함수는 저장변수에 내용을 저장하고 추가 내용을 누적시킵니다. 추가되는 `content`는 options type에 설정한 값에 따라 theme에서 출력형식과 결합하여 출력됩니다.

여기서 알아낼 수 있는 점은 변수를 최소한으로 하고 함수에서 바로 리턴하거나 만들어 놓은 함수를 재사용 하는 것입니다.

다음은 삭제입니다.

중간 정리를 하겠습니다.

조립식 함수 규칙

- 메서드 1개 = 기능 1개
- 가급적 중복되지 않으면 변수 생성을 자제하자.
- crud를 조합해서 다른 기능을 만들 수 있다.