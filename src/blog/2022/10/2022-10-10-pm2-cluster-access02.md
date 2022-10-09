---
slug: "/pm2-cluster-access02"
layout: post
date: 2022-10-10 02:23:05 +0900
title: "[NODE] PM2 Cluster간 통신을 해보자 02"
author: Kimson
categories: [node]
image: /images/post/covers/TIL-node.png
tags: [uWebSockets.js, websocket, pm2, process, til]
description: "클러스터 간 객체 전달 이슈

이전 포스팅에서 제가 시도했던 방법과 `process`객체의 `on event`로 메세지를 주고 받는 방법을 기록했습니다.

`Redis`를 사용해야하나 생각은 했지만 `Redis`말고 다른 방법이 없나 하면서 찾아본 결과 `EventEmitter`를 알게 되었습니다.

`EventEmitter`를 사용하게 된 이유는 **Class** 혹은 **함수형 객체**를 `process` 이벤트나 `pm2`에서 지원하는 `sendDataToProcessId`메서드로 전달 시 객체가 해체 됩니다.

즉, Test라는 객체를 인스턴스 생성하면 Test라는 이름이 붙게 되는데 이 객체가 JSON.stringify후 JSON.parse한 상태처럼 Object로 변환되는 이슈가 있습니다."
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

# 클러스터 간 객체 전달 이슈

> 까먹지 않기 위한 기록이라 이번 포스팅은 많이 짧습니다 🙇‍♂️

이전 포스팅에서 제가 시도했던 방법과 `process`객체의 `on event`로 메세지를 주고 받는 방법을 기록했습니다.

`Redis`를 사용해야하나 생각은 했지만 `Redis`말고 다른 방법이 없나 하면서 찾아본 결과 `EventEmitter`를 알게 되었습니다.

`EventEmitter`를 사용하게 된 이유는 **Class** 혹은 **함수형 객체**를 `process` 이벤트나 `pm2`에서 지원하는 `sendDataToProcessId`메서드로 전달 시 객체가 해체 됩니다.

즉, Test라는 객체를 인스턴스 생성하면 Test라는 이름이 붙게 되는데 이 객체가 JSON.stringify후 JSON.parse한 상태처럼 Object로 변환되는 이슈가 있습니다.

```javascript
class Test(){
  pox;
  poy;
  poz;
  roy;
  name;
  id;
  // ...
  constructor(name, id) {
    // ...
  }

  setPosition() {
    // ...
  }

  // ...
}

const test = new Test('test', 1);
pm2.list((err, list) => {
  const cluster = list.find(cluster => cluster.id === 1);
  cluster.sendDataToProcessId(/* ... */);
});

// 받는 스레드에서 객체 확인 시
{
  pox: 0,
  poy: 0,
  poz: 0,
  roy: 0,
  name: 'test',
  id: 1,
}
```

설명이 애매해서 이해가실지 모르겠지만 짐작은 하시리라 생각합니다. 이러한 이슈로 온전히 객체 그대로를 보내고 싶어서 다른 방법을 찾다보니 `EventEmitter`를 쓰게 되었습니다.

EventEmitter는 소켓을 사용하는 것과 유사합니다. 필요한 이벤트를 작성하여 리슨 시키고, 전송이 필요한 곳에는 emit메서드로 데이터를 담아 전송할 수 있습니다.

필자의 경우는 소켓 객체를 다른 스레드에 전달하기 위해 소켓이 살아있어야 했기 때문에 EventEmitter에 더 꽂혀있었습니다. 사용방법은 아래와 같이 단순합니다.

```javascript
// emitter.js
const { EventEmitter } = require("events");
module.exports = {
  emitter: new EventEmitter(),
};

// thread_a.js
const emitter = require("./emitter.js");
/* somethings... */
emitter.emit("thread_b", socket);

// thread_b.js
const emitter = require("./emitter.js");
/* somethings... */
emitter.on("thread_b", (socket) => {
  console.log(socket !== undefined); // true
});
```

이렇게 새로 생성된 emitter를 필요한 곳에서 끌어다 사용하면 됩니다. 그러면 socket은 그대로 살아있고 on과 emit을 사용하는 단순함에 안 쓸 이유가 없었습니다. 더 좋은 다른 방법이 있지 않을까 생각합니다만, 일단 신경쓰이는 레디스를 사용해서 또 다음 포스팅을 기록해보겠습니다.

---

📚 함께 보면 좋은 내용

[PM2::JavaScript API](https://pm2.keymetrics.io/docs/usage/pm2-api/)
