---
slug: "/react-use-transition"
layout: post
date: 2022-06-07 23:51:29 +0900
title: "[REACT] useTransition 사용"
author: Kimson
categories: [react]
image: assets/images/post/covers/TIL-react.png
tags: [react, basic, til]
description: "Slow Render를 위한 startTransition

이제 막 입사하고 `react`와 `next`를 공부한지 3주째가 된다. 아직 방대한 데이터를 처리하고 최적하한 경험은 없지만, `hooks`를 자유자재로 다루기 위해 여러 강의를 보던 중 `useTransition`을 알게 되었다.

useTransition은 왜 나왔나

대게 사람들은 0.2초에 화면이 반응하지 않으면 페이지가 느리다고 생각한다고 한다. 즉각적인 변화를 기대하는 반면에 화면에 나타나는 변화를 지연해야 할 때도 있다.

`useTransition`으로 인해 해결되는 문제들이 있는데, 예로는 많은 데이터를 리스트로 출력한다고 가정한다면, 데이터 필터링이나 필드 값 제어를 할 경우 화면에서 수많은 일들이 발생할 수 있다.

사용방법은 아래와 같다."
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

# Slow Render를 위한 startTransition

이제 막 입사하고 `react`와 `next`를 공부한지 3주째가 된다. 아직 방대한 데이터를 처리하고 최적하한 경험은 없지만, `hooks`를 자유자재로 다루기 위해 여러 강의를 보던 중 `useTransition`을 알게 되었다.

## useTransition은 왜 나왔나

대게 사람들은 0.2초에 화면이 반응하지 않으면 페이지가 느리다고 생각한다고 한다. 즉각적인 변화를 기대하는 반면에 화면에 나타나는 변화를 지연해야 할 때도 있다.

`useTransition`으로 인해 해결되는 문제들이 있는데, 예로는 많은 데이터를 리스트로 출력한다고 가정한다면, 데이터 필터링이나 필드 값 제어를 할 경우 화면에서 수많은 일들이 발생할 수 있다.

사용방법은 아래와 같다.

```jsx
import React, { useTransition } from "react";

function App() {
  const [isPending, startTransition] = useTransition();
  // ...

  // 긴급한 처리
  getInputValue(something);

  // 내부 모든 state를 transition으로 표시한다.
  startTransition(() => {
    // 긴급하지 않은 처리
    heavyProcess(query);
  });

  return <div>...</div>;
}

export default App;
```

여기서 `state update`는 `Urgent update`, `Transition update` 두 가지 범주로 분류한다. `React`는 대부분 업데이트가 개념적으로 `Transition update` 이다. 하지만 이전 버전과 호환성을 위해서 `Transition`은 `opt-in`이다.

여전히 React 18은 업데이트를 `Ungent` 처리하며, 업데이트를 `startTransition`으로 래핑해서 해당 업데이트를 `Transition`으로 표시할 수 있다.

위 내용은 `react` 저장소의 `feature:startTransition`의 내용 일부를 해석한 것이고, 단순하게 말하자면 `setTransition`으로 어떤 무거운 프로세스를 처리하는 함수를 래핑한다면, 단순하고 긴급하게 업데이트 되야할 ui를 먼저 빠르게 업데이트하고 ,약간의 딜레이로 `transition update`를 한다는 것이다.

`transition`을 사용해서 성능검사를 해보면 번갈아가면서 `ui`렌더링과 이벤트 처리가 된다. 마치 `CPU`가 시분할 스케쥴링하는 것 처럼 각각의 처리를 일정 단위만큼 번갈아 처리된다.
이후 이벤트가 끝나면 `transition update`로 화면에 최종 렌더링을 한다.

## transition 성능 테스트

간단하게 테스트를 하기 위해 rangeBar를 제어해서 많은 일을 하고 화면에 많은 데이터를 보여주도록 일부러 부하가 걸리는 모델을 생성한다.

rangeBar는 한도가 10000이다. 이떄 10000은 useState 변수를 사용한 태그를 10000개 생성해서 텍스트를 변경하거나 rangeBar를 이동할 때 성능을 체크한다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://user-images.githubusercontent.com/71887242/172615547-09a2114a-349b-4b4f-a9b8-80c0ec1bcfe0.png" alt="sample" title="sample">
   <figcaption>성능 샘플 - setState</figcaption>
</span>
</figure>

setState만 사용했을 때는 굉장히 버벅거리고 화면에 렌더되는데 걸리는 시간이 많다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="https://user-images.githubusercontent.com/71887242/172615778-68d5d60c-db3a-4f9c-8b74-70b5e8c9d002.png" alt="sample" title="sample">
   <figcaption>성능 샘플 - useCallback</figcaption>
</span>
</figure>

useCallback을 사용했을 때는 큰 차이를 보이지는 못한다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="image" src="https://user-images.githubusercontent.com/71887242/172616260-4ebc668a-02d6-4515-b5f8-b261e6b9fd80.png" alt="sample" title="sample">
   <figcaption>성능 샘플 - useTransition의 startTransition</figcaption>
</span>
</figure>

`useTransition`을 사용해서 `startTransition`를 사용하면 조금 다른 형태의 성능그래프를 볼 수 있다. 하지만 이벤트가 실행되는데 매우 길게 지연되는 것을 볼 수 있다. 실제로 rangeBar를 조작해보면 이전 샘플과 달리 버벅거림은 줄었지만 여전히 화면이 렌더되는데 
지연되는 것을 확인했다.

그렇다면 `startTransition`을 바로 `import` 해서 사용하는 방법은 어떨까?

바로 `import` 해서 사용하는 방법은 아래 함께 보면 좋은 내용에 참고한 링크를 첨부해뒀다. 이름은 `"Real world example"`이다.

<figure class="text-center">
<span class="w-inline-block">
   <img src="image" src="https://user-images.githubusercontent.com/71887242/172617675-4becbe76-add9-428a-9048-5962fec027c2.png" alt="sample" title="sample">
   <figcaption>성능 샘플 - startTransition</figcaption>
</span>
</figure>

위 이미지는 `startTransition`을 적용했을 때의 성능 분석이다. 굉장히 촘촘한 단위로 함수를 번갈아가며 호출하는 모습이 보인다. 실제로 `rangeBar`를 움직이고, 텍스트를 작성하고, 다시 움직여보면 이전 샘플들과 달리 조금 부드러워 진 것을 볼 수 있다.

아직 기술에 대한 이해와 성능 최적화에 대해 아직 걸음마도 아닌 기어다니는 수준이라 정확하지 않은 내용이 포함되어 있을 수 있다.

하지만 이런 저런 이유를 계속해서 찾고자 하는 것은 기어다니는 것을 걸음마 뗄 수 있게 도와줄 원동력이 될 것이라 생각한다.

> 22.06.07 기준, 최근 작성되는 포스팅은 시간 사정상 빠르게 기록하는 것을 목표로 합니다. 계속해서 쉬는 날에 업데이트 예정이니 참고바랍니다 🙇‍♂️

---

📚 함께 보면 좋은 내용

[React::Real world example](https://github.com/reactwg/react-18/discussions/65#){:target="\_blank"}

[React::Github repository](https://github.com/facebook/react/blob/42f15b324f50d0fd98322c21646ac3013e30344a/packages/react-dom/src/server/ReactPartialRendererHooks.js#L269){:target="\_blank"}
