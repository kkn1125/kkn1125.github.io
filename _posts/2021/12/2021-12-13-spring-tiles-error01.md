---
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-12-13 17:16:37 +0900
title:  "[SPRING] Tiles 설정 시 경로에 있는 파일을 못 찾을 때"
author: Kimson
categories: [ spring ]
image: assets/images/post/covers/TIL-spring.png
tags: [ tiles, not found, til ]
description: "Tiles 파일 못 찾을 때

저와 같은 상황이시라면 도움이 되시기를 바랍니다... 상황은 이렇습니다.

분명 `inc`라는 폴더에 `layout.jsp`를 `template`으로 불러오고 `body`라는 이름으로 `Controller`에서 `root.*`로 요청되는 페이지를 `{1}`에 매핑하여 불러올 때

분명히 `inc`폴더에 헤더나 푸터 파일을 생성하고 불러오면 안되는 현상이 발생했습니다."
featured: false
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# Tiles 파일 못 찾을 때

저와 같은 상황이시라면 도움이 되시기를 바랍니다... 상황은 이렇습니다.

분명 `inc`라는 폴더에 `layout.jsp`를 `template`으로 불러오고 `body`라는 이름으로 `Controller`에서 `root.*`로 요청되는 페이지를 `{1}`에 매핑하여 불러올 때

분명히 `inc`폴더에 헤더나 푸터 파일을 생성하고 불러오면 안되는 현상이 발생했습니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE tiles-definitions
    PUBLIC "-//Apache Software Foundation//DTD Tiles Configuration 3.0//EN" "http://tiles.apache.org/dtds/tiles-config_3_0.dtd">
<tiles-definitions>

    <definition name="baseTemp" template="/WEB-INF/views/inc/layout.jsp">
    	<put-attribute name="title" value="Home" />
    </definition>
    
    <definition name="root.*" extends="baseTemp">
    	<put-attribute name="title" value="Home" />
        <put-attribute name="body" value="/WEB-INF/views/{1}.jsp" />
        <put-attribute name="leftSide" value="/WEB-INF/views/inc/lsb.jsp" />
    </definition>

</tiles-definitions>
```

위의 코드는 작업 중에 만났던 에러부분입니다.

baseTemp에 template을 `/WEB-INF/views/inc/layout.jsp`로 지정했습니다. 로드가 안되는 부분이 `root.*`의 `leftSide`이구요.

물론 `layout.jsp`에서 `insertAttribute`속성에 `ignore`을 `true`로 한 상태였습니다.

이전 프로젝트에서 저렇게 불러왔던 기억이 있어 살펴보니 같은 경로가 아닌 서브폴더를 두고 불러오는 방식으로 되어 있는 것을 보고 폴더를 생성하여 `lsb.jsp`를 그 안에 넣고 실행했습니다.

결과는 성공...

# 결론

`extends`사용 시 `template`으로 사용하는 `layoutjsp`와 같은 경로에 있는 `jsp`파일을 `put-attribute`로 가져오면 발생하는 오류인 것 같습니다.

즉, `a/layout.jsp`로 `template`를 지정했다고 가정했을 때 `sidebar.jsp`를 특정 페이지에서만 붙이고 싶다면 파일경로를 `a/sidebar.jsp`가 아닌 `b/sidebar.jsp` 혹은 `a/b/sidebar.jsp`로 중첩되지 않는 경로로 설정해줘야 이런 에러를 피할 수 있을 것 같습니다.