---
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2022-03-03 13:12:53 +0900
title:  "[TERMINAL] 윈도우에서 Linux Ubuntu 터미널 사용"
author: Kimson
categories: [ terminal ]
image: assets/images/post/covers/TIL-terminal.png
tags: [ linux, ubuntu, til ]
description: "C/C++을 사용하기 위해

프로그래밍 언어가 어떻게 만들어지는지, 어떤 동작원리를 가지고 있는지 알기위해 지식을 모으고 있었습니다.

비교적 빠른 언어로 새로운 프로그래밍 언어를 만든다고 해서 C/C++의 기초를 찾던 중에 환경 설정을 하면서 우연히 윈도우에서 linux의 환경으로 터미널을 실행할 수 있다 해서 기록 남기게 되었습니다."
featured: true
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# C/C++을 사용하기 위해

프로그래밍 언어가 어떻게 만들어지는지, 어떤 동작원리를 가지고 있는지 알기위해 지식을 모으고 있었습니다.

비교적 빠른 언어로 새로운 프로그래밍 언어를 만든다고 해서 C/C++의 기초를 찾던 중에 환경 설정을 하면서 우연히 윈도우에서 linux의 환경으로 터미널을 실행할 수 있다 해서 기록 남기게 되었습니다.

## Ubuntu 터미널 설치

[Microsoft Store](https://www.microsoft.com/ko-kr/search/result.aspx?q=linux&form=MSHOME)에서 `ubuntu 20.04 LTS`를 받습니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/ubuntu/ubuntu01.png" alt="우분투" title="우분투">
   <figcaption>kimson</figcaption>
</span>
</figure>

설치되고 나면 터미널이 열리게 되는데 한 가지 더 세팅을 해줘야하는데요. wsl이라는 linux용 windows 하위시스템을 설치해야합니다.

[Microsoft의 WSL 설치](https://docs.microsoft.com/ko-kr/windows/wsl/install)를 보고 따라하면됩니다.

관리자권한으로 터미널을 열고 아래와 같이 입력하면 쭉 설치가 됩니다.

```sh
$ wsl --install
```

완료가 되면 재시작해서 사용자 이름과 패스워드를 입력하고 사용하시면 됩니다!

-----

📚 함께 보면 좋은 내용

[hashnode :: Creating your own scripting language? Where should one start?](https://hashnode.com/post/creating-your-own-scripting-language-where-should-one-start-ciudleyz70jksvy532q1y4uk7){:target="_blank"}

[Jay님 :: visual code 로 C++ 작업환경 만들기 ( Win10 기준, WSL 사용 )](https://tiny-jay.tistory.com/5){:target="_blank"}

[webnautes님 :: Visual Studio Code에서 C/C++ 프로그래밍( Windows / Ubuntu)](https://webnautes.tistory.com/1158){:target="_blank"}

[Microsoft :: WSL 설치](https://docs.microsoft.com/ko-kr/windows/wsl/install){:target="_blank"}