---
layout: post
date:   2022-01-17 12:20:44 +0900
title:  "[JAVASCRIPT] 체스게임 구현 02"
author: Kimson
categories: [ JAVASCRIPT, TIM, GAME ]
image: assets/images/post/chess/chess02.png
tags: [ game, chess ]
description: "체스 게임 구현

이전에 만든 체스가 버그 투성이라 다른 방식으로 접근해서 구현했습니다. 혹시 코드를 보시고 싶은 분은 아래의 저장소 링크에서 확인하시기 바랍니다."
featured: false
hidden: false
rating: 3.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# 체스 게임 구현

이전에 만든 체스가 버그 투성이라 다른 방식으로 접근해서 구현했습니다. 혹시 코드를 보시고 싶은 분은 아래의 저장소 링크에서 확인하시기 바랍니다.

## 체스 구현 과정

이전과 달라진 점은 `Piece`(기물)의 객체화와 기물의 경로에서 굳이 상하좌우를 제어하지 않고 일직선의 이동을 가지는 기물의 경로에서 만나는 상대 기물이 있을 때만 제어를 하고, 나이트와 폰 같은 특수 이동의 성격을 가지는 기물만 따로 제어를 하였습니다.

캐슬링과 체크를 구현한 상태이고 나아가 체크메이트를 구현하게 된다면 하나하나 뜯어서 솔리테어처럼 포스팅을 할 예정입니다.

<figure class="text-center">
<span class="w-inline-block">
   <img class="w-100" src="{{site.baseurl}}/assets/images/post/chess/chess02.png" alt="결과물" title="결과물">
   <figcaption>현재까지 결과물</figcaption>
</span>
</figure>

-----

📚 함께 보면 좋은 내용

[Chess 테스트 페이지](https://kkn1125.github.io/chess/){:target="_blank"}

[Chess 깃허브 저장소](https://github.com/kkn1125/chess/){:target="_blank"}