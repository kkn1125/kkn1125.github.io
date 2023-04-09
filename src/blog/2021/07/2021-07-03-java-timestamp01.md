---
slug: "/java-timestamp01/"
layout: post
modified: 2022-03-23 16:02:35 +0000
date:   2021-07-03 16:21:27 +0000
title:  "[JAVA] Timestamp 시간 나타내기"
author: Kimson
categories: [ java ]
tags: [mysql, timestamp, simpledateformat, til]
image: /images/post/mysql_cover.png
description: "MySQL Timestamp타입 웹에서 시간 표기  
남의 코드를 하나씩 뜯어보며 공부하는 방식을 취하는데 반해 생각없이 관습적으로 따라 쓰는 경우가 종종 있습니다."
featured: false
hidden: false
rating: 4
toc: false
published: true
---

# MySQL Timestamp 시간 표기

`MySQL`에서 테이블별로 생성일자와 수정일자를 페이지에 표시하는데 시간 단위는 없고 연월일만 표시가 되었습니다.

분명 `timestamp`에 시간도 들어있는데 나타나지 않아서 어떻게 데이터를 가져와 뿌려야할지 몰랐습니다.

찾아보니 `mysql`의 `timestamp`타입에 대응하도록 `java`에서도 `Timestamp`타입으로 객체 인스턴스를 만들 수 있었습니다.

## 시간 포멧

나아가서 시간에 대한 포멧은 `SimpleDateFormat` 클래스로 쉽게 조작가능합니다.

아주 간단하게 `MySQL`에서 `timestamp`타입을 지정한 것이 `java`에도 `timestamp`라는 타입이 있어 이것으로 선언하고 `SimpleDateFormat`으로 쉽게 표시 가능했습니다.

{%raw%}

```java
import java.text.SimpleDateFormat;

@RequestMapping("/")
public class HomeController {

    @Autowired
    private HomeService hs;

    @GetMapping("board")
    public String list (HttpRequest request, Model model) {
        Board board = hs.findByNum(1);
        Timestamp ts = board.getRegdate();
        SimpleDateFormat form = new SimpleDateFormat("yyyy년 MM월 dd일 hh:mm");
        String date = form.format(ts);
        model.addAttribute("formedTime", date)
        return "board.list"
    }
}

```

```jsp
<%= formedTime %> 0000년 00월 00일 00:00
```

{%endraw%}

다시보니 너무 내용이 부실해서 예제를 좀 바꿨습니다. 위에서 누락된 설명은 `service`에서 받아온 `board`의 `regdate`필드인데요. `regdate`는 `mysql`에서 `timestamp`타입으로 작성되어 있습니다.

그래서 `Timestamp`타입에 `regdate`를 저장하고 `SimpleDateFormat`으로 `form`을 만들어 포멧시킵니다.