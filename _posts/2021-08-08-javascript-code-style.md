---
layout: post
date:   2021-08-08 14:19:05 +0900
title:  "[JAVASCRIPT] 복잡한 코드, 규칙을 만들자"
author: Kimson
categories: [ TIL, JAVASCRIPT ]
tags: [array, coding, pattern]
image: assets/images/post/covers/TIL-javascript.png
description: "깔끔한 코드는 무엇일까

설계사무소에 다닐 때 자주 하던 말이 있었습니다. 도면을 정말 군더더기 없이 잘 그렸을 때 도면에서 빛이 난다고 자주 표현합니다.

파일관리, 선 정리, 정치수로 자리 잡은 텍스트들, 누가봐도 알아보는 레이어정리 등이 '빛나는 도면'의 조건인 셈입니다.

그러면 프로그래밍에서 깔끔한 코드는 무엇일까요? 아직 실무를 경험하지도 못했지만 감히 얕은 지식으로 방법론을 알아보고자 합니다."
featured: true
hidden: false
rating: 5
toc: true
profile: false
istop: true
keysum: true
keywords: '
A instanceof B : A가 B의 인스턴스이면 true, 아니면false
_typeof A : A의 타입이 무엇인지 반환
_!boolean : boolean값을 반대로
_Array.filter() : 배열의 구성을 조정하여 재구성한다.
_Array.slice() : 배열을 잘라내어 배열로 리턴한다 (원본 보존)
_보기쉬운 : 변수와 메서드의 네이밍으로 가독성 향상
_조립가능한 : 변수와 메서드의 독립성 부여
_반환하는 : 메서드의 리턴값을 활용한 변수 선언 최소화
'
---

# 깔끔한 코드는 무엇일까

설계사무소에 다닐 때 자주 하던 말이 있었습니다. 도면을 정말 군더더기 없이 잘 그렸을 때 도면에서 빛이 난다고 자주 표현합니다.

파일관리, 선 정리, 정치수로 자리 잡은 텍스트들, 누가봐도 알아보는 레이어정리 등이 '빛나는 도면'의 조건인 셈입니다.

그러면 프로그래밍에서 깔끔한 코드는 무엇일까요? 아직 실무를 경험하지도 못했지만 감히 얕은 지식으로 방법론을 알아보고자 합니다.

## 주석을 달면 좋을까

유명한 생활코딩의 이고잉님 강좌로 프로그래밍을 시작했습니다. 적절한 이론과 실습, 무엇보다도 스스로 찾아서 해결해야한다는 강조를 아직까지 잊지 않고 있습니다.

그때는 아무것도 모르는 시기였기에 기능 구현에만 오로지 몰두하던 시기였습니다. 그러면서 주석을 많이 달게 되었습니다. 제가 쓴 코드에 이해한 내용을 정리하던 식이었습니다.

주석은 명확히 기능이나 내용을 알리고자 요약하는 것인데 아이러니하게도 주석이 있는 코드는 그만큼 설명하지 않으면 이해하기 어렵다는 뜻으로 반증됩니다.

그렇다고해서 주석이 아예 없다고해서 보기 쉬운 코드인지도 의문입니다. 적재적소에 필요한 만큼의 최소화 하라는 것인지도 모르겠습니다. 

## 어제, 오늘의 코드

기능을 구현하는데에만 초점을 두다보니 어떤 변수가 몇 개 있어야하고, 어떤 함수가 있어야하면 무엇을 리턴하는지 안중에 없었습니다.

단지 기능이 작동되는지, 코딩 중에 변수가 바뀌면 해당 값을 모두 바꾸는 중노동을 하기도 했습니다. 마치 for문을 만번 돌려야하는데 수동으로 만번을 치는 느낌이었습니다.

```javascript
let t = document.querySelector('#output');

function inValue(a){
	t.value += a;
}

function outTargetVal(){
	t.value = eval(t.value);
}

let testbtn ...
// ...
```

위의 코드는 예전에 계산기를 만들때 썼던 코드 일부입니다.

현재도 그렇지만 이전 코드를 보면 굉장히 많은 중복된 코드와 알수없는 네이밍들이 많았습니다. 즉흥적으로 변수를 만들어 쓰고, 위치 또한 정리가 되어있지 않아 나중에는 제가봐도 모를 지경인 코드가 많았습니다.

# 코드에 규칙 만들기

설계도면을 깔끔하게 그린다는 것은 중복선 정리와 딱 떨어지는 정치수, 통일성 있는 주석과 레이어 등이 갖추어졌을때를 말합니다. 가끔 우스게 소리로 도면에서 빛이난다고 합니다.

그렇다면 코드가 깔끔하다는 것은 무엇일까요. 이전에 깔끔한 코드를 좋아한다는 사람을 본 적이 있습니다. 무엇이 깔끔한지는 아직 모를 일입니다.

하지만 여러 사이트를 보면서 다양한 효과와 기능을 따라하고 코드를 보다보니 조금의 가닥이 잡히는 느낌이 들었습니다.

이런 이해가 모이다 보니 세 가지 저만의 규칙이 생기기 시작했습니다.

- 보기쉬운 00
- 조립가능한 00
- 반환하는 00

## 보기쉬운

'코딩 팁'으로만 검색해도 수십에서 수백가지의 글이 나옵니다. 그 중에 자주 나오는 말이 가독성입니다. 그에 따라 나오는 것이 주석에 대한 이야기이고, 설명하기 위한 것이 주석인데 주석이 있으면 그만큼 설명이 필요한 복잡한 코드라는 반증이 되어버립니다.

하지만 코드가 복잡하지 않다고해서 주석을 배제하는 것도 아이러니한 상황이 될 것 같습니다.

주석을 없앤다는 말이 아닌 최소한으로 한다는 이야기가 아닌가 생각해봅니다.

## 조립가능한

설계에서 주로 소스를 많이 가져다 씁니다. 나무, 사람, 픽토그램(아이콘), 레이아웃 등 여러 종류의 소스가 넘쳐나고, 필요에 따라 직접 만들어 사용하기도 합니다.

건축물의 내부를 구성하는 것에도 방법론이 있고, 실의 용도에 따른 조건과 제한사항이 존재합니다. 그래서 주로 공유공간을 중심으로 개인공간들이 뻗어나가며 조합이됩니다.

특히나 아파트의 경우 2호 조합, 5호 조합 등의 말이 있는데요. 이러한 조합은 미리 계획된 루틴으로 조립하여 매스, 입면디자인을 하게 됩니다.

이처럼 코드 또한 조립 가능하게 따로따로 독립된 성격을 가진 메서드가 서로 상호작용한다면 많은 기능을 담당하는 객체가 탄생하지 않을까 생각합니다.

## 반환하는

서버측과 클라이언트측 언어를 공부하면서 느끼는 점은 내장 함수들이 리턴 값을 가지고 있으며, 해당 기능에 대한 패턴이 존재한다는 것입니다.

예를 들어 배열의 경우 push를 하게되면 push된 갯수를 반환하고, pop을 하게되면 제거된 것을 문자열로 반환합니다.

이를 통해서 리턴 값을 잘 사용하면 불필요한 변수를 쓰지 않을 수 있고, 기본적인 CRUD 기능만 구현해도 다른 기능을 가진 메서드를 만들어 낼 수 있다는 생각입니다.

이 개념을 토대로 코드 또한 적용될 수 있는 개념이라 생각을 했습니다.

예를 들면서 규칙을 정리하겠습니다.

# 간단한 규칙 적용하기

## 개요

> 템플릿 객체는 태그ID와 설정 값을 받습니다. 입력받은 데이터를 화면에 출력하고 조립가능하게 만들고자 합니다.
> 이때 메서드들은 하나의 기능씩 수행하게 됩니다.

## 기능 설정

> `type`은 변수의 타입입니다.  
> `>> type`은 리턴 값입니다.

## **Template**(id, {options}) 구현

- **node** : 노드의 아이디 : `string`
- **storage** : 저장소 : `array`
- **options** : 옵션(Map) : `map`
  - type
  - ...
- ***validTagId***() : 노드아이디 검증 : `>> boolean`
- ***theme***() : type에 따른 출력 포멧 변환 : `>> string`
- ***writeContents***() : id에 내용 출력 : `>> void`
- ***addContents***(...content) : 내용 추가 : `>> void`
- ***editContents***(origin, newContent) : 내용 수정 : `>> void`
- ***getContents***() : 내용 읽기 : `>> array`
- ***getCount***() : 내용 개수 : `>> int`
- ***remove***(content) : 내용 삭제 : `>> string`
- ***find***(content) : 내용 순번 확인 : `>> int`
- ***isContain***(content) : 내용 포함 여부 : `>> boolean`

> **Point**
> 
> 1. 구현하고자 하는 기능에 대해 열거해본다. (계산기 : 입력, 출력, 연산 ...)
> 2. 변수와 메서드의 이름은 최대한 간결하고 쉬운 말로 정한다.
> 3. 메서드는 동사로, 변수는 명사로 네이밍한다.

아주 간단하게 템플릿을 입혀주는 기능을 구현해봅시다.

```javascript
function Template(id, options, ...content){
	// 태그아이디 적합여부 검사
	this.validNode = function(){
        try{
            if(typeof id == 'string' && id.length>0){
                try{
                    if(document.querySelector(`#${id}`)){
                        return document.querySelector(`#${id}`);
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
	}
	this.node = this.validNode();
	this.storage = contents instanceof Array && contents instanceof Object?contents:[];
    this.options = !(options instanceof Array) && options instanceof Object?options:{};

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

	// 화면에 내용출력
	this.writeContents = function(){
        this.node.innerHTML = '';
        for(let i of this.getContents()){
            this.node.innerHTML += this.theme(i);
        }
	}

}
```

> **Point**
> 
> 1. 메서드 하나당 하나의 기능만을 수행
> 2. 초기에 반환타입을 설정하여 아직 구현되지 않은 메서드를 이용해 함수 구성 가능

theme 메서드는 타입 설정에 따라 출력 포멧을 바꿔주는 기능입니다.  
validNode 메서드는 id값을 존재여부와 데이터타입을 검사하는 기능입니다.
writeContents 메서드는 getContents(Array)를 하나씩 출력하는 기능입니다.

```javascript
/**
 * 변수, 메서드 정의...
 */

// 내용 추가
this.addContents = function(...contents){
	for(let content of contents){
		this.getContents().push(content);
	}
	this.writeContents();
}

this.editContent = function(origin, content){
	for(let i in this.getContents()){
		if(i==this.find(origin)){
			this.storage[i] = content;
		}
	}
	this.writeContents();
}
    
// 내용 읽기
this.getContents = function(){
	return this.storage;
}



// 내용 갯수
this.getCount = function(){
	return this.getContents().length;
}

// 내용 삭제
this.remove = function(content){
	let bool = false;
	this.storage = this.getContents().filter(i=>{
		if(i!=content){
			return i;
		} else {
			bool = true;
		}
	});
	if(this.getContents().indexOf(content) == -1 && bool){
		this.writeContents();
		return content;
	}
}
```

> **Point**
> 
> 1. crud기능을 만들어두면 메서드를 조합하여 다른 기능을 쉽게 만들 수 있다.
> 3. 리턴 값은 다른 메서드 데이터 가공 형식을 고려하여 타입을 선정한다.

만일 위의 예제와 달리 storage를 문자열로, getContent 리턴타입을 동일한 문자열로 했다면 getCount메서드 작성시 새로운 count변수를 만들거나 다른 내장 메서드를 써서 데이터 가공하는데 코드가 복잡해질 것입니다.

```javascript
this.find = function(content){
	return this.getContents().indexOf(content);
}

this.isContain = function(content){
	for(let i of this.getContents()){
		if(i==content){
			return true;
		}
	}
	return false;
}
```

마지막 메서드까지 모두 구현했습니다. 이제 작동 결과를 아래에서 확인하여 처음에 계획한데로 작동되는지 보겠습니다.

> 아래 결과를 참고해주세요.

```javascript
let a = new Template('test',{ // id test가 존재하면 test로 지정됩니다.
    type: 'card'
});

let b = new Template('test2',{ // id test2가 없어 기본 id wrap으로 지정됩니다.
    type: 'card'
}, 'memo','toto','mimi');
 
/*
null값은 valid에 검열되어 타겟이 생성되지 않습니다.
let c = new Template(null,{ 
    type: 'card'
}, 'giri','tomy','wow');
*/

console.log(a.node); // <div id="test"></div>
console.log(b.node); // <div id="wrap"></div>

console.log(a.getCount()); // 0
console.log(b.getCount()); // 3

a.addContents("pepe","moto");
b.addContents("moru","kedi");

console.log(a.getContents()); // (2) ["pepe", "moto"]
console.log(b.getContents()); // (5) ["memo", "toto", "mimi", "moru", "kedi"]

a.writeContents();
b.writeContents();
// c.writeContents(); // 타겟이 없어 에러가 납니다.

console.log(a.remove('moto')); // moto
console.log(b.remove('momo')); // undefined

console.log(a.getContents()); // ["pepe"]
console.log(b.getContents()); // (5) ["memo", "toto", "mimi", "moru", "kedi"]

console.log(a.find('pepe')); // 0
console.log(b.find('moru')); // 3

console.log(a.isContain('pepe')); // true
console.log(b.isContain('pepe')); // false

b.editContent("mimi","kimson");
console.log(b.getContents()); // (5) ["memo", "toto", "kimson", "moru", "kedi"]
```

-----

# 정리

## 개인 관점의 3가지 규칙

> 기능 구현 규칙 3가지
> - 네이밍은 간략하게 하고, 변수: 명사 / 메서드: 동사로 구분한다.
> - 가능한 하나의 메서드는 하나의 기능을 담당하게 한다.
> - 초기에 리턴값을 계획해두면 다른 기능을 추가할 때 유용하다.

제가 생각한 3가지 코딩 규칙을 정리해보았습니다. 계속해서 연구해 나가야할 부분이고 얼른 실무를 경험하고 잘못 이해한 부분을 고치고 알아가고 싶습니다.

## 주의사항

주요하게 알게 된 점으로는 객체든 메서드든 들어온 데이터를 보존하면서 저장시켜야 가공할때 코드가 짧아진다는 것입니다.

예를 들어 원본 데이터가 가공되어 저장이 되면 코드가 더 길어진다는 것입니다.


```javascript
// 위의 코드를 부분적으로 보겠습니다.

// 내용 추가 부분이 만약 원본데이터인 contents가 가공되어 저장된다면
this.addContents = function(...contents){
	for(let content of contents){
		this.storage.push(content);
	}
}
```

이어서 발생하는 문제를 보겠습니다.

```javascript
this.writeContents = function(){ // 오히려 i만 넣으면 되는 장점이 생겼지만
	for(let i of this.getContents()){
		this.node.innerHTML += i;
	}
}

// 내용 갯수와 파생되는 함수들이 길어집니다.
this.find = function(content){
	for(let i of this.storage){
		if(i.slice(i.indexOf(content), i.indexOf(content)+content.length+1)==content){
			return this.getContents().indexOf(content);
		}
	}
}
```

부분적인 예입니다. 건축에서는 0.1mm의 오차가 10m로 불어나는 경우가 많습니다.
한 세대의 벽두께가 0.1mm만 줄어도 전용면적이 소폭증가하고 1000세대 대규모 아파트라면 엄청난 차이가 나게 됩니다.

코드 또한 조금의 오차와 양을 줄인다면 이후 수정이나 유지관리면에서 좋지 않을까 하는 생각을 합니다.

아직 부족한게 많습니다. 여기까지 읽으셨다면 영양가 없는 글 읽어주셔서 감사합니다...

좀 더 지식과 실무경험을 쌓아 새로 코드 규칙에 관해 심도 있게 다루겠습니다.