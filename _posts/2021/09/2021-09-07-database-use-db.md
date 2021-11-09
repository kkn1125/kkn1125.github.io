---
layout: post
date:   2021-09-07 15:37:12 +0900
title:  "[DATABASE] 정적 웹에서 데이터베이스 사용하기"
author: Kimson
categories: [ TIL, SPRING, JAVASCRIPT ]
tags: [database, external, storage]
image: assets/images/post/database/db01.png
description: "데이터베이스를 사용해보자

`ToDo List`에서 가장 묵혀두었던 주제인데요. 안 될 것 같으면서도 될 것 같아서 흐지부지하고만 있었습니다.

파이썬으로 코딩테스트 준비만 하다가 `JS`와 `Spring`을 잊어버리지는 않을까 해서 그런 핑계로 테스트 해봤습니다."
featured: false
hidden: false
rating: 5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
---

# 데이터베이스를 사용해보자

`ToDo List`에서 가장 묵혀두었던 주제인데요. 안 될 것 같으면서도 될 것 같아서 흐지부지하고만 있었습니다.

파이썬으로 코딩테스트 준비만 하다가 `JS`와 `Spring`을 잊어버리지는 않을까 해서 그런 핑계로 테스트 해봤습니다.

정적웹에서 데이터베이스를 이용하자니 java나 nodejs등을 써야하는데 nodejs는 그저 조금 써봤고, java를 구동하자니 github 페이지를 spring으로 구현하는 방법은 모르겠고 해서 조금의 꼼수를 생각해봤습니다.

> 필요한 준비물
1. heroku app
2. jquery ( AJAX )
3. MySQL
4. Spring Boot (Spring이나 JSP도 가능하다 생각됩니다.)

> Used
1. spring-boot-starter-* 2.5.4
2. spring-boot-configuration-processor 2.5.4
3. tomcat-embed0jasper[privided] 9.0.52
4. mybatis-spring-boot-starter 2.2.0
5. mysql-connector-java 8.0.26
6. lombok 1.18.20

## 외부 데이터베이스 사용 구현

우선 생각은 이랬습니다.

1. 헤로쿠 앱을 하나 생성한다.
2. 외부 저장소를 하나 만든다. (JawsDB를 채택했습니다.)
3. `restful` 하게 만들어 `JSON`으로 데이터를 주고 받는다.
4. `table`을 만드는 `query`도 만든다. (`table`을 정적 웹상에서 `form`으로 만들고 지우는 것)

그래서 저는 테스트용으로 `heroku app`을 채택했습니다. `spring`으로 서버 구현이 쉽기도 하고 데이터베이스를 무료로 사용할 수 있게 add on을 지원해주기 때문입니다.

> heroku에서 db를 사용할 때 clearDB는 utf8이 지원이 안되어서 jawsDB를 사용하는 것을 추천드립니다.

### 헤로쿠 앱 생성

![헤로쿠]({{site.baseurl}}/assets/images/post/database/db02.png)

먼저 헤로쿠 앱 하나를 생성합니다. 그리고 Spring Boot로 프로젝트 하나를 만듭니다.

`add-on`을 `jawsDB`로 추가시키고 저장소 `url`과 `username`, `password`, `dbname`을 `spring boot`의 `properties`에 추가할 것이기 때문에 알아둬야합니다.

위 이미지의 `jawsDB MySQL`을 클릭하면 본인의 `db`정보를 볼 수 있습니다.

### Spring boot prj 설정

프로젝트는 `RestController` 하나는 사용해볼 것이므로 딱히 `view`단의 파일들은 필요 없습니다.

```properties
# mysql settings
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://{hostName}:3306/{databaseName}?useUnicode=yes&characterEncoding=UTF-8&maxActive=20&allowMultiQueries=true&serverTimezone=Asia/Seoul
spring.datasource.username= {Id}
spring.datasource.password= {Password}

mybatis.type-aliases-package=com.repotest.web.entity
```

프로퍼티파일은 위와 같이 설정했습니다. 콧수염 괄호("{", "}") 는 빼고 입력하시면 됩니다.

```java
// ServletConfig.java

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = { "com.repotest.web" })
public class ServletConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("localhost:8080/", "your herokuapp baseurl").allowedMethods(
            // "GET","POST","PUT","DELETE"
            HttpMethod.GET.name(), HttpMethod.HEAD.name(), HttpMethod.POST.name(), HttpMethod.PUT.name(),
            HttpMethod.DELETE.name());
    }
    
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/resources/**") // 매핑 URI 설정
				.addResourceLocations("/resources/"); // 정적 리소스 위치 설정
	}
}
```

`servletconfig.java`를 생성합니다. `cors`매핑과 `resources` 경로를 잡아줍니다.

resources 매핑은 굳이 필요 없다고 생각되지만 나중에 `js`등을 연결해서 데이터를 중간에서 가공할 때 필요할 것 같아 작성 해두었습니다.

```java
// WebConfig.java

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = { "com.repotest.web" })
public class WebConfig extends AbstractAnnotationConfigDispatcherServletInitializer{
	@Override
	protected Class<?>[] getRootConfigClasses()
	{
		return new Class[] {};
	}

	@Override
	protected Class<?>[] getServletConfigClasses()
	{
		return new Class[] {ServletConfig.class};
	}

	@Override
	protected String[] getServletMappings()
	{
		return new String[] {"/"};
	}
	
	@Override
	protected Filter[] getServletFilters() {
		HiddenHttpMethodFilter httpMethodFilter = new HiddenHttpMethodFilter();
	    CharacterEncodingFilter encodingFilter = new CharacterEncodingFilter();
	    encodingFilter.setEncoding("UTF-8");
	    encodingFilter.setForceEncoding(true);
	    return new Filter[] { httpMethodFilter, encodingFilter };
	}
}
```

필터도 하나 만들어 줍니다. 가끔 한글이 깨지는 것을 경험하고 난 후로는 모든 프로젝트에 추가하고 있습니다.

```java
// MemberMapper.java

@Mapper
public interface MemberMapper {
	@Select("SELECT * FROM member")
	List<Member> getList();
	@Select("select * from member where concat(id,name,age,gender) like '%#{word}%'")
	List<Member> getListByWord(String word);
	@Insert("INSERT INTO member(name, age, gender) VALUES(#{name}, #{age}, #{gender})")
	void addMember(Member member);
	@Update("UPDATE member SET name=#{name}, age=#{age}, gender=#{gender}")
	void editMember(Member member);
	@Delete("DELETE FROM member WHERE id=#{id}")
	void removeMember(int id);
}
```

`mybatis mapper`는 최소한으로 `CRUD`만 테스트해보겠습니다.

```java
// HomeController.java

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class HomeController {
	
	@Autowired
	MemberServiceImpl service;
	
	@GetMapping("")
	public String home() {
		return "hello world";
	}
	
	@GetMapping("member")
	public List<Member> memberlist() {
		return service.getList();
	}
	
	@GetMapping("member/{word}")
	public List<Member> memberadd(@PathVariable("word") String word) {
		return service.getListByWord(word);
	}
	
	@PostMapping("member")
	public List<Member> memberadd(Member member) {
		service.addMember(member);
		return service.getList();
	}
	
	@PutMapping("member/{id}")
	public List<Member> memberedit(Member member, @PathVariable("id") int id) {
		member.setId(id);
		service.editMember(member);
		return service.getList();
	}
	
	@DeleteMapping("member/{id}")
	public List<Member> memberremove(@PathVariable("id") int id) {
		service.removeMember(id);
		return service.getList();
	}

}
```

service와 entity부분은 생략하겠습니다. 컨트롤러는 RestController를 사용하여 나중에 정적웹에서 JSON으로 받을 준비를 합니다.

![스프링]({{site.baseurl}}/assets/images/post/database/db03.png)

그러고나서 스프링 부트를 실행하고 확인해봅니다. 위와 같이 나오면 성공입니다.

### 데이터베이스 서버 테스트

헤로쿠에 spring boot 프로젝트를 배포합니다.

배포 방법을 남겨두겠습니다. 이클립스를 사용하고 있어 이클립스 기준으로 설명하겠습니다.

> pom.xml에 version태그 밑 packaging태그가 war라면 jar로 바꾸어 줍니다.

이클립스에서 `run as > maven build > Goals`에 package라고 적습니다.
`profiles`에 pom.xml은 빌드 했을때 오류가 발생하면서 빌드 실패한다면 `profiles`란을 비우고 다시 빌드합니다.

이후 `cmd`나 `bash`를 열어 `heroku`에 배포합니다. 이 때 `build`된 파일은 해당 프로젝트 `target`폴더에 위치하며, 프로젝트 파일의 위치에서 `bash`를 엽니다.

```bash
git init
heroku git:remote -a appname
git add .
git commit -am "make it better"
git push heroku master
```

프로젝트가 헤로쿠 git에 업로드 되고 알아서 java를 인식합니다.

완료가 되면 https://appname.herokuapp.com으로 접속해서 확인합니다.

![스프링]({{site.baseurl}}/assets/images/post/database/db03.png)

위와 같이 이클립스에서 로컬호스트로 접속했을 때와 같다면 성공입니다. 그리고 `member`경로를 테스트 해봅니다.

![스프링]({{site.baseurl}}/assets/images/post/database/db04.png)

잘 뜹니다. 이제 저장소로 쓸 서버를 만들었으니 본인의 깃허브 페이지나 http 서버를 하나 엽니다.

### 데이터베이스로 사용하기

모든 준비가 끝났습니다. 저는 http server를 열어 테스트를 했는데요. 잘 받아오고 뿌려지는지 보겠습니다.

저는 카드형식으로 출력하고 싶어서 부트스트랩을 썼습니다. 편의에 맞게 사용하시면 됩니다. ajax로 가져오기 때문에 jquery나 xhr을 사용하시기 바랍니다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
	<title>Document</title>
</head>
<body>
	<h1>외부 저장소 테스트</h1>

	<div id="result"></div>

	<div id="pagination">
		<nav aria-label="Page navigation">
			<ul id="paging" class="pagination justify-content-center">

			</ul>
		</nav>
	</div>
</body>
</html>
```

```javascript
let query = location.search.slice(1).split('&');
let params = {};
query.forEach(x=>{
    let param = x.split("=");
    let k = param[0];
    let v = param[1];
    params[k] = v;
});
let request = {
    getParameter: function(key){
        return params[key];
    }
}

let pagination = 5;
let pageNum = request.getParameter('pageNum') || 1;

function getList(data){
    for(let i=(pageNum-1)*pagination; i<(pagination*pageNum); i++){
        if(data[i]!=undefined){
            let reg = new Date(data[i].regdate);
            let regs = `${reg.getFullYear()}-${reg.getMonth()}-${reg.getDate()} ${reg.getHours()}:${reg.getMinutes()}:${reg.getSeconds()}`;
            let update = new Date(data[i].updates);
            let updates = `${update.getFullYear()}-${update.getMonth()}-${update.getDate()} ${update.getHours()}:${update.getMinutes()}:${update.getSeconds()}`;
            document.getElementById('result').innerHTML += `
                <div class="container">
                    <div class="p-3 border rounded-3 mb-3">
                        <div><span class="badge bg-info">${data[i].id}</span><span>${data[i].name}</span></div>
                        <div class="badge bg-primary">나이 ${data[i].age}</div>
                        <div class="badge bg-primary">성별 ${data[i].gender==1?'남':data[i].gender==2?'여':''}</div>
                        <div><span class="badge bg-success">regdate</span> <span class="badge bg-secondary">${regs}</span></div>
                        <div><span class="badge bg-success">update</span> <span class="badge bg-secondary">${updates}</span></div>
                    </div>
                </div>
            `;
        }
    }
}

function getPage(data){
    let len = Math.ceil(data.length/pagination);
    let cur = request.getParameter('pageNum');
    // console.log(len)
    let pages = ``;
    for(let i=1; i<=len; i++){
        pages += `
        <li class="page-item"><a class="page-link" href="?pageNum=${i}">${i}</a></li>
        `;
    }
    document.getElementById('paging').innerHTML = `
        <li class="page-item">
            <a class="page-link" href="pageNum=${cur>1?cur-1:1}" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>

        ${pages}

        <li class="page-item">
            <a class="page-link" href="pageNum=${cur<len?cur+1:len}" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `;
}

window.addEventListener('load',()=>{

    const url = 'https://yourappname.herokuapp.com/';
    let tmp = [];
    $.ajax({
        url: `${url}/member`,
        method:'get',
        success:(data)=>{
            console.log(data);
            getList(data);
        },
        error:(xhr, err)=>{
            console.error(err);
        } 
    });
});
```

페이지 처리도 할 겸 getParameter를 만들었습니다. 그리고 부트스트랩의 레퍼런스를 가지고 후딱 만듭니다.

postman으로 데이터를 조금 더 추가한 후 테스트를 해봤습니다.

![스프링]({{site.baseurl}}/assets/images/post/database/db05.png)

1페이지 일때 db에 있는 내용이 잘 출력 됩니다.

![스프링]({{site.baseurl}}/assets/images/post/database/db06.png)

2페이지 일때도 나머지 내용이 잘 출력 됩니다.

-----

머리로 그려만 보다가 직접 테스트 하고 잘 되는 결과를 보니 뿌듯합니다. 그런데 이러한 방식을 누구라도 생각할 수 있지만 잘 안 쓰는 것을 보면 이유가 있을 것이라 생각합니다.

결과적으로 봤을 때 정적 웹에서 데이터베이스를 연결해서 쓴다기 보다 dao처럼 중간에서 연결해주는 서버를 하나 타고 받아오는 형태라 포스팅 타이틀을 정할 때 고민 했습니다. (그래도 아주 거짓말은 아니니...)

번거로운 부분도 있지만 어떻게 보면 정적 웹에서 데이터 베이스를 쓸 일이 빈번할까 생각도 듭니다. 그래서 찾아본 것이 `indexed DB`인데요.

다음에는 `indexed DB`에 대해 알아보고 사용하는 예를 좀 만들어 보려 합니다.

쭉 봐주셔서 감사합니다.