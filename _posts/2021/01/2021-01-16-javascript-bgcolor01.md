---
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-01-20 21:25:04 +0900
title:  "[JAVASCRIPT] 배경색 무작위 변경 버튼"
author: Kimson
categories: [ javascript ]
image: assets/images/post/covers/TIL-javascript.png
tags: [ bgcolor, backup, til ]
description: "색상 무작위 변경 버튼을 하나 만든다. 변경하는 함수를 만든다."
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

# 색상 무작위 변경

1. 버튼을 하나 만든다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <input type="button" onclick="javascript:colorchange()">
</body>
<script src="color.js"></script>
</html>
```

2. 변경하는 함수를 만든다.

```javascript
var a = 0; // RGB값의 R에 해당하는 값을 전역변수로 만든다.
var b = 0; // RGB값의 G에 해당하는 값을 전역변수로 만든다.
var c = 0; // RGB값의 B에 해당하는 값을 전역변수로 만든다.
 
function colorchange() { // 컬러를 변경하는 함수
    if (a > 255) { // RGB값은 255를 넘을 수 없기에 255를 넘어갈때 0으로 만드는 조건을 건다.
        a = 0;
    }
    if (b > 255) { // 상동
        b = 0;
    }
    if (c > 255) { // 상동
        c = 0;
    }
    
    a += 50; // R값을 50씩 올린다.
    b += 75; // G값을 75씩 올린다.
    c += 125; // B값을 125씩 올린다.
    //이렇게 되면 C가 초기화되고 R,G가 올라가는 식의 반복을 통해 색상이 무작위적으로 변한다.
    
    var target = document.querySelector('body'); // 예제로 배경색을 지정
    target.style.transition = '1s'; // 부드럽게 변하는게 좋아서 추가
    target.style.backgroundColor = 'rgb(' + a + ',' + b + ',' + c + ')'; // RGB적용
}
```

- backgroundColor가 타입을 string으로 받기때문에 'rgb(a, b, c)'를 따옴표로 묶음
- 증가와 초기화를 통해 색상이 바뀜

-----

Math.random()과 Math.round()를 통해 더 단순화 및 진정한 의미의 랜덤이 될 수는 있지만 어제 잠들기전 문득 생각이 나서 만들어 봄

되서 뿌듯