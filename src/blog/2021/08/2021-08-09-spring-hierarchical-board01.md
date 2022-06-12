---
slug: "/spring-hierarchical-board01"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-08-09 13:19:05 +0900
title:  "[SPRING] 계층형 게시판 만들기"
author: Kimson
categories: [ spring ]
tags: [ board, layer, hierarchical, til ]
image: /images/post/hierarchical/hierarchical13.png
description: "계층형 게시판

Layer의 개념

게시판의 하위에 달리는 게시판은 식별가능한 정보를 가져야합니다.

1. 원글의 번호 **bid**(board id)
2. 순서 **ordered**
3. 위계 **layer**

순서와 위계의 변화

`bid`는 `primary key`인 `id`와 동일해야합니다.
`ordered`와 `layer`는 새 글일 경우 0으로 기본값을 가집니다."
featured: false
hidden: false
rating: 4.5
toc: true
profile: false
istop: true
keysum: true
keywords: '
SQL max(name) : name칼럼의 최대 값을 반환하는 함수.
_SQL ifnull(value, falseValue) : value의 값이 null이면 0을, 아니면 value를 반환하는 함수.
'
published: true
---

# 계층형 게시판

## Layer의 개념

> 게시판의 하위에 달리는 게시판은 식별가능한 정보를 가져야합니다.

1. 원글의 번호 **bid**(board id)
2. 순서 **ordered**
3. 위계 **layer**

## 순서와 위계의 변화

> `bid`는 `primary key`인 `id`와 동일해야합니다.
> 
> `ordered`와 `layer`는 새 글일 경우 0으로 기본값을 가집니다.

### 테이블 설정

```sql
CREATE TABLE IF NOT EXISTS board(
    id int not null auto_increment,
    bid int not null,
    ordered int not null default 0,
    layer int not null default 0,
    title varchar(100) not null,
    contents longtext not null,
    author varchar(30) not null,
    regDate timestamp not null default current_timestamp,
    primary key(id)
)auto_increment=1 default charset='utf8mb4';
```

원리는 단순합니다. 새 글이 추가되면 `id, bid = auto_increment`, `ordered = 0`, `layer = 0`입니다.

### 원글 추가

{:.table.text-center}
|Col|Value|Info|
|---|---|---|
|id|1|원글{:rowspan="4"}|
|bid|1|^|
|ordered|0|^|
|layer|0|^|

```sql
INSERT INTO board (bid, title, contents, author)
VALUES ((SELECT IFNULL(max(id),0)+1 FROM board AS temp),'타이틀','내용','킴슨');
```

![계층형게시판](/assets/images/post/hierarchical/hierarchical01.png)

![계층형게시판](/assets/images/post/hierarchical/hierarchical02.png)

![계층형게시판](/assets/images/post/hierarchical/hierarchical03.png)

bid와 나머지 정보를 적게되는데, board테이블에서 `ordered`와 `layer`가 default값이 0이기 때문에 insert구문에서 빠집니다.

auto_increment가 1개만 지정되기 때문에 bid는 select 문으로 자신 테이블의 `id`칼럼을 참조하여 자동 증가하도록 하였습니다.


![계층형게시판](/assets/images/post/hierarchical/hierarchical04.png)

![계층형게시판](/assets/images/post/hierarchical/hierarchical05.png)

계속 추가하면 `id`와 `bid`만 증가하는 원글이 등록됩니다.

### 하위 글 추가

{:.table.text-center}
|Col|Value|Info|
|---|---|---|
|id|2|auto_increment|
|bid|1|(**origin**) bid|
|ordered|1|(**origin**) ordered+1|
|layer|1|(**origin**) layer+1|

매우 단순합니다. 원글의 ordered와 layer의 1 증가한 값을 가집니다.

#### 자리 변경

> 원글에 하위 게시글이 달릴 때는 조금 다릅니다. 단지 자리를 밀어주는 기능이 추가됩니다. 여기서 하위 글이 생성되는 간단한 원리를 알 수 있습니다.

하위 게시글 추가 시 변하는 것은 다음과 같습니다.

```sql
UPDATE board SET ordered = ordered + 1 WHERE bid = 1 AND ordered > 0;
```

![계층형게시판](/assets/images/post/hierarchical/hierarchical06.png)

아무 변화가 없습니다. 등록된 하위 게시글이 없기 때문에 그냥 넘어갑니다.

##### 구문 해석

- 조건은 원글의 `bid` 1값이고, 원글의 `ordered`보다 큰 값을 가진 `row`들을 대상으로한다.
- 대상 `row`들의 `ordered`를 1증가 한다.

이렇게 해당되는 `row`들은 `ordered`가 1증가하면서 원글의 하위 글들의 순서가 1씩 밀려납니다.

#### 앞 자리 삽입

> 삽입되는 글은 원글의 `ordered`와 `layer`에 1 증가 값을 가집니다.

즉, 자리를 먼저 밀고나서 추가되는 하위글을 공석에 집어넣는 형태입니다.

```sql
INSERT INTO board (bid, title, contents, author, ordered, layer) VALUES (1,'하위 게시글1','하위 내용','Kimson',(SELECT ordered FROM board AS temp WHERE id=6)+1,(SELECT layer FROM board AS temp WHERE id=6)+1);
```

![계층형게시판](/assets/images/post/hierarchical/hierarchical08.png)

![계층형게시판](/assets/images/post/hierarchical/hierarchical07.png)

새로운 하위 글은 `id`값은 증가하지만 대상 원글의 `bid`를 따라가며, 원글의 `ordered`와 `layer`가 1증가한 값을 가졌습니다.

##### 구문 해석

- `bid` = 1 (원글의 `bid`)
- `ordered` = 1 (원글의 `ordered`+1)
- `layer` = 1 (원글의 `layer`+1)

원글의 정보에서 `bid`가 따라오고, `ordered`와 `layer`는 1증가 값은 가집니다.
이 원리가 그대로 적용되어서 게시글에 하위 글이 붙고, 또 하위 글이 붙어도 원리는 변하지 않습니다.

### Table의 정렬

> 계층형 게시글의 구현 후, 정렬을 맞추어 게시판의 형태를 갖추어 봅시다.

```sql
SELECT * FROM board ORDER BY bid DESC, ordered;
```

`bid`가 낮을수록 시간이 지난 글이기 때문에 `DESC`로 내림차순합니다. ordered은 자리를 밀어 낮은 수로 추가되기 때문에 그대로 불러옵니다.

#### 일반 SELECT

![계층형게시판](/assets/images/post/hierarchical/hierarchical09.png)
![계층형게시판](/assets/images/post/hierarchical/hierarchical11.png)

#### 정렬 적용 SELECT

![계층형게시판](/assets/images/post/hierarchical/hierarchical10.png)
![계층형게시판](/assets/images/post/hierarchical/hierarchical12.png)

## 작동 테스트 이미지

![계층형게시판](/assets/images/post/hierarchical/hierarchical13.png)
![계층형게시판](/assets/images/post/hierarchical/hierarchical14.png)

-----

처음 계층형에 대한 내용을 접했을 때 굉장히 혼란스러웠습니다. 막상 따라해보고 익히면 아무것도 아닌데 경험이 없을 때는 계속 피하고 주저하게 됩니다.

계속 피하면 쉬운 것도 경험할 기회를 버리는 것 같아 요즘은 이것저것 해보자는 생각을 합니다.

작은 모방이 큰 아이디어가 되도록 노력합니다.

참고한 사이트를 아래 링크 남기겠습니다.

[Dev.GA님의 블로그](https://gangnam-americano.tistory.com/25)