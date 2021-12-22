---
layout: post
date:   2021-10-25 22:27:25 +0900
title:  "[JAVASCRIPT] 웹 튜토리얼 구현하기"
author: Kimson
categories: [ JAVASCRIPT, TIL, TIM ]
image: assets/images/post/covers/TIL-javascript.png
tags: [ web, tutorial, helper ]
description: "웹 튜토리얼

이름을 웹 튜토리얼이라 붙이긴 했습니다만, 웹 상에서 UI가 복잡하거나 독특하게 꾸며졌을 때 사용자에게 안내를 해주는 기능을 구현하기로 했습니다.

현재 문서화 어플리케이션을 프리 릴리즈 중에 있습니다. 문서화를 하면서 길게 늘어선 글 보다는 핵심적인 부분에 강조하여 필요한 설명만 붙이는 기능이 있으면 좋겠다는 생각에 만들게 되었습니다."
featured: true
hidden: false
rating: 5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# 웹 튜토리얼

이름을 웹 튜토리얼이라 붙이긴 했습니다만, 웹 상에서 UI가 복잡하거나 독특하게 꾸며졌을 때 사용자에게 안내를 해주는 기능을 구현하기로 했습니다.

현재 문서화 어플리케이션을 프리 릴리즈 중에 있습니다. 문서화를 하면서 길게 늘어선 글 보다는 핵심적인 부분에 강조하여 필요한 설명만 붙이는 기능이 있으면 좋겠다는 생각에 만들게 되었습니다.

문서화 어플리케이션에 추후 합쳐서 다시 포스팅으로 소개하려합니다.

## 기능 구현

주요 기능으로는 `selector`라는 html 태그 중 설명을 붙여야하는 태그정보(`id` > `className` > `tagName`)와 그에 따르는 설명(`msg`)만 있으면 알아서 태그를 찾습니다. 없는 태그정보는 에러를 반환하고, 찾은 태그정보는 배열에 담아 순차적으로 실행되도록 되어있습니다.

`CDN`은 아래와 같습니다.

```html
<script src="https://cdn.jsdelivr.net/gh/kkn1125/tutorial@update-1/tutorial.js"
	integrity="sha384-QoJ9qdYpjWWNwkqNRgsPBX5luJVuldH5I+mXBXM53xuYlaea01lXk4TCqt6E4iZL" crossorigin="anonymous">
</script>
```

테스트로 샘플페이지는 포스팅 하단에 링크를 두었습니다.

설정은 누구나 쉽게 적용하고 조정할 수 있게 옵션을 최소한으로 했습니다. 물론 스타일 부분은 어색하지 않을 정도만 `default`값을 주고 급하게 사용한다면 `selector`만 입력해서 사용가능하도록 했습니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	<script src="https://cdn.jsdelivr.net/gh/kkn1125/tutorial@update-1/tutorial.js"
		integrity="sha384-QoJ9qdYpjWWNwkqNRgsPBX5luJVuldH5I+mXBXM53xuYlaea01lXk4TCqt6E4iZL" crossorigin="anonymous">
	</script>
	<script src="index.js"></script>
</body>
</html>
```

```javascript
// index.js

const tutorial = Tutorial.init({
	selector: [
		{
			name: 'footer',
			msg: 'test입니다.',
		},
		{
			name: 'this-is-class',
			msg: 'test입니다.',
		},
		{
			name: 'thisIsId',
			msg: 'test입니다.',
		},
	],
	style: {
        layerLine: true,
        padding: "1rem",
        bgColor: "rgba(0,0,0,0.2)",
        border: {
            rounded: "1rem",
            width: "3px",
            color: "#eb47a8",
            line: "solid",
        },
        msgBox: {
            bgColor: "rgba(0,0,0,0.5)",
			color: "white",
        }
	}
});
```

기본적으로 제공되는 옵션은 아래 설명과 같습니다.

{:.table}
|구분|기능|기본값|
|---|---|---|
|layerLine|테두리를 border\|중첩레이어 로 설정|true(default)|
|padding|목표 태그에 강조하는 박스의 padding을 설정 (css dimensions)|1rem(default)|
|bgColor|목표 태그에 강조하는 박스 외 배경색상 설정 (css dimensions)|rgba(0,0,0,0.2)(default)|
|border|강조 박스 테두리를 설정 (css dimensions)||
| - rounded| 모서리 라운딩 설정 (css dimensions)|1rem(default)|
| - width| 테두리 두께 (css dimensions)|3px(default)|
| - color| 테두리 색상 (css dimensions)|#eb47a8(default)|
| - line| 테두리 스타일 (css dimensions)|solid(default)|
|msgBox| 설명 박스 설정 (css dimensions)||
| - bgColor| 설명 박스 배경색상 설정 (css dimensions)|rgba(0,0,0,0.5)(default)|
| - color| 설명 박스 폰트 색상 설정 (css dimensions)|white(default)|

스타일 초기값이 있어 `selector`만 지정해도 됩니다.

-----

> Github Repo :: devkimson

[깃허브 저장소 :: tutorial](https://github.com/kkn1125/tutorial){:target="_blank"}

[깃페이지 :: tutorial sample](https://kkn1125.github.io/tutorial/){:target="_blank"}