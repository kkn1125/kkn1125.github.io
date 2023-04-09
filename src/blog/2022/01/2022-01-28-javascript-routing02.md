---
slug: "/javascript-routing02/"
layout: post
modified: 2022-03-14 00:09:35 +0000
date:   2022-01-28 16:52:37 +0000
title:  "[JAVASCRIPT] Vanilla JavaScript로 SPA를 구현해보자 02"
author: Kimson
categories: [ javascript ]
image: /images/post/covers/TIL-javascript.png
tags: [ spa, router, vanilla js, import, tim ]
description: "Router 구현

작년 12월 즈음 spa에 관한 이야기를 했었습니다. 그 당시 구현 방식에 대해 짧게 다루어 보았는데요. 궁금하신 분은 링크를 참조하시기 바랍니다. 지금보니 쓸데없이 메서드가 많은 느낌이 들어서 개편?하고자 새롭게 `rotuer`를 만들게 되었습니다."
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

# Router 구현

작년 12월 즈음 spa에 관한 이야기를 했었습니다. 그 당시 구현 방식에 대해 짧게 다루어 보았는데요. 궁금하신 분은 <a class="text-danger" href="/javascript-routing01">[링크]</a>를 참조하시기 바랍니다. 지금보니 쓸데없이 메서드가 많은 느낌이 들어서 개편?하고자 새롭게 `rotuer`를 만들게 되었습니다.

처음에는 테스트로 시작했지만 만들고보니 뿌듯하면서도 아직 손 볼 곳이 많습니다.

## import와 export 사용

`nodejs`를 사용해야만 가능할 줄 알았던 `import`와 `export`가 단지 `script`태그에 `type`속성 값을 `module`로만 주면 사용가능 한 줄 최근에야 알았습니다.

`import`와 `export`를 사용하면 장점이 생기는데요. 객체를 사용하면 해당 객체는 데이터가 기억되고 있으면서도 다른 `js`파일에서 직접 사용할 수 없다는 장점이 있습니다.

변수를 지정하거나 메서드를 지정할 때 전역으로 남게 되는 경우가 현저히 줄어들게 됩니다. 단점은 경로 설정을 잘못하면 무지하게 헤맬 수 있습니다 😥

`import`와 `export`를 테스트하면서 알게 된 이점과 단점으로 경로 중복 최소화를 목표로 해야했습니다.

`core`라는 핵심 기능들이 담긴 툴박스를 두고 페이지 등록, 서브페이지 등록, 모듈 등록 세 가지를 염두에 두고 개발을 진행했습니다.

## 3 + 1가지 설정

설정을 더 간소화하기 위해 `import`를 `promise`로 받으려하는데 아직 능력이 부족하여 잘 되지 않습니다.

### core bus 설정

코어 버스는 나름의 이름을 임시로 붙인 것입니다. 코어 버스를 사용하는 이유는 단지 `cdn` 경로가 길어서 함축하고자 하는 이유입니다. 어느 영역에나 `cdn` 경로를 사용하면 너무 지저분해이기도 하고 버전 테스트에서 하나의 파일에서만 경로를 바꿔주면 되기 때문입니다.

```javascript
// coreBus.js
import { Router, Route, Layout, App } from '/cdn/path'
export { Router, Route, Layout, App }
```

`import` 후 바로 `export`해줍니다. 사용방식은 `vue`와 유사하지만 `vue`를 언급하기에는 너무나도 허접해서 민망합니다 :(

이렇게 export한 내용을 여러 파일에서 끌어와 사용할 요소만 가져다 쓰면 됩니다.

### router.js 설정

페이지 설정의 핵심입니다. 라우터 설정하고 페이지의 템플릿을 설정하며 페이지 공통요소(nav, footer...)등을 설정합니다.

`router`는 아래와 같이 설정합니다.

{%raw%}

```javascript
// router.js
import {Router} from './core/core.js'

import Home from './views/page/home.js'
import nav from './views/module/nav.js'

// 페이지 설정
Router.setPage('pageHash', Home);

// 모듈 설정
Router.setModulePage('templateModuleName', nav);

// page는 약속된 명칭이기 때문에 바꾸면 안됩니다.
// page부분에는 알아서 페이지가 교체되어 들어갑니다.
// templateModuleName는 모듈설정에서 지정한 이름을 사용하면 됩니다. 
Layout.template(`
    {{templateModuleName}}
    {{page}}
`);
```

{%endraw%}

### route 설정

이제 페이지 설정이 끝났으니 페이지를 생성해주고 페이지를 `hash`방식으로 조작가능하게 해주는 `route` 설정입니다.

```javascript
import {Router, Route, Layout} from './core/core.js'
import router from './routes/router.js'

Route.init({
    el: '#app', // index.html에 <div id="app"></div>을 만들어 두어야 합니다.
    Layout,
    router, // 대소문자 주의해주세요.
})
```

### 각 페이지 설정

이제 페이지만 설정해주면 끝이 납니다. `router.js`에서 봤던 import로 각 페이지들 불러오는 것을 작동되도록 하기 위해서입니다.

```javascript
import {Router} from '../../core/core.js'

import homesub from './home.sub.js'

homesub.parent = '#home';
Router.setPage('homesub', homesub);

export default {
    title: 'Home',
    // 1. 즉시 실행함수 (onclick 등 이벤트 속성 사용시)
    counter: `(()=>{
        if(isNaN(this.innerHTML)) this.innerHTML = 1;
        else this.innerHTML = parseInt(this.innerHTML)+1
    })()`,
    // 2. 구문만 (onclick 등 이벤트 속성 사용시)
    counter: `if(isNaN(this.innerHTML)) this.innerHTML = 1;
        else this.innerHTML = parseInt(this.innerHTML)+1`,
    // 3. 클로저 사용 (onclick 등 이벤트 속성 사용시)
    counter: `{
        if(isNaN(this.innerHTML)) this.innerHTML = 1;
        else this.innerHTML = parseInt(this.innerHTML)+1
    }`,
    capitalize: () => this.title.charAt(0).toUpperCase() + this.title.slice(1),
    module: {
        // 페이지에 종속된 하위 페이지를 만들기 위함
        homesub: Router['homesub']
    },
    template(){ // 모듈, 페이지, 종속 페이지 모두 동일하게 있어야합니다. (필수)
    // return 에서 템플릿 리터럴 안에 해당 default에서 지정한 속성을 this로 사용할 수 있습니다.
        return `
            <div>${this.title}</div>
            <div>${this.capitalize()}</div>
            <div onclick="${this.counter}">0</div>
        `
    }
}
```

`default`내에 작성한 속성은 `return`시에 `this`로 가져와 사용할 수 있습니다. `this.title` 혹은 메서드인 `this.capitalize()` 또한 사용 가능합니다.

`default`의 속성중 메서드를 `onclick`속성에서 사용할 수 있으며 해당 메서드는 `this`가 태그로 바인드됩니다.

`module`은 페이지를 등록하여 하위 페이지로 사용하기 편하게 합니다. 위에서 `setPage`로 등록한 페이지를 `module`에 넣습니다. 그리고 페이지에 `parent` 속성에 상위 파일의 해쉬경로를 넣습니다.

응용해서 여러가지를 할 수 있습니다. `nav.js`를 만들어 하위 페이지를 안보이도록 하고 싶으시면 아래에 제가 위키에 사용한 방식을 참고하시면 됩니다.

이후에는 이 작업을 `setPage`에서 처리하도록 할 예정입니다 :\)

조금이나마 흥미롭다면 👏

-----

📚 함께 보면 좋은 내용

[devkimson::[JAVASCRIPT] Vanilla JavaScript로 SPA를 구현해보자 01](/javascript-routing01)

[devkimson::router js repository](https://github.com/kkn1125/router)