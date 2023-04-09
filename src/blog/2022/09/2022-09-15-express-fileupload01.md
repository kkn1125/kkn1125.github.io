---
slug: "/express-fileupload01/"
layout: post
modified: 2023-04-08 16:57:33 +0000
date: 2022-09-15 19:25:29 +0000
title: "[EXPRESS] fileupload 구현"
author: Kimson
categories: [express]
image: /images/post/covers/TIL-express.png
tags: [express, typescript, esm, react, til]
description: "express에서 파일업로드 하기

express를 사용하다보면 자주 들어보기는 했지만 사용할 기회가 없어서, 혹은 내용 파악이 어려워서 등등의 이유로 다양한 라이브러리를 마주하게 되는 순간이 오게 되는데요. 자바나 장고를 사용하면서 파일 업로드를 해 본 경험은 많지만 express로 구현해 본 적이 없어서 기록을 남기려합니다.

포스팅 해야지 하면서 그렇게 일주일이 지나서야 쓰게 됩니다. express에서 파일을 업로드하기 위해 multer를 쓰기로 했습니다. 단순히 파일 업로드를 위함은 아니고 express에서 받던 formdata 형식을 x-www-formurlencoded에서 form-data형식으로 변경해서 만들기 위함 입니다.

방법이야 정해진 것은 없으니 자신에게 맞는 라이브러리를 쓰시고 고심하여 쓰시기 바랍니다. 물론 저처럼 개인 프로젝트에 쓰는 것이라면 굳이 상관은 없습니다."
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

# express에서 파일업로드 하기

express를 사용하다보면 자주 들어보기는 했지만 사용할 기회가 없어서, 혹은 내용 파악이 어려워서 등등의 이유로 다양한 라이브러리를 마주하게 되는 순간이 오게 되는데요. 자바나 장고를 사용하면서 파일 업로드를 해 본 경험은 많지만 express로 구현해 본 적이 없어서 기록을 남기려합니다.

포스팅 해야지 하면서 그렇게 일주일이 지나서야 쓰게 됩니다. express에서 파일을 업로드하기 위해 multer를 쓰기로 했습니다. 단순히 파일 업로드를 위함은 아니고 express에서 받던 formdata 형식을 x-www-formurlencoded에서 form-data형식으로 변경해서 만들기 위함 입니다.

방법이야 정해진 것은 없으니 자신에게 맞는 라이브러리를 쓰시고 고심하여 쓰시기 바랍니다. 물론 저처럼 개인 프로젝트에 쓰는 것이라면 굳이 상관은 없습니다.

## 개발환경

- express
- multer

## 파일 업로드 미들웨어 적용

multer는 미들웨어로 적용하게 되는데요, 아래 예시코드를 보시는 것이 더 빠를 수 있습니다.

```typescript
// app.ts

import multer from "multer";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    // 파일 명 커스터마이징
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
  destination: (req, file, cb) => {
    // 저장 위치 커스터마이징
    cb(
      null,
      __dirname +
        (process.env.NODE_ENV === "production" ? "" : "/../client/") +
        "public/uploads/"
    );
  },
});

const upload = multer({ storage });

// 모든 경로에 미들웨어로 적용합니다.
app.use(upload.any());

// 선택적으로 특정 경로에만 미들웨어를 적용할 수도 있습니다.
app.use("/api", upload.any(), userRouter);
```

예를 들어 회원 정보 수정 시 프로필 이미지를 변경한다면 저의 경우 userRouter(컨트롤러)에서 파일 업로드와 쿼리문을 db에 보내게 됩니다.

```typescript
// memberController.ts

import memberService from "../service/member.service.js";
memberRouter.post("/fileupload", (req, res) => {
  memberService.fileUpload(req, res);
});

// member.service.ts
import Member from "model/member.js";

Member.fileUpload = (req, res) => {
  const { num } = req.body;
  const cover = req.files[0];

  sql.query(
    "UPDATE member SET cover=? WHERE num=?",
    [cover.filename, num],
    (error: any, rows: any) => {
      try {
        if (error) {
          throwException(errorMessage[500], 500, false);
        }
        res.status(201).json({
          ok: true,
          payload: rows,
        } as APIResponse);
      } catch (e: any) {
        res.status(e.status).json({
          status: e.status,
          ok: e.ok,
          message: e.message,
        });
      }
    }
  );
};
```

미들웨어로 설정해 두기만 하면 크게 어렵지 않다고 생각합니다. 조금 씩 기록하고, 보완해 나가도록 하갰습니다.

---

📚 함께 보면 좋은 내용

[Express 공식 홈페이지::Express에서 정적 파일 제공](https://expressjs.com/ko/starter/static-files.html)

[digitalocean::How To Serve Static Files in Express](https://www.digitalocean.com/community/tutorials/nodejs-serving-static-files-in-express)

[Manbalboy님 블로그::[NODE] NODE.js의 express의 정적자원 서빙방법](https://manbalboy.github.io/javascript/express-static.html)

[Yogesh Chavan 미디움::How to Render a React App Using an Express Server in Node.js](https://levelup.gitconnected.com/how-to-render-react-app-using-express-server-in-node-js-a428ec4dfe2b)

[NPM::express-fileupload](https://www.npmjs.com/package/express-fileupload)

[GITHUB::expressjs/multer](https://github.com/expressjs/multer)

[NPM::multer](https://www.npmjs.com/package/multer)

[JH님 개발 블로그::미들웨어](https://ts2ree.tistory.com/207)

[LeeSeongho님 블로그::[Error][Express][Flutter] TypeError](https://leeseongho.tistory.com/130)

[Stackoverflow::Cannot app.use(multer). "requires middleware function" error](https://stackoverflow.com/questions/31496100/cannot-app-usemulter-requires-middleware-function-error)

[Stackoverflow::How to store a file with file extension with multer?](https://stackoverflow.com/questions/31592726/how-to-store-a-file-with-file-extension-with-multer)

[Stackoverflow::Express body-parser req.body with formdata is empty object](https://stackoverflow.com/questions/44861517/express-body-parser-req-body-with-formdata-is-empty-object)

[PEPPERMINT100님 미디움::[JS]React에서 Express로 이미지 파일 올리기(multer)](https://krpeppermint100.medium.com/js-react%EC%97%90%EC%84%9C-express%EB%A1%9C-%EC%9D%B4%EB%AF%B8%EC%A7%80-%ED%8C%8C%EC%9D%BC-%EC%98%AC%EB%A6%AC%EA%B8%B0-multer-f398adf6dbdd)

[Eunji님 블로그::express에서 post form-data 받기](https://kim-eun-ji.github.io/TIL/NodeJs/x-www-form-urlencoded.html#%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8C%E1%85%A5%E1%86%BC-%E1%84%87%E1%85%A1%E1%86%BC%E1%84%87%E1%85%A5%E1%86%B8)

[Uros Randelovic 블로그::How to upload multiple files to Node.js Express server using Axios from React/Vue](https://uros-randelovic.medium.com/how-to-upload-multiple-files-to-node-js-express-server-using-axios-from-react-vue-82cbc7aac55)

[StackAbuse::Axios Multipart Form Data - Sending File Through a Form with JavaScript](https://stackabuse.com/axios-multipart-form-data-sending-file-through-a-form-with-javascript/)

[BezKoder::Axios File Upload example](https://www.bezkoder.com/axios-file-upload/#Axios_File_Upload_Response_Body)

[Stackoverflow::Preview an image before it is uploaded](https://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded)

[Stackoverflow::NodeJS, Axios - post file from local server to another server](https://stackoverflow.com/questions/53038900/nodejs-axios-post-file-from-local-server-to-another-server)

[Stackoverflow::convert base64 to image in javascript/jquery](https://stackoverflow.com/questions/21227078/convert-base64-to-image-in-javascript-jquery)

[Stackoverflow::How to convert file to base64 in JavaScript?](https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript)
