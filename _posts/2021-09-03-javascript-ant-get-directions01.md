---
layout: post
date:   2021-09-02 13:35:47 +0900
title:  "[JAVASCRIPT] 개미 길 찾기 - 파이썬 문제"
author: Kimson
categories: [ TIL, JAVASCRIPT ]
tags: [python, ant, getdirection]
image: assets/images/post/covers/TIL-javascript.png
description: ""
featured: true
hidden: false
rating: 4.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
---

# 파이썬 문제 자바스크립트 변환

코드업의 Python 기초 100제 중 6098번 문제를 풀던 중에 html에서 보이도록 만들어보고자 하는 생각에 코드를 다시 곱씹어 볼 겸 자바스크립트로 옮겨서 만들기 시작했습니다.

## 코드를 옮기자

```html
<div class="container">
    <table class="table text-center mx-auto">
        <thead>
            <tr>
                <th colspan="10">길찾기</th>
            </tr>
        </thead>
        <tbody id="list">

        </tbody>
    </table>
</div>
```

html은 tbody에 2차 배열로 tr, td를 뿌릴 것 임으로 틀만 짜줍니다.

파이썬 문제에서는 개미가 길을 찾을 지도를 입력으로 받습니다. 문제에서 `10 x 10` 크기였습니다.

테스터케이스의 입력으로는 총 10번, 1번에 10개의 수가 담겨있는 것입니다.

자바스크립트로 구현한 경우는 제가 지도를 임의로 넣기에 문자열을 바로 가공했습니다.

```javascript
/*
또 다른 예제
1 1 1 1 1 1 1 1 1 1
1 0 0 1 0 0 0 0 0 1
1 0 0 1 1 1 0 0 0 1
1 1 0 0 0 1 0 1 0 1
1 0 1 1 0 0 0 0 0 1
1 0 0 1 0 1 0 1 0 1
1 0 0 0 0 1 0 1 0 1
1 0 0 0 0 1 0 0 0 1
1 0 0 0 0 0 0 0 0 1
1 1 1 1 1 1 1 1 1 1
*/
let arr = `
1 1 1 1 1 1 1 1 1 1
1 0 0 1 0 0 0 0 0 1
1 0 0 1 1 1 0 0 0 1
1 0 2 0 0 0 0 1 0 1
1 0 0 0 0 0 0 1 0 1
1 0 0 0 0 1 0 1 0 1
1 0 0 0 0 1 2 1 0 1
1 0 0 0 0 1 0 0 0 1
1 0 0 0 0 0 0 0 0 1
1 1 1 1 1 1 1 1 1 1
`
.replaceAll('\n', ' ')
.split(' ')
.filter(x => {
    if (x != '') {
        return true;
    }
});
```

`1`은 벽(장애물), `0`은 지나다닐 수 있는 길, `2`는 먹이 입니다.

규칙을 이렇습니다.

1. 장애물을 만나면 통과하지 못하고, 막히지 않은 방향으로 전진한다.
2. `0`을 지나면 지난 자리마다 `9`로 변환시켜 지나온 자리를 표시한다.
3. `2`와 닿으면 먹이를 먹고 `9`로 바꾼 뒤 길찾기를 종료한다.
4. 가던 중 모서리에 도달하여 움직이지 못하면 길찾기를 종료한다.

룰은 단순합니다. 어제 찾으면서 `bfs`와 `dfs`를 알게 되었는데 이는 추후에 알아보고 자동으로 길을 사방으로 탐색하도록 하여 다시 포스팅하려합니다.

이어서 파이썬 코드를 자바스크립트로 변환 후 `html` `table`에 색칠하여 뿌려봅시다.

```javascript
// 입력 받은 지도를 2차배열에 담음
const limit = 10; // 지도 범위 10 x 10
let d = Array.from(Array(limit + 1), () => new Array(limit + 1));
for(let q=0; q<limit; q++){
    let sl = arr.slice(((q+1)-1)*limit, (q+1)*limit);
    for(let j=0; j<limit; j++){
        d[q+1][j+1] = sl[j];
    }
}

// #list에 뿌림
let [x, y] = [2,2];
const list = document.getElementById('list');
for(let q=0; q<limit; q++){
    let tr = document.createElement('tr');
    
    for(let j=0; j<limit; j++){
        let td = document.createElement('td');
        if(d[q+1][j+1]==1){
            td.style = 'background-color: rgba(31, 19, 12, 0.925); width: 50px';
            td.dataset.num=1
            tr.appendChild(td);
        } else if (d[q+1][j+1]==2){
            td.style = 'background-color: rgba(236, 121, 54, 0.1); width: 50px';
            td.dataset.num=2
            tr.appendChild(td);
        } else if (d[q+1][j+1]==0){
            td.style = 'background-color: rgba(157, 247, 130, 0.459); width: 50px';
            td.dataset.num=0
            tr.appendChild(td);
        }
        if (q+1==x && j+1==y){
            td.setAttribute("class", 'ant');
            tr.appendChild(td);
        }
    }
    tr.style="height: 50px";
    list.appendChild(tr);
}
```

![ant]({{site.baseurl}}/assets/images/post/getDirection/ant01.png)
<span class="text-muted badge">- <em>CSS 코드는 맨 아래 올려두겠습니다.</em></span>

분홍색 칸이 먹이이고, 갈색이 벽, 초록이 갈 수 있는 곳, 동그란 녀석이 개미입니다.

숫자 지도보다 역시 색감있고 네모네모한게 보기 좋은 것 같습니다.

이어서 길을 제대로 찾아 경로가 잘 뜨는지 보겠습니다.

```javascript
let speed = 200; // 개미 길 찾는 속도
let find = setInterval(pathfind, speed);
let xl = false
let yl = false
// while (true){
function pathfind(){
    if (x >= 9 && y >= 9){
        clearInterval(find);
        setTimeout(()=>{
            alert("개미가 갈 곳이 없습니다.");
        }, 300);
        // break
    }
    if (d[x][y] == 0){
        d[x][y] = 9;
        list.children[x-1].children[y-1].style = 'background-color: rgba(85, 231, 231, 0.459)';
    } else if (d[x][y] == 2){  // x방향 장애물 피하기
        d[x][y] = 9;
        list.children[x-1].children[y-1].style = 'background-color: rgba(85, 231, 231, 0.8)';
        clearInterval(find);
        setTimeout(()=>{
            alert("개미가 먹이을 찾았습니다.");
        }, 300);
        // break;
    } else if (d[x][y+1] == 0){  // y방향 전진
        y += 1;
    } else if (d[x][y+1] == 1){
        x += 1;
        if(d[x][y]==1){
            clearInterval(find);
            setTimeout(()=>{
                alert("개미가 막다른 길에 막혔습니다.");
            }, 300);
        }
    } else if (d[x+1][y] == 1){  // y방향 장애물 피하기
        y += 1;
        if(d[x][y]==1){
            clearInterval(find);
        }
    } else if (d[x][y+1] == 2){
        y += 1;
    } else if (d[x+1][y] == 2){
        x += 1;
    }
}
```

> 아직 파이썬 문제를 풀고 계시는 분이라면 이 코드를 참고하기 보다 다른 코드를 참고바랍니다. html에 연결시키다보니 출제된 문제를 푼 코드와 조금 다릅니다.

한 가지 작동방식에서 아쉬운 점은 방향성이 단 두 가지 뿐이라 길찾기라는 이름을 붙이기도 애매 합니다. 하지만 이렇게라도 만들어보니 사방으로 탐색할 수 있도록 하기 위해 무엇이 필요한지는 감이 옵니다.

아래는 테스터 케이스를 주어 반복되는 예제를 올려두었습니다. 보고 참고 바랍니다. 소스코드는 지금 포스트의 내용을 조합하면 작동합니다.

-----

> 정리하면서 코드를 조금 수정하여 아래에 작동 예시를 올렸습니다. 보기에 너무 밋밋해서 이미지라도 넣어봤습니다.

<hr style="color: coral !important;">

### 길찾기

<style>
    td{
    position: relative;
}

.table{
    width: auto;
}

td::after{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.1);
    opacity: 0;
    transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    -webkit-transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    -moz-transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    -ms-transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    -o-transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}
td:hover::after{
    opacity: 1;
    color: rgba(85, 231, 231, 0.459)
}

.ant:before{
    content: "";
    background-image: url({{site.baseurl}}/assets/images/post/getDirection/ant00.png);
    background-size: contain;
    background-repeat: no-repeat;
    font-size: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    width: 60%;
    height: 60%;
    opacity: 1;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
}

.ant.moved:before{
    opacity: 0 !important;
}
</style>

<table class="table text-center mx-auto">
    <tbody id="list">
    </tbody>
</table>
<div class="px-5">
    <button onclick="start()" class="btn btn-outline-info" style="z-index:10;">Start</button>
    <button onclick="stop()" class="btn btn-outline-danger" style="z-index:10;">Stop</button>
</div>

<script>
    let count = 0;
let mapList = [];
mapList.push(`
1 1 1 1 1 1 1 1 1 1
1 0 0 0 0 0 0 1 0 1
1 1 0 1 1 1 0 0 0 1
1 0 1 1 0 0 0 1 0 1
1 0 2 0 0 1 0 1 0 1
1 0 0 1 1 1 0 1 2 1
1 0 0 0 0 1 1 1 0 1
1 0 0 0 0 1 0 0 0 1
1 0 0 0 0 0 0 0 0 1
1 1 1 1 1 1 1 1 1 1
`);
mapList.push(`
1 1 1 1 1 1 1 1 1 1
1 0 0 1 0 0 0 0 0 1
1 0 0 1 1 1 0 0 0 1
1 0 2 0 0 0 0 1 0 1
1 0 0 0 0 0 0 1 0 1
1 0 0 0 0 1 0 1 0 1
1 0 0 0 0 1 0 1 0 1
1 0 0 0 0 1 0 2 0 1
1 0 0 0 0 0 0 0 0 1
1 1 1 1 1 1 1 1 1 1
`);
mapList.push(`
1 1 1 1 1 1 1 1 1 1
1 0 0 1 0 0 0 0 0 1
1 0 1 1 1 1 0 0 0 1
1 0 2 0 0 0 0 1 0 1
1 0 0 0 0 0 0 1 0 1
1 0 0 0 0 1 0 1 0 1
1 0 0 0 0 1 0 1 0 1
1 0 0 0 0 1 0 0 0 1
1 0 0 0 0 0 0 0 0 1
1 1 1 1 1 1 1 1 1 1
`);
mapList.push(`
1 1 1 1 1 1 1 1 1 1
1 0 0 1 0 0 0 0 0 1
1 0 0 1 1 1 0 0 0 1
1 0 0 0 0 0 0 1 0 1
1 0 1 1 0 0 0 1 0 1
1 0 1 0 0 1 0 1 0 1
1 0 1 1 0 1 0 1 0 1
1 0 0 1 0 1 0 0 0 1
1 0 0 1 0 0 0 0 0 1
1 1 1 1 1 1 1 1 1 1
`);

const limit = 10;
let [x, y] = [2,2];
const list = document.getElementById('list');

let arr = getArr(mapList[count]);

function getArr(data){
    let ar = data
    .replaceAll('\n', ' ')
    .split(' ')
    .filter(x => {
        if (x != '') {
            return true;
        }
    });
    let tmpa = Array.from(Array(limit + 1), () => new Array(limit + 1));
    for(let q=0; q<limit; q++){
        let sl = ar.slice(((q+1)-1)*limit, (q+1)*limit);
        for(let j=0; j<limit; j++){
            tmpa[q+1][j+1] = sl[j];
        }
    }
    return tmpa;
}

draw(arr);

// let d = setArr(arr);
function draw(d){
    for(let q=0; q<limit; q++){
        let tr = document.createElement('tr');
        
        for(let j=0; j<limit; j++){
            let td = document.createElement('td');
            if(d[q+1][j+1]==1){
                // rgba(31, 19, 12, 0.925);
                td.style = `
                background-image: url({{site.baseurl}}/assets/images/post/getDirection/stone.png);
                background-size: cover;
                background-repeat: no-repeat;
                width: 50px;`;
                td.dataset.num=1
                tr.appendChild(td);
            } else if (d[q+1][j+1]==2){
                // #DE9B1B;
                td.style = `
                background-image: url({{site.baseurl}}/assets/images/post/getDirection/sa00.png);
                background-size: cover;
                background-repeat: no-repeat;
                width: 50px`;
                td.dataset.num=2
                tr.appendChild(td);
            } else if (d[q+1][j+1]==0){
                td.style = `
                background-color: transparent;
                width: 50px`;
                td.dataset.num=0
                tr.appendChild(td);
            }
            if (q+1==x && j+1==y){
                td.setAttribute("class", 'ant');
                tr.appendChild(td);
            }
        }
        tr.style="height: 50px";
        list.appendChild(tr);
    }
}

let speed = 200;
let xl = false;
let find;
let control = 0;

function start(){
    if (control == 0){
        find = setInterval(pathfind, speed, arr);
    }
    control = 1;
}

function stop(){
    clearInterval(find);
    control = 0;
}

function pathfind(d){
    
        
    if (x >= 9 && y >= 9){
        clearInterval(find);
        setTimeout(()=>{
            alert("개미가 갈 곳이 없습니다.");
            xl=true;
            lotation(xl);
        }, 100);
        // break
    }
    if (d[x][y] == 0){
        d[x][y] = 9;
        list.children[x-1].children[y-1].style = 'background-color: rgba(85, 231, 231, 0.459)';
        if(document.querySelector('.ant')){
            document.querySelector('.ant').classList.remove('ant');
        }
        list.children[x-1].children[y-1].classList.add('ant');
    } else if (d[x][y] == 2){  // x방향 장애물 피하기
        d[x][y] = 9;
        list.children[x-1].children[y-1].style = 'background-color: rgba(85, 231, 231, 0.8)';
        if(document.querySelector('.ant')){
            document.querySelector('.ant').classList.remove('ant');
        }
        list.children[x-1].children[y-1].classList.add('ant');
        clearInterval(find);
        setTimeout(()=>{
            alert("개미가 먹이을 찾았습니다.");
            xl=true;
            lotation(xl);
        }, 100);
        // break;
    } else if (d[x][y+1] == 0){  // y방향 전진
        y += 1;
    } else if (d[x][y+1] == 1){
        x += 1;
        if(d[x][y]==1){
            clearInterval(find);
            setTimeout(()=>{
                alert("개미가 막다른 길에 막혔습니다.");
                xl=true;
                lotation(xl);
            }, 100);
        }
    } else if (d[x+1][y] == 1){  // y방향 장애물 피하기
        y += 1;
        if(d[x][y]==1){
            clearInterval(find);
        }
    } else if (d[x][y+1] == 2){
        y += 1;
    } else if (d[x+1][y] == 2){
        x += 1;
    } 
}

function lotation(xl){
    if(xl){
        list.innerHTML = '';
        count++;
        if (count>3) count = 0;
        arr = getArr(mapList[count]);
        x=2;
        y=2;
        draw(arr);
        xl=false;
        find = setInterval(pathfind, speed, arr);
    }
}
</script>

<hr style="color: coral !important;">

> CSS 코드  
> 위의 예시 이미지들은 따로 갈아끼우면 됩니다.

```css
td{
    position: relative;
}

.table{
    width: auto;
}

td::after{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.1);
    opacity: 0;
    transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    -webkit-transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    -moz-transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    -ms-transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    -o-transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}
td:hover::after{
    opacity: 1;
    color: rgba(85, 231, 231, 0.459)
}

.ant:before{
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    width: 60%;
    height: 60%;
    border-radius: 50%;
    background-color: rgba(21, 15, 116, 0.671);
    opacity: 1;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
}
```