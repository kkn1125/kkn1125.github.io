---
layout: post
date:   2021-08-07 15:18:43 +0900
title:  "[SPRING] xml 없이 에러페이지 처리하기"
author: Kimson
categories: [ TIL, SPRING ]
tags: [javaconfiguration, exception, "404"]
image: assets/images/post/covers/TIL-spring.png
description: "xml 없는 프로젝트

꽤 오랫동안 묵혀뒀던 주제였습니다. Spring 책을 보면서 최근 web.xml(context-*.xml 등) 파일 없이 자바화 한다는 추세라는 문구를 보고 무작정 따라했던 기억이 납니다.  
그 영향에 현재도 xml파일 없이 구현 중에 있습니다.

이러한 레퍼런스가 오랜시간 쌓인게 아니기때문에 오류와 직면할때마다 외국 모사이트에 비슷한 의논을 찾아 영어 번역에만 두시간 쏟기도 합니다.

그래서 저와 같은 초보의 입장에서 비슷한 문제로 고민하고 있는 분들께 알리고, 제 나름의 기록을 해놓고자 합니다."
featured: true
hidden: false
rating: 5
toc: true
profile: false
istop: true
keysum: true
keywords: '
@ExceptionHandler(Class class[]) : 컨트롤러 메서드 실행과정에 Exception이 발생할 때 직접 처리하기 위해 사용
_@ControllerAdvice("controllerPackageName") : ExceptionHandler와 달리 다수의 컨트롤러에서 동일 타입 Exception을 처리한다. 지정된 컨트롤러에서 발상하는 Exception을 처리할때 사용.
_@ResponseStatus(HttpStatus.STATUS_CODE) : 클라이언트에 응답되는 페이지의 헤더에 열거형 응답코드를 적용하여 전송
_EL표현식 : ${...}형태로 사용되며, 요청에 담은 변수나 객체의 이름을 그대로 사용한다. 종류에따라 param,session,application등이 있다.
'
---

# xml 없는 프로젝트

꽤 오랫동안 묵혀뒀던 주제였습니다. Spring 책을 보면서 최근 web.xml(context-*.xml 등) 파일 없이 자바화 한다는 추세라는 문구를 보고 무작정 따라했던 기억이 납니다.  
그 영향에 현재도 xml파일 없이 구현 중에 있습니다.

이러한 레퍼런스가 오랜시간 쌓인게 아니기때문에 오류와 직면할때마다 외국 모사이트에 비슷한 의논을 찾아 영어 번역에만 두시간 쏟기도 합니다.

그래서 저와 같은 초보의 입장에서 비슷한 문제로 고민하고 있는 분들께 알리고, 제 나름의 기록을 해놓고자 합니다.

## Error Page 처리

> **작업 환경**
> - spring legacy project
> - springframework 5.3.6
> - jackson data bind
> - junit
> - spring test
> - tiles
> - tomcat 9.0.43

외국 사이트에서 찾은 내용을 토대로 처리하는 방법을 알려드리겠습니다.

아래는 현재 테스트용 프로젝트의 파일구조입니다.

![작업환경]({{site.baseurl}}/assets/images/post/exception/exception01.png)

exception 처리 하기위해 test폴더에 파일을 두개 만듭니다.  

1. errorPage(에러페이지 이동 링크가 있는 페이지)
2. 404 ... 처리로 뜨는 페이지

### Exception 페이지 처리

아무런 처리를 하지 않으면 흔히 보는 친절?하게 에러를 표시하는 페이지가 나옵니다.

![친절한 에러페이지]({{site.baseurl}}/assets/images/post/exception/exception02.png)

웹페이지 보안상 너무 친절하게 정보를 알려주면 위험하니 얼른 바꾸어 봅시다.

우선 에러 코드가 담기는 Json파일을 만들겠습니다.
자바에서 Jackson databind로 Json처리가 어려우신 분은 [[JAVA] Json 기본 익히기](https://kkn1125.github.io/java-jackson-databind/){:target="_blank"}를 보고오시면 도움이 됩니다.

```json
// 원래 json파일은 주석이 없습니다.
// 편의를 위해 달겠습니다.

[ // List 배열로 받아오기 위해 배열로 열었습니다.
	{
		"status":"403",
		"code":"Forbidden",
		"reason":"",
		"message":"잘못된 접근입니다.<a href='/' class='btn btn-info'>메인으로</a>"
	},
	{
		"status":"404",
		"code":"Not Found",
		"reason":"",
		"message":"페이지를 찾을 수 없습니다.<a href='/' class='btn btn-info'>메인으로</a>"
	},
	{
		"status":"500",
		"code":"Internal Server",
		"reason":"",
		"message":"페이지를 처리하는데 오류가 발생했습니다. 오류가 지속된다면 관리자에게 문의해주세요."
	}
    // 아래 ExceptionError VO객체와 동일한 정보값으로 설정합니다.
    // json리스트 받을 시 VO와 타입을 맞추기 위함입니다.
    // reason을 비워둔 이유는 exception이 발생 이유가 각각 다르기때문에 따로 받기위함입니다.
]
```

에러코드와 문구를 미리 만들어 놓고 ExceptionError라는 vo를 만들어 관리하겠습니다.

간단하게 주로 발생하는 3가지 종류의 코드를 적어두었습니다.

이제 json을 나중에 불러와 파싱하고 객체에 담아 전송할 것입니다.

다음은 에러코드를 받는 vo를 만들어줍니다.

```java
public class ExceptionError
{
	private String status;
	private String code;
	private String reason;
	private String message;

    public ExceptionError () {}
	
	public ExceptionError(String status, String code, String reason, String message) {
		super();
		this.status = status;
		this.code = code;
		this.reason = reason;
		this.message = message;
	}

    // getter,setter ...
}
```

에러페이지를 처리하는 부분만 남았습니다.
에러 처리를 위해 WebConfig에 디스패처 생성구문을 적어주세요.

```java
@EnableWebMvc
@Configuration
@ComponentScan(basePackages = {"com.practicePrj.web"})
public class WebConfig extends AbstractAnnotationConfigDispatcherServletInitializer
{

    // RootConfig.class ... 
    // ServletConfig.class ...

    @Override // 에러 처리를 위해 필요한 디스패처 생성
    protected DispatcherServlet createDispatcherServlet(WebApplicationContext servletAppContext) {
        final DispatcherServlet dispatcherServlet = (DispatcherServlet) super.createDispatcherServlet(servletAppContext);
        dispatcherServlet.setThrowExceptionIfNoHandlerFound(true);
        return dispatcherServlet;
    }

}
```

ControllerAdvisor 어노테이션으로 공통 익셉션 처리를 구현하고 ExceptionHandler를 사용해서 각 에러코드별로 처리를 하도록 나누겠습니다..

```java
@RestControllerAdvice
public class ControllerAdvisor
{
	@ExceptionHandler({NoHandlerFoundException.class})
    // 지정한 Exception 발생시 처리가능하도록 위임됨
    // 처리할 Exception Type은 여러개 지정 가능
	@ResponseStatus(HttpStatus.NOT_FOUND)
    // 응답에 404를 띄어주는 역할
	public ModelAndView notFoundExceptionHandler(NoHandlerFoundException ex) {
        // 인자로 *Exception 클래스를 받음
		ModelAndView mv = new ModelAndView("test.errorPage");
        // tiles를 쓰기때문에 tiles에 지정된 경로와 맞춥니다.
		ClassLoader classLoader = getClass().getClassLoader();
		// 클래스로더로 불러오면 리소스경로에서 찾아준다.
		File file = new File(classLoader.getResource("errorCode.json").getFile());
        // json파일 인스턴스에 저장합니다.
		ObjectMapper mapper = new ObjectMapper();
		ExceptionError e1 = null;
		try {
			List<ExceptionError> err = mapper.readValue(file, new TypeReference<List<ExceptionError>>() {});
            // ExceptionError를 담는 List타입으로 꺼내옵니다.
			System.out.println(err);
			for(ExceptionError ee : err) {
				if(ee.getStatus().equals("404")) {
                    // 에러코드가 404인 vo를 저장시킵니다.
					e1 = ee;
				}
			}
			e1.setReason(ex.getMessage());
            // 발생한 에러 메세지를 객체의 reason에 담습니다.
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		mv.addObject("exception",e1);
        // exception이라는 이름으로 객체를 전송합니다.
		return mv;
	}
}
```

ModelAndView를 사용하여 응답페이지 경로와 json에서 얻은 에러 객체를 함께 보냅니다.

데이터를 페이지에 뿌리기 전 404가 잘 연결되는지 테스트해봅시다.

![에러테스트페이지]({{site.baseurl}}/assets/images/post/exception/exception03.png)

빨간 링크는 `/toast`라는 존재하지 않는 경로로 연결됩니다.

![에러테스트페이지]({{site.baseurl}}/assets/images/post/exception/exception04.png)

잘 연결이 됩니다!

에러코드, 상태, 메세지, 이유가 나오게 됩니다. 이 부분은 방금 모델뷰에 담은 내용을 EL표현식으로 뽑아서 보겠습니다.

```html
<h1>에러 페이지</h1>

<div>
	<h3>${exception.code}</h3> <!-- 에러코드 -->
	<hr>
	<div class="mb-5">
		<div>${exception.status}</div> <!-- 에러 상태 -->
		<div>${exception.message}</div> <!-- 에러 메세지 -->
		<div>${exception.reason}</div> <!-- 에러 이유 -->
	</div>
</div>
```

![404페이지]({{site.baseurl}}/assets/images/post/exception/exception05.png)

헤로쿠로 블로그를 만들때에도 방법을 몰라서 그냥 두고 썼는데 속이 뻥 뚫리는 기분입니다.

아직 알아야 할 부분이 많고, 자세히 모르는 부분을 설명없이 방법만 설명해서 글을 써놓고도 부끄럽습니다.

httpstatus 코드는 많은 도큐먼트에서 알려주고 있어서 검색하기 쉽습니다.
혹시 찾기 어려우신 분은 [마이크로소프트 Docs HttpStatusCode](https://docs.microsoft.com/ko-kr/dotnet/api/system.net.httpstatuscode?view=net-5.0 'microsoft HttpStatusCode'){:target="_blank"}를 참고하시면 되겠습니다.

자주 사용되는 403, 404, 500에 대한 status와 exception class는 키워드에 같이 남겨두겠습니다.