#!/usr/bin/env sh

# 오류 발생시 중단한다.
set -e

today=`date`
MSG=''
SPACE=" "

while true;
do
    echo -e "1) update.\n"
    echo -e "2) bugfix.\n"
    echo -e "3) post.\n"
    echo -e "4) close\n"
    echo -e "선택해주세요."
    
    read -r -n 1 input
    
    if [ $input -eq 1 ];then
        clear
        echo "업데이트로 진행합니다."
        echo "메세지 남기기 (enter: 공백으로 넘어가기)"
        read MSG
        TYPE=":bulb: update:"
        break
    fi

    if [ $input -eq 2 ];then
        clear
        echo "버그 수정으로 진행합니다."
        echo "메세지 남기기 (enter: 공백으로 넘어가기)"
        read MSG
        TYPE=":wrench: bugfix:"
        break
    fi

    if [ $input -eq 3 ];then
        clear
        echo "포스팅으로 진행합니다."
        echo "메세지 남기기 (enter: 공백으로 넘어가기)"
        read MSG
        TYPE=":bulb: post:"
        break
    fi

    if [ $input -eq 4 ];then
        clear
        echo "종료됩니다."
        break
    fi
done

MSG=" ${MSG}"

# 문서(md)를 build하여 html로 만든다. 
# npm run build

# build가 output된 폴더로 이동한다. 
# cd ./dist

# init + add + commit을 해준 다음
git init
git add -A
git commit -m "$TYPE$MSG $today"

# https://<USERNAME>.github.io 에 배포하는 경우
# git push -f https://github.com/<USERNAME>/<USERNAME>.github.io.git master

# https://<USERNAME>.github.io/<REPO> 에 배포하는 경우
# 가 아니라 git초기화 된 디렉토리에서는 master:<branch>로 해줘야한다.
# git push -f https://github.com/<USERNAME>/<REPO>.git master:gh-pages

# 필자의 경우 TIL repository에 배포하기 때문에 아래와 같이 작성했다.
git push -f https://github.com/kkn1125/kkn1125.github.io.git main

# cd -