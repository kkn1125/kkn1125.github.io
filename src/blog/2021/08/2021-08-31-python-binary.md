---
slug: "/python-binary/"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-08-31 21:45:32 +0900
title:  "[PYTHON] 파이썬 기초 - 진수 변환"
author: Kimson
categories: [ python ]
tags: [ basic, til ]
image: /images/post/covers/TIL-python.png
description: "기초 다지기
10진수를 16진수로 변환
16진수를 8진수로 변환
10진수 유니코드로 변환
정수 유니코드 문자로 변환"
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

# 기초 다지기

## 10진수를 16진수로 변환

```python
a = input()
print('%x' % int(a))
# %x를 사용하면 16진수로 변환가능
print('%X' % int(a))
# %X를 대문자로 하면 대문자로 16진수 출력 255 >> FF

print(hex(int(a)))
# 0x가 붙고 변환이 된다.

# ex a가 255면 %x는 ff
# hex()는 0xff
```

## 16진수를 8진수로 변환

```python
a = input()
print('%o' % int(a, 16))
# int함수에 두번째 인자로 진수를 주면 해당 진수로 변환된다.
```

## 10진수 유니코드로 변환

```python
a = ord(input())
# 입력이 A일때 반환은 65
# 10이상은 안된다.
# 문자값 -> 정수값
```

## 정수 유니코드 문자로 변환

```python
a = chr(int(input()))
# 48부터 0, 48미만 없음
# 음수 불가
# 정수값 > 문자값
```