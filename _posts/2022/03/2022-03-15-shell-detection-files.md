---
layout: post
date:   2022-03-15 21:17:09 +0900
title:  "[SHELL] Shell Script로 파일 변환을 감지해보자 02"
author: Kimson
categories: [ shell ]
image: assets/images/post/covers/TIL-shell.png
tags: [ detection file, til ]
description: "경로 내 파일 변경 감지
문자 개행, 문자열 split, 배열 인덱스 번호, 특정 문자 포함 여부 등의 자료는 포스팅 하단에 링크로 첨부해두었습니다.
이전에 `shell script`로 파일 변경을 감지해서 `python`을 `watch`하는 기능을 소개한 적이 있습니다. 하지만 이전에 했던 주요 단점인 지정된 파일만 감지를 하는 방식이었는데요.

조금 더 변하게 알아서 변경된 파일에 대해서만 다시 실행해주는 편이 더 편하고 효율적이겠다 싶어 수정을 했습니다."
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

# 경로 내 파일 변경 감지

> 문자 개행, 문자열 split, 배열 인덱스 번호, 특정 문자 포함 여부 등의 자료는 포스팅 하단에 링크로 첨부해두었습니다.

이전에 `shell script`로 파일 변경을 감지해서 `python`을 `watch`하는 기능을 소개한 적이 있습니다. 하지만 이전에 했던 주요 단점인 지정된 파일만 감지를 하는 방식이었는데요.

조금 더 변하게 알아서 변경된 파일에 대해서만 다시 실행해주는 편이 더 편하고 효율적이겠다 싶어 수정을 했습니다.

해당 코드는 [여기](https://github.com/kkn1125/file-detection){:target="_blank"}를 참조하시면 되겠습니다.

## 변경된 파일 이름 가져오기

이전에 작성한 코드는 현재 실행 중인 터미널의 위치 내에서 변경된 파일들의 마지막 저장 일자를 문자열로 받아 비교하는 방식으로 단순히 `감지`만 했습니다.

현재 바뀐 점은 파일을 동일 위치에서 감지하는 것은 동일합니다만, 변경된 파일 명칭을 가져와 제어하는 기능입니다.

```sh
$ stat -c %n *
```

위에서 사용한 %n은 파일의 명칭을 가져오는 옵션입니다. 이전에는 %Z로 마지막 저장 시간을 가져왔지만 파일 명을 시간과 마찬가지의 순서로 가져오는 것에서 힌트를 얻고, 배열로 만들어 변경된 인덱스를 가져와 파일 명을 가져오게 하였습니다.

```sh
# 생략 ...
while true
do
    CUR=$(stat -c %Z *)
    
    if [ "$PREV" != "$CUR" ];then
        CHANGE_IDX=0                                    # 추가

        PREV_ARR=(`echo ${PREV} | tr "," "\n"`)         # 추가
        CUR_ARR=(`echo ${CUR} | tr "," "\n"`)           # 추가

        FILES=(`echo $(stat -c %n * | tr "," "\n")`)    # 추가

        echo "Change file detection !"                  # 추가

        for x in "${!PREV_ARR[@]}"                      # 추가
        do
            if [ "${PREV_ARR[$x]}" != "${CUR_ARR[$x]}" ];then
                CHANGE_IDX=$x

                FILE_NAME="${FILES[${CHANGE_IDX}]}"

                if [[ $FILE_NAME =~ 'py' ]];then
                    python $FILE_NAME
                fi
            fi
        done
    fi
    PREV=$CUR
done
```

코드의 일부입니다. 이전과 거의 동일하고 추가된 부분은 15줄에 불과합니다. 이미 `watch` 기능이 있는지는 모르겠지만 공부도 할 겸 좋은 기회라 생각해서 만들었습니다.

-----

📚 함께 보면 좋은 내용

[devhints.io :: Bash scripting cheetsheet](https://devhints.io/bash){:target="_blank"}

[Stackoverflow :: How to check if a string contains a substring in Bash](https://stackoverflow.com/questions/229551/how-to-check-if-a-string-contains-a-substring-in-bash){:target="_blank"}

[Stackoverflow :: Get the index of a value in a Bash array](https://stackoverflow.com/questions/15028567/get-the-index-of-a-value-in-a-bash-array){:target="_blank"}

[WEBTERROR님 :: BASH에서 SPLIT 활용하는 방법](https://stackoverflow.com/questions/15028567/get-the-index-of-a-value-in-a-bash-array){:target="_blank"}

[lesstif님 :: echo 명령어로 줄바꿈(개행) 문자 입력](https://www.lesstif.com/lpt/echo-19857474.html){:target="_blank"}