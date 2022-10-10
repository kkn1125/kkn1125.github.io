---
slug: "/typescript-study01/"
layout: post
date: 2022-06-19 19:27:36 +0900
title: "[TYPESCRIPT] TypeScript Study 01"
author: Kimson
categories: [react]
image: /images/post/covers/TIL-center.png
tags: [typescript, basic, til]
description: "Typescript Study

이번 프로젝트에 사용하지는 않지만 추후 어떻게 될지 모르기도 하고, 타입스크립트를 배워둬야 하는 상황이라 이번 스터티를 타입스크립트로 정했습니다.
내용이 많이 부실할 수 있습니다. 참조한 링크를 포스팅 하단에 정리해두고 있으니 자세한 내용을 꼭 참조하시기 바랍니다.
"
featured: true
hidden: false
rating: 3
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# Typescript Study

이번 프로젝트에 사용하지는 않지만 추후 어떻게 될지 모르기도 하고, 타입스크립트를 배워둬야 하는 상황이라 이번 스터티를 타입스크립트로 정했습니다.

> 내용이 많이 부실할 수 있습니다. 참조한 링크를 포스팅 하단에 정리해두고 있으니 자세한 내용을 꼭 참조하시기 바랍니다.

## 설치 및 실행

```bash
$ npm install typescript --save-dev
$ npx tsc // compile

// global로 설치할 경우
$ npm install -g typescript
$ tsc && node [buildpath]/index.js
```

컴파일 후 `node`로 실행하려면 `build path`에 위치하는 `index.js`를 실행하면 됩니다. `build path`를 따로 지정하려면 `tsconfig.json`을 만들고 따로 설정해야합니다. 혹은 `tsc --outDir ./build/`로 지정하셔도 됩니다.

## Boolean

```typescript
let isDone: boolean = true;
```

boolean 값만을 취급합니다. true/false.

## Number

```typescript
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
let digit: number = 3.14;
```

숫자 데이터를 취급합니다. 16진수는 0x로 시작하고, 2진수는 0b, 8진수는 0o로 시작합니다. 위 타입들은 모두 `number`타입에 포함됩니다.

## String

텍스트 데이터를 다룰 때 필요합니다.

```typescript
let color: string = "blue";
color = "red";
```

텍스트를 합치는 경우도 마찬가지로 string 타입을 사용해서 문자열을 연결합니다.

```typescript
let contiguousString: string = "My name is " + "kimson";
```

## Array

기존에 JavaScript와 다를게 없습니다. 단지 타입을 붙여주기만 하면 됩니다.

```typescript
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];

let list: string[] = ["kimson", "tommy", "noni"];
let list: Array<string> = ["kimson", "tommy", "noni"];
```

Java와 유사한 모습이 보입니다. `Java`에서 타입을 지정할 때 제네릭타입을 쓰곤 했는데, 타입스크립트 또한 제네릭을 가지고 있습니다. 이후에 차차 알아보겠습니다.

Array에 들어있는 요소의 타입을 화살괄호 안에 적습니다.

```java
ArrayList<String> list = new ArrayList<String>();
list.add("Test1");
list.add("Test2");
list.add("Test3");
```

자바에서처럼 배열 내에 있는 요소 타입을 화살괄호에 정의 해주듯이 타입스크립트 또한 위의 형식처럼 타입을 지정할 수 있고, 다만 다른 점은 Array가 자바스크립트에서는 배열 "[]"이기 때문에 동일하게 쓰인다는 것입니다. 자바에서는 "[]"인지 "Array"인지는 서로 다른 타입을 뜻하지요.

각설하고 다음으로 넘어가겠습니다.

## Tuple (튜플)

튜플 타입은 요소의 타입과 개수가 고정된 배열을 표현합니다. 쉽게 말하면 key-value 쌍이 배열에 들어있는 모습을 떠올리면 됩니다.

따로 자바스크립트에는 tuple 타입이 없습니다. 파이썬에서는 (0, 'test') 식으로 튜플을 사용하고는 하지요.

쓰일때가 있을까? 싶지만 언젠가는 쓰일 때가 옵니다. 저는 요즘 Object.entries를 자주 쓰기 때문에 튜플형식이 익숙합니다.

```typescript
let x: [string, number]; // 이후 나오는 배열 타입 지정과 다르니 모양새를 잘 보시기 바랍니다.

x = ["hello", 10];
x = [10, "hello"];
    ^^   ^^^^^
```

x를 처음 정의하는 것은 이상없이 실행됩니다. 하지만 아래 x 정의는 오류를 뱉어냅니다.

1. 'number' 형식은 'string' 형식에 할당할 수 없습니다.ts(2322)
2. 'string' 형식은 'number' 형식에 할당할 수 없습니다.ts(2322)

각 자리에서 오류를 따로 알려줍니다. 지정된 타입과 맞지 않다는 말입니다. 타입스크립트를 배우면서 좋았던 점이 오류를 정확하게 알려주는 점입니다.

메서드를 사용한다거나, 지정된 인덱스 외 다른 인덱스를 지정했을 때 등등 오류를 상세하게 잡아 알려줍니다.

## Enum (열거)

```typescript
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;
```

이렇게 보면 enum이 뭔지 어떻게 생겼는지 모릅니다. compile된 파일을 열어보면 어떤식으로 작동되고 정의 되었는지 쉽게 알 수 있습니다.

아마도 아래의 코드처럼 컴파일 되어 있을 겁니다.

```javascript
var Color;
(function (Color) {
  Color[(Color["Red"] = 0)] = "Red";
  Color[(Color["Green"] = 1)] = "Green";
  Color[(Color["Blue"] = 2)] = "Blue";
})(Color || (Color = {}));
let c = Color.Green;
```

하나씩 뜯어보자면 `Color || Color={}`를 인자로 `IIFE(즉시실행함수)`에 던져줍니다. Color를 선언만 했고, IIFE에서 Color의 default 값으로 객체를 던집니다.

그리고 `Color[Color["Red"] = 0] = "Red"`는 순차적으로 안쪽의 구문부터 해석해보면 됩니다.

Color객체의 Red키에 0을 집어넣고, 그 0값은 전달되어 Color의 "0"키에 "Red"값을 넣습니다. 즉, 한 줄에서 두 가지 일이 일어납니다.

최종적으로 Color객체가 가지는 key-value는 아래와 같습니다.

```javascript
Color[0] = "Red";
Color[1] = "Green";
Color[2] = "Blue";
Color["Red"] = 0;
Color["Green"] = 1;
Color["Blue"] = 2;
```

양방향으로 연결된 형태입니다. 여기서 주목할 점은 indexing을 임의로 지정가능한 것인데 임의로 지정하게 되면 해당 값을 기준으로 순차적용됩니다.

```typescript
enum Color {
  Red = 3,
  Green,
  Bule,
}
let c: Color = Color.Green;
// 4
```

위의 예제를 보면 Red에 default값으로 3을 지정했습니다. 그렇게되면 이후 나오는 열거들의 index값이 3을 기준으로 4, 5가 할당됩니다.

## Any

ㅇ떠한 타입이던 수용합니다. 외부 라이브러리에서 값을 가져와 사용할 때 동적 컨텐츠를 다룬다면 부득이 사용하겠지만 any타입은 여러 사람들이 자주 사용하는 것을 권장하지 않고 있습니다. any타입을 자주 쓴다는 것 자체가 굳이 타입스크립트를 쓸 이유를 없애게 되는 셈이죠.

```typescript
let variable: any = 4;
variable = "good";
variable = false;

let variables: any[] = [1, "2", false, undefined];
```

## Void

void는 `Java`를 사용했던터라 익숙합니다.

```typescript
function testFunc(): void {
  console.log("test");
}
```

변수에도 void 선언이 가능합니다. 하지만 유용하지 않습니다. undefined와 null만 할당할 수 있고, 심지어는 null의 경우는 --strictNullChecks 옵션을 사용하지 않을 때만 해당됩니다.

## Null과 Undefined

void와 마찬가지로 크게 유용한 경우는 잘 없습니다. 이후 유니언 타입을 설정할 때는 사용되지만 단일로 아래와 같이 사용되는 일은 잘 없습니다.

```typescript
let un: undefined = undefined;
let nu: null = null;
```

## Never

절대 발생할 수 없는 타입을 나타냅니다. 예를 들면 함수 표현식이나 화살표 함수 표현식에서 항상 오류를 발생시키커나 절대 반환하지 않는 반환타입으로 쓰입니다.

never타입의 예제입니다.

```typescript
function throwError(message: string): never {
  throw new Error(message);
}

function fail() {
  // never타입으로 추론
  return error("Something failed");
}

function infiniteLoop(): never {
  while (true) {
    // ...
  }
}

function inferenceNever() {
  throwError("Error!");
}
```

그렇다면 void와 다른 점은 무엇일까요? 자세한 차이는 모르겠지만 사용해보면서 느낀 점을 정리해보겠습니다. never타입은 절대적으로 반환하지 않습니다. void는 실행 후 함수 로그를 찍어보면 undefined라는 타입이 나옵니다.

void를 변수에 사용했을 때 null과 undefined가 허용이 됩니다. 위에서 말했지만 null은 옵션 설정에 따라 허용 가능 여부가 결정됩니다.

void는 함수 호출 후 undefined라는 값이 나오지만 never는 그 값 조차도 없다는, 절대 반환하지 않는다는 의미로 해석이 됩니다.

위 코드에서도 볼 수 있듯이 while문의 무한 루프는 함수를 빠져나오지 못하고 반환하는 값 또한 없습니다. 여기서 핵심 키워드는 함수가 종료하지 않아서 뭔가를 주지 않는다는 것에 있다고 생각합니다.

never 함수를 void반환 함수에 넣어 작성하면 오류가 뜨지 않습니다. 반대로 void반환 함수를 never반환 함수에 포함시키면 오류가 발생합니다.

즉, 단순히 말하자면 void는 반환하는 자료가 없다 뿐이지 함수를 실행하면 함수의 시작과 종료가 있고, never는 함수의 시작은 있지만 종료가 없으며, 그에 따라 반환하는 값 또한 절대 있을 수 없다는 뜻을 가지고 있다 생각합니다.

`try ... catch`문으로 처리한다면 catch까지 실행되고 에러 발생을 예상한 구문이기 때문에 반환하는게 여전히 없다면 never가 아닌 void로 작성하는 것이 옳다고 생각합니다. finally구문 까지 붙는다면 이후 작업에 맞는 반환타입을 설정하면 될 것 같습니다.

## Object (소문자 object)

object는 원시타입 Object가 아닌 Type을 나타냅니다. number, string, boolean, bigint, symbol, null, undefined 가 아닌 나머지 입니다.

원시타입에서는 Object의 root를 찾아가면 null이 있지만 TypeScript에서는 null과 object는 다르게 타입을 분류합니다.

TypeScript 핸드북에서는 object 타입을 사용하면 Object.create와 같은 API가 더 잘 나타난다고 예시 코드를 보여줍니다. 아래의 코드가 핸드북의 코드 일부입니다.

```typescript
declare function create(o: object | null): void;

create({ prop: 0 }); // 성공
create(null); // 성공

create(42); // 오류
create("string"); // 오류
create(false); // 오류
create(undefined); // 오류
```

## 타입 단언 (Type assertions)

처음에 배우면서 개념이 잘 안 잡히던 부분입니다.

제 방식으로 더 설명을 첨가하자면, 아래와 같은 예시코드를 보면서 설명하겠습니다.

```typescript
function getLength(arg: string | number): number {
  arg += "";
  return arg.length;
}
```

위 코드는 철저하게 에러를 뱉어냅니다. 유니언 타입으로 지정된 인자 값을 반환하는 길이 값을 계산할 때 number일 경우 number타입에 length 속성이 없다고 에러를 띄웁니다. 이러한 경우 TypeScript가 아무리 똑똑해도 제 등이 가려운 곳을 정확히 긁어줄 순 없는 노릇이죠.

이처럼 "TypeScript야 여기는 문자열이 오는 것이 틀림없이"라고 아예 지정을 해버리는 것입니다.

```typescript
function getLength(arg: string | number): number {
  arg += "";
  return (arg as string).length;
}

function getLength(arg: string | number): number {
  arg += "";
  return (<string>arg).length;
  // 혹은 이렇게
}
```

Java에서는 기억을 떠올려보면 캐스팅이 있었는데요. 그와 유사하게 사용하는 느낌입니다.

> 참고로 JSX에서 사용할 때는 as - 스타일의 단언만이 허용된다고 합니다.

## 마무리

이상으로 타입스크립트의 가장 기본적이 타입들에 대해 기록을 남겼습니다. unknown이 없지만 이는 제가 아직 모르는 부분이라 다음에 포스팅을 수정할 때 추가할 예정입니다. 이미 핸드북과 여러 블로그에 잘 정리 되어 있기 때문에 디테일하게 작성하지는 않겠습니다. 아직 배우는 입장이라 잘못된 정보를 흘리기보다 소소하게 제 생각을 첨가하는 식으로 배운 것을 기록하는데 집중하려합니다.

잘못된 정보나 오타 등을 발견하신다면 댓글로 남겨주시면 감사하겠습니다 🙇‍♂️

---

📚 함께 보면 좋은 내용

[TypeScript 핸드북](https://typescript-kr.github.io/pages/basic-types.html)

[tsconfig 설정](https://www.typescriptlang.org/ko/docs/handbook/tsconfig-json.html)