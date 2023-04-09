---
slug: "/spring-deploy01/"
layout: post
modified: 2022-03-14 00:09:35 +0000
date:   2022-02-03 13:05:22 +0000
title:  "[SPRING] Spring MVC 프로젝트 Heroku 배포 시 404 에러 기록"
author: Kimson
categories: [ spring ]
image: /images/post/covers/TIL-spring.png
tags: [ heroku, spring mvc, deploy, til ]
description: "Heroku war deploy

`heroku`를 처음 접했을 때 많이 어려움을 겪었습니다. 도대체 에러를 어디서 보여주는지 몰랐고 로그조차 찾기 힘들었기에 감으로 배포하면서 에러도 감으로 고치고는 했습니다. 그런데 최근에 다시 보니 로그를 보는 기능이 이미 있었네요 😥"
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

# Heroku war deploy

`heroku`를 처음 접했을 때 많이 어려움을 겪었습니다. 도대체 에러를 어디서 보여주는지 몰랐고 로그조차 찾기 힘들었기에 감으로 배포하면서 에러도 감으로 고치고는 했습니다. 그런데 최근에 다시 보니 로그를 보는 기능이 이미 있었네요 😥

`heroku`에 `spring mvc`를 배포할 때는 아래와 같이 합니다.

```bash
$ heroku login

$ heroku plugins:install java (처음 설치했을 때)
$ heroku plugins:install heroku-cli-deploy (처음 설치했을 때)

$ heroku war:deploy blah.war --app blah
$ heroku open -a blah
```

`blah`는 헤로쿠에 등록된 프로젝트 명입니다. 저 방법 말고도 많이 있습니다만 이 방법이 편합니다. 어제는 헤로쿠 자체에서 문제가 발생해 굉장히 느렸습니다. 새벽 즈음에 문제 발견하고 개발자들이 해결하고 있었습니다. 여하튼 배포방법은 간단한데 헤로쿠 페이지를 열었더니 404가 발생합니다.

## Heroku open 404

에러 없이 로그에서 `404`만 뱉어내니 너무 답답했습니다. 대충 머리를 스치는 에러 상황은 이랬습니다.

1. 혼용한 `vue`에 문제가 있나? → 네, 결론은 없었습니다.
2. 데이터베이스 연결이 잘못 되었나? → 데이터베이스는 로컬에서도 잘 작동되는 것을 보니 없는 것으로
3. baseurl이 잘못 되었나? → "/"라 별 문제는 없었습니다.
4. 리소스경로? → 문제없음
5. 필터문제? → 없음
6. ServletConfig? → ...
7. ...?????

여러 이유로 404가 발생하겠지만 모든 파일을 뒤져봐도 에러 날만한게 없었습니다.

## Maven clean

진짜 설마설마 해서 계속 빌드하면서 걸렸던게 다른 프로젝트 빌드된 파일과 비교했을 때 이상한 점이 눈에 띄었습니다. 파일의 수야 내용물이 다르겠거니 했지만 정작 있어야할 것들이 없거나 했습니다.

이클립스를 사용하신다면 `run as`에 `maven clean`이 있습니다. 예전에는 모르고 그냥 사용했었는데요. `clean`은 `maven`의 라이프사이클 페이즈 중 하나이고, `target`폴더에 생성되었던 이전 빌드에서 생성된 모든 파일을 제거해줍니다.

`clean`후 다시 `build`했더니 정상 작동 합니다... 😐