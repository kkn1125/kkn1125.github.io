---
layout: post
date:   2021-01-20 21:25:04 +0900
title:  "[JAVASCRIPT] 달력 만들기 (달력 기본 틀)"
author: Kimson
categories: [ JAVASCRIPT, TIL ]
image: assets/images/post/covers/TIL-javascript.png
tags: [ calendar, backup ]
description: "달력 만들기 날짜 관련 변수 선언 저번 글에서 var today = new Date();로 현재 날짜를 전역변수로 저장했었습니다."
featured: false
hidden: false
rating: 3
toc: true
profile: true
istop: true
keysum: false
keywords: ""
published: true
---

# 달력 만들기

## 날짜 관련 변수 선언

```javascript
// 달력, 날짜 관련 변수 선언
var calendar = document.querySelector('#calendar');
var select_ym = document.querySelector('#select_ym');
var output = document.querySelector('#output');
 
var v_date = today.getDate(); // 오늘 일수
var v_day = today.getDay(); // 오늘 요일
 
var year = today.getFullYear(); // 올해
var month = today.getMonth(); // 이번 달
var v_year = today.getFullYear(); // 올해 (변함)
var v_month = today.getMonth(); // 이번 달 (변함)
```

저번 글에서 var today = new Date();로 현재 날짜를 전역변수로 저장했었습니다.

변수 선언하여 사용할 목적은 이렇습니다.

고정된 오늘의 날짜가 있어야한다. 이후 today라는 버튼을 만들어 오늘날짜로 이동하는 기능을 구현하기 위함
변하는 오늘의 날짜가 있어야한다. 연월일의 이동이나 변함에 따라 그 값이 저장되며 다음달의 달력등을 조정하기 위함
그리고 각 id를 가진 태그들을 자주 사용할 것이기 때문에 전역변수로 지정해둡니다.

## 달력을 만들자

```javascript
function calendar_make(a, b) {
  if (a != undefined && b != undefined) { // 인수를 전달 받을 시 (달력 넘기기)
    v_year = a;
    v_month = b;
  } else { // 오늘로 이동
    v_year = year;
    v_month = month;
  }
  // 인수 받는 것을 처음에 둬야 이후 변수들에 대입되어 오류가 안 난다.
  var last_date = new Date(v_year, v_month + 1, 0).getDate(); // 이번달 마지막 일
  var first_day = new Date(v_year, v_month, 1).getDay(); // 이번 달 시작 요일 (0=>일, 1=>월 ...)
  select_ym.innerHTML = '<div>' + v_year + '년 ' + (v_month + 1) + '월' + '</div>';
 
  var row = calendar.insertRow();
  for (var i = 0; i < first_day; i++) { // 월의 시작일 전의 빈 칸
    var cell = row.insertCell();
  }
  for (var i = 1; i <= last_date; i++) { // 빈칸 이후의 달의 일수
    if (first_day != 7) {
      cell = row.insertCell();
      first_day += 1;
    } else {
      row = calendar.insertRow();
      cell = row.insertCell();
      first_day -= 6;
    }
    cell.setAttribute('id', i);
    cell.setAttribute('class', 'days');
    cell.addEventListener('click', function (self) {
      document.querySelector('#word_add').setAttribute('onclick', 'javascript:words_add(' + self.target.id + ')');
    })
    cell.innerHTML = i;
  }
}
```

우선 이름을 언더바로 나눈 이유는 나중에 calendar.make 이런식으로 바꿀 것이기 때문이다.

last_date에서 v_month+1을 한 이유는 입력한 달의 0은 입력한 달의 이전 달의 마지막 일수를 반환한다.

즉, 내가 2월의 마지막 일인 28일을 반환 받고 싶다면 아래처럼 불러올수 있다.

```javascript
var newdate = new Date(2021,2+1,0).getDate(); // 2월의 마지막 일수를 반환 (28일)
```

여기서 각자가 for문을 통해 알아볼 수는 있지만 0대신 1을 넣으면 해당 달의 시작일이 나온다.

하지만 자세히보면 last_date와 first_day의 차이가 보일 것입니다. first_day는 new Date()뒤에 .getDay가 붙습니다.

간략히 하자면 getDate는 일 수를, getDay는 요일을 나타냅니다. (0=>일, 1=>월, 2=>화 ... 6=>토)

```javascript
var firstday = new Date(2021, 2, 1).getDate(); // 2월의 1일이 반환
 
var firstday = new Date(2021, 2, 1).getDay(); // 2021년 2월의 시작 요일 => "5" (금요일)
```

var row부터 달력 출력의 시작입니다.

insertRow()를 통해 먼저 줄바꿈해줍니다. html구조 보여드릴때 추가로 이것 관련 설명드리겠습니다.
for문으로 줄바꿈한 곳에서 insertCell로 시작요일까지의 빈칸을 만듭니다.
그 다음 다시 for문으로 last_date일 까지 셀을 만듭니다. 여기서 분기문을 주는데 first_day를 != 7로 한 이유는 7이되면 else문으로 가서 줄바꿈, 셀추가가 동시에 되고 -6이 됩니다. 그러면 first_day는 1이 됩니다.
즉, 왜 first_day가 1이 되냐, 0부터 시작 아닌가? 하는 저와같은 고민을 할 분이 계실것 같아 재차 강조하자면, else문에서 줄바꿈과 셀추가가 동시에 일어나기때문에 일요일에 빈셀이 이미 생긴 상태고 월요일이 1부터 시작이 됩니다.
그리고 출력되는 셀들에 id값(호출하기 위한 인자로 쓸 예정)과 class값(css에 사용할 예정)을 줍니다.

지금보니 addEventListener를 줄 필요가 없었던거 같지만 우선 만들었으니 붙여줍니다.

해당 날을 클릭했을 때 글 작성버튼에 선택한 날의 일 수를 인자로 주는 기능입니다.

아래 예시를 보시면 무슨 말인지 이해 되실겁니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/back/back03.png" alt="sample" title="sample">
   <figcaption>kimson</figcaption>
</span>
</figure>

```html
<!DOCTYPE html>
<html lang="ko">
 
<head>
  <meta charset="UTF-8">
  <title>HTML</title>
  <link rel="stylesheet" href="css.css">
</head>
 
<body>
  <div id="setcal">
    <div>
      <div id="calcss">
        <table id="calendar">
          <thead>
            <tr>
              <td><input type="button" value="&lt&lt" onclick="javascript:before_after(this)"></td>
              <td id="select_ym" colspan="5">yyyy-mm</td>
              <td><input type="button" value="&gt&gt" onclick="javascript:before_after(this)"></td>
            </tr>
          </thead>
          <tbody>
            <!-- tbody에 tr가 하나라도 있어야 insertRow()가 tbody에 추가 됨 -->
            <tr>
              <td>일</td>
              <td>월</td>
              <td>화</td>
              <td>수</td>
              <td>목</td>
              <td>금</td>
              <td>토</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button id="go_today" onclick="javascript:calendar_today()"><span>Today</span></button>
    </div>
    <div>
      <div id="wordzone">
        <div id="crnt_ym"></div>
        <div id="output"></div>
      </div>
      <input id="word_add" type="button" value="Words add" onclick="javascript:words_add()" />
    </div>
  </div>
 
</body>
 
<script src="js.js"></script>
 
</html>
```