---
layout: post
modified: 2022-03-23 19:39:06 +0900
date:   2021-07-15 17:40:27 +0900
title:  "[JAVASCRIPT] 달력만들기"
author: Kimson
categories: [ javascript ]
tags: [calendar, 달력, js, til]
image: assets/images/post/jsdevKal/devkal.png
description: "Javascript 라이브러리를 끌어 쓰던 중 \" 내가 만들면 어떨까 \" 해서 작업을 하게 되었습니다.
저번에 중구난방으로 만들어봤지만 뭔가 설정 하나하나 커스터마이징 할 수 있게 하는 것이 라이브러리들의 특징이 아닐까 싶어 열심히 라이브러리 구조를 베끼고 관찰하면서 지금의 초본이 만들어졌습니다."
featured: false
hidden: false
rating: 3.5
toc: true
---

# Calendar 만들기

Todo List를 연습삼아 만들면서 캘린더가 필요할 것 같아 만들어 보았습니다.

```html
<html>
    <head>
         <script src="devkalendar.js">
             //head안에 devkalendar.js 를 불러옵니다.
         </script>   
    </head>
    <body>
        <div>
            <table id="example"></table>
        </div>
    </body>
</html>
```

body에 div에 감싸여진 채로 table태그를 생성하고 id값을 줍니다.

script를 body종료 전에 생성합니다. ( src로 불러와도 됩니다. 단, devkalendar.js 이후에 아래의 구문을 적어야합니다. )

```javascript
const example = com.devkimson.calendar.create(document.getElementById("example")||"example",{
    marker: {
        color: "red", /* default rgba(255,173,173,0.5) */
        thick: "3px", /* default 3px */
        style: "", /* default none */
        speed: "", /* default 0.5s */
        bezier: "", /* default cubic-bezier(1,0,0,1) */
        width: "" /* cell width */
     },
     table: {
         bgColor: "table-info", /* bootstrap */
         color: "text-muted", /* bootstrap */
         width: "10px", /* 셀너비 조정 default auto */
         padding: "1rem" /* table tag padding default auto */
         collapse: "separate", /* default collapse */
         spacing: "1rem" /* cell-padding default auto */
     }   
});
```

namespace ( com.devkimson.calendar )를 작성하고 인자 값으로 html에서 설정한 table의 id값을 적어줍니다.
중괄호의 settings는 필요한 부분만 커스터마이징하여 사용하면 됩니다.


## 기본 설정

![cal1]({{ site.baseurl }}/assets/images/post/jsdevKal/devkal.png)

## 커스터마이징

![cal2]({{ site.baseurl }}/assets/images/post/jsdevKal/devkal-2.png)

<a href="{{ site.baseurl }}/assets/download/kalendarJS.zip" download>캘린더 js 파일 다운로드</a>
