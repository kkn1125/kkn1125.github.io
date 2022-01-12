---
layout: post
date:   2021-10-27 21:39:53 +0900
title:  "[JAVASCRIPT] Typer 0.2.0 pre-release 한글 타이핑 효과"
author: Kimson
categories: [ JAVASCRIPT, Typer, TIM ]
image: assets/images/post/covers/TIM-none.png
tags: [ typer, korean, effect ]
description: "Typer js v0.2.0 pre-release

이번에 `Typer`라는 어플리케이션을 `pre-release`했습니다. 나중에 이름이 변경될 지는 모르겠지만 현재 이름을 `Typer`라고 정했습니다.

원리와 설명은 Docs페이지와 Github repository에 정리해두었습니다."
featured: false
hidden: false
rating: 5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# Typer js v0.2.0 pre-release

이번에 `Typer`라는 어플리케이션을 `pre-release`했습니다. 나중에 이름이 변경될 지는 모르겠지만 현재 이름을 `Typer`라고 정했습니다.

> 원리와 설명은 Docs페이지와 Github repository에 정리해두었습니다.

## 원리와 사용법

사용법은 간단하게 구성했습니다. `data-typer-*`라는 `data`속성을 사용하여 지정된 태그의 text가 있다면 해당 text를 파싱하여 한글을 분해하고 다시 재조립 과정을 거쳐 타이핑 순서에 맞게 입력하는 효과를 줍니다.

타이핑 전역 설정을 `Typer`함수를 초기화 할 때 설정할 수 있으며, 단일 태그에 `data-typer-*`로 지정하여 사용자 설정에 따라 타이핑 될 내용을 추가할 수 있으며, 스타일 및 타이핑 관련 설정 또한 `data-typer-*`로 지정합니다.

단일 태그설정에는 `id`속성을 이용해서 `custom`초기화 옵션에 `data-typer-*`와 같이 내용을 추가하거나 스타일, 타이핑 설정을 할 수 있습니다.

초기화 옵션의 모든 설정은 `data-typer-*`나 `custom`으로 지정된 대상으로 전역으로 설정 적용됩니다.

Docs를 보시려면 [Typer Docs](https://kkn1125.github.io/type/){:.target="_blank"}를 여시면 됩니다.

### 현재 포스팅에 적용된 Typer

<div data-typer-name="test1" data-typer-loop="true" data-typer-erase-mode="true">
    이것은 CDN으로 연결한 예제 입니다.
</div>

<div data-typer-name="test2" data-typer-speed="0.01" data-typer-loop="true" data-typer-erase-mode="false">
    지우기 효과를 끌 수도 있습니다. 각 태그별로 움직이도록 되어있습니다.
</div>

<div data-typer-name="test3" data-typer-loop="false" data-typer-erase-mode="false">
    루프를 끌 수도 있구요. 루프를 끄는 것은 마지막 내용을 다 적고 난 후 이렇게 멈춰 있게 됩니다.
</div>

<div data-typer-name="test4" data-typer-speed="0.05" data-typer-loop="true" data-typer-erase-speed="0.03" data-typer-erase-mode="true" data-typer-cursor-blink="horizontal">
    kimson과 devkimson은 동일 인물입니다!
</div>

## 이동 링크

현재 포스팅 날짜 기준 v0.2.0이 최신입니다.

[Typer Docs](https://kkn1125.github.io/typer/){:.target="_blank"}

[Typer Github](https://github.com/kkn1125/typer){:.target="_blank"}

-----