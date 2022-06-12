---
slug: "/javascript-calendar02"
layout: post
modified: 2022-03-23 20:30:47 +0900
date:   2021-07-18 16:21:27 +0900
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
published: true
---

# TODO List

> USED
> 
> - [x] Bootstrap 5.0.2
> - [x] JQuery 3.6.0
> - [x] VSCode
> - [x] Chrome, Firefox ( O )
> - [ ] IE ( X )

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

1. 달력을 만들 때 초기화 해주는 함수가 필요하다.
2. 각 기능별 초안을 잡아두지 않고 즉석으로 만들어내면 초기에는 잘 모르지만 이후에는 많이 조잡해진다.
3. 기능 추가로 변수가 증가하고, 가급적 불변으로 해야 데이터를 덮어쓰는 일이 없다.
4. this가 어디에 주체를 두고 있는지 익숙해져야 bind, call, apply를 때에 따라 자유자제로 사용할 수 있다.
5. 전체 포스팅을 점검하며 수정하는 시점에서 덧붙이면 이때 당시 객체 속성을 변수로 활용하는 것이 맞는 방법인지 불확실했다. 지금은 객체를 이용한 데이터 저장을 적극적으로 사용하고 있는 부분이다.
6. 함수 내 다른 this를 가진 함수를 사용할 때 현재 스코프의 this를 전달할 때는 인자로 전달하기보다 bind나 call 등으로 전달하는 것이 좋습니다.

예제 코드
```javascript
Obj.test = {
    prop1: "wow",
    prop2: function(){
        // 이 함수에서 this는 Obj.test 객체를 가리킵니다.

        console.log(this.prop1); ( O )  /* 함수 내에서 this.prop1하면 wow를 가져옴 */
        var prop1 = this.prop1;
        
        if( ... ) {
            // 스코프 변환 시점
            /* this.prop1 ( X ) 함수 내 다른 스코프 내에서는 this.prop1을 못 가져옴 */

            var prop2Var = "ABC";
            // prop2Var를 Obj.test객체에 tmp라는 속성에 값을 저장한다.
            // prop3메서드에서 변수를 사용하기 위함이다.
            Obj.test.tmp = {
                prop2var: prop2Var
            }
            console.log(prop1); ( O ) /* "wow" */
        }
    },
    prop3: function(){
        /* prop2의 if문 안에 선언되었던 prop2Var 값 ABC 출력 */
        console.log(Obj.test.tmp.prop2var);
    }
}
```

-----

<div>
    <table id="kal" class="table text-center table-hover"></table>
</div>
<script src="{{site.baseurl}}/assets/lib/devkalendar.js"></script>

-----

수정된 기능은 setting부분의 tr조정과 table의 width조정, 추가된 기능은 TODO List 기능과 오늘로 이동, 할일 여부에 따른 뱃지, 개수 표기 입니다.

[이전 달력 포스팅]({{ site.baseurl }}/javascript-calendar/){:target="_blank"}에 초기 세팅값에 대해 자세히 적혀있습니다.

<a href="{{site.baseurl}}/assets/download/devkalendarTODO.zip" download>devKalendarTODO 1.1.0 ver 다운로드</a>