---
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-07-24 16:21:27 +0900
title:  "[JAVASCRIPT] 달력만들기 - TODO LIST"
author: Kimson
categories: [ javascript ]
tags: [달력, calendar, todolist, til]
image: assets/images/post/jsdevKal/devkal-3.png
description: "사용 dependency
junit : 4.12
spring-test : 5.3.6
jackson-databind : 2.12.3"
featured: false
hidden: false
rating: 5
beforetoc: "이전 시간에 만들었던 달력에 오늘 TODO List 기능을 추가하면서 알게 된 것들과 수정된 부분을 정리하고자 포스팅합니다.

첨부파일은 맨 아래 올려두었습니다.

[달력은 bootstrap과 jquery가 없으면 부분 미작동합니다.]"
toc: true
---

# TODO List

>USED

- Bootstrap 5.0.2
- JQuery 3.6.0
- VSCode
- Chrome, Firefox ( O )
- IE ( X )

## 추가된 기능

### TODO List

기존 달력에서 크게 추가된 기능은 아래와 같습니다.
- 클릭된 요일의 연월일 표기
- 요일 클릭 안내 및 할일 목록, 빈 목록 안내 - 문구 출력
- 요일 클릭 시 할 일 추가 텍스트박스와 버튼 표시
- 할 일 추가

#### 시작 안내 문구

![devkal3]({{ site.baseurl }}/assets/images/post/jsdevKal/devkal-3.png)

#### 할 일 여부에 따른 뱃지와 개수 표기

![devkal4]({{ site.baseurl }}/assets/images/post/jsdevKal/devkal-4.png)

#### 할 일 추가

![devkal5]({{ site.baseurl }}/assets/images/post/jsdevKal/devkal-5.png)

![devkal7]({{ site.baseurl }}/assets/images/post/jsdevKal/devkal-7.png)


#### 오늘로 이동 버튼 추가

![devkal8]({{ site.baseurl }}/assets/images/post/jsdevKal/devkal-8.png)

![devkal9]({{ site.baseurl }}/assets/images/post/jsdevKal/devkal-9.png)

## 수정된 기능

### 비어있는 tr 추가되는 현상 수정

![devkal10]({{ site.baseurl }}/assets/images/post/jsdevKal/devkal-10.png)

요일이 토요일에 딱 떨어지는 달이면 빈 tr이 추가되어 들쭉날쭉하지 않도록 수정했습니다.

### 설정 값

create할 때 설정값 변경되었습니다.

```javascript
const kal = com.devkimson.calendar.create(document.getElementById("kal"||"kal", {
    marker: { ... },  /* 그대로 입니다. */
    table: {
        ***: " ... ",  /* 나머지 그대로 입니다. */
        width: "100%",  /* td로 들어가던 것을 table로 변경했습니다. */
        tr: {  /* tr부분이 새로 추가되었습니다. */
            height: "50px",  /* tbody 내의 전체 tr의 높이 */
            valign: "middle"  /* valign속성 그대로 들어갑니다. */
        }
    }
});
```

>알게된 내용
<div class="spoiler">
아주 단순한 코드이기 때문에 바로 아실 것 같습니다.

먼저 처음 달력을 만들때 태그의 id값과 설정값을 받아 한 번에 달력이 생성되어야 했기에 id값과 설정값을 받는 객체를 먼저 생성하고,
초기화 함수, 상단 네비게이션 생성 함수, 요일 생성, 일자 생성 함수, 다음달 함수, 이전달 함수를 만들었고, 원래 각 기능별로 하는 것에 초점을 두기보다 즉석으로 만들어내는 코드로 더욱 조잡해졌습니다.

이것 저것 기능을 추가하다보니 변수도 추가되고, 점점 꼬이는 것 같아 todo list기능을 만들때는 변수와 함수를 미리 정해놓고, 다른 변수 및 함수를 참조하지 않도록 신경을 썼습니다.

첫번째로 변수 스코프때문에 애를 먹었는데 특히 객체형 함수를 사용하다보니 this가 안먹히는 상황이 발생했습니다.
이때 끌어올 변수를 선언한 부분에서 객체.tmp로 임시저장변수를 만들어 000.tmp = { tmpVar: target}으로 어느 곳에서든 사용가능하게 만들어 사용을 했습니다. 이 사용이 어떤 오류를 발생시킬지는 아직 잘 모르겠습니다만, 현재는 무리가 없어 사용 중입니다.

두번째로 위와 비슷한 상황이었고, 동일 객체 내 함수에서 프로퍼티를 가져와 함수 내 지역 스코프에 사용이 안되어 함수에 변수를 만들어 해당 프로퍼티를 저장시키고 사용한 경우입니다.

저와 같은 처지의 분들에게 도움이 되고자 남깁니다...
</div>

예제 코드
```javascript
Obj.test = {
    prop1: "wow",
    prop2: function(){
        ...
        console.log(this.prop1); ( O )  /* 함수 내에서 this.prop1하면 wow를 가져옴 */
        var prop1 = this.prop1;
        
        if( ... ){
            var prop2Var = "ABC";
            /* prop2의 if문 안에 선언된 prop2Var가 지역변수이고 해당 값을 prop3에서 사용하고자 할때 */
            Obj.test.tmp = {
                prop2var: prop2Var
            }
            /* this.prop1 ( X ) 함수 내 다른 스코프 내에서는 this.prop1을 못 가져옴 */
            console.log(prop1); ( O ) /* "wow" */
        }
    },
    prop3: function(){
        ...
        console.log(Obj.test.tmp.prop2var); /* prop2의 if문 안에 선언되었던 prop2Var 값 ABC 출력 */
    }
}
```

-----

* 시험버전이므로 데이터가 저장되지 않습니다. 적용전 미리 체험해보시기 바랍니다.

<script src="{{site.baseurl}}/assets/lib/devkalendar.js"></script>

<div>
    <table id="kal" class="table text-center table-hover"></table>
</div>

<script>
const kal = com.devkimson.calendar.create(document.getElementById('kal')||'kal',{
		marker:{ // 클릭 위치 마커 관련 설정
			color: "green", // color name or color code
			// thick: "6px", // num
			// style: "dashed", // value
			speed: ".5s", // value
			// bezier: "none", // value
			width: "35px" // num
		},
		table:{ // 테이블 속성
			// bgColor: "table-info",
			color: "text-muted", // class name
			width: "80%", // num default auto
			// padding: "15px", // num
			// collapse: "separate", // value
			spacing: ".5rem", // num
			tr:{ // 1.1.0ver 추가
				height: "50px", // num default 50px
				valign: "middle" // num default middle
			}
		},
        today:{
            color: "coral"
        }
	});
</script>

-----

요약하면
수정된 기능은 setting부분의 tr조정과 table의 width조정,
추가된 기능은 TODO List 기능과 오늘로 이동, 할일 여부에 따른 뱃지, 개수 표기 입니다.



>Kalendar.js 1.1.0ver 

<a href="{{site.baseurl}}/assets/download/devkalendarTODO.zip" download>devKalendarTODO 1.1.0 ver 다운로드</a>


이전 달력만들기에 초기 세팅값에 대해 자세히 적혀있습니다.

[이전 달력 포스팅]({{ site.baseurl }}/javascript-calendar/){:target="_blank"}