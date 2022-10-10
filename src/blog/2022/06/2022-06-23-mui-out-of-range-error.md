---
slug: "/mui-out-of-range-error/"
layout: post
date: 2022-06-23 22:41:02 +0900
title: "[MUI] Select Component 설정 시 out-of-range 에러 문제"
author: Kimson
categories: [mui]
image: /images/post/covers/TIL-center.png
tags: [react, error, til]
description: "작업하다보면 많은 에러를 발생시켜보기도 하는데요, 위의 에러 내용은 `MUI`에서 제공하는 `Select` 컴포넌트를 사용할 때 발생하는 에러입니다.

여러가지 블로그 포스팅이나 스택오버플로우를 찾아봐도 도무지 같은 상황에 놓인 분이 없어서 이것저것 만져보면서 문제를 해결했습니다."
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

# 개발환경

1. react - 18.1.0
2. next - 12.1.6
3. next-auth - 4.3.4
4. mui - 5.8.1
5. yup - 0.32.11
6. formik - 2.2.9
7. formidable - 3.2.4
8. react-use - 17.4.0
9. tuffle - 5.1.67
10. ipfs-http-client - 56.0.3
11. emotion - 11.9.0
12. mongoose - 6.3.5

## 에러 메세지

```bash
에러 메세지: MUI: You have provided an out-of-range value `` for the select component.Consider providing a value that matches one of the available options or ''.The available values are `최근 생성 순`, `좋아요 많은 순`, `오래된 순`, `낮은 가격 순`, `높은 가격 순`.
```

작업하다보면 많은 에러를 발생시켜보기도 하는데요, 위의 에러 내용은 `MUI`에서 제공하는 `Select` 컴포넌트를 사용할 때 발생하는 에러입니다.

여러가지 블로그 포스팅이나 스택오버플로우를 찾아봐도 도무지 같은 상황에 놓인 분이 없어서 이것저것 만져보면서 문제를 해결했습니다.

## 문제 원인

Select 컴포넌트에서 MenuItem 컴포넌트 생성 시 에러가 발생을 하는데요. MenuItem 컴포넌트 때문이 아닌 그 컴포넌트의 value 값에서 발생하는 에러입니다.

정확한 원인은 모르겠으나 MenuItem 을 map으로 나열하는 상황이라면 해당 map구문 바깥에 기본 값으로 MenuItem 컴포넌트를 빈 value값으로 하나 두어야 에러가 해결됩니다.

예시 코드는 아래와 같습니다.

```jsx
<Select
  displayEmpty
  value={personName}
  onChange={handleChange}
  input={<CssOutlinedInput />}
  renderValue={(selected) => {
    if (selected.length === 0) {
      return <em>최근 생성 순</em>;
    }
    return selected.join(", ");
  }}
  MenuProps={MenuProps}
  inputProps={{
    "aria-label": "Without label",
  }}>
  <MenuItem // 필요
    disabled
    value='' // <<< 바로 이 부분 : 빈 문자열 값을 가진 MenuItem을 별도로 넣는다.
    sx={{
      display: "none", // 보여줄 지 설정
    }}>
    <em>-</em>
  </MenuItem>
  {names.map((name) => (
    <MenuItem
      key={name}
      value={name}
      style={getStyles(name, personName, theme)}
      dir='ltr'>
      {name}
    </MenuItem>
  ))}
</Select>
```

---

📚 함께 보면 좋은 내용

[github::mui issues 18494](https://github.com/mui/material-ui/issues/18494)
