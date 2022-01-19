---
layout: post
modified: 2022-01-19 15:55:53 +0900
date:   2021-08-09 20:01:15 +0900
title:  "[JAVASCRIPT] 정적웹에 다크모드 적용하기 01"
author: Kimson
categories: [ TIL, JAVASCRIPT ]
tags: [ darkmode ]
image: assets/images/post/covers/TIL-javascript.png
description: "다크모드

사용자 인터페이스에서 밝고 검은 글자 대신 어둡고 흰 글자를 나타내는 테마

요즘 다크모드가 핫한 기능이라고 해서 따라해보려고 합니다. 특히나 밤에 모바일로 기사를 읽거나 사이트를 이용할 때 아무리 폰의 밝기를 낮춰도 눈에 피로감이 가기 마련인데요.

피로한 눈을 보호하기도 하고 밝은 색상이 아닌 어두운 색상을 선호하는 사람들에게 좋을 것 같습니다.

그런데 요 며칠간 고민되었던 부분은 구현방법입니다. 동적 웹의 경우 서버측에서 데이터베이스나 요청 등을 관리해서 손쉽게 토글버튼으로 값을 저장하여 구현됩니다."
featured: false
hidden: false
rating: 5
toc: true
profile: false
istop: true
keysum: false
keywords: ''
---

# 다크모드

> 사용자 인터페이스에서 밝고 검은 글자 대신 어둡고 흰 글자를 나타내는 테마

요즘 다크모드가 핫한 기능이라고 해서 따라해보려고 합니다. 특히나 밤에 모바일로 기사를 읽거나 사이트를 이용할 때 아무리 폰의 밝기를 낮춰도 눈에 피로감이 가기 마련인데요.

피로한 눈을 보호하기도 하고 밝은 색상이 아닌 어두운 색상을 선호하는 사람들에게 좋을 것 같습니다.

그런데 요 며칠간 고민되었던 부분은 구현방법입니다. 동적 웹의 경우 서버측에서 데이터베이스나 요청 등을 관리해서 손쉽게 토글버튼으로 값을 저장하여 구현됩니다.

하지만 정적 웹에서는 어떻게 화면모드의 설정값을 저장하고, 유지시키고, 활용하는지에 의문이 들었습니다.

## 2가지 방식

여러 사이트 둘러볼 것 없이 네이버에서 찾을 수 있었습니다. 쿠키를 설정하는 방법과 localStorage를 설정하는 방법이었는데요, 여러 문서를 보다가 아주 잘 정리한 글을 덤으로 찾기도 했습니다.

쿠키에 대해 잘 모르시는 분들은 [[JAVA] Cookie에 관한 고찰](https://kkn1125.github.io/java-cookie/){:target="_blank"}을 읽어보시면 소정의 도움이 될 것 같습니다.

### 네이버의 쿠키 방식

![네이버]({{site.baseurl}}/assets/images/post/darkMode/dark01.png '네이버')

네이버에는 언제부터인가 다크모드 버튼이 우측하단에 나타나기 시작했습니다. 먼저 버튼을 클릭했을 때 localStorage의 변화인지 cookie의 변화인지 살펴봐야했습니다.

![네이버]({{site.baseurl}}/assets/images/post/darkMode/dark02.png '네이버')

라이트 모드일때 localStorage 모습입니다.

![네이버]({{site.baseurl}}/assets/images/post/darkMode/dark03.png '네이버')

다크 모드일때 localStorage 모습입니다.

네이버는 localStorage에서 설정한 타입이 아닌 것 같습니다. 다음은 쿠키의 변화를 보겠습니다.

![네이버]({{site.baseurl}}/assets/images/post/darkMode/dark04.png '네이버')

벌써부터 "나 다크모드 설정이야!"라고 외치는 녀석이 보입니다. 라이트모드를 켜서 명확히 보겠습니다.

![네이버]({{site.baseurl}}/assets/images/post/darkMode/dark05.png '네이버')

네, 맞네요.  
네이버는 현재 라이트모드면 N, 다크모드면 Y값을 NDARK라는 키에 저장하고 있습니다.

여기서 화면의 모드가 변할 때 특징은 새로고침이 된다는 것입니다. 

하지만 저는 화면이 새로고침 되지 않고 ajax통신하듯 변하는 방식을 채택하고 싶어서 조금 더 찾아봤습니다.

### localStorage 방식

현재 깃허브페이지의 Theme 모드를 바꾸어보면 잘 바뀌고 유지가 되는 것을 볼 수 있습니다. 잘 보면 localStorage에 dark모드 설정 값이 굉장히 긴데요. 바뀌는 값들이 제 각각입니다.

여기서 깃허브는 System.register라는 것을 사용해서 다크모드를 조정하는 듯 합니다. 이것이 무엇인지는 아직 잘 모르는 상황이라 간단하게 구현만 해보겠습니다.

localStorage에 대한 지식이 아직 많이 없어 [MDN](https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage){:target="_blank"}의 자료 설명을 빌리겠습니다.

> Window.localStorage
>
> 저장 테이터는 브라우저 세션 간 공유.
> sessionStorage와 비슷하지만 localStorage 데이터는 만료되지 않고,  
> sessionStorage 데이터는 페이지를 닫을 때 사라지는 것이 차이점입니다.
> 특징으로는 프로토콜별로 구분되며, http://kimson.com과 https://kimson.com은 다른 localStorage에 저장됩니다.

콘솔에 localStorage를 찍어 프로토타입을 보면 사용 메서드가 키 기반의 컬렉션과 유사하다는 것을 알 수 있습니다.

간단한 예제로 구현해보겠습니다.

# 다크모드 구현하기

## HTML

> html구조는 예제이므로 소스를 긁어와 만들어보겠습니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <!--
        meta, link ...
    -->
    <title>Document</title>
</head>
<body>

    <!--
        navbar ...
    -->
    
    <div class="container pt-4 mt-5">
        
        <h1>다크모드 테스트</h1>

        <div class="card mb-3" style="max-width: 100%;">
            <div class="row g-0">
              <div class="col-md-4">
                <img src="profilecard.jpg" class="img-fluid rounded-start" alt="prf"
                style="height: 100%; width:auto; object-fit: cover;">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">Dev Kimson</h5>
                  <p class="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, animi, cupiditate obcaecati officia dolorum maxime exercitationem ratione quasi ea veniam doloremque quia fugit iusto? Cumque harum rem neque et modi.</p>
                  <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                </div>
                <div class="float-end me-3 form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked>
                    <label class="form-check-label fw-bold" for="flexSwitchCheckChecked">Dark Mode</label>
                </div>
              </div>
            </div>
        </div>

        <div id="list" class="row">

        </div>
        
    </div>

    <script src="main.js"></script>

    <!--
        script ...
    -->
</body>
</html>
```

```css
/**
 * body에 dark 클래스를 줄 예정이기 때문에 먼저 
 * 다크모드 컬러를 맞추어 봅니다.
 */
body{
    background-color: #222222;
    color: white;
}

body .card{
    background-color: #444444;
    color: inherit;
}

body .navbar{
    background-color: #111111 !important;
}

body .navbar *{
    color: inherit!important;
}

body .navbar-toggler{
    background-color: #999999;
    filter:invert();
}
```

![급조]({{site.baseurl}}/assets/images/post/darkMode/dark06.png '급조')
*\- Light Mode입니다.*{:.text-muted}

![급조]({{site.baseurl}}/assets/images/post/darkMode/dark07.png '급조')
*\- Dark Mode입니다.*{:.text-muted}

대충 만들어봅니다. 카드, 네비게이션의 컬러를 폭넓게 바꿔야하기에 예제로 몇가지만 넣었습니다.

이제 다크모드 버튼에 토글식으로 localStorage에 접근하여 값을 조정해보겠습니다.

```javascript
function change(value){
    document.querySelector('[for="modeToggle"]').innerHTML = value!='N'?"Dark Mode":"Light Mode";
    document.body.setAttribute("class",value!='N'?"dark":"light")
    document.querySelector('#modeToggle').checked = value!='N'?true:false;
}
```

페이지가 로드되거나 토글버튼을 클릭할 때의 기능들은 동일하기 때문에 함수로 하나 만들었습니다. `value` 값에 따라 변하며 `true`이면 다크모드, `false`이면 라이트모드가 되도록 하겠습니다.

`line 1` 라벨태그의 이름을 다크모드와 라이트모드로 나눕니다.
`line 2` 바디 클래스명 설정.
`line 3` 토글버튼 체크 값을 설정.

```javascript
// 페이지 로드 시 change 함수 실행
window.addEventListener('load', function(){
    change(localStorage.getItem('dark'));
});

// 토글 값 변화 감지
document.querySelector('#modeToggle').addEventListener('change', function(event){
    if(event.target.checked){
        localStorage.setItem("dark","Y")
        change(localStorage.getItem('dark'));
    } else {
        localStorage.setItem("dark","N")
        change(localStorage.getItem('dark'));
    }
})
```

MDN의 정보대로면 페이지가 꺼지고도 값에 따라 모드가 유지되어야 하며, 페이지 이동시에도 유지되어야 합니다.

테스트 해보겠습니다.

![테스트]({{site.baseurl}}/assets/images/post/darkMode/dark08.png '테스트')
*\- 먼저 라이트모드로 두고 끕니다.*{:.text-muted}

![테스트]({{site.baseurl}}/assets/images/post/darkMode/dark09.png '테스트')
*\- 완전 끄고 다시 접속하겠습니다.*{:.text-muted}

![테스트]({{site.baseurl}}/assets/images/post/darkMode/dark10.png '테스트')
*\- 라이트 모드네요. 하지만 저는 저를 안 믿습니다. 다크모드로 해보겠습니다.*{:.text-muted}

![테스트]({{site.baseurl}}/assets/images/post/darkMode/dark11.png '테스트')
*\- 다크모드해 주시구요. `value`는 Y가 됩니다.*{:.text-muted}

![테스트]({{site.baseurl}}/assets/images/post/darkMode/dark12.png '테스트')
*\- 다시 켜보겠습니다. 다크로 유지가 되면 곧 바로 이 블로그에 적용해두겠습니다. 헤헤*{:.text-muted}

![테스트]({{site.baseurl}}/assets/images/post/darkMode/dark13.png '테스트')
*\- 와... 왜 되는거지... 됩니다.*{:.text-muted}

여기까지 정적웹에 다크모드를 알아보고 직접 적용해봤습니다.  
제가 참고한 사이트는 아래 링크로 남겨두었습니다.

`window.matchMedia`를 사용하면 더욱 쉬울 것 같습니다만 제가 아직 `matchMedia`를 처음 접해서 이번 주제 다룰 때는 `change`로만 감지해서 구현해보았습니다. 다음에 기회가 된다면 `matchMedia`로 사용자 설정에 접근하여 자동으로 mode를 감지하도록 해보겠습니다.

-----

[localStorage 사용법 - DaleSeo님의 블로그](https://www.daleseo.com/js-web-storage/ 'localStorage 참고 사이트'){:target="_blank"}

[정적웹 Dark 모드 - josephk님의 블로그](https://www.josephk.io/review-dark-mode/ '정적웹 Dark 모드 참고 사이트'){:target="_blank"}

