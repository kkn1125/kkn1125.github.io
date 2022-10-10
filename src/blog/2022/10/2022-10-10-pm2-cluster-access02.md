---
slug: "/pm2-cluster-access02/"
layout: post
date: 2022-10-10 02:23:05 +0900
title: "[NODE] PM2 Cluster간 통신을 해보자 02"
author: Kimson
categories: [node]
image: /images/post/covers/TIL-node.png
tags: [eventemitter, pm2, process, til]
description: "PM2 클러스터 간 객체 전달

까먹지 않기 위한 기록이라 이번 포스팅은 많이 짧습니다 🙇‍♂️

이전 포스팅에서는 PM2가 무엇이고, 어떤 기능을 지원 해주는지, 현재 진행 중인 프로젝트에서 어떤 방법으로 클러스터를 생성하여 스레드간 메세지를 어떻게 주고 받을 지 알아보았습니다.

이번에는 스레드 간에 메세지를 주고 받는 것에 중심을 두고 정리하려 합니다. 이전 포스팅에서는 `sendDataToProcessId`를 사용해서 스레드간 메세지를 주고 받았는데요, 이때 발생하는 이슈와 차선책을 기록하겠습니다."
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

<!--
클러스터 간 객체 전달
1. EventEmitter
2. sendDataToProcessId(packet)
 -->

# PM2 클러스터 간 객체 전달

> 까먹지 않기 위한 기록이라 이번 포스팅은 많이 짧습니다 🙇‍♂️

이전 포스팅에서는 PM2가 무엇이고, 어떤 기능을 지원 해주는지, 현재 진행 중인 프로젝트에서 어떤 방법으로 클러스터를 생성하여 스레드간 메세지를 어떻게 주고 받을 지 알아보았습니다.

이번에는 스레드 간에 메세지를 주고 받는 것에 중심을 두고 정리하려 합니다. 이전 포스팅에서는 `sendDataToProcessId`를 사용해서 스레드간 메세지를 주고 받았는데요, 이때 발생하는 이슈와 차선책을 기록하겠습니다.

## 개발환경

- uWebSockets.js
- pm2
- tx2 (필수는 아닙니다.)

## 클러스터 간 객체 전달 이슈

`sendDataToProcessId`는 사용하기 쉽게 되어있습니다. 데이터를 보내면 정확히 프로세스 아이디에 전송해주고 받는 프로세스에서 데이터를 읽어오기도 쉽습니다. 문제는 데이터를 전송 하는데 객체가 해제되는 이슈가 발생합니다.

```javascript
class Packet {
  this.#data = null;

  constructor(data) {
    this.#data = data;
  }

  getData() {
    return this.#data;
  }
}

const data = {
  name: "kimson",
  age: 30,
  desc: "hello, i'm kimson",
}
const packet = new Packet(data);
// expect(packet instanceof Packet).toBeTruthy() === true

// 실제 데이터 받을 시
console.log(packet);
/*
 * { Object가 되어버림
 *   data: {
 *     name: "kimson",
 *     age: 30,
 *     desc: "hello, i'm kimson"
 *   }
 * }
 */
```

이런 식으로 패킷 클래스를 생성해서 전송한다고 가정합니다. 그러면 패킷 클래스는 온전한 클래스 그대로 가는 것을 원하는데, 결과로 데이터 패킷을 받아보면 위처럼 object로 분해되어 있습니다. 적절한 어휘를 모르니 그냥 분해되었다고 부르겠습니다.

이러한 문제로 PM2에서 제공하는 API를 뒤로하고 EventEmitter를 사용하기로 했습니다. EventEmitter는 node에서 제공하는 events라이브러리에 속해있는 기능입니다.

## EventEmitter 사용하기

EventEmitter에 대한 원리 설명이 잘 된 블로그를 참고했습니다. 해당 내용은 포스팅 하단에 링크를 참조하시면 더욱 이해가 빠릅니다.

저는 간단하게 용례만 언급하겠습니다.

```javascript
// src/tools/emitter.js
const EventEmitter = require("node:events");

module.exports = {
  emitter: new EventEmitter(),
};
```

```javascript
// mainServer.js

const emitter = require("./src/tools/emitter");

emitter.emit("threadA::open", app, message);
```

```javascript
// src/threads/threadA.js

const emitter = require("../tools/emitter");

emitter.on("threadA::open", (app, message) => {
  // ... do something
  console.log(app);
  console.log(message);
});
```

이렇게 메인 서버에서 emit 함수로 데이터를 보냅니다. 그리고 받는 threadA에서는 메인 서버에서 emit 함수에 첫 번째 인자로 지정한 토픽과 동일한 토픽으로 on함수로 받습니다. 보냈던 데이터는 받는 on 함수에서 콜백함수의 인자로 순서대로 받습니다.

emit하는 순간 on에서 반응합니다. 무엇보다 처음 목표였던 객체가 분해되지 않고 온전히 잘 받아와집니다.

여기서 사용하는 이유는 소켓 객체를 전달하고, 전달된 소켓을 사용하기 위함이었는데, 객체 내의 함수등이 깨져버려서 사용하지 못하기 때문입니다.

다른 방법이 있다면 해당 방법을 쓰겠지만 현재로서는 제 기술로 EventEmitter가 한계인 것 같습니다 🥲

이번 기회에 멀티스레딩과 pm2를 확용해서 각 클러스터를 제어하는 방법을 공부하고 있습니다. 더 많은 참고자료나 제가 시도한 방법들에 대해서 자세하게 올리고 수정할 예정입니다. 현재 글이 언제 또 업데이트 될 지 모르겠습니다만, 여기까지 관심있게 읽어주셔서 감사합니다 🙇‍♂️

---

📚 함께 보면 좋은 내용

[PM2::JavaScript API](https://pm2.keymetrics.io/docs/usage/pm2-api/)

[Husky님 블로그::Nodejs EventEmitter 뜯어보기](https://www.huskyhoochu.com/nodejs-eventemitter/)
