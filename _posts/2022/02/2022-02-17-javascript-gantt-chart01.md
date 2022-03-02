---
layout: post
modified: 2022-03-02 22:30:57 + 0900
date:   2022-02-17 13:51:02 +0900
modified: 2022-02-22 20:14:18 +0900
title:  "[JAVASCRIPT] 간트차트를 만들어보자"
author: Kimson
categories: [ JAVASCRIPT, TIL, TIM ]
image: assets/images/post/covers/TIL-javascript.png
tags: [ web tool, gannt chart, table ]
description: "Gantt Chart 간트 차트는 프로젝트 일정관리를 위해서 사용이 되는데요. 처음 간트 차트를 접하게 된 때는 설계사무소를 다닐 때 였습니다. 물론 테이블을 다루는 라이브러리를 많이 있고, 아예 엑셀을 만들어 배포하는 것도 많이 봤습니다. 하지만 원리와 구성을 모른 채 라이브러리에 의존하다보니 문득 궁금해졌습니다. 하드코딩이라도 괜찮으니 한 번 만들어 보기로 한거죠."
featured: true
hidden: false
rating: 4.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# Gantt Chart

> 수정사항: 업데이트된 내용을 추가 하였습니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/GanttChartAnatomy.png/300px-GanttChartAnatomy.png" alt="위키 백과 - 플레잉카드" title="위키 백과 - 간트 차트">
   <figcaption>[출처] 위키 백과 - 간트 차트</figcaption>
</span>
</figure>

간트 차트는 프로젝트 일정관리를 위해서 사용이 되는데요. 처음 간트 차트를 접하게 된 때는 설계사무소를 다닐 때 였습니다.

물론 테이블을 다루는 라이브러리를 많이 있고, 아예 엑셀을 만들어 배포하는 것도 많이 봤습니다.

하지만 원리와 구성을 모른 채 라이브러리에 의존하다보니 문득 궁금해졌습니다. 무엇보다도 계기는 태그 하나씩 짜는게 마음대로 안되고 귀찮고, 노동이 필요하고, 필요로하는 사람이 있어 하드코딩이라도 괜찮으니 한 번 만들어 보기로 했습니다.

## 의사 코드 작성

의사 코드라기보다 전체적으로 어떻게 구성해서 어떤 기능이 크게 있는지 먼저 정리해나갔습니다.

1. 테이블은 초기에 헤드와 바디 영역으로 1개 씩 생성한다. (초기화)
2. 내보내기를 누르면 완성된 테이블을 `html` 코드로 복사해서 사용하고 싶은 곳에 붙여넣는다.

크게보면 별로 할게 없어보입니다.

### 세분화된 의사코드

- 셀
  1. `case` 마우스를 클릭한다.
     1. `textarea`를 생성한다.
     2. 셀의 내용을 `textarea`에 복사한다.
     3. 생성된 `textarea`를 `select`함수로 선택한다.
     4. `temp`에 처음 셀의 내용을 저장한다.
     5. 내용을 수정한다.
     6. `if` `Escape`키를 누르면
        1. `temp` 내용을 덮어씌운다.
        2. `textarea`를 삭제한다.
     7. `elif` `ctrl` + `Enter`키를 누르면
        1. `textarea`내용을 덮어씌운다.
        2. `textarea`를 삭제한다.
  2. `case` 마우스를 호버한다.
     1. 셀 기준 우측과 하단에 `add`버튼을 띄운다.
        1. `if` 우측 버튼 클릭
        2. 해당 셀이 속한 행 다음으로 열을 추가한다. (thead, tbody)
        3. `if` 하단 버튼 클릭
        4. 해당 셀이 속한 행 다음으로 행을 추가한다. (thead, tbody)
     2. 테이블 기준 좌측과 상단에 `delete`버튼을 띄운다.
        1. `if` 좌측 버튼 클릭
        2. 해당 셀이 속한 행을 지운다. (thead, tbody)
        3. `elif` 상단 버튼 클릭
        4. 해당 셀이 속한 열을 지운다. (thead, tbody)
  3. `case` 마우스 우클릭을 한다.
     1. 컨트롤 리스트를 띄운다.
        1. `case` 폰트 (size, style)
        2. `case` 폰트 색상 (color, opacity)
        3. `case` 배경 색상 (color, opacity)
        4. `case` 테두리 (width, style, color)
        5. `case` 이동 (left, top, bottom, right)
        6. `case` 속성 복사 (paste, copy, clear)
        7. `case` 내용 복사 (paste, copy, clear)
        8. `case` 행 전체 적용
        9. `case` 열 전체 적용
        10. `case` 길이 조정
        11. `case` 높이 조정

더 많은 기능들이 있지만 핵심이 되는 기능은 위가 전부 입니다. 대강 내용이 기능들이 정리되고 어떤 함수를 만들고 어떤 변수를 만들어 사용할지 가닥이 잡히면 코드를 작성합니다.

## 많은 input 내용 자동으로 변경시키기

`input`이 많아지면서 데이터를 넣는게 힘들어질텐데요. 여러 툴들을 떠올리면서 다양한 방법을 찾게 됩니다.

추천하는 방법은 전역적으로 `input` 이벤트를 사용해서 데이터를 적용시키는 것인데요.

힘든 예제는 아래와 같습니다.

```javascript
let fontSize, fontUnit, borderWidth, borderUnit, borderStyle, borderColor;

const gantt = {};

const inputFontSize = document.querySelector('#fontSize');
// ex) value = 12

const inputFontUnit = document.querySelector('#fontUnit');
const inputBorderWidth = document.querySelector('#borderWidth');
// ex) value = 1

const inputBorderUnit = document.querySelector('#borderUnit');
const borderStyle = document.querySelector('#borderStyle');
const borderColor = document.querySelector('#borderColor');

function unitDivide(input){
   return input.value.match(\/([0-9.]+)(\w+)\/).slice(1);
}

function unitConcat(input, unit){
   return input.value + unit;
}

window.addEventListener('change', (ev)=>{
   fontUnit = inputFontUnit.value; // ex) "px"
   borderUnit = inputBorderUnit.value; // ex) "px"

   fontSize = unitConcat(inputFontSize, fontUnit);
   borderWidth = unitConcat(inputBorderWidth, borderUnit);

   switch(ev.id){
      case 'fontSize':
         gantt.attr['fontSize'] = fontSize; // ex) "12px"
         break;
      case 'borderWidth':
         gantt.attr['borderWidth'] = borderWidth; // ex) "1px"
         break;
      // ... 쭉쭉쭉
   }
})
```

이렇게 작성하다보면 속성이 추가될 때마다 수정해줘야하고 많아져 관리가 힘듭니다.

특히 단위를 지정하는 속성이나 `radio` 등을 이용한 속성 선택이라면 더욱 힘듭니다.

```javascript
const gantt = {};

window.addEventListener('change', (ev)=>{
   const target = ev.target;
   let autoValue = [...document.querySelectorAll(`#${target.id}`)].reduce((pre, cur)=>pre+=cur.value, '');

   if(!target.classList.contains('attrs')) return;
   if(!target.closest('td,th')) return;

   switch(ev.target.id){
      default :
         if(closest.querySelector('#bRow').checked){
            gantt[ganttType][rowid.value].map(col=>{
                  col.attr[target.id] = autoValue;
            });
         }
   
         if(closest.querySelector('#bCol').checked){
            gantt[ganttType].map(row=>{
                  return row[colid.value].attr[target.id] = autoValue;
            });
         }
   
         gantt[ganttType][rowid.value][colid.value].attr[target.id] = autoValue;
         break;
   }
});
```

`attrs`클래스가 있는 타겟만 통과 시킵니다. 그러면 `Model`각 `input`에 스타일 이름과 동일한 속성 명`(camel case)`을 아이디로 부여합니다

이렇게 코드를 변경하게 되면 자잘한 변수들은 이제 지워도 됩니다. 넘버와 단위를 자동으로 합하고 적용시키기 때문에 불필요한 코드를 줄일 수 있습니다.

`if`문에 있는 내용은 테이블의 `row` 혹은 `col`에 전체 적용하기 위한 스위치에 대한 내용입니다.

`row`가 체크되면 해당 셀이 속한 행에 모두 값을 적용시키고, `col`이 켜지면 해당 셀이 속한 열에 모두 적용됩니다.

그러면 둘 다 키면 교차로 십자 경로에 있는 모든 셀들이 같이 수정 됩니다.

이제 HTML에 스타일 속성명을 카멜케이스로 가지는 `input`만 추가해주면 알아서 추가되는데로 기능이 연결됩니다.

## 결과물

여러 기능을 섞고 개선하면서 현재 결과물은 아래와 같습니다.

### 차트 예제

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/gantt/gantt01.png" alt="sample" title="sample">
   <figcaption>현재 작업된 내용</figcaption>
</span>
</figure>

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/gantt/gantt02.png" alt="sample" title="sample">
   <figcaption>현재 작업된 내용</figcaption>
</span>
</figure>

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/gantt/gantt03.png" alt="sample" title="sample">
   <figcaption>현재 작업된 내용</figcaption>
</span>
</figure>

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/gantt/gantt04.png" alt="sample" title="sample">
   <figcaption>현재 작업된 내용</figcaption>
</span>
</figure>

### 업데이트 사항

#### 시트 기능 추가

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://kkn1125.github.io/portfolio/assets/images/portfolio/ganttChart/gantt02.png" alt="sample" title="sample">
   <figcaption>시트 기능 추가</figcaption>
</span>
</figure>

#### 컨트롤 바 UI 변경

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://kkn1125.github.io/portfolio/assets/images/portfolio/ganttChart/gantt03.png" alt="sample" title="sample">
   <figcaption>컨트롤 바 UI 변경</figcaption>
</span>
</figure>

#### 셀 4방향 추가로 변경

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://kkn1125.github.io/portfolio/assets/images/portfolio/ganttChart/gantt04.png" alt="sample" title="sample">
   <figcaption>셀 4방향 추가로 변경</figcaption>
</span>
</figure>

#### 셀 드래그 선택 기능 추가

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://kkn1125.github.io/portfolio/assets/images/portfolio/ganttChart/gantt05.png" alt="sample" title="sample">
   <figcaption>셀 드래그 선택 기능 추가</figcaption>
</span>
</figure>

아래의 간트 차트는 직접 만든 `ganttChart`에 의해 만들어졌습니다. 아래 표의 작업 시간은 1채 안 됩니다.

{% include test-table01.html %}

## 정리

도식화 툴을 하던 중에 너무 버거워서 잠시 중단했었습니다. 그러다가 테이블을 작업하던 중에 이제 데이터를 어떻게 `CRUD`를 간편하게 하는지 조금 알 것 같습니다.

기능이 많다보니 한 번에 처리하고자 하는 마음에 빨리 포기했던 것 같습니다.

웹 툴 기능을 모두 모아 배포를 하는 그 날까지 🙇‍♂️

[테스트 페이지](https://kkn1125.github.io/ganttChart/){:target="_blank"}