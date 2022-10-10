---
slug: "/javascript-tree-parser01/"
layout: post
date:   2022-04-22 14:01:27 +0900
title:  "[JAVASCRIPT] 파일 구조 도식화 개발"
author: Kimson
categories: [ javascript ]
image: /images/post/covers/TIL-javascript.png
tags: [ file tree, directory, til, parser ]
description: "파일 구조 도식화

블로그에 포스팅을 작성하다 보면 파일 트리를 설명할 때 이미지보다 텍스트로 표현을 해야 할 때가 있습니다.

이미지를 사용하면 간단하게 해결되지만 번거로울 때가 있고, 이미지도 올려야 하고, 이미지가 늘어날수록 페이지가 느려지는 감이 있습니다.

이전에 바닐라 자바스크립트로 구현했던 마크다운 파서의 `블록 쿼터`와 `리스트` 들여쓰기와 관련 있지 않을까 생각하면서 시작했습니다.

목적

이미지 사용, 기호를 하나씩 붙여가며 수작업하는 것을 덜기 위해서 만들게 되었습니다.

개발 과정

이번에는 테스트 자동화 및 단위 테스트를 습관화하기 위해 테스트 코드 작성에 초점을 두어 작성했는데요. 기능 개발에 있어서 이전까지는 테스트 코드의 중요성을 크게 느끼지 못했습니다."
featured: true
hidden: false
rating: 5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# 파일 구조 도식화

블로그에 포스팅을 작성하다 보면 파일 트리를 설명할 때 이미지보다 텍스트로 표현을 해야 할 때가 있습니다.

이미지를 사용하면 간단하게 해결되지만 번거로울 때가 있고, 이미지도 올려야 하고, 이미지가 늘어날수록 페이지가 느려지는 감이 있습니다.

이전에 바닐라 자바스크립트로 구현했던 마크다운 파서의 `블록 쿼터`와 `리스트` 들여쓰기와 관련 있지 않을까 생각하면서 시작했습니다.

## 목적

이미지 사용, 기호를 하나씩 붙여가며 수작업하는 것을 덜기 위해서 만들게 되었습니다.

## 개발 과정

이번에는 테스트 자동화 및 단위 테스트를 습관화하기 위해 테스트 코드 작성에 초점을 두어 작성했는데요. 기능 개발에 있어서 이전까지는 테스트 코드의 중요성을 크게 느끼지 못했습니다.

개발하면서 테스트 코드를 통해서 어디에서 오류가 발생하고, 클린코드의 중요성을 한 번 더 느끼면서 최대한 군더더기 없이 코드를 짜는 데 노력했습니다.

코드 컨벤션을 지키면서, 파일 별로 버전과 수정시간, 작성 시간, 코드별 간단한 주석 등에 더 신경 썼습니다. 혼자 하는 작업이지만 누군가 볼 수도 있고, 나중에 작업하기 위해 볼 것이기 때문에 공들여 작성했습니다.

먼저, 아래 내용의 이해를 돕기위해 `Tree Parser` 일부 내용을 설명하겠습니다.

1. Branch = 파일 트리를 구조화하는데 필요한 기호를 말합니다. ex) "└── root"
2. First, Second, Third = 브랜치 기호의 인덱스를 말합니다. ex) first:"└", second:"─", third:"─"
3. vertical = 파일 트리 구조화에서 같은 위치(레벨)에 존재하는 파일 디렉토리를 잇는 선을 말합니다.ex)   
　│　 <----- vertical   
　└── brotherDirectory

### Pipeline 개념 활용

단계별로 파싱하는 개념을 생각했습니다. 단계별로 처리하게 되면 개인적으로 생각하는 이점은 흐름을 코드 단위로 볼 때 이해가 쉽고, 어디서 어떤 오류가 났는지 명확하게 볼 수 있다는 점이라 생각합니다. 반면 단점은 의존성이 커지는 것이라 생각됩니다.

#### 문자열에서 배열로

위에서 말하는 `pipeline` 개념은 아래와 같습니다.

```javascript
// 트리 파서 코드 일부

/**
 * 원문 파싱 후 브랜치를 그림
 * 
 * @param {string} source 
 * @returns {string[]}
 */
this.parse = function (source) {
    convertedLines = this.stringToArray(source);
    parsedLines    = this.parseLines(convertedLines);

    return this;
}
```

위 코드는 실제 `Tree Parser`의 일부입니다. `stringToArray`와 `parseLines` 메서드는 더 많은 메서드 호출 구문을 담고 있습니다. 호출되는 메서드는 모두 단계별로 실행되어 결과물이 아래로 전달되는 방식입니다.

```javascript
// 트리 파서 코드 일부

/**
 * 원문 소스를 공백 제거된 줄(line) 단위 배열로 변환
 * @param {string} source 
 * @returns {string[]}
 */
this.stringToArray = function (source) {
    const trimSources   = source.trim();
    const splitedLines  = this.separateLine(trimSources);
    const filteredLines = this.filterEmptyLine(splitedLines);

    return filteredLines;
}
```

`stringToArray` 메서드의 일부입니다. 여기서 생각했던 단계별 기능은 아래와 같습니다.

1. 원문 텍스트 앞 뒤 공백 제거
2. 줄 단위로 분리
3. 줄 단위에서 공백이 있으면 삭제
4. 필터를 거친 배열 반환

이름에서와 같이 딱 문자열에서 배열로 변환하는 작업만 합니다.

#### 라인 파싱

```javascript
/**
 * View 단에 출력하기 전 마지막 데이터 가공 상태 반환
 * @param {Object[]} lines 
 * @returns {Object[]}
 */
this.parseLines = function (lines) {
    const convertedCountIndenceArray = this.countIndences(lines);
    const addedThirdBranchArray      = this.addThirdBranch(convertedCountIndenceArray);
    const addedSecondBranchArray     = this.addSecondBranch(addedThirdBranchArray);
    const addedFirstBranchArray      = this.addFirstBranch(addedSecondBranchArray);

    return addedFirstBranchArray;
}
```

라인 파싱단계인 `parseLines`는 `countIndences`메서드로 앞의 공백 개수를 먼저 분석합니다. 그 다음 `addThirdBranch`메서드로 파일 트리의 공통되는 선 기호를 그립니다.

`add*` 메서드로 각 브랜치 부분을 적절한 요소를 판별해서 기호를 선정하는 작업을 하게 됩니다. 마지막으로 `FirstBranch`까지 파싱하면 반환합니다.

여기까지의 파싱 결과 타입은 `Object[]`입니다. 화면에 출력하는 메서드는 따로 있기 때문에 딱 여기까지의 일만 하고 나머지는 `View` 객체에 위임합니다.

> 브랜치가 무엇인지는 따로 설명 안 하겠습니다. 현재 포스팅의 상단 "개발 과정"에 설명되어 있으니 참고 바랍니다.

## 마무리

만드는 과정에서 제일 힘들었던 문제가 "First Branch를 어떻게 정확히 결정시키는가" 였습니다. 지금 보면 간단한 원리이지만 방법을 모르는 때에는 뭐든 어렵게 느껴지는 것 같습니다.

트러블슈팅에 있어서 기존에 작성했던 로직을 모두 버리고 새로운 방법으로 접근 시도를 가끔 하는데요. 여러 방식으로 접근하다 보면 적합한 솔루션을 발견할 수 있고, 해당 솔루션으로 작업하다 보면 의외로 간단하게 문제를 해결하는 제 모습을 많이 봤습니다.

트리 파서의 내용이 궁금하시거나 사용해보고 싶은 분은 아래 링크를 참조하시기 바랍니다 🙇‍♂️

## 개선 사항

> 현재 개발된 결과물에서 필요한 사항을 기재한 내용입니다.
> version v0.2.0

- 커스터마이징 가능한 환경
- API 방식 지원
- 실시간 변형 메서드 추가

### Demo site result

├┬─This is a sample   
│├┬─sample child 1-1   
││└──sample child 2-1   
│└┬─sample child 1-2   
│　└┬─sample child 2-2   
│　　└┬─children   
│　　　└──children   
└┬─Other Parent   
　├┬─child   
　│├┬─child   
　││└──child   
　│├┬─test1   
　││└──test2   
　│└──test3   
　└──test4

-----

📚 함께 보면 좋은 내용

[devkimson - tree parser::Demo Site](https://kkn1125.github.io/treeparser/)

[devkimson - tree parser::Repository](https://github.com/kkn1125/treeparser/)