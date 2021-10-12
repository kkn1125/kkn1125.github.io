---
layout: post
date:   2021-10-12 17:23:12 +0900
title:  "[JAVASCRIPT] HTML 커스텀 태그 만들어 사용하기"
author: Kimson
categories: [ TIL, JAVASCRIPT ]
image: assets/images/post/covers/TIL-javascript.png
tags: [ custom, tag ]
description: "Custom Tag

이름을 뭐라 해야할지 몰라서 커스텀 태그라고 했습니다. 어떤 의미인지는 아래 예를 보면서 설명드리겠습니다.

`jekyll`의 `liquid`를 쓰다가 문득 `ruby`없이 `javascript`로 `html`을 파싱하고 내가 정한 약속된 부분을 읽어서 설정한 내용을 적용할 수 없을까 하는 생각에 공부할 겸 구현해봤습니다.

liquid에서는 `{{ ... }}` 이렇게 콧수염을 이중으로 씁니다. 혹은 `{% ... %}` 이렇게 `jsp`의 스크립틀릿태그의 종류가 있듯이 기능에 따라 조금씩 다르게 변화시켜서 사용합니다."
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

# Custom Tag

이름을 뭐라 해야할지 몰라서 커스텀 태그라고 했습니다. 어떤 의미인지는 아래 예를 보면서 설명드리겠습니다.

`jekyll`의 `liquid`를 쓰다가 문득 `ruby`없이 `javascript`로 `html`을 파싱하고 내가 정한 약속된 부분을 읽어서 설정한 내용을 적용할 수 없을까 하는 생각에 공부할 겸 구현해봤습니다.

liquid에서는 `{\{ ... }\}` 이렇게 콧수염을 이중으로 씁니다. 혹은 `{\% ... \%}` 이렇게 `jsp`의 스크립틀릿태그의 종류가 있듯이 기능에 따라 조금씩 다르게 변화시켜서 사용합니다.

## 태그 모양 정하기

```javascript
<html>
    <head>
    ...
    </head>
    <body>
        <script src="ksLoader.js"></script>

        {@ include nav.html @}

        {@
        site.author.name
        @}

        <h1>Test</h1>
        <a href="">{@site.web.url@}</a>

    </body>
</html>
```

위의 코드처럼 `{@ ... @}` 으로 감싸여진 내용을 분리해서 `site`라는 예약어를 최상위 네임으로 사용하여 `{@ site.author.name @}` 사용자의 이름을 가져오는 식으로 사용하려합니다.

## json 설정

`_config.json`으로 이름짓고 페이지를 구성하는데 필요한 정보들을 끌어오기 쉽게 정리해둡니다.

```json
{
    "site": {
        "baseurl": "",
        "author": {
            "name": "kimson",
            "email": "chaplet01@gmail.com",
            "blog": "https://kkn1125.github.com/",
            "portfolio": "https://kkn1125.github.io/portfolio/"
        },
        "web": {
            "baseurl": "",
            "url": "https://kkn1125.github.io",
            "name": "Devkimson",
            "title": "나를 표현하는 공간",
            "pagination": {
                "page": 6,
                "active": false
            },
            "markdown": {
                "active": true
            }
        }
    }
}
```

> `yml`을 사용하고 싶으시면 `npm`에서 `yml`을 파싱하는 기능을 받아 사용하시면 됩니다. `yml`을 `json`으로 변환하려 했지만 아직 능력이 안되서 보류해뒀습니다...

`json`파일은 읽어와서 객체로 만들기가 용이해서 `json`을 쓰겠습니다.

## 태그 읽어서 json내용 넣기

```javascript
'use strict';
let site = {};
let tmp = '';

!function readJson(){
    const url = "_config.json";
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', requestHandler);
    xhr.open('get', url);
    xhr.send();
}();

function requestHandler(ev){
    if(this.status == 200 || this.status == 201){
        if(this.readyState === 4){
            readJsonToObject(this.responseText);
        }
    }
}

function readJsonToObject(json){
    site = JSON.parse(json).site
}
```

`XmlHttpRequest` 대신에 `jquery`의 `ajax`를 써도 됩니다. `readJson`함수로 파일을 읽어 `site`라는 변수에 담도록 했습니다.

```javascript
let includes = '';

document.body.style.cssText = `
    display: none;
`;

!function (){ // 변환되는 모습을 감추기 위함
    let fakeLoad = setInterval(()=>{
        if(document.readyState=='complete'){
            document.body.style.cssText = ``;
            clearInterval(fakeLoad);
        }
    }, 100);
}();

window.addEventListener('load', ksRegex);

function readInclude(url){
    const path = "_include/"+url;
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', requestInclude);
    xhr.open('get', path, false);
    console.clear();
    xhr.send();
};

function requestInclude(ev){
    if(this.status == 200 || this.status == 201){
        if(this.readyState === 4){
            includes = this.responseText;
        }
    }
}

function ksRegex(ev){
    let replace = document.body.innerHTML.replace(/\{\@\s*[\s\w\.]*\n*\s*\@\}/gim, e=>{
        let commend = e.replace(/[\{\}\@]/gm, '').trim();
        if(commend.includes('include')){
           readInclude(commend.split('include ')[1]);
           return includes;
        } else if(commend == 'site.url') {
            return location.hostname;
        } else {
            return eval(`${commend}`);
        }
    });
    document.body.innerHTML = replace;
}
```

`line: 3`은 `{@ ... @}`가 먼저 로드되어 파싱된 내용이 변환되는 과정이 노출되어 가리는 목적으로 `display`를 `none`으로 했습니다.

`line: 7`은 `document`의 상태가 `complete`일 때 `css`를 초기화 시켜서 파싱된 내용이 적용 되었을 때 뿌리도록 합니다.

`line: 35`에서 `{@ ... @}`를 `replace`하는데 콜백함수로 명령문을 따로 공백없이 구하고 `include`예약어를 사용하면 `_include`폴더 안의 파일을 `readInclude`함수를 통해 받아와 뿌려주고, 나머지 `site.*`로 구분되는 명령어는 `eval`함수를 통해 값을 바로 호출해서 `return`합니다.

예를 들어 `site.author.name`가 `commend`에 담기면 리터럴 표현식과 `eval`을 합쳐서 `json`파일을 객체로 만든 `site`변수의 `author`, `name`을 가져와 리턴하게 됩니다.

![custom]({{site.baseurl}}/assets/images/post/customTag/custom01.png)

위의 이미지처럼 실행하면 따로 `nav.html`파일에 `bootstrap` 네비게이션을 두면 예약어를 통해 가져올 수 있고, `console`에 나오는 `site`변수에 있는 프로퍼티들을 커스텀 태그를 통해 가져와서 href나 클래스 등에서 사용할 수 있습니다.

아쉽게도 `script`안에서는 작동이 안되서 계속 생각 중 입니다.

여기까지 커스텀태그? 사용이었습니다.

-----