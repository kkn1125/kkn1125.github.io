---
layout: post
date:   2021-12-15 17:44:57 +0900
title:  "[JAVA] Kakao 인턴"
author: Kimson
categories: [ JAVA, TIL, ALGORITHM, PROGRAMMERS ]
image: assets/images/post/covers/TIL-java.png
tags: [ kakao, algorithm ]
description: "2020 kakao 인턴 키패드 문제

if문을 많이 남발하다가 결국 풀이를 슬쩍 보면서 풀었습니다...

조건은 단순합니다.

양손 엄지가 있고 키패드가 `0-9`까지 `*`과 `#`이 있습니다. 그리고 손잡이 유형이 왼쪽이냐 오른쪽이냐가 조건으로 주어집니다."
featured: false
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---
# 2020 kakao 인턴 키패드 문제

if문을 많이 남발하다가 결국 풀이를 슬쩍 보면서 풀었습니다...

조건은 단순합니다.

양손 엄지가 있고 키패드가 `0-9`까지 `*`과 `#`이 있습니다. 그리고 손잡이 유형이 왼쪽이냐 오른쪽이냐가 조건으로 주어집니다.

![kakao tech](https://tech.kakao.com/wp-content/uploads/2020/07/kakao_phone1-333x333.png)
{:align="center"}

1. 왼쪽 엄지가 누르는 반경은 1,4,7,*
2. 오른쪽 엄지가 누르는 반경은 3,6,9,#
3. 중앙 컬럼의 2,5,8,0은 왼쪽 엄지 오른쪽 엄지가 누를 번호와 거리가 같다면 손잡이를 기준으로 해당 엄지가 누릅니다.
   - 만일 엄지가 서로 거리가 다르다면 누를 번호와 가장 가까운 엄지가 번호를 눌러야합니다.

이렇게 문제가 주어졌을 때 풀이를 보면서 이해하고 썼던 코드는 아래와 같습니다.

```java
import java.lang.Math;

class Solution {
    public String solution(int[] numbers, String hand) {
        String answer = "";
        
        int leftHand = 10;
        int rightHand = 11;

        for(int num : numbers){
            if(num % 3 == 0 && num != 0){
                // num이 0을 제외한 아닌 오른 엄지 반경 일 때
                rightHand = num;
                answer += "R";
            } else if((num + 2) % 3 == 0){
                // num이 0이 아닌 왼쪽 엄지 반경 일 때
                leftHand = num;
                answer += "L";
            } else {
                // 누를 번호와 왼쪽엄지, 오른쪽엄지 간 거리를 알아야한다.
                // 거리가 가까운 쪽의 엄지를 눌러 *Hand를 갱신해준다.
                String center = distance(num, leftHand, rightHand, hand);
                answer += center;
                
                if(center.equals("R")) rightHand = num;
                else leftHand = num;
            }
        }
        
        return answer;
    }
    
    public String distance(int num, int left, int right, String hand){
        int[][] pad = {
            {0,1}, // 0
            {3,0}, // 1
            {3,1}, // 2
            {3,2}, // 3
            {2,0}, // 4
            {2,1}, // 5
            {2,2}, // 6
            {1,0}, // 7
            {1,1}, // 8
            {1,2}, // 9
            {0,0}, // *
            {0,2} // #
        };

        // 굳이 사선 길이 구할 필요는 없어서 합만 구합니다.
        int left_dist = Math.abs(pad[num][0] - pad[left][0]) + Math.abs(pad[num][1] - pad[left][1]);
        int right_dist = Math.abs(pad[num][0] - pad[right][0]) + Math.abs(pad[num][1] - pad[right][1]);

        if(left_dist>right_dist){ // 오른 엄지가 더 가까울 때
            return "R";
        } else if(left_dist<right_dist){ // 왼쪽 엄지가 더 가까울 때
            return "L";
        } else { // 왼쪽 오른쪽 엄지가 같은 거리일 때
            if(hand.equals("right")){
                return "R";
            } else {
                return "L";
            }
        }
    }
}
```

-----

## 노트

처음에 `HashMap`으로 했는데 굳이 `HashMap`을 써야했나 싶었습니다. 패드를 좌표로 변경해볼까 하다가 결국 `if-else`를 썼더니 멘탈이 무너졌습니다.

해당 문제는 거리 산출과 좌표로 변환해내는 생각만 한다면 쉽게 풀 수 있는 문제 같습니다. (결국 풀이를 봤습니다만...)