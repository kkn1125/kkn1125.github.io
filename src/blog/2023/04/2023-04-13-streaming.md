---
slug: "/streaming01/"
layout: post
modified: 2023-04-13 21:41:41 +0000
date: 2023-04-13 21:41:41 +0000
title: "[JAVASCRIPT] 라이브 방송 구현 01"
author: Kimson
categories: [javascript]
image: /images/post/covers/TIL-javascript.png
tags: [MediaRecoder, live, streaming, til]
description: "Streaming이란?

스트리밍이라 하면 미디어파일을 전송하고 재생하는 방식의 하나로 불립니다. 스트림은 데이터가 입,출력 되는 흐름을 뜻하는데요, 스트리밍이라 하면 지속적으로 흐른다는 의미를 가지게 됩니다. 파일로 예를 들어보면, 대부분 미디어 파일은 다운로드 받고 나서야 실행하여 전체 길이의 미디어를 볼 수 있습니다. 이 파일의 크기가 커지면 커질수록 재생하는데 걸리는 시간은 파일의 크기와 비례하겠지요. 그렇다면 이 파일을들 쪼개어서 먼저 다운로드 받은 파일만을 재생시키면 어떻게 될까요?

스트리밍이라는 말처럼 파일을 잘게 쪼개어 먼저 받아진 미디어 파일들을 재생시켜 출력을 흐르게 한다면 굳이 전체 미디어 파일을 받지 않더라도 기다리지 않고 곧바로 미디어를 볼 수 있겠지요.

WebRTC로 회의형 플랫폼을 만드는 기술과는 조금 다른 방향의 기술이 요구됩니다. 물론 WebRTC가 필요합니다. 영상 권한을 요구해야하기 때문이죠."
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

# Streaming이란?

스트리밍이라 하면 미디어파일을 전송하고 재생하는 방식의 하나로 불립니다. 스트림은 데이터가 입,출력 되는 흐름을 뜻하는데요, 스트리밍이라 하면 지속적으로 흐른다는 의미를 가지게 됩니다. 파일로 예를 들어보면, 대부분 미디어 파일은 다운로드 받고 나서야 실행하여 전체 길이의 미디어를 볼 수 있습니다. 이 파일의 크기가 커지면 커질수록 재생하는데 걸리는 시간은 파일의 크기와 비례하겠지요. 그렇다면 이 파일을들 쪼개어서 먼저 다운로드 받은 파일만을 재생시키면 어떻게 될까요?

스트리밍이라는 말처럼 파일을 잘게 쪼개어 먼저 받아진 미디어 파일들을 재생시켜 출력을 흐르게 한다면 굳이 전체 미디어 파일을 받지 않더라도 기다리지 않고 곧바로 미디어를 볼 수 있겠지요.

WebRTC로 회의형 플랫폼을 만드는 기술과는 조금 다른 방향의 기술이 요구됩니다. 물론 WebRTC가 필요합니다. 영상 권한을 요구해야하기 때문이죠.

여기서 WebRTC가 왜 필요해? 라는 의문을 가지는 분이 계실겁니다. 이번 포스팅에서 다룰 Streaming은 1인 실시간 라이브 방송을 목표로 하고 작성하기 때문에 WebRTC API를 사용해서 영상을 찍어 공유해야하기 때문에 WebRTC가 필요합니다.

## 회의형 플랫폼과 1인 라이브 방송 구현 기술의 차이

WebRTC는 RTCPeerConnection API를 사용해서 사용자의 카메라 장치에 접근하고 조정 가능하게 해줍니다. 물론 다중 화상 채팅도 가능하게 해줍니다. 그렇다면 1인 라이브 방송도 RTCPeer를 교환해서 offer, answer, ice candidate를 주고 받아서 미디어 데이터를 주고 받으면 되지 않을까?
필자가 말하고자 하는 의견은 두 플랫폼의 기술을 다른 방향으로 가져가야하지 않나 생각합니다. 구현을 가능합니다. 회의형 플랫폼에서는 서로의 피어를 공유하고 ice 후보를 주고 받아야합니다. 1인 라이브를 구현하고자 한다면 피어만 공유하고 영상만 마스터의 영상을 출력시키면 가능은 합니다. 하지만 피어를 연결하고 데이터를 공유하기 때문에 공유되는 사람이 늘어날 수록 부하는 늘어납니다.

그리고 부가적으로 소켓서버에 룸과 룸을 제어하는 객체 등을 만들고 마스터인지 일반 뷰어인지 판별해야하는 번거로운 작업도 추가됩니다.

그렇게 고민하다가 HLS를 알게 되고, 영상을 녹화/녹음 할 수 있는 MediaRecorder API를 알게 됐습니다. MediaRecoder를 사용하면 원하는 시간마다 끊어 영상을 파일로 저장할 수도, 다른 사람에게 공유할 수도 있습니다. 사용자는 그 데이터를 받아 재생만 시키면 됩니다.

## 라이브 방송 환경 구축

개발 환경은 다음과 같습니다.

1. uWebSockets.js (socket)
2. vite / react-ts (front)
3. protobufjs (공통)
4. uuid (공통)

WebRTC 회의형 플랫폼과 다른 점이 있다면, 먼저 Peer공유는 필요 없습니다. 카메라 장치는 발송자만 권한을 가질 겁니다. Peer연결이 없기 때문에 data channel 대신 socket으로 채팅을 처리할 것 입니다. socket.io가 아니기 때문에 on event 제어를 구현하고 소켓에서도 데이터 포멧을 맞추어 이벤트 단위로 컨트롤 가능하게 서비스를 설계 할 것 입니다.

WebRTC로 회의형 서비스를 구현해본 사람은 getUserMedia를 많이 사용하셨을 겁니다. 혹은 OpenVidu를 사용하시는 분들도 있겠지요. getUserMedia로 카메라 권한을 요청합니다. 그리고 MediaRecorder를 이용해 단위 시간마다 영상을 분할 녹화 할 것 입니다.

socket과 front영역을 나누어 예시코드를 완성하면서 하나씩 뜯어나가겠습니다.

> 이번에는 소스코드를 좀 줄이고자 필요한 객체의 기능은 나열만 할 것이고 따로 구현 예시는 적지 않을 것 입니다. 단, 환경 설정과 틀을 잡는 코드는 작성할 것 입니다.

### 데이터 포멧 설정

데이터 포멧은 protobufjs를 사용할 것이기 때문에 필요한 것도 있고, socket 서버와 통신할 때 로직을 짜기 편하게 하려는 목적이 있습니다. 단, 어디까지나 바이너리 데이터의 이야기입니다.

1. type
2. data

타입은 socket과 통신할 때 주고 받는 데이터의 타입이고, data는 스트링으로 변환된 JSON데이터를 주고 받을 것입니다.

## socket 환경 구축

uWebSockets.js가 생소하신 분들이라면 socket.io를 사용해도 괜찮습니다. 오히려 더 편할 수 있습니다. 이유는 socket.io가 제공하던 on, emit을 유사하게나마 구현할 것이기 때문입니다.

```typescript
// socket/src/index.ts

import uWS from 'uWebSockets.js';
import { v4 } from 'uuid';

const app = uWS
  .App()
  .ws("/*", {
    /* Options */
    compression: uWS.SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 32,
    /* Handlers */
    upgrade: (res, req, context) => {
      console.log(
        "An Http connection wants to become WebSocket, URL: " +
          req.getUrl() +
          "!"
      );

      const upgradeAborted = { aborted: false };

      const userId = v4();
      const url = req.getUrl();
      const secWebSocketKey = req.getHeader("sec-websocket-key");
      const secWebSocketProtocol = req.getHeader("sec-websocket-protocol");
      const secWebSocketExtensions = req.getHeader("sec-websocket-extensions");

      /* Simulate doing "async" work before upgrading */
      setTimeout(() => {
        console.log(
          "We are now done with our async task, let's upgrade the WebSocket!"
        );

        if (upgradeAborted.aborted) {
          console.log("Ouch! Client disconnected before we could upgrade it!");
          return;
        }

				/* upgrade에서 첫 번째 인자로 데이터를 넘기면 open,message,drain,close의 ws에 고유한 데이터로 사용할 수 있습니다. */
        res.upgrade(
          {
            id: userId,
            url: url,
          },
          secWebSocketKey,
          secWebSocketProtocol,
          secWebSocketExtensions,
          context
        );
      }, 0);

      res.onAborted(() => {
        upgradeAborted.aborted = true;
      });
    },
    open: (ws: any) => {
      userData.set(ws, {});
      ws.subscribe("global");
      ws.subscribe(ws.id);
      Object.assign(userData.get(ws), { id: ws.id });
      dev.alias("connect url").log(ws.url);
      dev.alias("user id").log(ws.id);
    },
    message: (ws, message, isBinary) => {
      // 여기서 데이터를 처리할 예정입니다.
			if(isBinary) {
				// 바이너리 데이터
			} else {
				// 텍스트 데이터
			}
    },
    drain: (ws) => {
      console.log("WebSocket backpressure: " + ws.getBufferedAmount());
    },
    close: (ws, code, message) => {
      console.log("WebSocket closed");
      const room = manager.outUser((ws as any).id);
      if (room) {
        dev.alias("after out user").log(room);
      }

      if (ws && (ws as any).id) {
        const json = {
          type: "SIGNAL:USER",
          data: JSON.stringify({ action: "out" }),
          result: JSON.stringify({
            userId: (ws as any).id,
            room,
            user: room.findUser((ws as any).id),
          }),
        };

        const encode = Message.encode(new Message(json)).finish();
        app.publish("global", encode, true);
      }
    },
  })
  .any("/*", (res, req) => {
    res.end("Nothing to see here!");
  })
  .listen(PORT, (token) => {
    if (token) {
      console.log("Listening to port " + PORT);
    } else {
      console.log("Failed to listen to port " + PORT);
    }
  });
```

socket에서 필요한 객체는 Room, User, Room을 제어하는 Manager입니다.

Manager는 Room 리스트를 가지고, Room 리스트의 CRUD 기능을 가집니다. Room은 users라는 User 리스트를 가지고 User 리스트의 CRUD 기능을 가집니다.

```typescript
// socket/src/model/Manager.ts

import { dev } from "../util/tool";
import Room from "./Room";

export default class Manager {
  rooms: Room[] = [];

  constructor() {
    dev.alias("✨CREATE MANAGER").log(this);
  }

  createRoom(options: { id: string; password?: string; limit?: number }) {
    const room = this.findRoom(options.id) || new Room(options);
    this.rooms.push(room);
    dev.alias("✨CREATE ROOM").log(room);
    return room;
  }

  insertRoom(room: Room) {
    this.rooms.push(room);
  }

  findRoom(id: string) {
    const room = this.rooms.find((r) => r.id === id);
    dev.alias("🔍FIND ROOM").log(room);
    return room;
  }

  deleteRoom(id: string) {
    const index = this.rooms.findIndex((room) => room.id === id);
    const room = this.rooms.splice(index, 1)?.[0];
    dev.alias("❌DELETE ROOM").log(room);
    return room;
  }

  findUser(userId: string) {
    let user;
    this.rooms.forEach((room) => {
      user = room.findUser(userId);
    });
    dev.alias("🔍FIND USER IN ROOM").log(user);
    return user;
  }

  findRoomUserIn(userId: string) {
    const room = this.rooms.find((r) => r.findUser(userId));
    dev.alias("🔍FIND ROOM BY USER ID").log(room);
    return room;
  }

  outUser(userId: string) {
    const room = this.findRoomUserIn(userId);
    if (room) {
      room.out(userId);
      dev.alias("❌OUT ROOM BY USER ID").log(room);
      if (room.users.length === 0) {
        room.streams = [];
        dev.alias("🗑️CLEAR STREAMS").log(room.streams);
      }
    } else {
      dev.alias("OUT ROOM NOT FOUND").log(room);
    }
    return room;
  }
}
```

여기서 dev는 제가 console을 커스터마이징한 것입니다. 개발할 떄마다 만들어 둔 소스코드를 붙여넣고 로깅에 활용하고 있습니다. 필자의 스타일이기 떄문에 참고만 하시기바랍니다.

```typescript
// */src/util/tool.ts

const dev: any = function () {};
const prefix = "SERVER";
dev.alias = function (prefix: string) {
  dev.prefix = prefix;
  return dev;
};

Object.assign(
  dev,
  Object.fromEntries(
    Object.entries(console).map(([key, value]) => {
      const wrap = function (...arg: any[]) {
        value.call(
          console,
          `🚀 [${capitalize(dev.prefix || prefix || "DEV")}]============\n`,
          ...arg,
          `\n============(${(function () {
            const time = new Date();
            const h = time.getHours();
            const m = time.getMinutes();
            const s = time.getSeconds();
            const ms = time.getMilliseconds();
            return `${h.toString().padStart(2, "0")}:${m
              .toString()
              .padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms
              .toString()
              .padStart(3, "0")}`;
          })()})`
        );
        dev.prefix = "";
      };
      if (key === "memory") {
        return [key, value];
      }
      return [key, MODE === "development" ? wrap.bind(console) : () => {}];
    })
  )
);

const capitalize = (words: string) =>
  words
    .toLowerCase()
    .replace(/[a-z]+/g, ($) => $[0].toUpperCase() + $.slice(1).toLowerCase());

export { dev, capitalize };
```

Manager 객체를 봤습니다. 여기서 필요하다면 좀 더 기능을 추가해도 될 것 같습니다. 그 다음 필요한 Room입니다.

```typescript
// socket/src/model/Room.ts

import { dev } from "../util/tool";
import User from "./User";

export default class Room {
  id: string;
  password?: string;

  admin: User | undefined;
  users: User[] = [];

  streams: ArrayBuffer[] = [];
  chunk: number = 0;

  limit?: number = 0;

  constructor({
    id,
    password,
    limit,
  }: {
    id: string;
    password?: string;
    limit?: number;
  }) {
    id && (this.id = id);
    password && (this.password = password);
    limit && (this.limit = limit);
    dev.alias("✨CREATE ROOM").log(this);
  }

  isAdmin(id: string) {
    const isAdmin = Boolean(this.admin?.id === id);
    dev.alias("🔍IS ADMIN?").log(id, isAdmin);
    return isAdmin;
  }

  changeAdmin(user: User) {
    dev.alias("♻️CHANGE ADMIN").log(user);
    this.admin = user;
    user.setAdmin();
  }

  hasAdmin() {
    const hasAdmin = Boolean(this.admin);
    dev.alias("🔍CHECK HAS ADMIN").log(hasAdmin);
    return hasAdmin;
  }

  findUser(id: string) {
    const user = this.users.find((u) => u.id === id);
    dev.alias("🔍FIND USER").log(user);
    return user;
  }

  join(user: User) {
    if (!this.hasAdmin()) {
      this.changeAdmin(user);
      dev.alias("✨SET ADMIN").log(user);
    } else {
      user.setUser();
    }
    user.joinIn = this.id;
    this.users.push(user);
    dev.alias("✨JOIN USER").log(user);
    return user;
  }

  addStream(stream: ArrayBuffer) {
    this.streams.push(stream);
  }

  getStream() {
    return this.streams;
  }

  setChunk(chunk: number) {
    return (this.chunk = chunk);
  }

  getChunk() {
    return this.chunk;
  }

  out(id: string) {
    const index = this.users.findIndex((u) => u.id === id);
    const user = this.users.splice(index, 1)?.[0];
    if (user && this.isAdmin(user.id)) {
      this.admin = undefined;
      if (this.users.length > 0) {
        this.admin = this.users[0];
        this.users[0].setAdmin();
      }
    }
    dev.alias("❌DELETE USER").log(user);
    if (this.users.length === 0) {
      dev.alias("😥ROOM IS EMPTY").log(this);
    }
    return user;
  }
}
```

그 다음으로 User 객체입니다.

```typescript
// socket/src/model/User.ts

import { v4 } from "uuid";
import { dev } from "../util/tool";

export default class User {
  id: string;
  nickname: string;

  isAdmin: boolean = false;

  joinIn: string;

  created_at: number = Date.now();
  updated_at: number = Date.now();

  /* media */
  offer: object;
  answer: object;
  remoteOffer: object;
  remoteAnswer: object;
  icecandidate: object;
  remoteIcecandidate: object;
  isAudio: boolean = false;
  isVideo: boolean = false;

  constructor(id: string = v4(), nickname: string = v4(), roomId?: string) {
    id && (this.id = id);
    nickname && (this.nickname = nickname);
    roomId && (this.joinIn = roomId);
    dev.alias("✨CREATE USER").log(this);
  }

  setAdmin() {
    this.isAdmin = true;
    dev.alias("✅SET ROLE ADMIN").log(this);
  }

  setUser() {
    this.isAdmin = false;
    dev.alias("✅SET ROLE USER").log(this);
  }

  turnOnVideo() {
    this.isVideo = true;
    dev.alias("♻️TURN ON THE VIDEO").log(this);
  }

  turnOffVideo() {
    this.isVideo = false;
    dev.alias("♻️TURN OFF THE VIDEO").log(this);
  }

  turnOnAudio() {
    this.isAudio = true;
    dev.alias("♻️TURN ON THE AUDIO").log(this);
  }

  turnOffAudio() {
    this.isAudio = false;
    dev.alias("♻️TURN OFF THE AUDIO").log(this);
  }
}
```

이제 socket서버에 연결 할 프론트를 만지면 됩니다. 위 코드는 테스트 케이스로 만들어나가면 오히려 빠르고 쉽게 구현할 수 있는 단순한 기능입니다.

## front 환경 구축

vite로 react-ts 템플릿을 사용해 프로젝트를 생성했습니다. 한 페이지에서 영상 데이터를 단위 시간마다 녹화해서 socket서버로 보낼 것 입니다. 소켓서버에서는 미디어 파일로 저장하거나 인메모리로 저장해서 socket에서 미디어 데이터를 뿌려주는 구조로 만들 예정입니다.

핵심만 전달하기 위해서 라우팅은 생략하겠습니다. 미디어 데이터를 저장하고 출력하는게 가능한지 테스트하기 위해 socket서버로 보내지 않고 먼저 배열에 담아 스트리밍 되는지 보겠습니다.

처음 접했을때 예시 코드는 http통신으로 api 서버에 미디어 데이터를 파일로 저장하고, 사용자가 시청하기 위해 api서버에 요청을 보내어 해당 파일을 blob으로 받아 영상을 재생하는 방법이 었습니다. 어차피 데이터를 주고 받는 과정은 api던 socket이던 똑같을 테니 가능하겠다고 판단해서 socket으로 대체한 것 입니다.

> 참고로 MUI라이브러리를 사용하고 있습니다.

```tsx
// front/src/pages/Home.tsx

// 비디오 녹화에 사용될 코덱을 설정합니다.
// 브라우저에서 지원하는 비디오 타입과 코덱이 다르기 때문에 지원되는
// 옵션을 사용하시기 바랍니다.
const CODEC = "video/webm;codecs=vp9,opus";

function Home() {
const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>();

  const handlePath = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLButtonElement;
    navigate(`/${target.dataset.path}`);
  };

  useEffect(() => {
    let loop1: NodeJS.Timer;

    // 미디어 소스를 생성합니다.
    const mediaSource = new MediaSource();
    if (videoRef.current) {
      // WebRTC 연결 시 stream을 srcObject에 넣는 것과 달리
      // mediaSource의 URL을 src에 입력합니다.
      videoRef.current.src = URL.createObjectURL(mediaSource);
    }

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        let videoBuffer: SourceBuffer;
        videoBuffer = mediaSource.addSourceBuffer(CODEC);

        if (videoRef.current) {
          localStream = stream;

          let countUploadChunk = 0;
          let countDownloadChunk = 0;

          // 카메라 장치를 활성화하고, 활성화된 카메라 장비의 stream을 녹화합니다.
          const recorder = new MediaRecorder(stream, {
            // 상단에서 미리 설정해둔 코덱을 부여합니다. 이 코덱은 나중에 재생할 때도 동일해야합니다.
            mimeType: CODEC,
          });

          // recorder.requestData 함수를 실행하게 되면 발생하는 이벤트입니다.
          recorder.ondataavailable = async (data) => {
            // streams 배열에 데이터를 추가합니다. 이때 데이터는 Blob입니다.
            streams.push(data.data);
            countUploadChunk++;

            if (streams[countDownloadChunk]) {
              console.log(streams[countDownloadChunk]);
              // 여기서 Buffer는 ArrayBuffer입니다.
              videoBuffer.appendBuffer(await data.data.arrayBuffer());
              countDownloadChunk++;
            }
          };

          // 녹화 시작
          recorder.start();

          // 매 1초마다 녹화 데이터를 끊어 저장하기 위함입니다.
          loop1 = setInterval(() => {
            console.log("record");
            recorder.requestData();
          }, 1000);
        }
      });
    return () => {
      clearInterval(loop1);
    };
  }, []);

  return (
    <Box>
      <Typography component='h3' variant='h3' align='center' gutterBottom>
        Home
      </Typography>

      <Box
        component='video'
        ref={videoRef}
        sx={{
          backgroundColor: "#55555556",
        }}
        autoPlay
        playsInline
        controls
      />
    </Box>
  );
}
```

이렇게 실행해보면 조금 딜레이가 있는 라이브 방송이 실행됩니다. mediaSource에 CODEC을 부여하고 반환된 videoBuffer에 단위 시간마다 저장한 녹화 영상 데이터를 추가하는 형태입니다. 그러면 url을 등록했던 video에 저장된 영상들이 소스로 추가되면서 재생됩니다. 그래서 약간의 시간차이가 발생합니다.

이제 이 스트림 데이터를 Socket 서버에 전달하고, 전달된 데이터를 새로 접속한 사용자가 볼 수 있게 만들어야합니다.

길어질 것 같으니 Socket과 통신해서 데이터를 저장하고, 사용자가 데이터를 불러와 재생하는 파트를 다음 포스팅에서 진행하겠습니다!

---

📚 함께 보면 좋은 내용

[Medium - Igro Kovalev - 초기 참고 자료](https://medium.com/@likovalevl/video-streaming-with-javascript-the-easy-way-45ecd7ec3f08#id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk2OTcxODA4Nzk2ODI5YTk3MmU3OWE5ZDFhOWZmZjExY2Q2MWIxZTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2ODEyNjI0MTIsImF1ZCI6IjIxNjI5NjAzNTgzNC1rMWs2cWUwNjBzMnRwMmEyamFtNGxqZGNtczAwc3R0Zy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMDEyMDk4MTA4MTA5MTMwNTMwNyIsImVtYWlsIjoiY2hhcGxldDAxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhenAiOiIyMTYyOTYwMzU4MzQtazFrNnFlMDYwczJ0cDJhMmphbTRsamRjbXMwMHN0dGcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJuYW1lIjoi6rmA6rK964KoIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FHTm15eGJfYlU3U3l1MkR1dldpZUlNX3kyWkNWSGRNemRMZW1RWjFQdjB1M2c9czk2LWMiLCJnaXZlbl9uYW1lIjoi6rK964KoIiwiZmFtaWx5X25hbWUiOiLquYAiLCJpYXQiOjE2ODEyNjI3MTIsImV4cCI6MTY4MTI2NjMxMiwianRpIjoiYjhhN2Y1ZWVjMTQ1ZDU0Mzg0MzkyMGU2MTI4YzI3MGUzZTkxMTAzYiJ9.Kq5aO9b02eXFCeArAmm0WwXZU2Ve8TjgCVQUaqndtDYlpUku2L_ELlIeHwmrfPZOioZmi_arPWf5MEZ4c7I8LOMTgcu-c9UciwXw5cQrPzAKeRb-SkjNGaVOvMSSwyWJDyZuoLJkJmVkbJTdlX4scKLmaKXcfPZHCsdX2DFBFD95w2I4n7hs2tDcXZeL5vY0Bo-XPBz6n3lNjSNh0V81_LefgYpJrIRY_e4xucEtiFeO8z9KdMw-tvIMXzd4I4ecIrrxgcXl9JHdbG-meRX7aNxkD7I7iJPeUM5pmp24SN7irKPIM5Hzvrbov8oy6TacNZSz08kZ85BP61vCZCXbwQ)