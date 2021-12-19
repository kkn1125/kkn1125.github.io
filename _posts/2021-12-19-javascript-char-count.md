---
layout: post
date:   2021-12-16 14:31:34 +0900
title:  "[JAVASCRIPT] 2020 카카오 문자열 압축 풀이"
author: Kimson
categories: [ JAVASCRIPT, TIL, ALGORITHM ]
image: assets/images/post/covers/TIL-javascript.png
tags: [ algorithm, strToZip ]
description: ""
featured: true
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# 2020 카카오 문자열 압축 풀이

풀어봐야하는 차원에서 모든 답을 알려드려도 될지 모르겠습니다. 그저 제가 풀이한 방식을 기록하고자 올립니다.

```javascript
function duplicationCharCount(array){
   // 다음 문자와 같다면 카운팅
   // 아니면 개수 1로 추가
   return countingString;
}

function convertArrayFromNum(string, num){
   // 문자열을 받아 num의 갯수만큼 잘라 배열을 새로 만듬
   return newArray;
}
```

위의 두 가지 함수를 만들어 풀었습니다. 먼저 핵심은 같은 문자열의 경우 1개를 잘랐을 때 다음 문자가 같으면 카운트, 아니면 다른 문자 갯수를 1로 카운트하는 작업의 단순한 반복이었습니다.

즉, `aabbcc`라는 문자열이라면 1개 단위로 쪼개어 배열을 만들면 아래와 같습니다.

```javascript
let temp = [];
let split = ['a', 'a', 'b', 'b', 'c', 'c'];
```

그럼 처음에 `a`니까 1개로 카운팅하여 `temp`배열에 넣습니다. 두 번째도 `a`면 `temp`의 마지막 요소의 개수에 `+1`을 카운팅합니다. 그 다음 `b`로 `temp`의 마지막 요소의 문자와 다르면 새로 1개의 문자를 `temp`에 추가합니다.

예를 보시면 더 이해가 빨리 되실겁니다.

```javascript
// split[0] == 'a'
[['a', 1]] // temp
//split[1] == 'a'
[['a', 2]] // last of temp +1
// split[2] == 'b'
[['a', 2], ['b', 1]] // 새로 추가
```

`dictionary`로 하게 되면 다음에 올 문자가 같은 문자라면 중복 제거되어 카운팅이 제대로 안 됩니다.

튜플형식으로 하는게 적합할 것 같아서 사용했습니다.

함수를 짜보면 아래와 같습니다.

```javascript
function duplicationCharCount(array){
   // array가 1개 단위로 쪼개어 져있다고 가정하겠습니다.
   let before;
   let temp = [];
   let result = '';
   for(let i=0; i<array.length; i++){
      if(before != array[i]){ // 이전과 다음 문자가 다르다면
         temp.push([array[i], 1]); // temp에 추가
      } else { // 이전과 다음 문자가 같다면
         temp[temp.length-1][1] += 1; // temp마지막 요소에 +1 카운팅
      }
      before = array[i];
      // 마지막에 before에 요소를 할당해야 다음 턴에서 위의 조건문에서
      // 이전 요소와 현재요소가 비교될수 있다.
   }
   temp.forEach(([char, count])=>{
      result += (count>1?count:'')+char;
   });
   return result;
}
```

이렇게 함수를 작성했더니 테스트용으로 배열을 넣으면 해당 배열의 문자를 잘 카운팅해서 `aabbcc`라면 `2a2b2c`로 변환해줍니다.

이제 마지막 남은 배열을 압축가능한 길이로 잘라 카운팅을 하는 일 중 압축 가능 길이로 자르는 기능이 남았습니다.

아래와 같습니다.

```javascript
function convertArrayFromNum(string, num){
   // 문자열을 slice하여 num만큼씩 자를겁니다.
   let max = parseInt(string.length/num)+1;
   let convertedArray = [];
   for(let i=0; i<max; i++){
      convertedArray.push(string.slice(i*num, i*num+num));
   }
   return convertedArray;
}
```

매우 간단합니다. 자르기 시작점은 배수로 잘라야합니다. 종료점은 `num`만큼 띄어져야 하니 `i*num`에 `num`을 더해준 값으로 잘라냅니다. 그렇게 압축가능 길이는 `문자열의 총길이`에 `절반+1`만큼 잘라낼 수 있습니다. 그 이상은 어차피 압축이 되지 않기에 절반을 `for`문을 돌려 작성한 함수를 활용하면 됩니다.

```javascript
let s = 'aabbaccc';

function isMinimum(s){
   let result = [];
   for(let i=1; i<=parseInt(s.length/2)+1; i++){
      let array = convertArrayFromNum(s, i);
      let counters = duplicationCharCount(array);
      result.push(counters.length);
   }
   return Math.min(...result);
}
```

만들었던 함수들을 적절히 써서 `for`문을 돌려버리면 압축된 문자열들이 `result`에 담기는데 `length`로 담기 때문에 압축된 문자열 길이를 담게 되고, 담겨진 길이 중 최소값을 반환하여 출력하게 됩니다.

처음에 `RegExp`로 풀려다가 한계를 느껴 `for`문을 돌렸더니 감이 잡혀 풀게 되었습니다. 헤매던 문제를 풀고나니 한결 편하고 성취감이 오르는 느낌이라 뿌듯했습니다.

reduce를 쓰면 굳이 이렇게 함수를 만들지 않아도 될 거 같지만 정제하기 전에 이해 먼저 해야 좋을 것 같아 기록 해 둡니다.