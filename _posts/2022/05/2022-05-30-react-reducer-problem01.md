---
layout: post
date: 2022-05-13 10:34:26 +0900
title: "[REACT] reducer 두 번 실행 문제"
author: Kimson
categories: [react]
image: assets/images/post/covers/TIL-react.png
tags: [react, basic, til]
description: "
문제 상황

문제상황은 이렇다.

위 코드와 같이 `state`의 형태가 배열 내에 객체가 있고, 객체 내에 배열이 있다. 문제는 깊이 있는 배열은 최초 생성 시 배열에 담겨 새로운 `task`가 생성되어야 하고, 같은 날짜에 내용을 등록한다면 해당 날짜의 `tasks`에 `task`가 배열에 추가되어 업데이트 되야하는 상황이다."
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

# 문제 상황

문제상황은 이렇다.

```jsx
// ProblemContext.js

// ...

// state의 형태
const stateList = [
  {
    // task
    id: 0,
    tasks: [
      {
        content: "test",
        done: false,
      },
      {
        content: "test",
        done: true,
      },
    ],
    date: format(new Date(), "yyyy-MM-dd", true),
  },
  // ...other tasks
];

// reducer 형태
const GraphReducer = (state, action) => {
  switch (action.type) {
    case "CREATE":
      // action. date/task
      return state.concat({
        id: action.id,
        tasks: [action.task],
        date: action.date,
      });
  }
};

// ...
```

위 코드와 같이 `state`의 형태가 배열 내에 객체가 있고, 객체 내에 배열이 있다. 문제는 깊이 있는 배열은 최초 생성 시 배열에 담겨 새로운 `task`가 생성되어야 하고, 같은 날짜에 내용을 등록한다면 해당 날짜의 `tasks`에 `task`가 배열에 추가되어 업데이트 되야하는 상황이다.

1. `state`는 각 `task`를 담는다.
2. `task`의 객체 구조는 `id`, `tasks`, `date` 속성을 갖는다.
3. `tasks`의 배열은 `content`, `done` 속성을 갖는 객체를 담는다.
4. `tasks`는 해당 날짜 최초 등록 시 [task]이고, 그 뒤로 같은 날짜는 `tasks`에 [객체, 객체, 객체 [, ...]] 형식으로 내부 배열에서 추가되어야 한다.

새로운 날짜에 `tasks`를 추가하는 것은 쉽지만, 내부 배열에 `tasks`를 추가하는 작업에서 갑자기 `reducer`가 **두 번 실행**되어 값이 두 개씩 들어가는 현상이 발생했다.

## 문제 원인

```jsx
const GraphReducer = (state, action) => {
  switch (action.type) {
    case "CREATE":
      // action. date/task
      if (state.some((item) => item.date === action.date)) {
        // 두 번 실행
        return state.map((item) => {
          if (item.date === action.date) {
            item.tasks = item.tasks.concat({
              content: action.content,
              done: false,
            });
            return item;
          }
          return item;
        });
      } else {
        return state.concat({
          id: action.id,
          tasks: [action.task],
          date: action.date,
        });
      }
  }
};
```

초기에 짰던 코드이다. 분명 이벤트에서 `dispatch`를 실행 할 때는 한 번 호출되는데 왜 값이 두 번이 들어갈까?

디버깅을 해보니 `GraphReducer`가 호출되고 `return`을 거치는데, `state`가 중간에 업데이트가 되면서 `reducer`를 한 번 더 호출하게 되고 있었다.

자세한 원인은 아래 코드 부분이다.

```jsx
const GraphReducer = (state, action) => {
  switch (action.type) {
    case "CREATE":
      if (state.some((item) => item.date === action.date)) {
        return state.map((item) => {
          if (item.date === action.date) {
            item.tasks = item.tasks.concat({
              // 여기!!!
              content: action.content,
              done: false,
            });
            return item;
          }
          return item;
        });
      } else {
        return state.concat({
          id: action.id,
          tasks: [
            {
              content: action.content,
              done: false,
            },
          ],
          date: action.date,
        });
      }
  }
};
```

`concat` 또한 새로운 배열일텐데 왜 업데이트 되었다고 인식을 할까? 정확한 원리는 아직 모르지만 값일 직접 할당하고 있는 부분이 문제의 부분이었다.

속성에 직접 값을 지정하고 있기 때문에 `reducer`가 변화를 감지하고 다시 실행되는 것으로 판단된다. 다른 사람들은 `react.strictmode` 때문이라고 하는 사람들이 있지만 내 코드에서의 문제는 `concat`한 데이터를 직접 정하는 부분의 문제라고 확신한다.

그래서 코드를 조금 변경해봤다.

```jsx
const GraphReducer = (state, action) => {
  switch (action.type) {
    case "CREATE":
      if (state.some((item) => item.date === action.date)) {
        return state.map((item) => {
          if (item.date === action.date) {
            return {
              // 변경
              ...item,
              tasks: item.tasks.concat({
                content: action.content,
                done: false,
              }),
            };
          }
          return item;
        });
      } else {
        return state.concat({
          id: action.id,
          tasks: [
            {
              content: action.content,
              done: false,
            },
          ],
          date: action.date,
        });
      }
  }
};

// 더 다듬으면 아래와 같다.
const GraphReducer = (state, action) => {
  switch (action.type) {
    case "CREATE":
      return date === -1
        ? state.concat({
            id: action.id,
            tasks: [
              {
                content: action.content,
                done: false,
              },
            ],
            date: action.date,
          })
        : state.map((item) =>
            item.date === action.date
              ? {
                  ...item,
                  tasks: item.tasks.concat({
                    content: action.content,
                    done: false,
                  }),
                  // or
                  tasks: [
                    ...item.tasks,
                    {
                      content: action.content,
                      done: false,
                    },
                  ],
                }
              : item
          );
  }
};
```

## 정리

이 문제로 알 수 있는 점은 불변성을 지켜지 않은데서 오는 사이드이펙트라 생각한다. `dot notation`을 이미 한 번 탄 속성을 직접 수정하는 것 또한 사이드이펙트가 발생할 수 있다는 것이다.

객체나 배열의 데이터를 추가, 수정, 삭제 할 때는 항상 새로운 객체/배열을 반환 시켜줘야한다. `=(equal)` 기호를 써서 직접 값을 지정하는 경우는 사이드이펙트가 발생한다. 불변성을 지켜가면서 작성해야 상태관리가 용이하고, 사이드이펙트를 방지할 수 있다.

---

📚 함께 보면 좋은 내용

[React::Github repository](https://github.com/facebook/react/blob/42f15b324f50d0fd98322c21646ac3013e30344a/packages/react-dom/src/server/ReactPartialRendererHooks.js#L269){:target="\_blank"}

[Stackoverflow::useReducer Action dispatched twice](https://stackoverflow.com/questions/54892403/usereducer-action-dispatched-twice){:target="\_blank"}

[꿀로그님 블로그::리액트 불변성이란 무엇이고, 왜 지켜야 할까?](https://hsp0418.tistory.com/171){:target="\_blank"}
