---
layout: post
date:   2022-03-08 20:38:22 +0900
title:  "[SPRING] Spring legacy project error"
author: Kimson
categories: [ SPRING, TIL ]
image: assets/images/post/covers/TIL-spring.png
tags: [ spring, error, legacy ]
description: "eclipse update 관련 에러 노트

spring boot와 vue를 혼합해서 사용하려다 보니 codemix라는 앱을 찾았는데요. 알고보니 유료인 것을 알고 빠르게 지웠더랬지요..."
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

# eclipse update 관련 에러 노트

spring boot와 vue를 혼합해서 사용하려다 보니 codemix라는 앱을 찾았는데요. 알고보니 유료인 것을 알고 빠르게 지웠더랬지요...

<del>공짜가 좋은데</del>

그렇게 update할 내용이 많아보여서 update를 시켰더니 프로젝트 생성할 때 문제가 생겼습니다.

## 에러 현상

Spring Legacy project에 mvc META-INF\MANIFEST.MF

## 에러 내용

```plaintext
An error has occurred.
See error log for more details.
Could not initialize class com.thoughtworks.xstream.converters.collections.PropertiesConverter
```

이 외에도 다른 오류를 뱉어내길래 검색을 해보니 이클립스에서 프로젝트를 생성할 때 `java` 버전과 `eclipse`의 버전이 맞지 않아서 충돌나는 것이라 합니다.

여러 방법을 시도하기 전에 `workspace`에 있는 `.metadata` 디렉토리를 삭제하고 이클립스를 재시작하니 !

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/error/spring-update-error01.png" alt="sample" title="sample">
   <figcaption>kimson</figcaption>
</span>
</figure>

업데이트된 버전으로 잘 켜집니다만 여전히 프로젝트는 생성이 안 됩니다.

저와 같은 상황을 겪는 분이 있으셔서 글을 참고해보니 `eclipse`의 `vm`경로를 바꾸셨더군요.

저도 뭔가 `vm` 경로가 잘못된 것 같아 고쳐봤습니다.

```ini
# ... 중략
-vm
#C:/Users/user/.p2/pool/plugins/org.eclipse.justj.openjdk.hotspot.jre.full.win32.x86_64_17.0.1.v20211116-1657/jre/bin
C:\Program Files\Java\jdk-11.0.13\bin\javaw.exe
# ... 중략
```

물론 자바 버전도 11로 맞춰주고 다시 실행해보면

<figure class="text-center">
<span class="w-inline-block">
   <img src="{{site.baseurl}}/assets/images/post/error/spring-update-error02.png" alt="sample" title="sample">
   <figcaption>kimson</figcaption>
</span>
</figure>

잘 됩니다... <del>스트레스</del>

-----

📚 함께 보면 좋은 내용

[OPENLUNCH님 :: [스프링 퀵스타트] DAY 01 CLASS 1.2c 실습 프로젝트 생성 그리고 오류 해결...완료!](https://openlunch.tistory.com/112){:target="_blank"}

[Haenny :: \[Error\] Spring 웹 프로젝트 META-INF\MANIFEST.MF \(지정된 경로를 찾을 수 없습니다\) 에러 해결](https://haenny.tistory.com/52)

