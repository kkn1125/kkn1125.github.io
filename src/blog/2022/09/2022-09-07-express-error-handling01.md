---
slug: "/express-error-handling01/"
layout: post
modified: 2023-04-08 16:57:33 +0000
date: 2022-09-14 17:51:43 +0000
title: "[EXPRESS] express axios 에러 핸들링"
author: Kimson
categories: [express]
image: /images/post/covers/TIL-express.png
tags: [express, axios, error, handling, til]
description: "express + axios 에러 핸들링

axios를 자주 사용하지만 아직도 알아야할 것이 산더미입니다. express와 같이 사용하면서 어떻게하면 반복을 줄이고 효율적으로 에러 처리할지 고민하면서 괜찮았던 방법과 특히나 오류가 발생한 문제를 위주로 기록하려합니다.

도식화 하자면 아래와 같습니다."
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

# express + axios 에러 핸들링

axios를 자주 사용하지만 아직도 알아야할 것이 산더미입니다. express와 같이 사용하면서 어떻게하면 반복을 줄이고 효율적으로 에러 처리할지 고민하면서 괜찮았던 방법과 특히나 오류가 발생한 문제를 위주로 기록하려합니다.

도식화 하자면 아래와 같습니다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://[user-images.githubusercontent.com/71887242/187074979-4a53bddd-d539-4de8-a80f-abceb48b6c07.png](https://user-images.githubusercontent.com/71887242/190115679-627c7c7d-4d59-4929-a42d-828ab82a4131.png)" alt="sample" title="sample">
   <figcaption>도식화 1</figcaption>
</span>
</figure>

서버 측에서 에러 메세지와 예상되는 범위의 예외 처리를 합니다. 따로 클라이언트에서 메세지를 설정하지 않고 서버단에서 처리하는 방법입니다.

굳이 도식화 할 필요는 없지만 단순하게 접근 해보았지만 생각해보면 예외를 잡지 못하면 그래도 서버가 멈춰버리는 문제가 있습니다. 일괄적으로 try ... catch로 응답하자니 서버에서 발생한 에러 내용이 그대로 노출되는 문제가 있습니다. 찾지 못한 예외 상황을 "서버 문제"라는 문구를 달고 내보내는 방법을 택했습니다.

## express에서 axios를 사용할 때

```typescript
import qs from "qs";

const token = async (
  req: Request<{}, any, any, qs.ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>, number>
) => {
  try {
    const { data } = await axios.post(
      `https://kauth.kakao.com/oauth/token`,
      qs.stringify({
        ...req.body,
        grant_type: "authorization_code",
        client_id: process.env.REST_API_KEY,
      }),
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
    res.status(200).json({
      ok: true,
      payload: data,
    });
  } catch (e: any) {
    res.status(500).json({
      ok: false,
      message: e.message,
    });
  }
};
```

작업 중인 프로젝트 중에서 가져온 예시 코드입니다. express에서 kakao api를 끌어와 사용하는 상황인데요, 토큰을 확인하는 post 방식 요청입니다. 리액트에서 사용하던 것과 조금 달라서 기록을 해 둡니다.

qs를 가져와서 stringify함수로 바디를 파싱시켜 axios로 넘겨줍니다. 프로젝트 설정상 require대신 import를 사용했습니다.

## 에러 처리 예시

```typescript
// utils/customException.ts
export class CustomException {
  public message: string;
  public status: number;
  public ok: boolean;
  constructor(e: CustomError) {
    this.message = e.message;
    this.status = e.status !== undefined ? e.status : 200;
    this.ok = e.ok !== undefined ? e.ok : true;
  }
}
```

에러를 일괄 처리하기 위해 커스텀 에러를 작성했습니다. 받는 인자는 양식에 맞춰서 동일하게 처리합니다.

```typescript
// member.service.ts
import Member from "../models/member.js";
import { CustomException } from "../utils/customException.js";

Member.signin = (req, res) => {
  const token = jwtUtil.sign({ email: req.body.email });
  const refreshToken = jwtUtil.refresh();
  sql.query(
    "SELECT * FROM member WHERE email=?",
    req.body.email,
    (err, rows) => {
      try {
        if (rows.length === 0) {
          // query결과가 없을 때
          throw new CustomException({
            message:
              "일치하는 회원 정보가 없습니다. 로그인을 다시 시도 해주세요.",
            status: 404,
            ok: false,
          });
        } else if (err) {
          // query에서 문제가 발생 할 때
          throw new CustomException({
            message:
              "로그인 시도에서 문제가 발생했습니다. 새로고침 후 다시 시도해주세요.",
            status: 500,
            ok: false,
          });
        }
        bcrypt.compare(req.body.pw, rows[0].pw, (error, same) => {
          if (error) {
            // 계정 비밀번호가 일치하지 않을 때
            throw new CustomException({
              message:
                "계정 정보가 일치하지 않습니다. 로그인을 다시 시도 해주세요.",
              status: 500,
              ok: false,
            });
          }
          if (same) {
            // 비밀번호가 일치할 때
            const { pw, ...user } = rows[0];
            res.status(200).json({
              ok: true,
              payload: {
                token,
                refreshToken,
                user_num: user.num,
                user,
              },
            });
          } else {
            // 일치하지 않을 때
            throw new CustomException({
              message: "패스워드가 일치하지 않습니다.",
              status: 401,
              ok: false,
            });
          }
        });
      } catch (e: any) {
        // 그 외 응답 및 에러 일괄 응답
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

에러가 발생할 만한 경우를 직접 메세지와 상태 코드를 적고, 그 외 발생하는 에러를 서버 문제로 돌려버리는 방법을 사용했습니다. 더 추가하자면 catch문에서 e의 ok필드가 없다면 모두 서버 문제라는 문구로 교체해버리면 될 것이라 생각합니다.

---

📚 함께 보면 좋은 내용

[Stackoverflow::Axios handling errors](https://stackoverflow.com/questions/49967779/axios-handling-errors)

[Express::guide](https://expressjs.com/ko/guide/error-handling.html)

[MDN Web Docs::throw](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/throw)
