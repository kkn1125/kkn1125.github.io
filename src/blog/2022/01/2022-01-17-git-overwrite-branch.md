---
slug: "/git-overwrite-branch"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2022-01-17 12:40:42 +0900
title:  "[GIT] 깃 브랜치 덮어쓰기"
author: Kimson
categories: [ git ]
image: /images/post/covers/TIL-git.png
tags: [ git, branch, overwrite, til ]
description: "깃 브랜치 덮어쓰기

main 브랜치를 새로운 브랜치로 교체할 일이 생겨 시도하다보니 아래와 같은 메세지가 나왔습니다."
featured: false
hidden: false
rating: 3
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# 깃 브랜치 덮어쓰기

main 브랜치를 새로운 브랜치로 교체할 일이 생겨 시도하다보니 아래와 같은 메세지가 나왔습니다.

```bash
$ git checkout main
$ git merge newBranch
# error...
```

<figure class="text-center">
<span class="w-inline-block">
   <img class="w-100" src="{{site.baseurl}}/assets/images/post/git/git01.png" alt="에러" title="에러">
   <figcaption>에러 메세지</figcaption>
</span>
</figure>

스택오버플로우의 글과 여러 블로그를 참고하고 아래와 같이 해결했습니다.

1. 덮어쓰고자하는 새로운 브랜치를 `newBranch`라 하고
2. 덮을 기존의 브랜치를 `oldBranch`라 했을 때

```bash
$ git checkout oldBranch
$ git merge -Xtheirs newBranch
```

이렇게 해서 해결이 된다면 괜찮습니다만 "관련없는 기록 병합 거부(fatal: refusing to merge unrelated histories)"라는 메세지가 뜬다면 아래와 같이 하면 됩니다.

```bash
$ git checkout oldBranch
$ git merge -Xtheirs newBranch --allow-unrelated-histories
```

이렇게 병합되지 않던 브랜치가 합쳐지면서 덮어쓰기 됩니다.

`-X theirs`는 현재 브랜치(oldBranch)에 대상 브랜치(newBranch) 기준으로 덮어 쓰겠다는 것이고, `-X ours`는 반대로 현재 브랜치 기준으로 대상 브랜치를 덮어 쓴다는 것입니다. 깃 문서의 [7.8 git 도구 - 고급 Merge](https://git-scm.com/book/ko/v2/Git-%EB%8F%84%EA%B5%AC-%EA%B3%A0%EA%B8%89-Merge)에 관련 내용이 있으니 참고바랍니다.

-----

📚 함께 보면 좋은 내용

[stackoverflow::Git merge with force overwrite](https://stackoverflow.com/questions/40517129/git-merge-with-force-overwrite)

[Engineer135님::git merge 덮어쓰기(overwrite)](https://engineer135.tistory.com/166#recentComments)

[호기심 많은 오리님::Git push가 안되는 경우 (fatal: refusing to merge unrelated histories)](https://gdtbgl93.tistory.com/63)