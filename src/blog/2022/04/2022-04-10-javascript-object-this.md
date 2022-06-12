---
slug: "/javascript-object-this"
layout: post
date:   2022-04-10 17:43:00 +0900
title:  "[JAVASCRIPT] Object와 This"
author: Kimson
categories: [ javascript ]
image: assets/images/post/covers/TIL-javascript.png
tags: [ object, this, til ]
description: "Object 이해하기

최근에 `TDD`를 알아가면서 테스트 코드를 작성하는 습관을 들이기 위해 노력 중 입니다.

`Python`과 `JavaScript` 둘 다 테스트 코드를 습관들이려다 보니 많이 헷갈리는 것도 있는데요. 이번에 문득 깨달은 점이 있어 기록하려합니다.

이전에 `object`와 `proxy`, `defineproperty` 등의 내용을 다룬 포스팅이 있습니다. 당시 포스팅과 달리 `Object`를 작성하는 것과 프로토타입 기반인 `javascript`의 상속문제, 그리고 `this`의 정해진 규칙을 정리하는 것을 중점으로 이야기하고자 합니다."
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

# Object 이해하기

최근에 `TDD`를 알아가면서 테스트 코드를 작성하는 습관을 들이기 위해 노력 중 입니다.

`Python`과 `JavaScript` 둘 다 테스트 코드를 습관들이려다 보니 많이 헷갈리는 것도 있는데요. 이번에 문득 깨달은 점이 있어 기록하려합니다.

이전에 `object`와 `proxy`, `defineproperty` 등의 내용을 다룬 포스팅이 있습니다. 당시 포스팅과 달리 `Object`를 작성하는 것과 프로토타입 기반인 `javascript`의 상속문제, 그리고 `this`의 정해진 규칙을 정리하는 것을 중점으로 이야기하고자 합니다.

## Object를 만드는 3가지 방법

다른 방법 또한 있지만 자주 사용하는 내용으로 3가지 보자면 아래와 같습니다.

1. 리터럴
2. 함수
3. 클래스

객체 리터럴이 가장 간단하면서 쉬운 방법인데요.

```javascript
const myObj = {
    name: 'kimson',
    age: 30,
    behavior: function () {
        // 함수를 정의하는 방식 1
        console.log('움직였다!');
    },
    behavior () {
        // 함수를 정의하는 방식 2
        console.log('움직였다!');
    },
}
```

프로퍼티를 지정하는 것은 위처럼 한 번에 작성하는 방법도 있고, `defineProperty`메서드를 통해 세부적으로 지정하는 방법도 있습니다. 나아가서는 `Proxy API`를 사용해서 굉장히 강력한 기능을 가지는 객체를 작성할 수도 있습니다. 예를 들면, 데이터를 객체에 넣고 뺄 때를 감지 가능하게 하는 등의 기능입니다.

그 다음 함수로 객체를 생성하는 방법 또한 있습니다.

```javascript
function Human(name, age) {
    // Human 객체
    this.name = name;
    this.age = age;
    this.live = true;
}

// or

const Human = function (name, age) {
    this.name = name;
    this.age = age;
    this.live = true;
}

// 위의 두 방법은 동일하게 Human 객체를 정의합니다. 차이점은 작성하는 방식이 변수형태인 것과 함수형태인 것의 차이와 호이스팅의 차이입니다.
```

여기서 `Human`객체는 함수의 형태를 띄고 있지만 호출하면 아무것도 반환하지 않고, `this`를 가지고 있으며, `this`에 `dot notation`으로 생성자를 작성한 예 입니다.

객체들은 모두 `this`를 가집니다. 이 `this`는 동작 중인 코드의 소유자인 해당 객체를 가리킵니다. 예를 들면, 위의 `Human`과 내부에 사용된 `this`는 서로 동일한 것입니다. 서로가 객체인 `Human`을 가리키는 것이죠.

## this가 도대체 누구를 가리키는가

배우는 시점에서 `this`를 사용하다보면 문득 이상한 상황을 마주할 때가 있습니다. 분명 `this`가 `A`를 가리키다가 나중에는 `B`를 가리키는 상황 등 입니다.

`this`는 가리키는 객체를 결정하는 우선순위 규칙을 가집니다. 기본적으로 전역 객체를 가리키고, 실행되는 위치에 따라 `this`가 가리키는 주체가 달라집니다. 아래는 4가지 우선순위 규칙입니다.

1. 기본 바인딩 (Default Binding)
2. 암시적 바인딩 (Implicit Binding)
3. 명시적 바인딩 (Explicit Binding)
4. 하드 바인딩 (Hard Binding)

### 기본 바인딩

```javascript
function test() {
    console.log(this.name);
}

var name = 'kimson';

test(); // 'kimson'
```

`var`로 변수 정의하면 `window`에 속하게 되고, 기본적으로 `this`는 전역 객체인 `window`를 가리킵니다. 그래서 `window.name`이라는 결과를 표시합니다. 단, 위 예시는 `var`로 선언할 때의 이야기 입니다. `let`과 `const`는 위의 결과와 달리 `undefined`를 반환합니다.

### 암시적 바인딩

```javascript
function calling() {
    console.log(this.msg);
}

let obj = {
    msg: 'kimson',
    test: calling
};

obj.test(); // 'kimson'
```

위 예제에서 `obj`객체에서 `test`라는 프로퍼티를 호출하면 `calling` 함수 안에 있던 `this`가 암시적으로 `obj`객체의 내부에 할당되어 실행되었기 때문에 `this`는 `obj`를 가리키게 됩니다.

### 명시적 바인딩

명시적 바인딩은 말 그대로 명시적으로 바인딩 시켜 호출하는 것을 이야기합니다. `bind`, `call`, `apply` 가 되겠습니다.

```javascript
function calling() {
    console.log(this.msg);
}

let obj = {
    msg: 'kimson',
};

calling.bind(obj)(); // 'kimson'
calling.call(obj); // 'kimson'
calling.apply(obj); // 'kimson'
```

3가지 모두 같은 결과를 줍니다. 다만 `bind`와 `call`, `apply`는 서로 조금씩 다릅니다. 공통적으로 세 가지 모두 `this`를 명시적으로 바인딩시켜줍니다. 즉, `this`를 지정해줍니다.

`bind`는 딱 바인딩 까지이고 호출하지는 않습니다. `call`과 `apply`는 바인딩도 하면서 호출까지 합니다. `call`과 `apply`는 인자 값을 전달하는데 차이가 있습니다. 그 외에는 동일한 기능을 합니다. `call`은 인자를 하나하나 넘기고, `apply`는 배열형태로 인자를 넘깁니다.

```javascript
let arr = [];

arr.push.apply(arr, [1,2,3]); // ✅
// [1, 2, 3]
arr.push.call(arr, 1,2,3); // ✅
// [1, 2, 3, 1, 2, 3]
arr.push.call(arr, [1,2,3]); // ❌
// [1, 2, 3, 1, 2, 3, Array(3)]
```

의도에 따라 쓰임이 다르겠지만 쓰는 형태를 설명하기 위함이기 때문에 맞고 틀리고를 표시했습니다.

### 하드 바인딩

```javascript
function calling() {
    console.log(this.msg);
}

let obj = {
    msg: 'kimson',
};

const hardBinding = function () {
    calling.call(obj);
}

hardBinding(); // 'kimson'
```

명시적 바인딩과 유사해보이지만 `calling` 호출 스택을 호출하는
`hardBinding`을 통해 명시적이면서도 유입되는 값 없이 고정된 객체를 바인딩해서 호출하므로 `hard binding`이라고 합니다. `Function`의 내장 함수인 `bind`가 이와 유사하게 역할을 한다고 합니다.

변경해보면 아래와 같은 예제가 될 것 입니다.

```javascript
function calling() {
    console.log(this.msg);
}

let obj = {
    msg: 'kimson',
};

const hardBinding = calling.bind(obj);

hardBinding(); // 'kimson'
```

## 상속 문제

```javascript
const Human = function (name, age) {
    this.name = name;
    this.age = age;
    this.calling = function (prop){
        console.log(this[prop]);
    };
}

const kimson = new Human('kimson', 30);
kimson.calling('name');
// 'kimson'
```

여기서 `calling`의 `this`는 `Human`을 가리킵니다. 위에서 `Human`은 `calling`메서드를 가지고 `property`명칭을 인자로 받아 `this`의 프로퍼티를 콘솔에 찍는 행위를 합니다. 점과 대괄호 표현식에 대해 잘 모르신다면 `dot notation`과 `bracket notation`으로 찾아보시기 바랍니다.

이렇게 단일로 객체를 관리할 때는 별 문제가 없지만 프로토타입 체인 등의 과정을 거치거나 다른 객체의 함수에 인자로 다른 객체 함수가 전달되어 실행되는 경우 `this`를 이해하지 못하면 나중에 어려움을 겪을 수 있다고 생각합니다.

```javascript
const Human = function (name, age) {
    this.name = name;
    this.age = age;
    this.calling = function (){
        console.log(this);
    };
}

const Student = function (name, age, schoolName, classNumber, grade) {
    Human.call(this, name, age);
    // 실행해보면 프로토타입 Human의 name과 age는 undefined이고
    // Student객체의 프로퍼티에 정의되는 것을 볼 수 있습니다.

    // 만일 프로토타입의 Human의 name, age에 저장하려면 this를 this.__proto__로 변경하면
    // Human의 프로퍼티에 적용되는 것을 볼 수 있습니다.

    this.schoolName = schoolName;
    this.classNumber = classNumber;
    this.grade = grade;
    this.test = function () {
        console.log(this);
    }
}

Student.prototype = Object.create(Human.prototype);
// 또는
Student.prototype = new Human;

Student.prototype.constructor = Student;

let kimson = new Student('kimson', 30, 'sch', 5, 3);

window.addEventListener('click', e => {
    kimson.test();
    kimson.calling();
});
```

이제 금방 정의한 `Human`을 `Student`가 상속 받았습니다. `Student`는 이제 `Human`의 기본 프로퍼티인 이름과 나이를 기본적으로 가지게 됩니다.

`Student`의 `prototype`을 `Human`의 `prototype`으로 설정하고 학생을 생성해서 각 객체에 넣어둔 메서드를 실행해보면 콘솔에 찍히는 `this`가 모두 학생을 가리키는 것을 볼 수 있습니다.

`Human` 내에서 정의된 `calling`는 왜 `Human`이 아니고 `Student`일까요? 여기서는 `this`가 기본 바인딩 규칙이 아닌 암시적 바인딩 규칙을 따랐습니다. 그 결과 `Student`를 가리키게 되었습니다. 그 이유는 `Student`의 프로토타입이 `new` 연산자를 통해 새로 생성된 `Human`프로토타입이 정의가 되고나서 `Student`의 인스턴스가 생겨났기 때문입니다. 즉, `Student`의 속성으로 `calling`메서드가 정의되었기 때문에 `this`가 `Student`를 가리킵니다.

## 모듈 패턴으로 보는 예제

다른 예제를 가져오겠습니다. 모듈 패턴으로 어떠한 기능을 짠다고 가정할 때 `MVC`가 있다고 가정하겠습니다.

```javascript

const Something = (function () {
    
    function Controller () {
        let models;

        this.init = function (model) {
            models = model;

            // 예제가 이 부분 입니다.
            window.addEventListener('click', this.firstCall);
        }

        this.firstCall = function () {
            this.getMyName();
            models.something();
        }

        this.getMyName = function () {
            console.log('My name is kimson!');
        }
    }

    function Model () {
        let views;

        this.init = function (view) {
            views = view;
        }

        this.something = function () { /** ... */ }
    }

    function View () {
        let options;

        this.init = function (option) {
            options = option;
        }
    }

    return {
        init(options) {
            const view = new View();
            const model = new Model();
            const controller = new Controller();

            view.init(options);
            model.init(view);
            controller.init(model);
        }
    }
})();

Something.init({});

```

제가 실제로 자주 사용하는 방식입니다. 위에 주석이 달린 예제 부분을 볼 때 `firstCall`이 이벤트에 걸려 클릭할 때마다 호출하게 되는데, `firstCall`내부의 `getMyName`은 제대로 작동할까요?

결론은 작동하지 않고 `not defined`에러를 냅니다. `Controller` 객체 내부의 `this`는 `Controller`를 가리킵니다.

그렇다면 `window`객체는 어떻게 구성되어 있을까요? `javascript`로 짰으니 별 다른 구성일 것이라 생각되지 않습니다. 즉, `window`객체의 `addEventListener`를 `api`를 보지 않고도 추측할 수는 있습니다. 인자 값으로 이벤트 타입과 함수를 받고, 필요에 따라 `boolean` 값을 받습니다.

추측하는 것이지만 `addEventListener` 내부 코드에서 `call`을 해서 `this`를 바인딩 하는 부분이 있다고 생각합니다. 실제로 찾아보니 누군가 작성한 `addEventListener`의 `pollyfill` 소스코드를 보니 `call`로 `window`객체로 덮어쓰도록 하게 되어 있습니다.

```javascript
function Window () {
    this.addEventListener = function (type, func, bool) {
        // ...
        func.call(this);
        // ...
    }
}
```

이해를 돕고자 대략적인 형태를 작성해보면, 위처럼 함수가 전달되고 실행될 것 입니다. 그렇다면 `func`가 아래처럼 정의된 내용이였다고 가정하겠습니다.

```javascript
function Window () {
    this.addEventListener = function (type, func, bool) {
        // ...
        (function () {
            this.getMyName();
            models.something();
        })();
        // ...
    }
}
```

이렇게 놓고보면 `window`객체에서 `this`를 얘기하게 됩니다. `window`객체에 `getMyName`이 없으므로(있다면 상관없지만) `not defined` 에러가 발생하게 됩니다.

어? 분명히 `Controller`객체에서 `this`는 `Controller`였는데? 이 내용은 `기본 바인딩`에 해당되는 이야기입니다. `this`는 기본적으로 전역 객체를 가리킵니다. `this`를 언급하는 함수를 단일로 호출하게 되면 문제 없습니다.

하지만 `A`객체에서 `B`객체의 함수를 실행하거나 또는 반대로 실행하는 경우 함수가 이동하면서 실행되기 때문에 `this`가 기본 바인딩 규칙을 따르게 됩니다. 단일 함수에서 `this`를 지칭하고 객체에서 그 단일 함수를 사용한다면 암시적 바인딩에 의해 잘 적용됩니다. 하지만 객체와 객체 사이에서 메서드끼리의 상호작용에서는 `window`가 바인딩 되는 기본 바인딩이 적용된다는 말을 하는 것 입니다.

그런데 조금 바꿔서 `window`가 아닌 `document.body.addEventListener`로 작성해서 실행하면 어떤 결과가 나올까요?

`document.body`의 `addEventListener` 또한 마찬가지일 것으로 생각되어 테스트 해보니 결과는 `this`가 `body` 엘레멘트를 가리키는 것을 볼 수 있습니다. 그렇다면 위의 설명과 다르게 암시적 바인딩 되는 것이 아닌가? 하겠지만 잠깐 언급했지만 `addEventListener`는 내부 구조적으로 `call`을 통해 명시적 바인딩을 하는 것으로 보입니다.

그것에 해당하는 근거는 아래의 예시로 보여드리겠습니다.

```javascript
const store = {
    doubleCalling: function (type, func) {
        console.log(type, this);
        func.call(this);
    }
}

function Controller () {
    let models;

    this.init = function (model) {
        models = model;

        // 예제가 이 부분 입니다.
        store.doubleCalling('click', this.firstCall);
    }

    this.firstCall = function () {
        console.log(this)
        this.getMyName();
    }

    this.getMyName = function () {
        console.log('My name is kimson!');
    }
}

const con = new Controller();
con.init();
```

위 코드는 `firstCall`함수를 주목해보면 내부의 `this`가 암시적 바인딩 될 것이라 기대하고 작성했지만, 결과적으로는 **기본 바인딩 규칙**이 적용됩니다. 그래서 `window`객체를 콘솔에 찍어줍니다.

그렇다면 위에서 언급한 `addEventListener`처럼 명시적 바인딩을 통해서 원했던 `Controller`가 `this`에 바인딩되면서 콘솔에 `Controller`가 찍히게 될 것 입니다.

```javascript
store.doubleCalling.call(this, 'click', this.firstCall);
```

명시적 바인딩으로 해당 함수 내에 작성한 `this`를 원하는 객체로 변경할 수 있는 점만 알아도 왜 `this`가 여기서는 `window`이고, 어디서는 변경이 안되는지 알 수 있을 것 입니다.

## 개인적인 견해

한 개발자 분이 작성한 글을 보고 `bind`, `call`, `apply`를 많이 쓰지 않는 것이 좋다는 이야기를 본 기억이 납니다.

내용이 자세히 기억이 나지 않지만 현재 사용하면서 느낀바로 의미를 보태어 본다면 이렇습니다.

코드를 작성하다보면 디버그하거나 오류를 찾아낼 때 프로퍼티나 메서드들을 거슬러 올라가 찾아내곤 합니다. 그 와중에 거슬로 올라왔지만 못 찾는 경우가 생깁니다. 물론 제가 이상하게 짠 탓이지만 가령 이러한 예제가 있습니다.

```javascript
function Test (type) {
    this.type = type;
    this.active = function () {
        return this.type;
    }
}

function OtherTest(type) {
    this.type = type;
    this.mytype = function () {
        console.log(this.active());
    }
}

const test1 = new Test('test1');
const otherTest1 = new OtherTest('other test1');

otherTest1.mytype.call(test1);
```

오류를 찾아내는 상황 등에서는 실행 해보면 금방 어떻게 돌아가는지 알기 쉽지만 여러 줄이고, 많은 파일로 쪼개져 관리된다면, `OtherTest`객체의 `mytype`이라는 프로퍼티 내부에 정의된 `this.active`가 도대체 어떤 객체의 `active`인지 알기 쉽지 않습니다.

여러 방법이 있겠지만 특정 경우를 제외하고는 가급적이면 쓰지않고 대안을 사용하는 것이 좋다고 생각을 합니다. `this`를 변수에 담아 사용하는 것 또한 방법 중 하나입니다.

어떤 의미로 그 분은 `bind`, `call`, `apply`의 사용을 지양했는지 잘 기억은 나지 않습니다만, 이러한 이유가 아닐까 하는 생각을 보탭니다.

포스팅 전체는 대략 한 달 주기로 내용을 점검하고 수정하려고 노력합니다. 틀린 내용이나 적절하지 않은 표현 등이 있다면 제보 바랍니다.

-----

📚 함께 보면 좋은 내용

[TrackMyStories::Javascript: The four rules of \{this\}.](https://dev.to/trackmystories/javascript-the-four-rules-of-this-42g0){:target="_blank"}

[MDN Web Docs::JavaScript object basics](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics#what_is_this){:target="_blank"}

[MDN Web Docs::Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain#performance){:target="_blank"}

[Rich-Harris::eventListener.js](https://gist.github.com/Rich-Harris/6010282){:target="_blank"}

[MDN Web Docs::Function.prototype.apply()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/apply){:target="_blank"}

[MDN Web Docs::Call stack](https://developer.mozilla.org/ko/docs/Glossary/Call_stack){:target="_blank"}