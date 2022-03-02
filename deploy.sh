#!/usr/bin/env sh

set -e

today=`date`

echo -e "현재 커밋하는 이유는 무엇입니까?\n( update / post / bugfix )"
read TYPE

git init
git add -A
git commit -m ":bulb: $TYPE: $today"

git push -f https://github.com/kkn1125/kkn1125.github.io.git main