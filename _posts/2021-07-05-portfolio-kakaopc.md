---
layout: post
date:   2021-07-05 13:17:27 +0900
title:  "[PORTFOLIO] KAKAO PC버전"
author: Kimson
categories: [ portfolio, SPRING ]
tags: [kakao, spring]
image: assets/images/post/kakao/kakao-1.png
description: ""
featured: false
hidden: false
rating: 4.5
toc: true
---

# KAKAO PC ver

kakao pc 버전은 설계 분야 업무를 하던 중에 알게 되어 정말 편리하고 자료 공유로 사용하기도 했는데요, 현재 프로그래밍을 공부하면서 구현해보고자 하는 마음에 열심히 독학 중인 spring으로 만들었습니다.

## Skills
- spring framework
- websocket js
- mysql
- html, css, javascript

## 소요기간
>2021.6.5 ~ 2021.6.10(중단)
><footer class="blockquote-footer">5일 소요</footer>
><details><summary>중단사유</summary><p>websoket 지식이 많이 부족하여 현재 준비중인 구직에 지장을 주어 임시 중단</p></details>

## 사이트 구성

- 로그인
- 메인
- 채팅목록
- 채팅룸
- 더보기

### java config 방식 사용

spring에서 web.xml 및 context-*.xml대신 webconfig.java를 만들어 configuration 방식을 사용하였습니다.
많은 레퍼런스가 있는 상황은 아니지만 검색을 통해 구현하는데 성공하였습니다.

당시 java config로 exception, security 처리가 미숙하여 url과 sessionId로 분기문처리하였습니다.

### 로그인

![로그인]({{site.baseurl}}/assets/images/post/kakao/kakao-6.png '로그인')

>java config 방식을 사용하면서 불편했던 점이 security와 exception 처리였습니다.  
로그인페이지로 redirect하는 부분에서 번거롭지만 url을 받고, sessionId 여부를 통해 redirect하는 방식을 취했습니다.

### 메인

![메인]({{site.baseurl}}/assets/images/post/kakao/kakao-5.png '메인 친구목록')

>친구목록은 db에 user테이블로 구성하였고, 친구카드 클릭 시 옵션 popup에 있는 버튼은 restful 방식으로 처리되도록 하였습니다.  
채팅하기를 누르면 본인이 마스터가되어 채팅룸이 열립니다. (자세한 내용은 [채팅룸][chat] 단락 참조)

[chat]:#채팅룸

### 채팅목록

![채팅목록]({{site.baseurl}}/assets/images/post/kakao/kakao-2.png '채팅 목록')

>생성된 채팅룸은 '채팅하기'를 누른 사람에게 생성되며, 상대방 또한 '채팅하기'를 누르면 같은 UUID를 확인하고 동일한 채팅룸에 접속됩니다.  

### 채팅룸

![채팅룸]({{site.baseurl}}/assets/images/post/kakao/kakao-3.png '채팅룸')

>채팅룸은 UUID를 룸의 ID로 사용하고 본인 입력 시 연속되면 노란 박스로, 상대 입력 시 회색 박스로 연속되게 됩니다.

### 더보기

![더보기]({{site.baseurl}}/assets/images/post/kakao/kakao-1.png '더보기')

>websoket 기능구현 이외 미구현되어 있습니다. 원래의 계획은 메일이 카카오메일로 넘어가도록 하고, 캘린더는 이후 따로 [캘린더 api][kal]를 만들어 적용할 계획이었습니다. 현재 블로그에 포스팅된

[캘린더][kal]

가 추후 프로젝트 재개 시 사용될 것입니다.

[kal]:{{site.baseurl}}/javascript-calendar02/ '캘린더'