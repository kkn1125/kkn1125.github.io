---
slug: "/spring-boot-file-upload"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-09-24 20:15:27 +0900
title:  "[SPRING] 파일 업로드 하기"
author: Kimson
categories: [ spring boot ]
tags: [ file, upload, til ]
image: assets/images/post/covers/TIL-spring.png
description: "File Upload
USED
`org.springframework.web.multipart.MultipartFile`
Multipart를 안 쓰다가 사용하니 처음에 조금 버벅거렸습니다."
featured: false
hidden: false
rating: 3.5
toc: true
profile: false
keysum: false
keywords: ""
published: true
---

# File Upload

> USED
`org.springframework.web.multipart.MultipartFile`

Multipart를 안 쓰다가 사용하니 처음에 조금 버벅거렸습니다.

## 파일 올리기

```java
public String addProduct(HttpServletRequest request, MultipartFile cover) {
	String fileName = ""; // 파일 이름
	String web_path = "/resources/img/upload"; // DB 저장될 경로명
	String absolutePath = request.getServletContext().getRealPath(web_path); // 절대경로

	File file = new File(absolutePath);

	if(!file.exists()) {
		System.out.println(file.mkdirs());
	}

	// String contentType = cover.getContentType();
	// if(!ObjectUtils.isEmpty(contentType)) {
	// 	fileName = cover.getOriginalFilename();
	// }
	file = new File(absolutePath + "/" + fileName);

	try {
		cover.transferTo(file);
	} catch (IllegalStateException e) {
		e.printStackTrace();
	} catch (IOException e) {
		e.printStackTrace();
	}
}
```

`file`의 목적 경로에 폴더가 존재하는지 여부를 보고 `mkdirs`로 상위 폴더를 전부 생성합니다. 절대경로를 얻는 방법은 많았지만 저는 다른 방법이 안되서 `ServletContext`로 받아왔습니다.

파일의 타입을 검증하고 싶으시면 `MultipartFile`로 받은 인자의 `getContenType`을 사용하면 됩니다.

`file`의 경로 설정이 다 되면 `transferTo`로 생성하면 끝납니다.

-----