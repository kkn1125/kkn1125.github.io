---
slug: "/python-basic01"
layout: post
date:   2022-03-15 21:17:09 +0900
title:  "[Python] 기초부터 다시 보자 01"
author: Kimson
categories: [ python ]
image: /images/post/covers/TIL-python.png
tags: [ basic, til ]
description: "기초 Cheetsheet
수
print > \"+\" 덧셈한다. > \"-\" 뺄셈한다. > \"*\" 곱셈한다. > \"\/\" 나눗셈한다. ex) 4를 3으로 나누면 1.3333333이 나온다. > \"\/\/\" 몫을 구한다. ex) 4를 3으로 나누면 몫이 1이 나온다. > \"%\" 나머지를 구한다. ex) 4를 3으로 나누면 나머지가 1이 나온다. > \"**\"는 제곱을 말한다. ex) 3의 4제곱 === 3 ** 4"
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

# 기초 Cheetsheet

## 수

```python
print(2 + 3)    # 5
print(3 - 3)    # 0
print(4 / 3)    # 1.333
print(4 // 3)   # 1
print(4 % 3)    # 1
print(3 * 9)    # 27
print(3 ** 3)   # 27
```

{:.blockquote.blockquote-info}
> ***print***  
> \> **"+"** 덧셈한다.  
> \> **"-"** 뺄셈한다.  
> \> **"*"** 곱셈한다.  
> \> **"/"** 나눗셈한다. ex) 4를 3으로 나누면 1.3333333이 나온다.  
> \> **"//"** 몫을 구한다. ex) 4를 3으로 나누면 몫이 1이 나온다.  
> \> **"%"** 나머지를 구한다. ex) 4를 3으로 나누면 나머지가 1이 나온다.  
> \> **"\*\*"**는 제곱을 말한다. ex) 3의 4제곱 === 3 ** 4

## 문자열

```python
print('test' ' ' 'kimson') # test kimson
print('kimson'*5) # kimsonkimsonkimsonkimsonkimson
print('my name is {}'.format('kimson')) # my name is kimson
print('my name is {0}'.format('kimson', 'roro')) # my name is kimson
print('my name is {1}'.format('kimson', 'roro')) # my name is roro
print("""
    multi-line
""") # multi-line
```

{:.blockquote.blockquote-info}
> ***print***  
> \> 문자열의 연결은 "+"를 사용하지 않습니다. 문자열 연결형식을 선호한다고 합니다.

## 코멘트

```python
# 인라인 코멘트

# 여러 줄
# 주석

"""
여러 줄 주석
"""

def foo():
    """foo's
    docstring
    이것은 함수의 docs입니다.
    """
    a=1+2
    return a

print(foo())        # 3
print(foo.__doc__)  # foo's
                    #   docstring
                    #   이것은 함수의 docs입니다.

def bar():
    a=1+2
    """bar's
    docstring
    이것은 함수의 docs입니다.
    """
    return a

print(foo.__doc__)  # None

def baz():
    a=1+2
    return a

print(foo.__doc__)  # None
```

{:.blockquote.blockquote-info}
> ***print***  
> \> 함수 내 docs는 함수 바로 아래 작성해야 \_\_doc\_\_으로 사용가능합니다.  
> \> 함수 내 docs가 없거나 아래가 아닌 떨어진 곳에 작성되면 \_\_doc\_\_은 None 값을 반환합니다.

## input과 output

```python
print('너의 이름은?')
my_name = input()
print('안녕 반가워 {}'.format(my_name))
```

{:.blockquote.blockquote-info}
> ***print***  
> \> 너의 이름은?  
> \> kimson  
> \> 안녕 반가워 kimson

## len() 함수

```python
len('hello')
```

{:.blockquote.blockquote-info}
> ***print***  
> \> 5

## 형변환

integer => string | float

```python
print(str(29)) # '29'
print(int('31')+1) # 32
print(str(32)+1) # '321'
print(int(7.7)) # 7
print(int(7.7)+1) # 8

print(str.isnumeric('a'))   # False
print(str.isdigit('a'))     # False
print(str.isdecimal('a'))   # False
print(str.isnumeric('1ca')) # False
print(str.isdigit('1ca'))   # False
print(str.isdecimal('1ca')) # False
print(str.isnumeric('1'))   # True
print(str.isdigit('1'))     # True
print(str.isdecimal('1'))   # True
print(str.isnumeric('1.3')) # False
print(str.isdigit('1.3'))   # False
print(str.isdecimal('1.3')) # False
```

{:.blockquote.blockquote-info}
> ***print***  
> \> 문자열에 숫자를 가지고 있으면 int로 형변환 가능  
> \> 문자열에서 숫자와 문자가 섞여 있으면 Error를 표시하면서 작동을 멈춤  
> \> 숫자로 변환 가능한지 여부를 알기 위해 isnumeric, isdigit, isdecimal을 통해 판별  
> \> int와의 차이점은 에러 대신 Boolean값을 반환 받아 True | False로 값을 표시  
> \> 단, -1 || 3.14 등 음수, 소수는 False로 반환되어 정규표현식으로 판별하는 편이 좋음

## if elif else

```python
data = 'kimson'

if data == 'kimson':
    print('hi kimson')
elif data == 'roro':
    print('hi roro!')
else:
    print('who are u?')
```

### 새롭게 추가된 match ... case

switch ... case 문이 python에는 존재하지 않습니다. 굳이 사용률도 저조하고 if .. elif 나 dictionary로 대체 가능하기 때문이었습니다.

Python 3.10의 도입으로 몇 가지 새로운 기능이 도입되었고, 그 중 하나는 `python match case`였습니다. `python match case`는 파이썬에서 구조적 패턴 매칭으로 인식되는 `switch case` 문과 유사합니다.

{:.blockquote.blockquote-danger}
> 참고: 대소문자 구분 구조는 python 버전 3.10 이상에서 사용할 수 있습니다.

```python
flag = 5
match flag:
    case 1:
        print("number 1")
    case 2:
        print("number 2")
    case (3|4):
        print("number 3 or 4")
    case _:
        print('default value')

flag = 0
match flag:
    case flag if flag < 0:
        print("음수입니다")
    case flag if flag == 0:
        print("0 입니다")
    case flag if flag > 0:
        print("양수입니다")
```

{:.blockquote.blockquote-info}
> ***print***  
> \> default value  
> \> 0 입니다

## loop와 range

```python
for i in range(5):
    print(i) # 0 1 2 3 4

for i in range(5, -1, -1):
    print(i) # 5 4 3 2 1 0

for i in range(5):
    if i == 6:
        break
else:
    print('Nothing matches. Last item is {}'.format(i))

# array_dict에서 일치하는 데이터 찾기
def find_user_name(data, name):
    temp=False
    for v in data:
        if v['name'] == name:
            temp = v
            break
    else:
        print('Nothing matches. Last item is {}'.format(v))
    return temp
    
data = [
    {
        'name': 'kimson',
        'age': 30,
    },
    {
        'name': 'roro',
        'age': 30,
    },
    {
        'name': 'ohoraming',
        'age': 30,
    },
]

found = find_user_name(data, 'tomson')
print(found)

# 축약형
def find_user_info(key, value):
    temp = [i for i in data if i[key] == value] # 배열에 담긴다.
    if not temp: return False
    return temp
    
found = find_user_info('age', 27)
print(found)
```

{:.blockquote.blockquote-info}
> ***print***  
> \> range(start, end, step) 으로 사용한다.  
> \> step은 default로 1이다.
> 
> \> find_user_info처럼 축약으로 사용할 수 있다.  
> \> 배열이 비어있는지 확인하려면 if not array: 를 사용하면 된다.
> 
> \> for .. else문은 for문을 돌면서 if 문으로 판별할 때 해당 표현식에 모두 해당하지 않을 경우 else를 실행한다.

-----

📚 함께 보면 좋은 내용

[Python Cheatsheet](https://www.pythoncheatsheet.org/)

[Python Pool :: Match Case Python: New Addition to the Language](https://www.pythonpool.com/match-case-python/)