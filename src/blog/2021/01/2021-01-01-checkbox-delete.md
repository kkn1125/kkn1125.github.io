---
slug: "/checkbox-delete"
layout: post
modified: 2022-03-23 16:02:12 +0900
date:   2021-01-01 21:25:04 +0900
title:  "[JAVASCRIPT] checkbox로 항목 삭제 기능 구현"
author: Kimson
categories: [ javascript ]
image: /images/post/covers/TIL-javascript.png
tags: [ delete, checkbox, backup, til ]
description: "checkbox로 항목 삭제 기능 구현"
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

# checkbox로 항목 삭제 기능 구현

## 배열과 체크박스를 사용한 일괄 삭제 기능

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>arr-del</title>
</head>
 
<body>
  <!-- 정보표시 함수 링크 -->
  <a href="javascript:list()">list</a>
  <a href="javascript:deletes()">delete</a>
  <!-- 정보를 담는 배열을 표시하는 영역 -->
  <div class="ctg"></div>
</body>
 
<script src=js.js></script>
</html>
```

1. 배열을 표시하는 list 링크와 삭제를 위한 delete 링크를 만든다. 여기서 delete의 기능은 바로 삭제하는 게 아닌 각 항목에 일괄 혹은 단일 삭제를 위한 체크박스를 띄우기 위해 만든 것.

```javascript
// 예를 들어 게시글의 정보를 담은 배열로 생각하고 각 항목을 넣는다.
var arr = [1,2,3,4,5];
 
// checkbox 클릭 시 해당 checkbox의 내용을 담기 위해 빈 배열 del을 생성한다.
var del = [];

// 1. list() 함수는 1-1에 만들었던 div.ctg 태그에 배열들을 출력시킨다.
function list(){
	var target = document.querySelector('.ctg');
    var sv = '';
    for(var i = 0; i<arr.length; i++){
    	sv += '<div>'+arr[i]+'</div>'; // for문 반복때마다 div태그에 감싸 줄바꿈
    }
    target.innerHTML = sv; // 출력
}

/**
 * 1. list() 함수와 같은 구조로 각 항목들의 앞에 checkbox를 부여한다.
 * 2. 마지막으로 accept라는 최종 확인 기능의 버튼을 구현해준다.
 * 3. 이제 함수 두 개가 추가되었으니 마저 작성해준다.
 */
function deletes(){
  var target = document.querySelector('.ctg');
    var sv = '';
    for(var i = 0; i<arr.length; i++){
    	sv += ('<label><input type="checkbox" onclick="javascript:checks(this)">'+ arr[i]+'</label><br>'); // for문 반복때마다 div태그에 감싸 줄바꿈
    }
    sv += '<div><a href="javascript:checkdel()">accept!!</a></div>';
    target.innerHTML = sv; // 출력
}
```

```javascript
var sav = []; // 체크여부 저장하는 빈 배열
 
function checks(self) { // 체크박스 클릭 시 실행 될 함수
  if (self.checked) {
    sav.push(self.labels[0].textContent);
    $e(`체크박스 -> true`);  // 1-1-1의 함수 참조(console.log()를 단순화시킴)
    $e(sav);  // 1-1-1의 함수 참조(console.log()를 단순화시킴)
  } else {
    for (var i = 0; i < sav.length; i++) {
      if (self.labels[0].textContent == sav[i]) {
        sav.splice(i, 1);
        $e(`체크박스 -> false`);  // 1-1-1의 함수 참조(console.log()를 단순화시킴)
        $e(sav);  // 1-1-1의 함수 참조(console.log()를 단순화시킴)
      }
    }
  }
  $e(sav);
}
```

1. list() 함수는 1-1에 만들었던 div.ctg 태그에 배열들을 출력시킨다. 진행상황 및 테스트는 콘솔 로그와 개발자 도구를 통해 연구해본다.
2. 테스트한 내용을 빼고 코드를 정리해보면,

```javascript
var sav = []; // 체크여부 저장하는 빈 배열
 
function checks(self) { // 체크박스 클릭 시 실행 될 함수
  if (self.checked) {  // self를 인자로 받아 check 여부에 따라 true false 반환
    sav.push(self.labels[0].textContent); // sav배열에 self의 텍스트를 push
  } else { // check를 풀면 다시 check되는 값의 배열push를 방지하기 위해 다시 배열 제외
    for (var i = 0; i < sav.length; i++) { // 반복문을 통해 sav배열 조회
      if (self.labels[0].textContent == sav[i]) { // sav요소와 self텍스트 일치 조회
        sav.splice(i, 1); // 일치 시 sav의 i번째 요소 삭제
      }
    }
  }
}

function checkdel(){
  $e('--for문시작--'); // 함수가 어디쯤 작동되는지 보기위한 콘솔로그
  for (var j = 0; j < sav.length; j++) { // j변수를 sav배열 인덱스로 함
    for (var i = 0; i < arr.length; i++) { // j변수가 증가할때마다 i변수로 arr 조회
      if ( sav[j] == arr[i]) { // 즉 sav배열 하나하나 당 arr배열요소가 일치하는지 검사
        $e(arr); // arr변수의 현재 값
        $e(String(j)+String(i)); // sav의 몇번째와 i변수의 몇번째를 반환하는지 확인
        arr.splice(i, 1);
        $e(arr); // splice 후 arr의 배열 상태 확인. 이때 잘 제거 됐으면 성공.
        break; // splice한 후 for문을 정지 시키고 다시 j변수 for문 실행
      }
    }
  }
  $e('--for문 종료--'); // 함수가 제대로 진행되어 마쳤는지 보기위한 콘솔로그
  list(); // 삭제 후 삭제된 배열을 다시 list()함수로 보여지게 하여 확인
}
```

1. checkdel() 함수로 accept링크 클릭 시 해당 목록 지워지고 arr배열의 상태를 확인한다.
2. 잘 제거되었을 시 성공
3. 작동이 잘 안 될 시 콘솔 로그와 개발자 도구를 이용하여 에러가 나거나 boolean이 사용되는 부분을 찾아내어 하나씩 고친다.

-----

```javascript
// 최종 코드
function $e(a) {
  return console.log(a);
}
 
var arr = [1, 2, 3, 4, 5];
var sav = [];
 
var func = {
  list: function() {
    var target = document.querySelector('.ctg');
    var sv = '';
    for (var i = 0; i < arr.length; i++) {
      sv += '<div>' + arr[i] + '</div>'; // for문 반복때마다 div태그에 감싸 줄바꿈
    }
    target.innerHTML = sv; // 출력
  },
  dlist: function() {
    var target = document.querySelector('.ctg');
    var sv = '';
    for (var i = 0; i < arr.length; i++) {
      sv += ('<label><input type="checkbox" onclick="javascript:func.checks(this)">' +
        arr[i] + '</label><br>'); // for문 반복때마다 div태그에 감싸 줄바꿈
    }
    sv += '<div><a href="javascript:func.checkdel()">accept!!</a></div>';
    target.innerHTML = sv; // 출력
  },
  checks: function(self) {
    if (self.checked) {
      sav.push(self.labels[0].textContent);
    } else {
      for (var i = 0; i < sav.length; i++) {
        if (self.labels[0].textContent == sav[i]) {
          sav.splice(i, 1);
        }
      }
    }
  },
  checkdel: function() {
    for (var j = 0; j < sav.length; j++) {
      for (var i = 0; i < arr.length; i++) {
        if (sav[j] == arr[i]) {
          $e(arr);
          $e(String(j) + String(i));
          arr.splice(i, 1);
          $e(arr);
          break;
        }
      }
    }
    func.list();
  }
};
```