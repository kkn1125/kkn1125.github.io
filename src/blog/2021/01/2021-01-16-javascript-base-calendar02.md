---
slug: "/javascript-base-calendar02/"
layout: post
modified: 2022-03-23 16:02:22 +0900
date:   2021-01-16 21:25:04 +0900
title:  "[JAVASCRIPT] 달력 만들기 (글쓰기 기능)"
author: Kimson
categories: [ javascript ]
image: /images/post/back/back02.png
tags: [ calendar, backup, til ]
description: "달력 만들기 어떻게 코드를 짤까

크게 하나의 객체로 관리하고자 했습니다. 폴더처럼요!"
featured: false
hidden: false
rating: 3
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# 달력 만들기

## 어떻게 코드를 짤까

크게 하나의 객체로 관리하고자 했습니다. 폴더처럼요!

1. index라는 객체에 year라는 객체가 요소로 들어감
2. year객체들 각각에는 또 month객체가 들어감
3. 또 month 객체 속에는 day객체가 들어감
4. 또! day객체에는 words라는 배열이 들어감
5. 그다음엔 words라는 배열에 쓴 글들을 push

```javascript
var indexs = { // index Obj
    2020: { // year Obj
        1: {
            25: [
                1, 2, 3 // 각 숫자를 글이담긴 객체라 생각
            ],
            26: [
                1, 5, 7,
            ]
        }
    }
}
```

대략 내가 생각한 객체 트리 구조

```javascript
target.innerHTML = indexs[2021][1][16][1]
```

오늘(2021.01.16)의 두번째 글을 보고싶다! 그러면 위 명령어로 불러줍니다. 제 생각엔 객체의 키로 연월일을 구분해서 각 키에 폴더 형식으로 담는 것이 효율적이라 생각했습니다.

## 이제 글쓰기 기능을 구현 해보자

```html
<!-- 먼저 테스트용 HTML 구조입니다. -->
 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>write test</title>
  <link rel="stylesheet" href="style.css">
</head>
 
<body>
  <input type="button" value="add" onclick="javascript:addwords()"/>
  <div id="output">
    
  </div>
</body>
 
  <script src="main.js"></script>
</html>
```

우선 버튼 하나를 만들어 글을 만들고 div#output에 출력하는 기능을 추가 할 계획인데요.

간단하게 계획 한 원리를 설명하자면

1. indexs객체변수와 글 객체원형을 생성
2. indexs객체에 year,month의 객체를 형성하고 day는 배열로 형성
3. 2번이 중복생성되는 것을 막고, 마지막 day배열에 글 객체를 push

```javascript
function dump() { // [object Object]형태를 읽기위해 만든 확인용 함수
  var str = '';
  for (var i in indexs) {
    str += i + ' => ' + JSON.stringify(indexs[i]) + '<br/>';
  }
  document.querySelector('#output').innerHTML = str;
}
 
var indexs = {}; // indexs 객체 ***** 이후 검색기능 할 예정
var today = new Date(); // 나중에 달력에 필요한 현재 표준시
 
function wordsobj() { // 글 객체 원형 ***** 글 객체 기본 틀
  this.title;
  this.descriptions;
  this.id; // 글 번호
  this.user_id; // 유저아이디(차후 로그인 기능까지 해볼 생각)
}
/////////////////////////////////////////////////////////////////////////
//이 다음부터 addwords()함수를 수정하기에 윗 부분은 컷, 가독성을 위해서//
/////////////////////////////////////////////////////////////////////////
function addwords() { // 글 추가 기능 함수
  var nyear = prompt('yyyy'); // 테스트용으로 prompt를 썼지만 나중에는 클릭된 일자의 연도를 받을 예정
  var nmonth = prompt('mm'); // 연도와 마찬가지
  var nday = prompt('dd'); // 이하 생략
  var words = new wordsobj; // 새로운 글 객체 생성
  words.title = prompt('title'); // todo list 글제목
  words.memo = prompt('memo'); // todo list 메모
  words.user_id = 'chocode1'; // 차후 로그인 기능 만들고 받을 놈
 
  dump(); // 객체,배열 형태 출력
}
```

저는 dump()라는 출력함수를 만들고, addwords()의 마지막 실행에 넣었습니다. 글 추가시 자동으로 볼 수 있게요. 어차피 나중에 달력만들면서 dump말고 다른 기능으로 대체 할 예정입니다

```javascript
function addwords() { // 혼동을 줄이기 위해 이전에 썼던 주석우만 지움
  var nyear = prompt('yyyy');
  var nmonth = prompt('mm');
  var nday = prompt('dd');
  var words = new wordsobj;
  words.title = prompt('title');
  words.memo = prompt('memo');
  words.user_id = 'chocode1';
 
  for (var i = 0; i < 3; i++) {  // 기나긴 고민과 착오 끝에 간추린 빈 키에 빈 객체 넣기
    if (indexs[nyear] == undefined) { // nyear키가 없다면
      indexs[nyear] = new Object(); // 빈 객체를 만듦
    } else if (indexs[nyear][nmonth] == undefined) { //nyear키가 있고, nmonth키 없다면
      indexs[nyear][nmonth] = new Object(); // + 빈 객체
    } else if (indexs[nyear][nmonth][nday] == undefined) { //nyear,nmonth 있고 nday없다면
      indexs[nyear][nmonth][nday] = new Array(); // + 빈 배열
    } else {
      break; // 셋 중 객체가 있을 시 건너뛰면서 for문 정지 불필요한 작업 최소화
    }
  }
  // 분기를 세번 실행시켜 이미 생성된 객체가 있으면 건너뛰는 필터 기능
  
  words.id = indexs[nyear][nmonth][nday].length;
  // 글객체 id를 뒤로 뺀 이유는 for문 필터를 지난후에 마지막 nday의 배열이 생성됨으로
  글의 순서에따라 매겨지는 id를 push전에 두었다
  
  indexs[nyear][nmonth][nday].push(words);
  // 드디어 글 객체 push
  dump();
} // 글쓰기 함수 완료
```

함수 내 변수를 토대로 기능을 작성했습니다.

먼저 판별기능으로는

1. 다시 생각해보자 내가 활용하고자 하는 구문 형태가 indexs[year][month][day][0]···[n]
2. for문에서 indexs[year]의 키에 객체를 생성한다. 단순히 생성만 하면 나중에 [year]가 다시 빈 객체로 초기화 되기 때문에 if문을 더함
3. 같은 방식으로 키 값을 차례로 받아, if와 else if로 순차적 판별을 하게 하고, 마지막 else의 break로 각 조건에 키값이 있으면 반복을 멈추고 다음을 실행하라는 명령
4. 그 다음은 indexs[year][month][day]의 길이만큼 words.id에 저장합니다.

여기서 id가 다른 속성값과 달리 뒤에 저장되는 이유는 for문 판별후에 이 값이 형성되어 뒤로 뺐어요.

그리고 indexs[year][month][day]배열에 push합니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="/images/post/back/back01.png" alt="sample" title="sample">
   <figcaption>kimson</figcaption>
</span>
</figure>