---
slug: "/express-typescript01"
layout: post
date: 2022-09-04 16:50:12 +0900
title: "[EXPRESS] Express + Typescript 환경 구축 01"
author: Kimson
categories: [deploy]
image: https://user-images.githubusercontent.com/71887242/187075852-a5f21ed6-667f-4b0c-bdfe-07451e55e96f.png
tags: [express, typescript, esm, react, til]
description: "Express + Typescript 환경 구축 기록
spring boot로 작성된 프로젝트를 express로 변경하는 중에 발생한 에러를 중심으로 기록합니다.

설정

node에서 commonjs를 사용하는데 import 구문을 사용하기위해 몇 가지 설정이 필요합니다. package.json에서 `type`필드에 `module`을 추가해야합니다. 그리고 tsconfig.json에서 target과 module, ts-node 설정이 필요합니다."
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

# Express + Typescript 환경 구축 기록

> spring boot로 작성된 프로젝트를 express로 변경하는 중에 발생한 에러를 중심으로 기록합니다.

## 설정

```bash
yarn add concurrently tslib mysql dotenv cors body-parser bcrypt
yarn add ts-node express typescript nodemon @types/bcrypt @types/express @types/node -D
```

node에서 commonjs를 사용하는데 import 구문을 사용하기위해 몇 가지 설정이 필요합니다. package.json에서 `type`필드에 `module`을 추가해야합니다. 그리고 tsconfig.json에서 target과 module, ts-node 설정이 필요합니다.

```json
// package.json
{
  "name": "mentees_server",
  "version": "5.0.0",
  "private": true,
  "main": "server/index.ts",
  "type": "module", // default 값은 commonjs입니다.
  "scripts": {
    "server": "nodemon --watch server/ --exec \"npx\" \"ts-node\" server/index.ts",
    "client": "cd client/ && yarn start",
    "start": "concurrently --kill-others \"yarn server\" \" yarn client\""
  }
  // ...
}
```

```json
// tsconfig.json
{
  "compileOptions": {
    //...
  },
  "ts-node": {
    "esm": true
  }
}
```

- `target` : 사용할 문법
- `module` : commonjs = require / esnext = import, export
- ts-node > esm : esm 활성화

## 파일 구조

파일 구조는 다음과 같습니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://user-images.githubusercontent.com/71887242/188854754-9e16f266-2450-4522-93cf-4c2d526b8f5a.png" alt="sample" title="sample">
   <figcaption>file tree by tree parser</figcaption>
</span>
</figure>

> 빌드 방법은 다음 편에서 다룰 예정입니다.

## 겪었던 문제 상황

### ts-node 관련 에러

이렇게 설정 함에도 불구하고 에러가 발생하는데 내용은 다음과 같습니다.

```text
[0] C:\kimson\Kim_Coding\intellij\mentees_express\node_modules\ts-node\dist-raw\no
de-internal-modules-esm-resolve.js:366
[0]     throw new ERR_MODULE_NOT_FOUND(
[0]           ^
[0] CustomError: Cannot find module 'C:\kimson\Kim_Coding\intellij\mentees_express
\server\restController\memberRestController' imported from C:\kimson\Kim_Coding\in
tellij\mentees_express\server\index.ts
[0]     at finalizeResolution (C:\kimson\Kim_Coding\intellij\mentees_express\node_
modules\ts-node\dist-raw\node-internal-modules-esm-resolve.js:366:11)
[0]     at moduleResolve (C:\kimson\Kim_Coding\intellij\mentees_express\node_modul
es\ts-node\dist-raw\node-internal-modules-esm-resolve.js:801:10)
[0]     at Object.defaultResolve (C:\kimson\Kim_Coding\intellij\mentees_express\no
de_modules\ts-node\dist-raw\node-internal-modules-esm-resolve.js:912:11)
[0]     at C:\kimson\Kim_Coding\intellij\mentees_express\node_modules\ts-node\src\
esm.ts:218:35
[0]     at entrypointFallback (C:\kimson\Kim_Coding\intellij\mentees_express\node_
modules\ts-node\src\esm.ts:168:34)
[0]     at C:\kimson\Kim_Coding\intellij\mentees_express\node_modules\ts-node\src\
esm.ts:217:14
[0]     at addShortCircuitFlag (C:\kimson\Kim_Coding\intellij\mentees_express\node
_modules\ts-node\src\esm.ts:409:21)
[0]     at resolve (C:\kimson\Kim_Coding\intellij\mentees_express\node_modules\ts-
node\src\esm.ts:197:12)
[0]     at resolve (C:\kimson\Kim_Coding\intellij\mentees_express\node_modules\ts-
node\src\child\child-loader.ts:15:39)
[0]     at ESMLoader.resolve (node:internal/modules/esm/loader:580:30)
```

#### 원인 및 해결

```typescript
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import members from "./restController/memberRestController.js";
import db from "./db/mysqlDatabase";
import dotenv from "dotenv";

dotenv.config();

const { PORT, HOST } = process.env;

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// member restController
app.use("/api", members);

app.listen(PORT, () => {
  console.debug(`app listening on port http://${HOST}:${PORT}`);
});
```

위 코드는 프로젝트 코드 일부 입니다. 에러 내용에서 라인 4를 보면 import하는데 모듈을 찾지 못한다고 합니다. 자세히 보면 다른 노드 모듈은 로드가 되지만 로컬 파일이 로드되지 않습니다.

혹시나 ts-node에 의해서 파싱되어 실행되는 것이라면 확장자 문제인가 싶어서 찾아보니 아니나 다를까 `import ... from ...` 에서 모듈 위치에 확장자명을 표기하되 js로 표기해야 정상 작동이 됩니다.

### module import/export 방식 build 안되는 문제

몇 시간 삽질하다가 알아낸 해결 방법은 아래와 같습니다.

```json
// tsconfig.json
{
  "compilerOptions": {
    //..,
    "noEmit": false
    // module을 esnext로 설정 하면 noemit이 true일 때 ts build가 되지 않음
  }
}
```

아마도 위의 에러는 module을 esnext로 하여 생기는 문제로 판단됩니다. module을 esnext로 설정하고 빌드하고자 하면 import하는 위치를 제대로 찾지 못합니다. 위 설정대로 저장하고 tsc하면 정상적으로 작동합니다.

> 참고한 페이지는 아래 링크로 남겨두었습니다.
> 에러 상황이 더 많습니다. 계속해서 추가하면서 업데이트 하고 있습니다.

---

📚 함께 보면 좋은 내용

[woongbeee님 블로그::Typescript를 Node.js 에서 실행할 때, ts-node 오류](https://velog.io/@woongbeee/Typescript%EB%A5%BC-Node.js-%EC%97%90%EC%84%9C-%EC%8B%A4%ED%96%89%ED%95%A0-%EB%95%8C-ts-node-%EC%98%A4%EB%A5%98)

[woongbeee님 블로그::Typescript를 Node.js 에서 실행할 때, ts-node 오류](https://devblog.kakaostyle.com/ko/2022-04-09-1-esm-problem/)

[Simon님 블로그::ESM 삽질기](https://velog.io/@woongbeee/Typescript%EB%A5%BC-Node.js-%EC%97%90%EC%84%9C-%EC%8B%A4%ED%96%89%ED%95%A0-%EB%95%8C-ts-node-%EC%98%A4%EB%A5%98)

[ts-node github repository::ts-node fails when ES Modules are in the dependency graph in Node.js 13+ \#935](https://github.com/TypeStrong/ts-node/issues/935)

[Stackoverflow::Webpack "Cannot find module" for "module"\:"esnext"](https://stackoverflow.com/questions/53803534/webpack-cannot-find-module-for-module-esnext)

# d.ts 글로벌 설정 에러

[khalilstemmler::How to Import Modules using Absolute File Paths with TypeScript](https://khalilstemmler.com/blogs/typescript/absolute-file-path/)

[Florian Mößle::Typescript paths with ts-node, ts-node-dev, and jest](https://medium.com/@fmoessle/typescript-paths-with-ts-node-ts-node-dev-and-jest-671deacf6428)

[Stackoverflow::ts-node ignores d.ts files while tsc successfully compiles the project](https://stackoverflow.com/questions/51610583/ts-node-ignores-d-ts-files-while-tsc-successfully-compiles-the-project)

[Stackoverflow::Extend Express Request object using Typescript](https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript)

# functional object this type 문제

[Stackoverflow::Typescript "this" inside a class method](https://stackoverflow.com/questions/16157839/typescript-this-inside-a-class-method)

# 내용 보충 필요
