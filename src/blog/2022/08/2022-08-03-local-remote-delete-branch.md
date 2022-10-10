---
slug: "/branch-delete-way01/"
layout: post
date: 2022-08-03 14:12:45 +0900
title: "[GIT] 로컬 및 원격에서 브랜치 삭제"
author: Kimson
categories: [git]
image: /images/post/covers/TIL-git.png
tags: [branch, locally, remotely, til]
description: "브랜치 삭제

브랜치 삭제는 쉽습니다. 하지만 쉬워서 살 떨리는 것 같습니다 😮

잘못 삭제하면 후시하지 않은 브랜치를 커밋만 해놓고 지워버리는 경우도 발생하겠지요 🥲 하지만 되살리는 방법이 있더라구요."
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

# 브랜치 삭제

브랜치 삭제는 쉽습니다. 하지만 쉬워서 살 떨리는 것 같습니다 😮

잘못 삭제하면 후시하지 않은 브랜치를 커밋만 해놓고 지워버리는 경우도 발생하겠지요 🥲 하지만 되살리는 방법이 있더라구요.

## 로컬 + 원격 브랜치 삭제

로컬은 이미 자주 사용하고 있어서 삭제하는 구문을 기록해두려 합니다. 원격은 github에서 삭제하는 터라 명령줄은 이번에 처음 사용해봅니다.

```bash
// 로컬 브랜치 삭제
git branch -d kimson/local/branch

// 원격 브랜치 삭제
git push origin --delete kimson/remote/branch
```

점차 UI조작에서 커멘드 조작이 익숙해지고 있는 시점에서 원격 브랜치르 삭제하는 것 또한 지금 익혀두는게 좋을 것 같아 같이 기록합니다.

보통 해당 브랜치 작업이 끝나고 브랜치를 정리하는 작업을 합니다. 기능에 대한 작업이 완료되면 브랜치를 삭제해 주는 것이 좋습니다.

## 로컬 브랜치 삭제에 대해서

삭제 할 때는 삭제 대상의 브랜치에 있으면 안되기 때문에 다른 브랜치로 이동해서 삭제를 원하는 브랜치를 삭제해야합니다.

삭제할 때 누구는 -d 누구는 -D 옵션을 사용하는 것을 많이 보았는데요, 여기서 헷갈리던 부분이 옵션 부분입니다. -d 옵션은 이미 푸시되어서 원격 브랜치와 병합된 경우에만 분기를 삭제합니다. -D 옵션은 아직 푸시되거나 병합되지 않은 경우에도 브랜치를 삭제하기 때문에 강제성이 있습니다.

-d는 작으니 일반 삭제, -D는 크니까 좀더 쎈 삭제? 라고 외우면 까먹지는 않겠죠? 😅

## 원격 브랜치 삭제에 대해서

기본적으로 아래 구문을 따릅니다.

```bash
git push <remote> --delete <branch>
```

혹은 짧게 작성하는 방법을 사용할 수 도 있습니다.

```bash
git push <remote> :<branch>

git push origin :kimson/remote/branch
```

이렇게 간추려 사용하면 사용하기가 더 편리하겠지요. 만일 삭제했는데 아래와 같은 에러가 난다면, 이미 해당 브랜치가 삭제되었을 수 있습니다.

```bash
error: unable to push to unqualified destination: remoteBranchName The destination refspec neither matches an existing ref on the remote nor begins with refs/, and we are unable to guess a prefix based on the source ref. error: failed to push some refs to 'git@repository_name'
```

원격에서 삭제되어 존재하지 않은 브랜치가 자동으로 삭제되었으면 하는 때가 있습니다. 예를 들어, 원격에 main, dev, test, hotfix가 있을 때 로컬도 동일하다 가정합니다. 시간이 지나 test와 hotfix가 원격에서 누국가에 의해 삭제되었습니다. 로컬 또한 싱크를 맞출 필요가 있겠죠.

이때 사용하는 것이 아래 명령 줄입니다.

```bash
git fetch -p
```

-p 옵션은 prune(가지치기) 입니다. fetch 후 더 이상 원격에 존재하지 않는 브랜치를 삭제합니다.

> 해당 내용은 아래 링크의 페이지를 해석해서 한글로 옮겨놓은 것이 대부분 입니다. 글에서 나온 개인적 견해 외에 소스코드 내용의 출처는 모두 아래 링크 입니다.

---

📚 함께 보면 좋은 내용

[freeCodeCamp](https://www.freecodecamp.org/news/how-to-delete-a-git-branch-both-locally-and-remotely/)
