---
layout: post
date:   2021-08-26 15:07:42 +0900
title:  "[JAVASCRIPT] 현재 주소 알아내기"
author: Kimson
categories: [ TIL, JAVASCRIPT ]
tags: [geoplugin, geolocation]
image: assets/images/post/geolocation/geo01.png
description: "현재 주소를 알아내보자

이번 포스팅은 api를 이용해서 현재 주소를 출력하는 것을 해볼텐데요. 방법은 여러가지가 있습니다. 네이버, 구글 등의 API를 이용한다던가 `geoplugin`을 사용한다던가 `geolocation` API를 사용하는 등의 방법이 있습니다.

그중에서 저는 `geoplugin`을 사용했습니다. `geoplugin`은 사용법이 간단하고 구체적인 주소보다 도, 시, 구, 군, 동 중에서 도와 시까지만을 불러오기때문에 동에 번지까지 나오지느 않습니다."
featured: true
hidden: false
rating: 4
toc: true
profile: false
istop: true
keysum: false
keywords: ""
---

# 현재 주소를 알아내보자

이번 포스팅은 api를 이용해서 현재 주소를 출력하는 것을 해볼텐데요. 방법은 여러가지가 있습니다. 네이버, 구글 등의 API를 이용한다던가 `geoplugin`을 사용한다던가 `geolocation` API를 사용하는 등의 방법이 있습니다.

그중에서 저는 `geoplugin`을 사용했습니다. `geoplugin`은 사용법이 간단하고 구체적인 주소보다 도, 시, 구, 군, 동 중에서 도와 시까지만을 불러오기때문에 동에 번지까지 나오지느 않습니다.

투두리스트에 계획했던 연습프로젝트가 정해뒀던 기간이 지나서 아쉬운 마음에 `ui`는 포기하고 기능이라도 구현해서 마무리하고자 했는데, "야놀자" 사이트에 위치주소를 불러오는 기능을 구현해보고 싶어서 이리저리 찾다보니 알게 되어 포스팅합니다.

## 진짜 이제 주소를 알아보자

지오("이하 `geoplugin`")는 외부 `script`를 불러와서 사용하게 됩니다.
```html
<script language="JavaScript" src="http://www.geoplugin.net/javascript.gp" type="text/javascript"></script>
```

### 여러가지 함수들

```javascript
geoplugin_city(); // 시
geoplugin_region(); // 도
geoplugin_areaCode(); // 지역코드
geoplugin_countryCode(); // 국가코드 KR
geoplugin_countryName(); // 국가명 South korea
geoplugin_continentCode(); // 대륙코드 AS (Asia)
geoplugin_latitude(); // 위도 (지구본에서 극 방향)
geoplugin_longitude(); // 경도 (지구본에서 둘레방향)
geoplugin_currencyCode(); // 통화코드 KRW
geoplugin_currencySymbol(); // 통화 기호
geoplugin_request(); // ip출력

/**
 * JSON형태로 받아와 사용하는 경우
 */ 
// http://www.geoplugin.net/json.gp?ip=xx.xx.xx.xx
$.getJSON('http://www.geoplugin.net/json.gp?ip='+ip, function(data){
    let str = '';
    str += data['geoplugin_region']+'\n'; // data의 부분출력 예
    str += data['geoplugin_city']+'\n'; // data의 부분출력 예
    str += data['geoplugin_request']+'\n'; // ip 출력
    console.log(str);
    console.log(data); // 더 많은 데이터 출력
})
```

![주소받은모습]({{site.baseurl}}/assets/images/post/geolocation/geo01.png '주소받은모습')
{:.text-center}

이미지의 맨아래 두 줄은 getJson을 사용하여 받은 내용입니다.

1. 함수사용은 ip없이 현재 클라이언트 기준으로 지역 정보를 받는 것  
2. getJSON에서 주소와 ip를 직접 받는 query를 던져 지역정보를 받는 방법입니다.

보안에 대해서는 모릅니다만 ip가 공개되는 getJSON보다는 함수사용하는 것이 안전해보여서 저는 함수를 사용하여 연습 프로젝트에 적용하였습니다.

## 사용 예

![작업중인프로젝트]({{site.baseurl}}/assets/images/post/geolocation/geo02.png)

한글로 되어있는 것은 정규식으로 변환한 것 뿐입니다.

-----

> 참고 사이트

[MDN - Geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API){:target="_blank"}

[GeoPlugin](http://www.geoplugin.com/quickstart#how_to_geo-localize_your_visitors){:target="_blank"}

[Ip 알아내기](https://stackoverflow.com/questions/4937517/ip-to-location-using-javascript){:target="_blank"}

[늦깍이 공대생의 좌충우돌이야기님의 블로그](https://elecs.tistory.com/201){:target="_blank"}