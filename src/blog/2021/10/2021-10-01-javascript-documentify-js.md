---
slug: "/javascript-documentify-js"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-10-01 20:30:32 +0900
title:  "[JAVASCRIPT] Documentify ( 문서화 ) 구현"
author: Kimson
categories: [ javascript ]
image: assets/images/post/covers/TIM-none.png
tags: [ document, generator, documentify, til, tim ]
description: "Documentify

현재 Github에 올려두었으니 관심 있으신 분은 사용해보시면 됩니다.

문서화

예전에 `JSDOC`을 이용해서 문서화를 해본 적이 있습니다. 하지만 아직 라이브러리를 만들어 낼 정도의 능력이 안되서 `JSDOC`을 구경만 했는데요.

문득 생각이 들었던 것이 `Nodejs` 없이 문서화를 할 수 있지 않을까 해서 둘러보다가 결국 만들어 보게 되었습니다."
featured: false
hidden: false
rating: 4.5
toc: true
profile: false
keysum: false
keywords: ""
published: true
---

# Documentify

> 현재 Github에 올려두었으니 관심 있으신 분은 사용해보시면 됩니다.

## 문서화

예전에 `JSDOC`을 이용해서 문서화를 해본 적이 있습니다. 하지만 아직 라이브러리를 만들어 낼 정도의 능력이 안되서 `JSDOC`을 구경만 했는데요.

문득 생각이 들었던 것이 `Nodejs` 없이 문서화를 할 수 있지 않을까 해서 둘러보다가 결국 만들어 보게 되었습니다.

## 주석 파싱

정규식의 힘을 빌리니 주석만 꺼내오는 것은 비교적 쉬웠습니다.

```javascript
let regex = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;

let comment = '/**
 * @param {string} str explain
 */';

 let parsingData = comment.match(regex);
 console.log(parsingData); // array
```

이런 식으로 주석만 골라내어 나머지는 map과 filter, 함수형 객체를 써가며 입맛대로 분류를 했습니다.

```javascript
const DataNodeType = function (type, dataNode) {
    this.type = type;
    this.name = (function(){
        for(let x of dataNode){
            if(x.name!=null && x.name.indexOf('function')>-1)
                return x.value;
            else return 'no name';
        }
    })();
    this.dataNode = dataNode;
    this.outText = dataNode.outText || null;
    (function (t) {
        parsingData.push(t);
    })(this);
}

const DataNode = function (n, v, i) {
    this.sep = (function () {
        n = n.replace(/[\@]/gm, '');
        v = v.replace(/[\{\}]/gm, '');
        if (v.indexOf(' ') > -1) {
            return [v.substring(0, v.indexOf(' ')), v.substring(v.indexOf(' '))]
        } else {
            return null;
        }
    })();
    this.outText = (function(){
        if((n+v).match(/[.]+/)){
            return n+' '+v;
        }
        return null;
    })();
    this.column = n == 'function' ? this.sep[0] : 'info';
    this.name = n || null;
    this.value = this.sep != null ? this.sep[0].trim() : v;
    this.text = this.sep != null && this.sep[1] ? this.sep[1] : null;
    this.index = i || 0;
}
```

위 코드는 현재 `mkDocumentifyJS`라 이름 붙이고 깃허브에 올려둔 코드의 일부 입니다.

두 가지의 `DTO`를 만들어 두고 집어 넣으면 알아서 뿌려지게 끔 해두었지만 작동은 되니까 일단 멈추었습니다...

## 데이터 문서화

문서화가 좀 시간이 걸렸습니다. 그냥 받은 데이터를 뿌려주는 것은 괜찮았는데 문제는 `css`와 `js(기능)`를 어떻게 손대어야 하나 해서 일단 쭉 만들었습니다.

모바일 환경과 pc환경에서 안깨질 정도만 손을 본 상태입니다.

## 결론

문서화에 대해 자세히 알지는 못하지만 오늘 만들어 보고 느낀 점은 주석을 가져와서 문자열을 마음대로 가지고 놀 수 있을 정도가 되면 쉽겠지만 아직은 역부족인 듯 합니다.

그리고 깃허브 저장소에 파일을 받고 싶으신 분은 아래의 링크를 참고하시면 됩니다!

-----

[mkDocumentifyJS :: devkimson](https://github.com/kkn1125/mkDocumentifyJS){:target="_blank"}