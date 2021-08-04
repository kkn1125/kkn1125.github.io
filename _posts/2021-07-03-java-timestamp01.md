---
layout: post
date:   2021-07-24 16:21:27 +0900
title:  "[JAVA] Timestamp 시간 나타내기"
author: Kimson
categories: [ TIL, JAVA ]
tags: [mysql, timestamp, simpledateformat]
image: assets/images/post/mysql_cover.png
description: "MySQL Timestamp타입 웹에서 시간 표기  
남의 코드를 하나씩 뜯어보며 공부하는 방식을 취하는데 반해 생각없이 관습적으로 따라 쓰는 경우가 종종 있습니다."
featured: false
hidden: false
rating: 4
toc: false
---

# MySQL Timestamp타입 웹에서 시간 표기

남의 코드를 하나씩 뜯어보며 공부하는 방식을 취하는데 반해 생각없이 관습적으로 따라 쓰는 경우가 종종 있습니다.

그러다 문득 MySQL에서 테이블별로 생성일자와 수정일자를 표시하는데 시간단위는 온데간데 없고 연월일 단위만 표시가 되는 것을 발견했습니다.

아주 간단하게 MySQL에서 timestamp 지정한 것이 java에도 timestamp라는 타입이 있어 이것으로 선언하고 SimpleDateFormat으로 쉽게 표시 가능했습니다.

```java
impleDateFormat form = new SimpleDateFormat("yyyy년 MM월 dd일 hh:mm");
String date = form.format(board.getRegDate());

...

<%=date %> // 0000년 00월 00일 00:00
```