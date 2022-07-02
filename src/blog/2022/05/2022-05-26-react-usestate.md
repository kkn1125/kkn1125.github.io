---
slug: "/react-usestate"
layout: post
date: 2022-05-26 22:29:01 +0900
title: "[REACT] React 시작하기 03 [useState]"
author: Kimson
categories: [react]
image: /images/post/covers/TIL-react.png
tags: [react, basic, til]
description: "useState Hook

`useState`훅은 `React` 버전 `16.8`부터 새로 추가되었다. `Hook`을 이용해서 기존에는 `Class` 바탕의 코드 작성이었지만, 그럴 필요없이 함수형 컴포넌트에서도 사용할 수 있게 되었다.

그 중에서도 `useState`라는 기초되는 기능을 정리하고자 한다."
featured: true
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# useState Hook

`useState`훅은 `React` 버전 `16.8`부터 새로 추가되었다. `Hook`을 이용해서 기존에는 `Class` 바탕의 코드 작성이었지만, 그럴 필요없이 함수형 컴포넌트에서도 사용할 수 있게 되었다.

그 중에서도 `useState`라는 기초되는 기능을 정리하고자 한다.

## 기능

`useState`가 가지는 기능은 단순하게 보면 읽고 쓰는 기능을 지원해준다. `useState`는 반환 값으로 튜플형태의 배열을 반환하는데, 배열 첫 번째가 `state`라는 읽기전용 **변수**이고, 두 번째가 읽기전용의 state를 갱신해주는 `setState`**함수**이다.

```jsx
function Test() {
  // 관습적으로 이름을 동일하게 지정하고, 함수에는 set*을 붙인다.
  const [state, setState] = useState(/* 초기 값 */);

  return (
    <div>
      <h1>{state}</h1>
      <span>{state}</span>
    </div>
  );
}

export default Test;
```

읽기전용 변수가 뿌려진 곳에는 `setState`함수가 호출되었을 때 값이 변경되면 `state`가 있는 곳 모두 갱신시켜준다.

`react`를 처음 접할 때는 `Hook`이 도대체 뭐지? 바닐라 자바스크립트로 하드코딩하던 나는 전혀 알지 못했다.

바짝 밤새면서 일주일간 연습해보니 점점 원리가 이해가 가고 굉장히 유용하다는 걸 깨달았다.

## 빠지지않는 투두리스트

나 또한 투두리스트를 예로 들어보고자 한다. 그런데 투두리스트는 식상하니 가계부라고 하겠다.

```jsx
import { Fragment } from "react";
import { Title } from "./Title";
import { Inputs } from "./Inputs";
import { AccountList } from "./AccountList";

function AccountBook() {
  return (
    <Fragment>
      <Title />
      <Inputs />
      <AccountList />
    </Fragment>
  );
}

export default AccountBook;
```

이러한 예제가 있다고 가정해보자. 컴포넌트를 만들고, state가 뭔지, props가 뭔지는 알아야 한다. 아직 잘 모른다면 [React::주요개념](https://ko.reactjs.org/docs/hello-world.html)을 보면 된다.

이어서 AccountBook이라는 컴포넌트를 만들었는데 아직 하위요소는 만들지 않았다. 하나씩 구성해보면서 이해해보자.

## 가계부 작성

서버를 켜고 화면을 띄우면 에러가 발생한다. 있지도 않은 컴포넌트를 왜 쓰냐고 한다. 시작한지 일주일 밖에 안되었으니 어떻게 컴포넌트를 설계하고 어떤 방식으로 모듈화하는지 모르지만 결과적으로 썼을때 간단하게 `props`를 조정하고 내 입맛에 맞게 재사용이 쉬워야한다는 관점에서 나는 거꾸로 밖에서 안으로 설계한다.

먼저 폴더 구조는 이렇다. 이 내용이 처음에 나왔어야했는데 여기서 같이보자. 드디어 내가 만들었던 트리 파서가 나올때이다.

<pre style="background-color: #88888815; width: 300px; padding-left: 1rem; border-radius: 15px;">

└┬─ account_book(project)
　├── node_modules
　├── public
　└┬─ src
　　├── components
　　├── App.css
　　├── App.js
　　├── App.test.js
　　├── index.css
　　├── index.js
　　├── logo.svg
　　├── repotWebVitals.js
　　├── setupTests.js
　　├── .gitignore
　　├── package.json
　　├── package-lock.json
　　└── README.md

</pre>

> 트리파서가 궁금하거나 저런 특수기호 노가다가 싫다면 한 번 써보는걸 추천😎

간단하게 내용을 작성하고 데이터를 하나 씩 전달시켜보자.

```jsx
// ./AccountBook.jsx

import { Fragment, useState } from "react";
import { Title } from "./Title";
import { Inputs } from "./Inputs";
import { AccountList } from "./AccountList";

function AccountBook() {
  const TITLE = "Account Book";
  const [account, setAccount] = useState({});
  const [accountList, setAccountList] = useState([]);

  const handleState = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setAccount({ ...account, [key]: value });
  };

  const handleAddStateList = () => {
    setAccountList([...accountList, account]);
  };

  return (
    <Fragment>
      <Title title={TITLE} />
      <Inputs
        account={account}
        handleState={handleState}
        handleAddStateList={handleAddStateList}
      />
      <AccountList accountList={accountList} />
    </Fragment>
  );
}

export default AccountBook;
```

`TITLE`은 고정 값이기에 대문자로 표기했다. `useState`를 두 가지 사용하는데, `account`는 내가 `비용(cost)`과 `목적(purpose)`에 따라 내용을 갱신해주기 위해 오브젝트를 초기값으로 줬다.

그리고 각 비용들이 작성되면 추가를 해야하니 `accountList`를 만들었다. 말은 투두리스트 식상하다했으나 식상한게 최선인듯하다. 말만 바꿨지 똑같다.

### 가계부 인풋

```jsx
// ./Inputs.jsx

function Inputs({ account, handleState, handleAddStateList }) {
  return (
    <div>
      <select
        name="purpose"
        type="text"
        value={account.purpose}
        onChange={handleState}
      >
        <option value="life">생활</option>
        <option value="food">음식</option>
        <option value="hospital">병원</option>
        <option value="health">운동</option>
        <option value="play">놀이</option>
      </select>
      <input
        name="cost"
        type="number"
        min="0"
        step="1000"
        value={account.cost}
        onChange={handleState}
      /> <- 항시 단일 태그는 닫아줘야한다!
      <button onClick={handleAddStateList}>추가</button>
    </div>
  );
}

export default Inputs;
```

전달 받을 것은 이미 정해뒀으니 그냥 받아서 연결하기만 하면 끝난다. `onChange`는 입력 값이 변경될때(지우거나 입력하거나) `handleState`에서 `account`의 상태를 갱신한다. 그러면 뿌려진 `value`에 값이 갱신되어 `input`의 내용이 변경된다. 제대로 연결안되면 `input`이 제 기능을 못하고 먹통이 된다.

### 가계부 리스트

```jsx
// ./AccountList.jsx

function AccountList({ accountList }) {
  return (
    <div>
      <ol>
        {accountList.length > 0 ? (
          accountList.map(({ purpose, cost }, id) => (
            <li key={id}>
              <b>{purpose}</b>
              <span>{cost} 원</span>
            </li>
          ))
        ) : (
          <div>가계부 목록이 비었습니다.</div>
        )}
      </ol>
    </div>
  );
}

export default AccountList;
```

대략 써보고 돌려봤더니 잘 된다. 삭제 기능과 추가 클릭 시 인풋을 클리어하는 기능은 한 번씩 만들어보시길.

![가계부 테스트](https://user-images.githubusercontent.com/71887242/170496520-0333dcb2-9553-4152-a459-08d39ca1d2f4.png)

---

📚 함께 보면 좋은 내용

[React::Hook의 개요](https://ko.reactjs.org/docs/hooks-intro.html)
