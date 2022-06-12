---
slug: "/javascript-grabbing-loaded-page"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-12-16 18:41:37 +0900
title:  "[JAVASCRIPT] 페이지 내용이 동적으로 로드되는 페이지 자바스크립트로 읽어오기"
author: Kimson
categories: [ javascript ]
image: /images/post/covers/TIL-javascript.png
tags: [ dynamic, load page, til ]
description: "동적 로드 페이지 내용을 읽어오자

구글 검색 후 나타나는 결과물을 긁어오는 도중에 문제가 생겼습니다.
\"`fetch`로 긁어오면 빈 태그들만 있고 심지어 클래스명도 다르네?\"

자바스크립트로 동적 로드되어 내용의 클래스가 변경되고 나머지 요소들이 렌더링 되는 식으로 구현되어 있는 것 같아 로드된 내용을 불러 올 수 없을까 하는 마음에 시도해봤습니다."
featured: false
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# 동적 로드 페이지 내용을 읽어오자

구글 검색 후 나타나는 결과물을 긁어오는 도중에 문제가 생겼습니다.

> "`fetch`로 긁어오면 빈 태그들만 있고 심지어 클래스명도 다르네?"

자바스크립트로 동적 로드되어 내용의 클래스가 변경되고 나머지 요소들이 렌더링 되는 식으로 구현되어 있는 것 같아 로드된 내용을 불러 올 수 없을까 하는 마음에 시도해봤습니다.

1. `innerHTML`
   - `innerHTML`은 "**현재 페이지 내**"에서 동적으로 변경되는 내용을 가져올 수 있습니다.
2. `window.open`
   - 원하는 `URL`을 새 창으로 띄웁니다.
   - 원하는 내용을 새 창에 담아 띄울 수 있습니다.

시도했던 것 중에서 가장 원하는 결과를 주는 것을 설명드리고자 합니다.

## 외부 URL 동적 로드된 내용을 가져와보자

현재 페이지에서 동적으로 변하는 텍스트는 `innerHTML`이나 여러 쉬운 방법으로 가져올 수 있습니다. 하지만 외부 `URL`을 `fetch`로 호출하고 아무리 `async`, `await`를 사용해도 딜레이를 주고 페이지 내용이 로드가 된다면 `fetch`로 받는 시점의 페이지 내용에는 원하는 데이터가 없을 수 있습니다.

그래서 조금 꾀를 써서 "`URL`을 호출하고 내용이 미리 페이지에 로드된 후에 내용을 받을 수는 없을까?"

### window.open에 내용 주입

거창한 것은 아니지만 `window.open`을 하게 되면 `window`를 리턴하게 됩니다. 즉, 열린 페이지의 `window` 입니다.

`window`객체를 받는 다는 것은 새 창의 내용을 조작할 수 있다는 것이 됩니다. 그렇다면 `window.open`을 하나의 변수에 담고 `body`에 텍스트를 넣으면 실시간으로 새 창으로 열린 페이지를 조작하여 즉시 변경되는 것을 확인할 수 있습니다.

```javascript
const newApp = window.open('/','test',{});

newApp.document.body.innerHTML = 'test start';
setTimeout(()=>{
   newApp.document.body.innerHTML = 'test end!';
}, 3000);
```

이렇게 작성하게 되면 새 창이 열리고 `test start`라는 문구가 세팅되어 보여집니다. 3초 뒤에 `test end!`라고 변경됩니다.

이것을 이용해서 스크립트를 새 창에서 동작 시키고 변경된 내용을 가져오는 방법이 생긴 것 입니다.

### 써먹어보자

아래는 제가 생각해봤던 로드된 내용 가져오는 방법입니다.

1. 해당 경로의 내용을 텍스트로 받아온다.
2. `DOMParser`로 변환시키고
3. 심을 `script`를 넣어주고(선택)
4. `setTimeout`으로 새 창 내용을 가져온다.

```javascript
fetch(`myUrl`).then(response=>response.ok?response.json():null).then(data=>{
   // 먼저 동적 로드되는 페이지의 URL을 적어 내용을 텍스트로 가져옵니다.
   let datas = new DOMParser().parseFromString(data, 'text/html');
   // DOMParser로 엘리먼트화 시키고
   // 1. (선택) 자바스크립트를 심어서 open 후 적용하거나
   let script = document.createElement('script');
   script.innerHTML = 'setTimeout(()=>alert(\'test\'), 3000)';
   datas.body.append(script);

   // 2. open메서드를 이용해서 로드된 내용을 가져옵니다.
   let test = window.open();
   test.document.documentElement.innerHTML = '<!DOCTYPE html>'+datas.documentElement.outerHTML;

   setTimeout(()=>{
      console.log([...test.document.body.querySelectorAll('h3')].filter(x=>x.textContent.match(/grab/gim)))
   }, 1000);
})
```

테스트 해보니 잘 작동됩니다. 여러 이유가 있겠지만 페이지가 로드되고 나서 내용을 변경하는 스크립트를 가진 페이지가 있는 것으로 알고 있습니다.

테스트 했던 페이지는 구글 검색 결과 페이지였습니다. 이후 클래스가 부여되거나 하는게 동적으로 할당 되는 것으로 보고 해당 방법으로 가져 왔을 때 거의 대부분 데이터를 가져오는 것으로 확인했습니다.

뭔가 생각대로 되서 뿌듯하네요.