---
slug: "/shell-auto-executing/"
layout: post
modified: 2022-03-14 00:09:35 +0000
date:   2022-03-04 19:56:07 +0000
title:  "[SHELL] Shell Script로 파일 변환을 감지해보자 01"
author: Kimson
categories: [ shell ]
image: /images/post/covers/TIL-shell.png
tags: [ bash, shell, sh, til ]
description: "파일 변환 감지

파이썬을 사용하면서 불편했던 점이 실행할 때마다 입력하는게 번거롭기도 하고 live-server의 저장시 새로고침 되는 기능을 만들 수 있을까 싶었습니다.

여러 커뮤니티를 찾다가 그 내용이 역시 갓오버플로우에 있었습니다."
featured: true
hidden: false
rating: 4.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# 파일 변환 감지

파이썬을 사용하면서 불편했던 점이 실행할 때마다 입력하는게 번거롭기도 하고 live-server의 저장시 새로고침 되는 기능을 만들 수 있을까 싶었습니다.

여러 커뮤니티를 찾다가 그 내용이 역시 갓오버플로우에 있었습니다. 👏

## sh파일 만들기

```sh
LEDIT=$(stat -c %Z /path/filename.extension)
while true
do
  CEDIT=$(stat -c %Z /path/filename.extension)
  if [[ "$CEDIT" != "$LEDIT" ]]; then
      echo "===== RUN PYTHON COMMNAD ====="
      python test01.py
      LEDIT=$CEDIT
  fi
  sleep 0.5
done
```

### stat 명령어

`stat`명령어는 파일이나 파일 시스템 상태를 표시하는 명령어 입니다. 뒤에 따르는 옵션을 하나하나 알아봅시다.

`-c`는 포맷을 사용할 때마다 개행 출력을 해줍니다. 그리고 그 뒤에 따르는 `%Z`는 해당 경로 파일의 마지막 상태변경 시간을 초단위로 나타냅니다.

즉, 전체 구문을 보면 `LEDIT`에 해당 파일의 마지막 변경 시간이 담기게 되고, `while`문을 돌면서 `CEDIT`변수에 `sleep`을 걸어 `0.5`초 간격으로 잠자게 합니다. 그냥 `0.5`초 딜레이 주고 `while`문 돌리는 겁니다.

그러면 `if`문에서 `CEDIT`과 `LEDIT`이 다르다면 `python test01.py`를 `command`로 `execute`합니다.

`if`문 나오기 전에 `LEDIT`을 `CEDIT`으로 초기화 해줍니다.

파이썬이나 c언어를 컴파일하고 실행하는데 계속 명령줄에 입력하기가 번거로웠는데 만들어 두고 사용하면 참 편리합니다. 😁👍

> stat의 옵션 정보는 stat --help에 잘 나와 있습니다. 😮

### 추가

만일 파일 하나를 대상으로 하는게 아닌 폴더 내에 있는 파일 어느 하나라도 변경되면 `command`를 실행하고 싶을 때는 아래와 같이 조금만 바꿔주면 됩니다.

```sh
LEDIT=$(stat -c %Z *)
while true
do
  CEDIT=$(stat -c %Z *)
  if [[ "$CEDIT" != "$LEDIT" ]]; then
      echo "===== RUN PYTHON COMMNAD ====="
      python test01.py
      LEDIT=$CEDIT
  fi
  sleep 0.5
done
```

즉, `sh`파일이 있는 위치에서 `stat *`을 하면 디렉토리 내 모든 파일 정보를 불러오는데 -c로 시스템 정보에 접근하고 %Z로 마지막 변경 시간만을 가져와 비교하게 되므로 어느 파일이던 변경되면 지정한 명령줄이 실행됩니다. 😉

-----

📚 함께 보면 좋은 내용

[DAVE MCKAY :: How to Use the stat Command on Linux](https://www.howtogeek.com/451022/how-to-use-the-stat-command-on-linux/)

[StackOverflow :: How to execute a shell script when a file changes?](https://stackoverflow.com/questions/66857291/how-to-execute-a-shell-script-when-a-file-changes#answers-header)