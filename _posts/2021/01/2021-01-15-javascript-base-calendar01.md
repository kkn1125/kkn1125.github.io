---
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-01-15 21:25:04 +0900
title:  "[JAVASCRIPT] 달력 만들기"
author: Kimson
categories: [ javascript ]
image: assets/images/post/covers/TIL-javascript.png
tags: [ calendar, backup, til ]
description: "달력 만들기

달력 하나 만드는 게 이렇게 힘들 줄 몰랐네요...

그저 검색과 간단한 실험으로 하나씩 연구하면서 만들고는 있지만 그 달력 하나에 이 많은 코드가 필요할 줄 상상도 못 했습니다. 제가 살면서 제일 많이 쓴 코드량이네요."
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

달력 하나 만드는 게 이렇게 힘들 줄 몰랐네요...

그저 검색과 간단한 실험으로 하나씩 연구하면서 만들고는 있지만 그 달력 하나에 이 많은 코드가 필요할 줄 상상도 못 했습니다. 제가 살면서 제일 많이 쓴 코드량이네요.

## 꾸역꾸역 기능을 추가하다 보니 알게 된 점.

1. 객체 원형을 복사하는 new 함수가 정해진 패턴 없이 남발된다.
2. 즉흥적으로 생각나는 기능을 추가하려다 보니 추가되는 기능에 따라 기존의 코드를 무수히 고쳐야 하는 일이 발생했다. 즉, 최종 기능을 생각하지 않고 하다 보니 코드의 중복을 줄이지 못했고, 점점 조잡하게 코드들이 나열되었다.
3. 굳이 년월일을 배열로 구분하겠다고 처음부터 자료 관계를 엉뚱하게 이끌고 가는 바람에 쓸데없는 로스가 많았다. 예를 들면, 2021년 1월 15일이라는 데이터를 arr [2021015]라는 식으로 저장이 되어 2021014개의 빈 요소가 생성되었다...(끔찍)
4. 즉석으로 기능이 추가되면서 어떤 함수가 무슨 기능을 하고 이 함수가 어디에 연결되어 있는지 헷갈려서 도저히 감당할 코드가 아니게 됐다.
5. 아무리 연습 삼아했지만 자괴감이 든다.

```javascript
function $e(a) {
  console.log(a);
}
//날짜 관련 변수
var today = new Date();
var year = today.getFullYear();
var year2 = today.getFullYear();
var month = today.getMonth();
var month2 = today.getMonth();
var ym = year + "년" + (month + 1) + "월";
var todo = document.querySelector('.todo');
document.querySelector('#ym').innerHTML = ym;
//innerHTML을 위한 타겟 변수
var calender = document.querySelector('#cal');
var last_date = new Date(year2, month2 + 1, 0).getDate();
 
//데이터를 저장하는 배열과 변수
var ycheck = 0;
var Board = [];
var MemberList = [];
var loginMember = "";
var svdata = 0;
 
//기존 데이터를 유지하고 복사하여 변수를 선언하는 객체원형
function wlist() {
  this.num = [];
}
 
function ctn() {
  this.title = "",
    this.memo = "",
    this.id;
  this.time;
}
// var writelist = new wlist(); // 게시글 객체원형
 
function bafmemo(self) {
  var todayinfo = year2 + String(month2) + document.querySelector('.todo').children[0].href.substring(17).split(')')[0].split('_')[2];
  if (self.id == 'mmv0') {
    for (var key in Board[Number(todayinfo)].num) {
      if (document.querySelector('.wtitle').innerHTML == Board[Number(todayinfo)].num[key].title) { //memo동일조건 추가해야함
        var tgt = Board[Number(todayinfo)].num[key - 1]
        if (tgt == undefined) {
          alert('첫 글입니다. 표시 할 이전 글이 없습니다.')
          break;
        } else {
          var tars = document.querySelector('.views');
          var stacks = '';
          stacks += '<p class="wtitle">' + tgt.title + '</p>' + '<p class="wmemo">' + tgt.memo + '</p><p id="mmove"><a id="mmv0" onclick="javascript:bafmemo(this)">Before</a><a id="glist" href="javascript:views(' + Number(todayinfo) + ');">Go to List</a><a id="mmv1" onclick="javascript:bafmemo(this)">Next</p>';
          tars.innerHTML = stacks;
          document.querySelector('#tdtitle').innerHTML = '';
          document.querySelector('.views').style.borderBottom = 'none';
          document.querySelector('#tdtitle').style.borderBottom = 'none';
          break;
        }
      }
    }
  } else if (self.id == 'mmv1') {
    for (var key in Board[Number(todayinfo)].num) {
      if (document.querySelector('.wtitle').innerHTML == Board[Number(todayinfo)].num[key].title) { //memo동일조건 추가해야함
        var tgt = Board[Number(todayinfo)].num[Number(key) + 1]
        if (tgt == undefined) {
          alert('마지막 글입니다. 표시 할 다음 글이 없습니다.')
          break;
        } else {
          var tars = document.querySelector('.views');
          var stacks = '';
          stacks += '<p class="wtitle">' + tgt.title + '</p>' + '<p class="wmemo">' + tgt.memo + '</p><p id="mmove"><a id="mmv0" onclick="javascript:bafmemo(this)">Before</a><a id="glist" href="javascript:views(' + Number(todayinfo) + ');">Go to List</a><a id="mmv1" onclick="javascript:bafmemo(this)">Next</p>';
          tars.innerHTML = stacks;
          document.querySelector('#tdtitle').innerHTML = '';
          document.querySelector('.views').style.borderBottom = 'none';
          document.querySelector('#tdtitle').style.borderBottom = 'none';
          break;
        }
      }
    }
  }
}
 
function views(self) { // todo list 출력
  // console.log(self); //정수가들어옴
  var tars = document.querySelector('.views');
  var tgts = document.querySelector('#ym').innerHTML; //? 이거뭐냐
  // console.log(tgts);
  if (Board[self]) {
    var stacks = '';
    for (i = 0; i < Board[self].num.length; i++) {
      var tart = Board[self].num[i];
      stacks += '<p class="viewsf"><span class="sep"><span>' + (Number(tart.id.split("_")[2]) + 1) + '</span><a class="board_words" id="mnum' + '_' + self + '_' + i + '" onclick="javascript:viewdetails(this)">' + tart.title + '</a></span><span class="his_daytimes">' + tart.time + '</span></p>';
    }
    tars.innerHTML = stacks;
  } else {
    tars.innerHTML = '';
  }
  svdata = self;
  document.querySelector('#tdtitle').innerHTML = 'To-do List';
  document.querySelector('.views').style.borderBottom = '1px solid lightgray';
  document.querySelector('#tdtitle').style.borderBottom = '1px solid lightgray';
}
 
function crnt_time() { // 현재시간 새로 추출
  var todays = new Date();
  var day = todays.getFullYear() + '.' + (today.getMonth() + 1) + '.' + today.getDay();
  var timezone = todays.getHours() + ':' + todays.getMinutes() + ':' + todays.getSeconds();
  return day + '\t' + timezone;
}
 
function viewdetails(self) { // todo 확대보기
  var tars = document.querySelector('.views');
  var stacks = '';
  var vrb = '';
  for (y = 0; y < Board[svdata].num.length; y++) { // 보드배열에서 조회
    if (self.innerText == Board[svdata].num[y].title) {
      vrb = Board[svdata].num[y];
    }
  }
  stacks += '<p class="wtitle">' + vrb.title + '</p>' + '<p class="wmemo">' + vrb.memo + '</p><p id="mmove"><a id="mmv0" onclick="javascript:bafmemo(this)">Before</a><a id="glist" href="javascript:views(' + svdata + ');">Go to List</a><a id="mmv1" onclick="javascript:bafmemo(this)">Next</p>';
  tars.innerHTML = stacks;
  document.querySelector('#tdtitle').innerHTML = '';
  document.querySelector('.views').style.borderBottom = 'none';
  document.querySelector('#tdtitle').style.borderBottom = 'none';
}
 
// function dump() {
//   document.querySelector('#ch').innerHTML = JSON.stringify(yearmonth);
// }
 
function dumps(obj) {
  var str = '';
  for (var i in obj) {
    str += i + ' => ' + obj[i] + '<br/>';
  }
  document.querySelector('#dumpout').innerHTML = str;
}
 
// var yearmonth = [];
 
// function ymcreater() {
//   this.year = 0;
//   this.month = 0;
//   this.day = 0;
//   this.arr;
// }
 
function write(self) { // 글쓰기 기능
  var contents = new ctn();
  contents.title = prompt("Title : ");
  contents.memo = prompt("Memo : ");
  // console.log(self);
  // self -= 1;
  if (Board[self]) {
    contents.id = 'memo_' + self + '_' + Board[self].num.length;
  } else {
    Board[self] = new wlist;
    contents.id = 'memo_' + self + '_' + 0;
  }
  contents.time = crnt_time();
  // console.log(contents.time.split('.'));
  // writelist['num'].push(contents);
  // console.log(self+'.'+writelist[0].title);
  Board[self].num.push(contents);
  // ymca = new ymcreater();
  // ymca['year'] = Number(contents.time.split('.')[0]);
  // ymca['month'] = Number(contents.time.split('.')[1]);
  // ymca['day'] = Number(contents.time.split('.')[2].split('\t')[0]);
  // yearmonth.push(ymca);
  // ymca.arr.push(Board);
  // console.log(self);
  views(self);
}
 
function mkcal(a, b) { // 캘린더 디스플레이 함수
  var row = calender.insertRow();
  var last_date = new Date(a, b + 1, 0).getDate();
  var first_day = new Date(a, b, 1).getDay();
  var cell = '';
  for (var i = 0; i < first_day; i++) {
    cell = row.insertCell();
  }
  for (var j = 1; j <= last_date; j++) {
    if (first_day != 7) {
      // console.log(this);
      cell = row.insertCell();
      cell.setAttribute('id', a + '_' + b + '_' + [j]); //
      cell.setAttribute('class', 1);
      cell.onclick = function (event) {
        var boardnum = Number(this.id.split('_')[0] + this.id.split('_')[1] + this.id.split('_')[2]);
        if (Board[boardnum]) {
          views(boardnum);
        } else {
          views(boardnum);
        }
        todo.innerHTML = '<a href="javascript:write(' + this.id + ')">Todo 작성</a>'; //todo쪽 고치기 (년월구분)
        //color area
        for (var q = 1; q <= last_date; q++) {
          var set_id = document.getElementById(Number(year2) + '_' + Number(month2) + '_' + q);
          set_id.bgColor = "";
          set_id.style.color = 'black';
        }
        this.bgColor = '#F44D00';
        this.style.color = 'white';
        //color area
      };
      cell.innerHTML = [j];
      first_day += 1;
    } else {
      row = calender.insertRow();
      cell = row.insertCell();
      cell.setAttribute('id', a + '_' + b + '_' + [j]);
      cell.setAttribute('class', 1);
      cell.onclick = function (event) {
        var boardnum = Number(this.id.split('_')[0] + this.id.split('_')[1] + this.id.split('_')[2]);
        if (Board[boardnum]) {
          views(boardnum);
        } else {
          views(boardnum);
        }
        todo.innerHTML = '<a href="javascript:write(' + this.id + ')">Todo 작성</a>';
        //color area
        for (var q = 1; q <= last_date; q++) {
          var set_id = document.getElementById(Number(year2) + '_' + Number(month2) + '_' + q);
          set_id.bgColor = "";
          set_id.style.color = 'black';
        }
        this.bgColor = "#F44D00";
        this.style.color = 'white';
        //color area
      };
      cell.innerHTML = [j];
      first_day = first_day - 6;
    }
  }
}
 
mkcal(year, month); // 첫 실행 함수
checktoday(); // 오늘날 표시
 
function checktoday() {
  m_today();
  var today_date = today.getDate();
  var tdy = '';
  if (year === year2) {
    if (month == month2) {
      for (var i = 1; i <= 31; i++) {
        var set_id = document.getElementById(Number(year) + '_' + Number(month) + '_' + i);
        set_id.bgColor = "";
        set_id.style.color = 'black';
        // console.log(tdy.getAttirbute('id'));
        if (today_date == Number(set_id.getAttribute('id').split('_')[2])) {
          // console.log(Number(set_id.getAttribute('id').split('_')[2]));
          set_id.bgColor = "tomato";
          set_id.style.color = 'white';
          tdy = set_id;
          year2 = today.getFullYear();
          month2 = today.getMonth();
          var sav_day = tdy.id.split('_')[0] + tdy.id.split('_')[1] + tdy.id.split('_')[2];
          views(Number(sav_day));
        }
      }
    } else {
      for (var i = 1; i <= 31; i++) {
        var set_id = document.getElementById(Number(year) + '_' + Number(month) + '_' + i);
        set_id.bgColor = "";
        set_id.style.color = 'black';
        // console.log(tdy.getAttirbute('id'));
        if (today_date == Number(set_id.getAttribute('id').split('_')[2])) {
          // console.log(Number(set_id.getAttribute('id').split('_')[2]));
          set_id.bgColor = "tomato";
          set_id.style.color = 'white';
          tdy = set_id;
          year2 = today.getFullYear();
          month2 = today.getMonth();
          var sav_day = tdy.id.split('_')[0] + tdy.id.split('_')[1] + tdy.id.split('_')[2];
          views(Number(sav_day));
        }
      }
    }
  } else {
    for (var i = 1; i <= 31; i++) {
      var set_id = document.getElementById(Number(year) + '_' + Number(month) + '_' + i);
      set_id.bgColor = "";
      set_id.style.color = 'black';
      // console.log(tdy.getAttirbute('id'));
      if (today_date == Number(set_id.getAttribute('id').split('_')[2])) {
        // console.log(Number(set_id.getAttribute('id').split('_')[2]));
        set_id.bgColor = "tomato";
        set_id.style.color = 'white';
        tdy = set_id;
        year2 = today.getFullYear();
        month2 = today.getMonth();
        var sav_day = tdy.id.split('_')[0] + tdy.id.split('_')[1] + tdy.id.split('_')[2];
        views(Number(sav_day));
      }
    }
  }
  // mkcal(year, month);
  todo.innerHTML = '';
  todo.innerHTML = '<a href="javascript:write(' + tdy.id + ')">Todo 작성</a>';
}
 
// function evntl(self) { // 여기 수정중 21.01.13
//   var button = document.getElementsByClassName('1');
//   for (var i = 0; i < last_date; i++) {
//     button[i].onclick('click', function (event) {
//       this.bgColor = "red";
//     });
//   }
// }
function m_today() {
  delcell();
  var yms = year + "년" + (month + 1) + "월";
  document.querySelector('#ym').innerHTML = yms;
  mkcal(year, month);
}
 
function before_after(self) { // 이전, 다음달 기능
  if (self.value == '<') {
    delcell();
    if (month2 == 0) {
      month2 = 11;
      year2 -= 1;
    } else {
      month2 -= 1;
    }
    var yms = year2 + "년" + (month2 + 1) + "월";
    document.querySelector('#ym').innerHTML = yms;
    mkcal(year2, month2);
    views(self);
  } else if (self.value == '>') {
    delcell();
    if (month2 == 11) {
      month2 = 0;
      year2 += 1;
    } else {
      month2 += 1;
    }
    var yms = year2 + "년" + (month2 + 1) + "월";
    document.querySelector('#ym').innerHTML = yms;
    mkcal(year2, month2);
    views(self);
  }
}
 
function gett(self) { //월말까지 순회해서 배경 흰색으로 초기화
  for (var j = 0; j < last_date; j++) {
    var stids = document.getElementsByClassName('1')[j].bgColor = "";
  }
  var a = self.id;
  var b = Number(a);
  return b;
}
 
function delcell() { // 이전,다음달 넘어가면서 레코드 초기화
  if (document.querySelector('#cal').rows.length != 2) {
    for (var k = 1; k < 7; k++) {
      calender.deleteRow(2);
      if (document.querySelector('#cal').rows.length == 2) {
        break;
      }
    }
  }
}
```