---
slug: "/javascript-chess01"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2022-01-13 22:12:28 +0900
title:  "[JAVASCRIPT] 체스게임 구현 01"
author: Kimson
categories: [ javascript ]
image: assets/images/post/chess/chess01.png
tags: [ game, chess, tim ]
description: "체스 게임 구현

저번에 올린 솔리테어처럼 코드를 하나씩 뜯어보며 만들어가는 포스팅이 아닙니다. 추후에 시간 될 때 차근차근 만들어나가는 포스팅을 하려합니다. 아래는 자바스크립트로 체스게임이 구현 되는지 테스트 해서 올리는 결과물입니다."
featured: false
hidden: false
rating: 4.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# 체스 게임 구현

저번에 올린 솔리테어처럼 코드를 하나씩 뜯어보며 만들어가는 포스팅이 아닙니다. 추후에 시간 될 때 차근차근 만들어나가는 포스팅을 하려합니다. 아래는 자바스크립트로 체스게임이 구현 되는지 테스트 해서 올리는 결과물입니다.

## 체스 구현 과정

간단하게 소개드리자면 체스를 렌더하는 영역부터 만듭니다.

이번 경우는 이전에 했던 솔리테어와 유사하게 체스 기물 이름, 체스 보드 좌표 등을 미리 배열로 만들어 두어 사용했습니다.

흑, 백의 진영(Object)에 생성된 기물을 저장하고 history 배열을 만들어 보드를 한 턴 씩 저장시킵니다. 배열을 저장할 때 새로운 객체로 복사해서 값을 저장시키고 흑, 백 진영도 초기화하여 저장하면 기록을 되돌리는 기능을 간단하게 만들 수 있습니다.

이후 체스의 기물들의 특성을 제어문으로 다룹니다. 폰은 처음 시작 지점에서 1~2칸 앞으로, 이동 후에는 1칸으로 제한하고, 나이트는

{:.table.text-center}
|구분|||||
|---|---|---|---|---|
|0|x|0|x|0|
|x|0|0|0|x|
|0|0|♞|0|0|
|x|0|0|0|x|
|0|x|0|x|0|

룩은 수직/수평, 비숍은 대각선 모두, 퀸은 룩과 비숍을 합친 이동경로로 이동하게 됩니다. 해당 경로는 2차원 배열에서 연산만 잘 되면 경로표시, 경로에 걸리는 장애물 등을 알아낼 수 있습니다.

아래는 체스 게임 테스트 페이지입니다.

코드는 저장소를 참고하시기 바랍니다.

<figure class="text-center">
<span class="w-inline-block">
   <img class="w-100" src="{{site.baseurl}}/assets/images/post/chess/chess01.png" alt="결과물" title="결과물">
   <figcaption>현재까지 결과물</figcaption>
</span>
</figure>

-----

📚 함께 보면 좋은 내용

[Chess 테스트 페이지](https://kkn1125.github.io/chess/){:target="_blank"}

[Chess 깃허브 저장소](https://github.com/kkn1125/chess/){:target="_blank"}