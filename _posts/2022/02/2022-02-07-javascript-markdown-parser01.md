---
layout: post
modified: 2022-02-08 21:38:38 +0900
date:   2022-02-07 19:53:39 +0900
title:  "[JAVASCRIPT] Markdown Parser를 만들어보자 (특히 리스트)"
author: Kimson
categories: [ JAVASCRIPT, TIL ]
image: assets/images/post/covers/TIL-javascript.png
tags: [ markdown, md, parser ]
description: "Markdown Parser를 만들어보자

마크다운을 HTML로 파싱해주는 라이브러리가 여러가지 있지만 한 번 구현해 보면 공부가 되겠다 싶어 기록합니다.

이전에 `router`를 구현해서 포스팅 한 적이 있는데요. `router`를 응용해서 `wiki`페이지를 만들어 페이지를 관리하고 있습니다.

그런데 페이지 내용을 리터럴 템플릿으로 태그를 하나하나 작성하기가 번거롭기도 하고 시간이 많이 들어 마크다운을 파싱하여 내용을 관리하는게 효율적일 것 같아 필요하게 되었습니다."
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

# Markdown Parser를 만들어보자

> 내용이 수정 되었습니다 !
> 코드에 오류가 있어서 고쳤습니다. 계층형으로 리스트화 되지 않던 부분 완전 작동하도록 수정했습니다.

마크다운을 `HTML`로 파싱해주는 라이브러리가 여러가지 있지만 한 번 구현해 보면 공부가 되겠다 싶어 기록합니다.

이전에 `router`를 구현해서 포스팅 한 적이 있는데요. `router`를 응용해서 `wiki`페이지를 만들어 페이지를 관리하고 있습니다.

그런데 페이지 내용을 리터럴 템플릿으로 태그를 하나하나 작성하기가 번거롭기도 하고 시간이 많이 들어 마크다운을 파싱하여 내용을 관리하는게 효율적일 것 같아 필요하게 되었습니다.

## Parser 개요

개인적으로 `ul`과 `ol`, `blockquote` 이 세 가지 기호를 제외한 다른 기호를 파싱해서 `html`로 변환하는 작업은 간단하다고 생각합니다.

`ul`과 `ol`, 그리고 `blockquote`는 계층적으로 래핑되어야 하기 때문에 다른 블로그를 둘러보아도 리스트화에 대한 내용을 찾기가 힘들었습니다.

### Parser 구현 방식

제가 생각한 파싱 범위는 아래와 같습니다.

1. 텍스트 전체 파싱
2. 문단 파싱
3. 한 줄 파싱

여러 방법이 있겠지만 저는 2번을 택했습니다. 나머지 기호에 관해서는 아래에 계속해서 설명하겠습니다.

- `heading`은 `#`의 개수로 헤딩 태그를 만들어주면 완성입니다.
- `paragraph`는 `h1 ~ h6`과 `img`, `a`, `ul`, `ol`, `blockquote`외에 라인들을 `p`태그로 감싸면 됩니다.
- `img`와 `a`는 유사하게 진행되는데 대괄호와 소괄호에 작성되는 텍스트를 정규표현식으로 긁어오면 됩니다.
- `ul`과 `ol`, `blockquote`는 개인적으로 헬이었습니다.

#### 텍스트 전체 파싱

처음에는 정규표현식으로 어느정도 만들어 지는 줄 알았습니다. 하지만 `ol`과 `ul`, `blockquote`가 여전히 해결이 안됐습니다.

정규식을 적용하려면 정규식이 판별하는 범위를 더 좁힐 필요가 있습니다. 유사한 텍스트가 있다면 그것마저 변경시키기 때문에 한 줄 씩 읽는 것을 다음으로 진행했습니다.

#### 한 줄 파싱

한 줄 씩하면 정규식이 판별하는 구역이 좁아지긴 하지만 여전히 `ol`과 `ul`등을 리스트화하려면 문단을 읽으면서 한 줄 씩 읽어내려가야 적합하다고 생각했습니다.

한 줄 씩 읽어들이면 앞 뒤 문맥을 코드를 짜서 비교하거나 해야하기 때문에 일이 더 많아질 것 같아 문단을 읽기로 했습니다.

#### 문단 파싱

{%raw%}

문단을 파싱하기 위해 정한 기준은 엔터 (\n)가 두번 이상 들어간 것을 기준으로 했습니다.

```javascript
import mdContents from './markdown/contents.js'

const Markdown = (function (){
    function Parser(){
        let md;
        let block;
        let converted;

        this.init = function (contents){
            md = contents;

            this.parsing();
        }

        this.parsing = function (){
            this.mdToBlock();
            // this.heading();
            // this.images();
            // this.anchors();
            // this.listify();
            // this.paragraphs();
            // this.br();
            // this.font();
        }

        this.mdToBlock = function (){
            block = md.split(\/\n\/gm);
            converted = [...block];
        }
    }

    return {
        parse(contents){
            const parser = new Parser();
            return parser.init(contents);
        }
    }
})();

Markdown.parse(mdContents);
```

{%endraw%}

먼저 내용을 문단으로 나누어 배열을 복사하고 `block`에서 파싱된 내용을 파싱하자마자 지우고 `converted`에 같은 인덱스에 넣는 방법으로 파싱합니다.

해당되는 기호들의 중복 파싱을 하지 않기 위해서 입니다.

### Heading

{%raw%}

```javascript
this.heading = function (){
    block.forEach((line, id)=>{
        if(line.match(\/^\#\/g)){
            converted[id] = line.replace(\/^(\#+)(.+)\/g, (o,$1,$2)=>{
                return `<h${$1.length}>${$2.trim()}</h${$1.length}>`
            });
            block[id] = '';
        }
    });
}
```

{%endraw%}

`ol`, `ul`, `blockquote`를 제외한 나머지를 이런 식으로 변환시키면 `converted`에 변환된 내용만 담기게 되므로 나중에 `join`해서 화면에 렌더해주면 됩니다. 처음 만들어 보시는 분들은 나머지 기능은 한 번 구현해보시면서 익혀보시길...

### ol과 ul, blockquote

제일 관건이라 생각되는데요. 어떻게 순차적으로 읽고 래핑하면서 `ol`인지 `ul`인지를 판별하는지가 어려웠습니다.

나름의 가닥을 잡은 것을 기록하겠습니다.

여러 시도를 해봤지만 배열을 사용해서 스택자료처럼 만드는게 가장 근접한 방식이 아닌가 생각합니다.

{%raw%}

```javascript
this.listify = function (){
    let indent = 0, before = -1;
    let isDouble = 1;
    let types = [];

    block.forEach((line, id)=>{
        if(line.match(\/\s*\-\/gm)){
            convertedHTML[id] = line.split(\/\n\/gm).filter(x=>x!='').map(li=>{
                let temp = '';
                let space = li.match(\/(^\s*)\/)[1];
                
                indent = space.length;

                if(indent>before){ // 들여쓰기가 늘어날 때
                    let gap = 0;

                    if(indent > 0 && before == -1){
                        gap = parseInt(indent/4) + 1;
                        // 처음 시작하는 리스트가 얼마나 래핑되어야 하는지
                    } else {
                        gap = parseInt((indent - before)/4)+(before>-1?0:1);
                        // 처음 래핑 외에 gap을 그대로 사용합니다.
                    }

                    for(let i=0; i<gap; i++){
                        // ... ol과 blockquote도 분기문으로 types에 push
                        if(li.match(\/^\s*\-\/gm)){
                            array.push('ul');
                        }
                        temp += `<${types[types.length-1]}>`;
                    }
                } else if(indent < before){ // 들여쓰기가 이전보다 적을 때
                    let gap = parseInt((before - indent)/4);
                    for(let i=0; i<gap; i++){
                        temp += `</${types.pop()}>`;
                    }
                }

                temp += `<li>${li.replace(\/^\s*\-\s*(.+)\/gm, '$1')}</li>`;
                
                before = indent;
                return temp;
            }).join('\n');
            while(types.length>0){ // 나머지 태그 닫기
                convertedHTML[id] += `</${types.pop()}>`;
            }
            block[id] = '';
        }
        // 초기화
        indent = 0;
        before = -1;
        types = [];
    });
}
```

{%endraw%}

이렇게 배열에 담고 래핑된 횟수만큼 닫아주고를 반복시키면 쉽게 계층형 리스트화를 할 수 있습니다. 리스트화할 때 `ol`인지 `ul`인지 `blockquote`인지 판별하는 정규식을 짜고 `types`에 넣어주면 래핑되는 태그와 닫는 태그가 알아서 들어가게 됩니다.

조건식에서 어느정도 래핑이 오버되거나 하면 몇 단계는 생략되도록 되어 있습니다. 사용하고자 목적에 따라 분기문을 변경해서 사용하면 되겠습니다.

### 요약

1. 마크다운 파싱은 문단 단위로 하는 것이 좋다고 생각합니다.
2. 계층형 요소가 있다면 스택자료형으로 래핑하는 방법이 단순하고 조작이 쉽습니다.
3. 공부차원에서 시도했지만 라이브러리 사용하는게 최고입니다. 😅

-----

📚 함께 보면 좋은 내용

[위키백과::스택](https://ko.wikipedia.org/wiki/%EC%8A%A4%ED%83%9D '위키::스택')
{:target="_blank"}