---
slug: "/javascript-public-data"
layout: post
modified: 2022-03-23 20:55:04 +0900
date:   2021-08-06 16:22:36 +0900
title:  "[JAVASCRIPT] 공공데이터로 페이징 처리하기"
author: Kimson
categories: [ javascript ]
tags: [공공데이터, pagination, json, til]
image: assets/images/post/publicData/public-cover.png
description: "공공데이터포털은 국가에서 보유하고있는 다양한 데이터와 오픈API를 공개하는 곳 입니다. 법적으로 개방하도록 되어 있는것 같습니다.

공부 중에 꼭 필요하면서도 만들기 귀찮은게 샘플데이터인데요. 이 데이터를 샘플데이터로 이용하면 참 편리해질 것 같습니다.

종류도 많으니 필요하신 분은 들어가셔서 참고하시면 되겠습니다."
featured: false
hidden: false
rating: 4.5
toc: true
profile: false
istop: true
keysum: true
keywords: '
window.location # 페이지의 주소 및 호스트 등을 알수있다.
_typeof 대상 # 대상의 타입이 무엇인지 반환
_XMLHttpRequest # 서버와 상호작용하기 위해 사용되며, 페이지 새로고침 없이 지정 URL에서 데이터를 받아옴 (ajax 참고)
_JSON.parse(string) # key-value형태로 작성된 텍스트를 객체로 변환한다.
_JSON.stringify(객체) # key-value형태의 객체를 문자열로 변환한다.
_조건?참:거짓 # 조건식이 true이면 "참"부분 아니면 "거짓"부분을 실행하는 삼항연산자
'
published: true
---

# 공공데이터 페이지 처리하기

## 공공데이터포털

> [공공데이터포털](https://www.data.go.kr/tcs/dss/selectDataSetList.do?dType=API&keyword=&detailKeyword=&publicDataPk=&recmSe=N&detailText=&relatedKeyword=&commaNotInData=&commaAndData=&commaOrData=&must_not=&tabId=&dataSetCoreTf=&coreDataNm=&sort=&relRadio=&orgFullName=&orgFilter=&org=&orgSearch=&currentPage=1&perPage=10&brm=%EB%AC%B8%ED%99%94%EA%B4%80%EA%B4%91&instt=&svcType=&kwrdArray=&extsn=&coreDataNmArray=&pblonsipScopeCode=){:target="_blank"}
> 은 국가에서 보유하고있는 다양한 데이터와 오픈API를 공개하는 곳 입니다. 법적으로 개방하도록 되어 있는것 같습니다.

공부 중에 꼭 필요하면서도 만들기 귀찮은게 샘플데이터인데요. 이 데이터를 샘플데이터로 이용하면 참 편리해질 것 같습니다.

종류도 많으니 필요하신 분은 들어가셔서 참고하시면 되겠습니다.

## 공공데이터 가져오기

이번에 참고한 자료는 대구광역시의 공연정보를 가져왔습니다.  

![대구 공연 정보]({{site.baseurl}}/assets/images/post/publicData/public01.png)

제가 열람한 데이터는 JSON포맷이라 JSON과 객체, Array를 써서 페이지 처리를 해보겠습니다.

## 공연 객체 및 리스트 만들기

html부터 작성해줍니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.js"
        integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous"></script>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
    
    <!-- main.css -->
    <link rel="stylesheet" href="main.css">
    <title>Document</title>
</head>
<body>
    <h1>대구광역시 공연 정보</h1>
    <hr>

    <div id="wrap" class="container">
        <!-- 공연정보가 카드형태로 들어갈 곳 -->
    </div>

    <div class="d-flex justify-content-center">
        <ul id="paging" class="pagination flex-wrap">
            <!-- 오늘의 주제 페이지 처리 버튼 부분 -->
        </ul>
    </div>

    <!-- Option 1: Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4" crossorigin="anonymous">
    </script>
</body>
</html>
```

덜 밋밋하게 부트스트랩을 가져왔습니다. <del>적어도 뭐라도 치장되야 열심히 한 티가 나서..</del>

![JSON내용]({{site.baseurl}}/assets/images/post/publicData/public02.png)

이렇게 나열되어 있는 정보를 파싱하여 봅시다.

```javascript

const LIMIT = 3;
// 페이지 내 목록 제한
let wrap = document.querySelector('#wrap');
// 카드리스트 컨테이너 노드
let paging = document.querySelector('#paging');
// 페이지처리 컨테이너 노드
let origin = window.location.origin;
// origin 경로
let path = window.location.pathname;
// 페이지 경로
// origin+path로 request.getParameter를 만들고 태그에 파라미터 넘기기 위함
let jsonList = new Array();
// Festv객체가 담길 배열 생성

let request = {
    // 자바와 달리 파라미터값 조회 기능이 없어
    // 만들어줍니다.
    window: window,
    // window프로퍼티에 전역객체 window를 저장합니다.
    // 객체함수의 함수 내에서 this가 객체 자신이 되어서 window가 잡히지 않습니다.
    getParameter: function(param){
        // 흔히 보던 함수명
        if(typeof param == 'string'){
            let map = new Map();
            let params = this.window.location.search.slice(1).split("&");
            // search에서 ?기호를 잘라내고 이후 파라미터 증가 대비하여 &기호로 나눕니다.
            for(let key of params){
                let sep = key.split("=");
                map.set(sep[0],sep[1]);
                // =기호로 다시 나누어 map에 key-value로 담습니다.
            }
            if(map.get(param)==undefined){
                // 타입 판별하기위해 간단히 넣었습니다.
                throw "파라미터가 존재하지 않습니다.";
            } else {
                return map.get(param);
                // 완료되면 map을 반환합니다.
            }
        } else {
            throw "형식이 잘못되었습니다.";
        }
    }
}

/** 
 * XMLHttpRequest로 사용했습니다. 
 * jquery의 ajax를 사용해도 좋습니다.
 * 간단하게 보여드리기 위해 동기식으로 가져와 구현하였습니다.
 * 참고로 XMLHttpRequest에서 open함수의 async = false는 Deprecate되었습니다.
 */
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(){
    if(xhr.readyState === xhr.DONE){
        if(xhr.status === 200 || xhr.status === 201){
            let num = 0; // 공연객체 인덱스 번호
            for(let key of JSON.parse(xhr.responseText)){
                console.log(key);
            }
        }
    }
}
xhr.open("GET","list.json",false);
xhr.send();
```

![파싱후]({{site.baseurl}}/assets/images/post/publicData/public03.png)

그나마 보기 좋게 객체형태로 나왔습니다. 여기서 이 객체를 필요한 정보만 골라내어 따로 Festv라는 객체를 만들어 리스트를 만들어 뿌리도록 하겠습니다.

```javascript
/**
 * 공연 정보 객체
 * @param {int} num 번호
 * @param {string} subject 제목
 * @param {string} content 내용
 * @param {string} place 장소
 * @param {string} start 시작
 * @param {string} end 종료
 * @param {string} type 종류
 * @param {string} payment 지불여부
 */
 function Festv(num,subject,content,place,start,end,type,payment){
    this.num = num+1; // 1번부터 번호를 매기기 위해 1증가
    this.subject = subject;
    this.content = content;
    this.place = place;
    this.start = start;
    this.end = end;
    this.type = type;
    this.payment = payment;
    this.template = function(){
        return ` 
        <div id="card" class="bg-light p-4 rounded-3 border border-primary mb-3">
            <h3 class="text-truncate" title="${this.subject}">${this.num}-${this.subject}</h3>
            <div class="my-3">${this.content==null?"내용이없습니다":this.content}</div>
            <div>${this.place}</div>
            <div>
                <span class="badge bg-info">${this.start}</span>
                <span class="badge bg-secondary">${this.end}</span>
            </div>
            <div class="fw-bold">${this.type}</div>
            <div>${this.payment}</div>
        </div>`
    };
}
```

객체 프로퍼티에 입력된 정보를 템플릿으로 리턴하는 함수를 만들었습니다. 다음은 방금 파싱한 데이터에서 필요한 부분을 `Festv`객체에 옮겨담아 리스트에 `push`하겠습니다.

```javascript
/** 
 * 변수들 ...
 * Festv 객체 ...
 */
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(){
    if(xhr.readyState === xhr.DONE){
        if(xhr.status === 200 || xhr.status === 201){
            let num = 0;
            for(let key of JSON.parse(xhr.responseText)){
                
                jsonList.push(
                    new Festv(
                        num, // 인덱스 번호
                        key.subject, // 제목
                        key.content, // 내용
                        key.place, // 장소
                        key.start_date, // 시작일
                        key.end_date, // 종료일
                        key.event_gubun_name, // 종류
                        key.pay_gubun_name // 지불여부
                    )
                );
                
                num++;
                // 인덱스 증가
            }
        }
    }
}
xhr.open("GET","list.json",false);
xhr.send();

jsonList.reverse();
// 배열 순서를 거꾸로 바꿔야 최신 글이 나오게 됩니다.
// xhr구문 위에 작성할 경우 요청 전이라 list가 빈 상태입니다.
// xhr로 json요청해야 내용이 날아오기 때문에 구문 아래에 적습니다.

let total = jsonList.length / LIMIT;
// 전체 공연 개수에 3(LIMIT)을 나누면 잘 페이지 수가 총 나옵니다
let page = request.getParameter("page");
// 파라미터를 가져오는 함수로 page값을 가져옵니다.
let end = LIMIT * page;
let start = (page-1) * LIMIT;
// Array.slice(시작인덱스번호=start, 잘라낼번호=end);
```

이제 공연 객체를 차곡차곡 쌓았으니 wrap노드에 뿌리면 카드가 쭉 나옵니다.

![리스트]({{site.baseurl}}/assets/images/post/publicData/public04.png)

리미트 개수를 3개로 지정하였기 때문에 총 93개 항목을 나누어 31개의 페이지가 생성되게 구현하겠습니다.

```javascript
let pagination = jsonList.slice(start,end);

for(let key in pagination){
    wrap.innerHTML += (pagination[key].template());
}

paging.innerHTML = // 페이지 감소 버튼입니다.
// 페이지가 1페이지이면 더이상 감소하지 않게 합니다.
// =입니다. +=아닙니다. 
`
<li class="page-item">
    <a href="${origin+path}?page=${page==1?page:parseInt(page)-1}" class="page-link">&lt;&lt;</a>
</li>
`;

for(let i=0; i<total; i++){
if(i>(total/2)-5 && i<(total/2)+5){
        // 화면을 벗어나서 ... 처리했습니다.
        // if 구문 지우면 전체 페이지가 나옵니다.
        if(i<(total/2)-4){
            paging.innerHTML += `
            <li class="page-item fw-bold">
                ...
            </li>
            `;
        }
        continue;
    } else {
        // 이 부분만 있어도 됩니다.
        paging.innerHTML += `
        <li class="page-item${i+1==page?" fw-bold":""}">
            <a href="${origin+path}?page=${i+1}" class="page-link">${i+1}</a>
        </li>
        `;
    }
}

paging.innerHTML += // 페이지 증가 버튼입니다.
// 페이지가 total값이면 getParameter 받은 값으로 유지합니다.
`
<li class="page-item">
    <a href="${origin+path}?page=${page==total?page:parseInt(page)+1}" class="page-link">&gt;&gt;</a>
</li>
`
```

![완성]({{site.baseurl}}/assets/images/post/publicData/public-move.gif)

페이지 처리를 해보았는데요. 다음에는 객체에 페이지처리하는 메소드를 추가하여 객체로만 처리하는 것을 준비해보도록 하겠습니다. 사용된 함수들은 [페이지 상단](#keywords)에 정리되어 있습니다.