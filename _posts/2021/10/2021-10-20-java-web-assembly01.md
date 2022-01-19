---
layout: post
modified: 2022-01-19 15:55:53 +0900
date:   2021-10-20 11:27:25 +0900
title:  "[SPRING] JWebAssembly를 사용해보자"
author: Kimson
categories: [ SPRING, TIL ]
image: assets/images/post/covers/TIL-spring.png
tags: [ jdbc, template ]
description: "WebAssembly란

웹 어셈블리는 최신 웹 브라우저에서 실행할 수 있는 새로운 유형의 코드입니다. C나 C++, Rust, Java와 같은 언어를 웹에서 사용할 수 있게 해준다고 합니다. 아직 공부중인 영역이라 MDN 웹어셈블리를 참고하시면 좋을 것 같습니다. 추가로 참고한 사이트는 맨 하단에 링크를 남기겠습니다."
featured: false
hidden: false
rating: 4.5
toc: true
profile: false
keysum: false
keywords: ""
published: true
---

# WebAssembly란

웹 어셈블리는 최신 웹 브라우저에서 실행할 수 있는 새로운 유형의 코드입니다. C나 C++, Rust, Java와 같은 언어를 웹에서 사용할 수 있게 해준다고 합니다. 아직 공부중인 영역이라 [MDN 웹어셈블리](https://developer.mozilla.org/ko/docs/WebAssembly){:target="_blank"}를 참고하시면 좋을 것 같습니다. 추가로 참고한 사이트는 맨 하단에 링크를 남기겠습니다.

웹어셈블리를 어제 막 알게 되었습니다. 유튜브의 신기한 알고리즘 덕에 `코딩애플`님의 영상을 보고 조금이나마 머리속에 남게 되었는데요.

서버 없이 구동을 시킬 수 있다는 마법같은 이야기인지 단순히 빠르게 돌릴 수 있도록 해주는 것인지는 잘 모르겠습니다.

주로 쓰는 언어인 Java를 webassembly로 변환할 수 있도록 도와주는 JWebAssembly라는 라이브러리를 받아 테스트한 것을 기록하고자 합니다.

## JWebAssembly 사용

> 실행환경  
> java openjdk 11.0.12  
> JWebAssembly-api v0.3  
> JWebAssembly Compiler v0.3  
> eclipse java  

스프링 Test도 작동 됩니다.

WebAssembly로 변환할 대상 클래스를 생성합니다.

```java
// Add.java
import de.inetsoftware.jwebassembly.api.annotation.Export;

public class Add {
	@Export
	public static int add(int a, int b) {
		return a+b;
	}
	@Export
	public static int minus(int a, int b) {
		return a-b;
	}
}
```

@Export라는 어노테이션으로 변환시킬 함수들을 내보냅니다. Export가 빠진 함수는 제외됩니다.

```java
// testWasm.java
import java.io.File;

import de.inetsoftware.jwebassembly.JWebAssembly;

public class testWasm {
	public static void main(String[] args) {
		JWebAssembly wasm = new JWebAssembly();
		wasm.addFile(new File("bin/testwasm/Add.class"));
		String text = wasm.compileToText();
		System.out.println(new File("bin/testwasm/Add.class").canRead());
		System.out.println(text);
	}
}
```

JWebAssembly을 하나 생성하고 addFile메서드로 변환대상 파일을 인자로 줍니다. 이때 Add.class인 점을 보셔야합니다. 계속 java로 해서 한참을...

class파일은 java에서는 bin에 들어있고, spring이나 jsp는 target/classes에 들어있습니다.

canRead로 확인해보고 `compileToText`로 변환 내용을 받아 출력해서  아래와 같이 나오면 성공입니다.

![wasm]({{site.baseurl}}/assets/images/post/wasm/wasm01.png)

이후로 어떻게 사용하고 하는지는 더 공부해서 기록에 남기려합니다.

-----

> 참고사이트

[WebAssembly from the Java Perspective](https://speakerdeck.com/dalexandrov/webassembly-from-the-java-perspective?slide=108)
{:target="_blank"}