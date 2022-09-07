---
slug: "/express-typescript01"
layout: post
date: 2022-09-04 16:50:12 +0900
title: "[EXPRESS] Express + Typescript 환경 구축 01"
author: Kimson
categories: [deploy]
image: /images/post/covers/TIL-express.png
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

## 개발환경

> ✳️는 필수 입니다.

아래의 리스트는 제가 현재 기존에 있던 프로젝트를 expres로 변경하면서 적용한 내용입니다. 굳이 따라 할 필요는 없으니 포스팅에서 꼭 필요한 것만 체크해두겠습니다.

- 프론트
  1. react (typescript) ✳️
  2. mui (UI 컴포넌트 라이브러리)
  3. react-router-dom (SPA)
  4. yup + formik (이 둘은 거의 짝지)
  5. axios (비동기통신) ✳️
  6. aos (애니메이션 효과를 위함)
  7. http-proxy-middleware (cors에러 대응) ✳️
  8. react-helmet
- 백앤드
  1. express ✳️
  2. sse (실시간 상태 관리 - 공부를 위함)
  3. jwt (로그인 구현)
  4. bcrypt (비밀번호 암호화)
  5. axios
  6. mysql (db) ✳️
  7. ts-node ✳️
  8. tslint ✳️
  9. nodemon
  10. tslib ✳️
  11. body-parser (클라이언트 측 api요청 시 request body를 파싱하기 위함) ✳️
  12. cors ✳️
- 브라우저
  1. Mozilla/5.0 (Windows NT 10.0; Win64; x64)
  2. AppleWebKit/537.36 (KHTML, like Gecko)
  3. Chrome/105.0.0.0 Safari/537.36

## 파일 구조

파일 구조는 다음과 같습니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://user-images.githubusercontent.com/71887242/188854754-9e16f266-2450-4522-93cf-4c2d526b8f5a.png" alt="sample" title="sample">
   <figcaption>file tree by tree parser</figcaption>
</span>
</figure>

## Express 설정

파일구조에서 보듯이 서버와 클라이언트 디렉토리를 따로 두었습니다. 제가 아직 모르는게 많기 때문에 굳이 안해도 되는 부분이 있을 수 있으니 양해바랍니다 🙇‍♂️

`express`를 저번 주부터 사용해보았는데요, 기존에 자바스크립트를 쭉 써와서인지 크게 어려운 부분은 없었습니다. 다만, 디자인 패턴이 있을텐데 이렇게 하는게 맞는지도 스스로 의문을 가집니다.

<hr />

먼저 말씀을 드리자면 구축하고자 하는 `express` 환경은 `typescript`를 사용해서 빌드하는 것이며, **`commonjs(require)`가 아닌 `esm(import/export)`로 빌드하는 방법이니 꼭 참고 바랍니다.**

우선 루트되는 디렉토리를 하나 생성하고, `client`와 `server`라는 이름으로 폴더를 생성합니다.

```bash
mkdir project_root/{client,server}
# 콤마 다음 붙여써야 제대로 됩니다.
```

루트 디렉토리에서 `npm`을 초기화 해줍니다.

```bash
npm init -y
```

그 다음 `concurrently`를 설치하여 이후에 루트 디렉토리에서 모든 명령을 내릴 수 있도록 작성 할 겁니다.

```bash
yarn add concurrently
# or
npm install concurrently --save
```

```json
// package.json
{
  "name": "halmi",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build:server": "cd server/ && yarn build",
    "build:client": "cd client/ && yarn build",
    "build": "concurrently --kill-others-on-fail \"yarn build:server\" \"yarn build:client\"",
    "start:server": "cd server/ && yarn start",
    "start:client": "cd client/ && yarn start",
    "start": "concurrently --kill-others-on-fail \"yarn start:server\" \"yarn start:client\"",
    "clean": "rm -rf build/"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

이렇게 설정하고 서버 디렉토리로 가서 `npm`과 `tsc`를 초기화하고 필요한 라이브러리를 받습니다.

```bash
npm init -y && tsc --init
yarn add tslib mysql dotenv cors body-parser bcrypt
yarn add ts-node express typescript nodemon @types/bcrypt @types/express @types/node -D
```

`node`에서 `commonjs`를 사용하는데 `import` 구문을 사용하기위해 몇 가지 설정이 필요합니다. `package.json`에서 `type`필드에 `module`을 추가해야합니다. 그리고 `tsconfig.json`에서 `target`과 `module`, `ts-node` 설정이 필요합니다.

```json
// package.json
{
  "name": "my_server",
  "version": "5.0.0",
  "private": true,
  "main": "build/index.js",
  "type": "module", // default 값은 commonjs입니다.
  "scripts": {
    "prebuild": "tslint -c tslint.json -p tsconfig.json --fix",
    "build": "rm -rf ./build/ && tsc --project .",
    "clean": "rm -rf build/",
    "start": "nodemon --watch ./ --exec \"npx\" \"ts-node\" index.ts"
  }
  // ...
}
```

`type`을 설정하는 이유는 앞서 말한 `import/export`를 사용하기 위해 설정합니다. `pre*`는 `*`표시를 실행하기 전에 먼저 실행됩니다. `prebuild`는 빌드 하기 전에 타입 검사를 합니다. 그리고 빌드를 실행하게 되는데 기존 빌드 디렉토리를 지워주지 않으면 하위 폴더로 중복 생성되기 때문에 지워주고 컴파일 하도록 설정합니다.

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

> 빌드 방법은 다음 편에서 다룰 예정입니다.

## React(TypeScript) 설정

> [MUI::react-typescript template](https://github.com/mui/material-ui/tree/master/examples/create-react-app-with-typescript)을 받아 사용했습니다.

설치하는 명령줄은 위 링크에 소개 되어있는데로 진행하면 됩니다.

```bash
curl https://codeload.github.com/mui/material-ui/tar.gz/master | tar -xz --strip=2 material-ui-master/examples/create-react-app-with-typescript
cd create-react-app-with-typescript
```

만일, `mui`를 사용하지 않는 분은 `cra`의 `typescript template`을 사용하시면 됩니다.

## 겪었던 문제 상황

### ts-node 관련 에러

이렇게 설정 함에도 불구하고 에러가 발생하는데 내용은 다음과 같습니다.

```text
[0] C:\kimson\fake_path\intellij\my_express\node_modules\ts-node\dist-raw\no
de-internal-modules-esm-resolve.js:366
[0]     throw new ERR_MODULE_NOT_FOUND(
[0]           ^
[0] CustomError: Cannot find module 'C:\kimson\fake_path\intellij\my_express
\server\restController\memberRestController' imported from C:\kimson\fake_path\in
tellij\my_express\server\index.ts
[0]     at finalizeResolution (C:\kimson\fake_path\intellij\my_express\node_
modules\ts-node\dist-raw\node-internal-modules-esm-resolve.js:366:11)
[0]     at moduleResolve (C:\kimson\fake_path\intellij\my_express\node_modul
es\ts-node\dist-raw\node-internal-modules-esm-resolve.js:801:10)
[0]     at Object.defaultResolve (C:\kimson\fake_path\intellij\my_express\no
de_modules\ts-node\dist-raw\node-internal-modules-esm-resolve.js:912:11)
[0]     at C:\kimson\fake_path\intellij\my_express\node_modules\ts-node\src\
esm.ts:218:35
[0]     at entrypointFallback (C:\kimson\fake_path\intellij\my_express\node_
modules\ts-node\src\esm.ts:168:34)
[0]     at C:\kimson\fake_path\intellij\my_express\node_modules\ts-node\src\
esm.ts:217:14
[0]     at addShortCircuitFlag (C:\kimson\fake_path\intellij\my_express\node
_modules\ts-node\src\esm.ts:409:21)
[0]     at resolve (C:\kimson\fake_path\intellij\my_express\node_modules\ts-
node\src\esm.ts:197:12)
[0]     at resolve (C:\kimson\fake_path\intellij\my_express\node_modules\ts-
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

// member restController
app.use("/api", members);

app.listen(PORT, () => {
  console.debug(`app listening on port http://${HOST}:${PORT}`);
});
```

위 코드는 프로젝트 코드 일부 입니다. 에러 내용에서 라인 4를 보면 `import`하는데 모듈을 찾지 못한다고 합니다. 자세히 보면 다른 노드 모듈은 로드가 되지만 로컬 파일이 로드되지 않습니다.

혹시나 `ts-node`에 의해서 파싱되어 실행되는 것이라면 확장자 문제인가 싶어서 찾아보니 아니나 다를까 `import ... from ...` 에서 모듈 위치에 확장자명을 표기하되 `js`로 표기해야 정상 작동이 됩니다.

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

아마도 위의 에러는 `module`을 `esnext`로 하여 생기는 문제로 판단됩니다. `module`을 `esnext`로 설정하고 빌드하고자 하면 `import`하는 위치를 제대로 찾지 못합니다. 위 설정대로 저장하고 `tsc`하면 정상적으로 작동합니다.

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
