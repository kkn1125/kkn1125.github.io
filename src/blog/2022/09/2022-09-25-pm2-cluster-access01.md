---
slug: "/pm2-cluster-access01/"
layout: post
date: 2022-09-25 18:49:28 +0900
title: "[NODE] PM2 Cluster간 통신을 해보자 01"
author: Kimson
categories: [node]
image: /images/post/covers/TIL-node.png
tags: [uWebSockets.js, websocket, pm2, process, til]
description: "PM2 프로세스 매니저
PM2는 process management로 애플리케이션을 온라인으로 관리하고 유지하는 데 도움이 되는 데몬 프로세스 관리자입니다. - pm2
최근 작업 중인 프로젝트에서 pm2를 사용하게 되었는데요, 하루 배우고 하루 까먹는 상황에서 여태까지 삽질했던 내용을 기록하고 해결 방안을 제시하는 포스팅을 하려합니다.

pm2는 node.js에서 기본적으로 제공하는 cluster module을 간편하게 사용하게 해줍니다. Node.js는 단일 스레드 방식으로 실행되므로 다중 코어 시스템 기능을 활용하지 않습니다. 하지만 Node.js는 기본적으로 모든 TCP 연결을 공유할 수 있는 Worker를 생성하는 Cluster module을 제공합니다."
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

# PM2 프로세스 매니저

> PM2는 process management로 애플리케이션을 온라인으로 관리하고 유지하는 데 도움이 되는 데몬 프로세스 관리자입니다. - pm2

최근 작업 중인 프로젝트에서 pm2를 사용하게 되었는데요, 하루 배우고 하루 까먹는 상황에서 여태까지 삽질했던 내용을 기록하고 해결 방안을 제시하는 포스팅을 하려합니다.

pm2는 node.js에서 기본적으로 제공하는 cluster module을 간편하게 사용하게 해줍니다. Node.js는 단일 스레드 방식으로 실행되므로 다중 코어 시스템 기능을 활용하지 않습니다. 하지만 Node.js는 기본적으로 모든 TCP 연결을 공유할 수 있는 Worker를 생성하는 Cluster module을 제공합니다.

IPC 채널을 통해 Worker와 통신하고 Worker 간에 load(부하)를 더 잘 분산하기 위해 Round-robin 알고리즘을 사용하는 임베디드 로드 밸런서와 함께 제공됩니다. 라운드 로빈 스케쥴링으로 사용할 때 마스터는 들어오는 모든 연결을 수락하고 특정 Worker에게 해당 특정 연결에 대한 TCP 핸들을 보냅니다.

## Node cluster는 알겠는데 PM2 Cluster는?

먼저 시도했던 경우를 말씀드리면 아래와 같습니다.

1. Node.js에서 코드로 cluster를 생성하는 방법
2. PM2를 Fork mode로 실행하고 코드로 cluster 생성
3. PM2를 Fork mode와 CPU 처리 thread 개수 - 1 만큼의 PM2 cluster 생성
4. PM2를 Cluster mode로 CPU thread 개수 만큼 cluster 실행

Node cluster와 PM2에서 제공하는 cluster모드는 관계성이 있다고 생각합니다. 자세한 내용은 더 찾아보아야 하지만 다른 글에서도 추측할 수 있지만 PM2는 Node.js cluster를 이용하며 cluster mode 실행 시 라운드 로빈 스케쥴링에 의해 부하가 적은 프로세스에 작업을 자동으로 할당하는 것으로 알고 있습니다.

node.js cluster module 문서를 보면 아래와 같은 구문이 있습니다.

> ...  
> The worker processes are spawned using the child*process.fork() method, so that they can communicate with the parent via IPC and pass server handles back and forth.  
> The cluster module supports two methods of distributing incoming connections.  
> The first one (and the default one on all platforms except Windows) is the round-robin approach, where the primary process listens on a port, accepts new connections and distributes them across the workers in a round-robin fashion, with some built-in smarts to avoid overloading a worker process.  
> The second approach is where the primary process creates the listen socket and sends it to interested workers. The workers then accept incoming connections directly.  
> The second approach should, in theory, give the best performance. In practice however, distribution tends to be very unbalanced due to operating system scheduler vagaries. Loads have been observed where over 70% of all connections ended up in just two processes, out of a total of eight.  
> ...  
> *\- Node.js Cluster module, How it works\_

cluster module은 들어오는 연결을 배포하는 방식을 두 가지 지원합니다. 첫 번째는 기본 프로세스사 포트에서 수신 대기하고, 새 연결을 수락하고 이를 라운드 로빈 방식으로 Worker 전체에 배포하는 방법(라운드 로빈 방식). Worker 프로세스에 과부하가 걸리지 않 도록하는 방법입니다.

두 번째는 기본 프로세스가 Listen Socket을 생성하여 관심 있는 Worker에게 소켓을 보내는 것입니다. 그런 다음 Worker는 들어오는 연결을 직접 수락합니다.

첫 번째 방식은 메인 프로세스가 수락을 담당하여 Worker에 배포, 두 번째 방식은 리슨 소켓을 생성하여 각 Worker들이 직접 수락하도록 하는 방식으로 해석 됩니다.

이론상 초상의 퍼포먼스를 내야 하지만 운영 체제 스케쥴링의 변동으로 인해서 불균형한 경향이 있다고 합니다. 모든 연결의 70%이상이 총 8개 중 2개 프로세스에서 끝나는 부하가 관찰되었다고 합니다.

> 정확한 해석이 아닐 수 있으니 문서 본문을 참고하시기 바랍니다.

## 삽질 기록을 해보자

> 삽질 리스트는 위에서 언급 했듯이 4가지 정도에 대해서 정리하려 합니다. 개인적인 견해가 포함되어 있으니 잘못된 지식은 댓글로 지적해주시면 감사하겠습니다.

삽질에 대한 개발 환경과 구조는 아래와 같습니다.

여러 서버를 두어야 하는데 개별적으로 프로세스가 감당하게 되면 부하를 줄이면서 가볍게 돌릴 수 있지 않나에 대한 컨셉에서부터 시작합니다.

즉, db서버, socket서버, api 서버 등이 기존에는 3000, 3001, 3002 포트에서 실행되어 따로 돌아갔다면, 생각하는 구상은 3000포트에서 포트를 공유하며 메인이 되는 프로세스가 각 스레드의 health체크를 하며, 각각의 스레드가 db, api, socket서버를 담당하는 것 입니다.

필요한 요구사항은 아래와 같습니다.

1. 메인 프로세스에서 각 스레드 간 통신 가능 여부
2. 스레드가 통신 가능 여부 (ex. socket 서버 -> api서버)
3. db스레드에서 데이터베이스 통신 가능 여부

개발 환경은 아래와 같습니다.

1. uWebSocket.js
2. mariadb
3. pm2 - process management

> uWebSocket.js가 생소하신 분은 다음 있을 uWebSocket.js 포스팅을 기대 해주세요 😀

### Try 1. Node.js에서 코드로 cluster를 생성

처음 시도한 node.js cluster 생성입니다.

```javascript
import cluster from "cluster";
import http from "http";
import { cpus } from "os";
import process from "process";

const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end("hello world\n");
    })
    .listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```

node.js cluster 문서를 보면 쉽게 찾을 수 있는 예시 코드입니다. 여기서 저는 소켓서버이기 떄문에 http부분을 쓰지는 않았습니다.

os를 가져와 cpu가 감당 가능한 thread수를 가져와 cluster가 메인 스레드이면 최대한의 worker를 생성합니다. cluster.fork하게 되면 worker를 반환합니다.

각 worker는 else문에서 실행되며 포트를 공유한 채로 실행됩니다.

문제는 pm2를 사용하는 이유가 프로세스 관리를 효율적으로 하고 균등분배하여 부하를 줄이기 위함인데 굳이 잘 짜지도 못하는데 node.js cluster를 만들어 작업하는 것은 소모적이라 생각하여 그만 두었습니다.

### Try 2. PM2에서 Fork mode로 실행, 코드로 cluster 생성

PM2의 config 옵션은 아래와 같이 설정했습니다.

```javascript
// ecosystem.config.js

const script = "src/index.js";

const envOptions = {
  env: {
    // 실행 시 환경 변수 설정
    HOST: "localhost",
    PORT: 3000,
  },
  env_production: {
    // 개발 환경별 환경 변수 설정
    NODE_ENV: "production",
  },
  env_development: {
    // 개발 환경별 환경 변수 설정
    NODE_ENV: "development",
  },
};

const watchOptions = {
  watch: true, // watch 여부
  ignore_watch: ["node_modules"], // watch 제외 대상
};

const statusOptions = {
  wait_ready: true, // 마스터 프로세스에게 ready 이벤트를 기다리라는 의미
};

module.exports = {
  apps: [
    {
      name: "main", // 앱 이름
      script, // 스크립트 파일 위치
      exec_mode: "fork", // 애플리케이션을 클러스터 모드로 실행
      ...statusOptions,
      ...watchOptions,
      ...envOptions,
    },
  ],
};
```

fork 모드로 하나를 생성하고 첫 번째 시도와 동일하게 작업 했습니다. 하지만 작업을 하다보니 첫 번째와 다를게 없구나를 느끼고 다시 그만 두었습니다.

### Try 3. PM2에서 Fork 1 개 + cluster thread - 1 개 생성

PM2에서 시도 했을 때 한 가지 특이사항은 모두 cluster로 생성하면 메인되는 스레드가 없습니다. cluster.isPrimary를 시도하면 전체 cluster가 모두 worker로 생성됩니다.

즉, 메인되는 프로세스를 인위적으로 만들어 나머지 스레드를 cluster로 실행하는 방법입니다.

```JavaScript
// ecosystem.config.js

const script = "server.js";

const envOptions = {
  env: {
    // 실행 시 환경 변수 설정
    HOST: "localhost",
    PORT: 3000,
  },
  env_production: {
    // 개발 환경별 환경 변수 설정
    NODE_ENV: "production",
  },
  env_development: {
    // 개발 환경별 환경 변수 설정
    NODE_ENV: "development",
  },
};

const watchOptions = {
  watch: true, // watch 여부
  ignore_watch: ["node_modules"], // watch 제외 대상
};

const statusOptions = {
  wait_ready: true, // 마스터 프로세스에게 ready 이벤트를 기다리라는 의미
};

module.exports = {
  apps: [
    {
      name: "main", // 앱 이름
      script, // 스크립트 파일 위치
      exec_mode: "fork", // 애플리케이션을 클러스터 모드로 실행
      ...statusOptions,
      ...watchOptions,
      ...envOptions,
    },
    {
      name: "workers", // 앱 이름
      script, // 스크립트 파일 위치
      instances: 7, // 0 | "max" = CPU 코어 수 만큼 프로세스를 생성
      increment_var: "WID",
      exec_mode: "cluster", // 애플리케이션을 클러스터 모드로 실행
      ...statusOptions,
      ...watchOptions,
      ...envOptions,
    },
  ],
};

```

위의 pm2 config 옵션으로 실행해서 각 스레드를 차별화할 수 있는 식별id로 WID 환경변수를 증가시켰습니다.

동일한 server.js를 실행하여 각 클러스터에 메세지를 보내는 테스트를 하기 위해 EventEmmiter를 사용하기도 했습니다.

```javascript
const { cpus } = require("os");
const cluster = require("cluster");
const { EventEmitter } = require("stream");
const emmiter = new EventEmitter();
const processNumber = cluster.isPrimary ? 0 : cluster.worker.process.env.WID;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // console.log(cluster);
} else {
  // console.log(cluster.worker.state);
  // cluster worker id 식별 값
  // console.log(cluster.worker.process.env.WID);
  console.log(`Worker ${processNumber} is running`);
  emmiter.on(threads[processNumber], () => {
    console.log(`Worker ${data.wid} was called`);
  });
```

하지만 하나의 파일을 실행하기 때문에 각 스레드간에 통신하는 것은 별 의미도 없고, 작업하는데 드는 생각은 하나였습니다. 동일한 파일을 공유하는데 어떻게 서로 통신하는 코드를 작성하지?

하면 하겠지만 저는 그럴 능력이 안되는 걸로.....🥲

### Try 4. PM2에서 Cluster mode로 Max Cpu thread 실행

옵션 설정이 직관적이고 제일 간편한 방법이었습니다.

```javascript
// ecosystem.config.js

const envOptions = {
  env: {
    // 실행 시 환경 변수 설정
    HOST: "localhost",
    PORT: 3000,
  },
  env_production: {
    // 개발 환경별 환경 변수 설정
    NODE_ENV: "production",
  },
  env_development: {
    // 개발 환경별 환경 변수 설정
    NODE_ENV: "development",
  },
};

const watchOptions = {
  watch: true, // watch 여부
  ignore_watch: ["node_modules"], // watch 제외 대상
};

const statusOptions = {
  max_memory_restart: "300M", // process memory가 300mb에 도달하면 reload 실행
};

module.exports = {
  apps: [
    {
      name: "main", // 앱 이름
      script: "src/server.js", // 스크립트 파일 위치
      instances: 1, // 0 | "max" = CPU 코어 수 만큼 프로세스를 생성
      watch: ["./server.js"],
      wait_ready: true,
      ...statusOptions,
      ...watchOptions,
      ...envOptions,
    },
    {
      name: "receive", // 앱 이름
      script: "src/workers/receive.js", // 스크립트 파일 위치
      instances: 1, // 0 | "max" = CPU 코어 수 만큼 프로세스를 생성
      watch: ["./"],
      ...statusOptions,
      ...watchOptions,
      ...envOptions,
    },
    {
      name: "loc01", // 앱 이름
      script: "src/workers/loc01.js", // 스크립트 파일 위치
      instances: 1, // 0 | "max" = CPU 코어 수 만큼 프로세스를 생성
      watch: ["./"],
      ...statusOptions,
      ...watchOptions,
      ...envOptions,
    },
    {
      name: "loc02", // 앱 이름
      script: "src/workers/loc02.js", // 스크립트 파일 위치
      instances: 1, // 0 | "max" = CPU 코어 수 만큼 프로세스를 생성
      watch: ["./"],
      ...statusOptions,
      ...watchOptions,
      ...envOptions,
    },
    {
      name: "db", // 앱 이름
      script: "src/workers/dbWorker.js", // 스크립트 파일 위치
      instances: 1, // 0 | "max" = CPU 코어 수 만큼 프로세스를 생성
      watch: ["./"],
      ...statusOptions,
      ...watchOptions,
      ...envOptions,
    },
    {
      name: "chat", // 앱 이름
      script: "src/workers/chatWorker.js", // 스크립트 파일 위치
      instances: 1, // 0 | "max" = CPU 코어 수 만큼 프로세스를 생성
      watch: ["./"],
      ...statusOptions,
      ...watchOptions,
      ...envOptions,
    },
  ],
};
```

각 cluster를 개별로 설정하고 script 또한 개별로 관리합니다. 이때 health체크를 하는 녀석이 main app이 됩니다.

추가로 조사한 내용으로는 pm2 API가 존재하므로 pm2에서 지원해주는 프로세스간 메세지 통신이 있습니다. 여태 모르고 지금 시도까지 온 것이기 때문에 이전에 시도한 경우의 수에서 다시 시도하지는 않았습니다.

pm2 API가 조금 불친절하게 설명되어 있지만 곧 업데이트가 되겠지요...🥲

메인 프로세스가 실행하는 부분은 아래와 같습니다.

```javascript
// server.js

const pm2 = require("pm2");

var workers = new IndexedMap();

const getWorkers = (clusters) => {
  clusters.forEach((worker) => {
    workers.set(worker.name, worker);
  });

  return workers;
};

const sendMessage = (targetType, data, callback) => {
  pm2.list((err, list) => {
    getWorkers(list);
    console.log(`${targetType}로 보내는 시도 중`);
    if (workers.has(targetType)) {
      pm2.sendDataToProcessId(
        workers.get(targetType).pm_id,
        {
          type: "process:msg",
          data: data,
          topic: true,
        },
        (err, result) => {
          // console.log(err); // 없으면 null
          if (err) {
            console.log(err);
          } else {
            callback?.(result);
          }
        }
      );
    } else {
      pm2.sendDataToProcessId(
        1,
        {
          type: "process:msg",
          data: {
            from: targetType,
            message: "연결되지 않은 서버입니다.",
          },
          topic: true,
        },
        (err, result) => {
          // console.log(err); // 없으면 null
          if (err) {
            console.log(err);
          } else {
            callback?.(result);
          }
        }
      );
    }
  });
};

const startReceiveMessage = (name) => {
  pm2.launchBus(function (err, pm2_bus) {
    pm2_bus.on("process:msg", function (packet) {
      console.log(packet.hasOwnProperty("data") ? packet.data.from : "started");
      console.log(`${name}에서 받은 패킷 데이터 << `, packet);
    });
  });
};
// 각 워커의 process.send 데이터를 받음
startReceiveMessage("main");

// 워커 탐색
pm2.list((err, list) => {
  // console.log(err, list);
  process.send("ready");
  getWorkers(list);
  sendMessage("db", { from: "main", message: "test" });

  pm2.restart("api", (err, proc) => {
    // Disconnects from PM2
    pm2.disconnect();
  });
});
```

메인 스레드에서 통신을 주고 받도록 합니다. PM2에서 소개하는 API를 조금 설명 붙이자면 이렇습니다. pm2.list내에서 list인자를 받으면 cluster들이 들어있습니다.

cluster를 바깥으로 빼려고 했지만 비동기로 받아오기 때문에 에러 관리가 힘듭니다.

그렇기 때문에 pm2.sendDataToProcessId함수를 사용할 때 pm2.list에 감싸여져 있습니다.

이벤트를 만들어 사용하면 굳이 래핑되지 않을 수 있겠다는 생각이 들지만 이벤트 생성하는 부분이 미흡하여 시도하지 못했습니다.

pm2.launchBus에서 process:msg값을 받아 다른 프로세스에서 송신하는 메세지를 받을 수 있습니다.

launchBus는 메인과 receive서버에만 존재하도록 했습니다. 그리고 모든 송수신을 담당하는 receive 스레드를 보겠습니다.

```javascript
// workers/receive.js

const uws = require("uWebSockets.js");
const IndexedMap = require("../utils/IndexedMap");
const { convertResponseData, sendMessage } = require("../utils/tools");
const { servers } = require("../utils/variables");
let isDisableKeepAlive = false;
// let wsServers = new IndexedMap();

/**
 * 전체 서버에서 데이터 받을 수 있음
 */
const receiveSrever = uws
  .App({})
  .ws("/uws/*", {
    // properties
    idleTimeout: 32,
    maxBackpressure: 1024,
    maxPayloadLength: 1024, // 패킷 데이터 용량 (용량이 넘을 시 서버 끊김)
    compression: uws.DEDICATED_COMPRESSOR_3KB,

    // method
    open(ws) {
      if (isDisableKeepAlive) {
        ws.close();
      }
      servers.forEach((server) => {
        ws.subscribe(server);
        // wsServers.set(server, ws);
      });
      // console.log(wsServers)
      ws.send("socket server loaded!");
    },
    message(ws, message, isBinary) {
      const data = convertResponseData(message, isBinary);
      const json = JSON.parse(data);
      console.log(json);
      const callback = (result) => {
        ws.send(JSON.stringify(result.data));
      };
      sendMessage(json.from, json, callback);
    },
    drain(ws) {
      console.log("WebSocket backpressure: ", ws.getBufferedAmount());
    },
    close(ws, code, message) {
      if (isDisableKeepAlive) {
        ws.unsubscribe(String(procId));
      }
    },
  })
  .any("/*", (res, req) => {
    res.writeHeader("Connection", true).writeStatus(200).end("test");
  })
  .listen(3000, (socket) => {
    if (socket) {
      process.send("ready");
      console.log(`server listening on ws://localhost:${3000}/uws/*`);
    }
  });

// 클라이언트 요청을 socket message로 받아
// sendMessage로 보내면 아래 메세지 이벤트로 받음
process.on("message", (packet) => {
  console.log(`[RECEIVE 서버에서 받은 패킷 메세지] : `, packet);
  // console.log(wsServers.get(packet.data.from));
  // wsServers.get(packet.data.from).send(JSON.stringify(packet).data);
  console.log(packet);
  receiveSrever.publish(packet.data.from, JSON.stringify(packet));
  process.send({
    type: "process:msg",
    data: {
      success: true,
    },
  });
});

// process dead
process.on("SIGINT", function () {
  isDisableKeepAlive = true;
  receiveSrever.close(function () {
    process.exit(0);
  });
});

module.exports = receiveSrever;
```

receive서버에서는 웹소켓을 통해 모든 요청을 클라이언트로부터 받습니다. 그리고 message이벤트에서 요청되는 특정 데이터 필드 값에 따라 각 프로세스로 전파하는 형식입니다.

위 코드에서는 json.from에 각 스레드의 명칭이 들어있어 sendMessage에서 해당 스레드로 메세지를 전송합니다.

다음으로 스레드가 받는 부분을 보겠습니다.

> 원래의 코드는 보안상 올리지 못하는 점 양해바라며 이제 다른 스레드에서는 어떻게 통신하는지 보겠습니다.

```javascript
// workers/chatWorker.js

const { sendMessage } = require("../utils/tools");

function returnMsg(packet) {
  const isMain = packet.data.from === "main";
  if (isMain) {
    process.send(packet);
  } else {
    // 워커 탐색
    sendMessage("receive", packet.data);
  }
}

// sendMessage로 보내면 아래 메세지 이벤트로 받음
process.on("message", (packet) => {
  // process.on은 워커를 반환한다.
  console.log(`[CHAT 서버에서 받은 패킷 메세지] : `, packet);
  if (
    packet.data.hasOwnProperty("to") &&
    !packet.data.hasOwnProperty("return")
  ) {
    const to = packet.data.to;
    packet.data.return = true;
    sendMessage(to, packet.data);
  } else {
    returnMsg(packet);
  }
});

process.send("ready");
```

precess.on 이벤트를 사용해서 위에서 봤던 sendMessage에서 발송된 메세지를 잡습니다. sendMessage는 모든 프로세스에서 사용하기 때문에 모듈화 했습니다.

그렇게 packet을 받으면 다시 packet의 성격에 따라 returnMsg함수를 통해 receive서버로 회신합니다. returnMsg 함수는 sendMessage함수를 재사용해서 receive서버로 회신합니다.

엄청난 삽질 끝에 드디어 pm2를 사용해서 클러스터 간에 메세지 통신을 끝냈습니다. zeroMQ나 rabbitMQ등으로 스레드간 통신을 고려하고 있었지만 현재로서는 통신하는 방법을 모색하고 있었기 때문에 일단락된 것으로 생각합니다.

> 참고로 IndexedMap은 인덱스 번호와 key값을 상호저장하기 위해 커스텀으로 만든 Map입니다. 궁금하신 분을 위해 아래에 코드를 남겨놓겠습니다.

```javascript
// IndexedMap class

class IndexedMap extends Map {
  constructor(args) {
    super(args);
    // key - index number mapping
    if (args) {
      for (let i = 0; i < args.length; i++) {
        const tuple = args[i];
        this.set(String(i), { [tuple[0]]: tuple[1] });
      }
    }
  }

  isNumber(key) {
    return Boolean(String(key).match(/^[0-9]{1,}$/));
  }

  findEmptyNumber(array) {
    const temp = [];
    const numbering = array
      .filter(([k, v]) => this.isNumber(String(k)))
      .map((arg) => arg[0])
      .sort();
    for (let i = 0; i < numbering.length - 1; i++) {
      const expectNextNumber = numbering[i] + 1;
      const nextIndex = numbering[i + 1];
      if (expectNextNumber !== nextIndex) {
        for (let j = expectNextNumber; j < nextIndex; j++) {
          temp.push(j);
        }
      }
    }
    if (temp.length === 0) {
      temp.push(numbering.length);
    }
    return temp[0] || 0;
  }

  hasSameIndex(key) {
    const index = this.findIndexByKey(key);
    if (index === -1) return false;

    for (let [k] of this) {
      if (k === index) {
        return index;
      }
    }
    return false;
  }

  toArray() {
    const temp = [];
    for (let i of this) {
      temp.push(i);
    }
    return temp;
  }

  set(...args) {
    if (args.length === 2) {
      const [key, value] = args;
      super.set(key, value);
      if (key) {
        const emptyNumber =
          this.hasSameIndex(key) || this.findEmptyNumber(this.toArray());
        super.set(Number(emptyNumber), {
          [key]: value,
        });
      }
    } else if (args.length === 3) {
      const [num, key, value] = args;
      super.set(key, value);
      super.set(Number(num), {
        [key]: value,
      });
    }
  }

  get(key) {
    return super.get(key);
  }

  findValueByIndex(index) {
    const found = this.get(index);
    if (found) {
      return found;
    }
    return undefined;
  }

  findIndexByKey(key) {
    for (let [k, v] of this) {
      if (this.isNumber(k)) {
        if (v.hasOwnProperty(key)) {
          return Number(k);
        }
      }
    }
    return -1;
  }

  delete(key) {
    if (this.isNumber(key)) {
      const [k] = Object.entries(this.findValueByIndex(key)).flat(1);
      super.delete(key);
      super.delete(k);
    } else {
      const index = this.findIndexByKey(key);
      super.delete(key);
      super.delete(index);
    }
  }
}

module.exports = IndexedMap;
```

## 마무리

시도를 많이 하다보면 못하겠다는 생각이 많이 드는데요, 결국에 하다보면 지푸라기가 잡히고, 그게 모여서 지푸라기 더미가 되듯이 지식을 모으다 보니 조금 씩 해결되는 것 같아 뿌듯합니다. uWebSockets.js를 사용하거나 pm2에서 cluster간 통신을 찾고 계신분에세 도움이 조금이나마 되었으면 하는 바람입니다! 😀

---

📚 함께 보면 좋은 내용

[Node.js::Cluster module](https://nodejs.org/api/cluster.html)

[GeeksforGeeks::How to create load balancing servers using Node.js ?](https://www.geeksforgeeks.org/how-to-create-load-balancing-servers-using-node-js/)

[PM2::PM2 JavaScript API](https://pm2.keymetrics.io/docs/usage/pm2-api/)

[PM2::NODE.JS CLUSTERING MADE EASY WITH PM2](https://pm2.io/blog/2018/04/20/Node-js-clustering-made-easy-with-PM2)
