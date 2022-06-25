---
slug: "/spring-boot-react01"
layout: post
date: 2022-06-24 22:53:14 +0900
title: "[SPRINGBOOT] Spring boot + React 환경 구축하기 01"
author: Kimson
categories: [mui]
image: /images/post/covers/TIL-spring.png
tags: [react, spring boot, til]
description: "Spring Boot + React 환경 구축하기 01

지금까지 Python과 JavaScrpit 위주로 프레임워크나 라이브러리를 봐왔는데요. 특히나 Java는 이것저것 어렵다는 핑계로 미뤄왔습니다.

회사에서 프론트엔드 기술을 요구해서 얼떨결에 React를 배웠는데요, 이것도 나중에 도움이 될 것이라 생각하고 써먹기위해, Java도 지금보면 더 친숙하지 않을까 하고 `Spring Boot`와 `React`를 조합한 환경을 구축해보려 합니다. 물론 시장에서 요구하는게 Java가 대부분이 의식되기도 하네요 🥲"
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

# Spring Boot + React 환경 구축하기 01

지금까지 Python과 JavaScrpit 위주로 프레임워크나 라이브러리를 봐왔는데요. 특히나 Java는 이것저것 어렵다는 핑계로 미뤄왔습니다.

회사에서 프론트엔드 기술을 요구해서 얼떨결에 React를 배웠는데요, 이것도 나중에 도움이 될 것이라 생각하고 써먹기위해, Java도 지금보면 더 친숙하지 않을까 하고 `Spring Boot`와 `React`를 조합한 환경을 구축해보려 합니다. 물론 시장에서 요구하는게 Java가 대부분이 의식되기도 하네요 🥲

물론 여러 블로그에서 소개하고 있지만 어딘가는 파일구조가 빠지거나 어디서는 gradle 혹은 maven으로 build를 작성하는 등 변수가 많이 있었습니다. 그래서 저는 maven이면 maven, gradle이면 gradle 등 사용하는 환경에 따라 나워서 포스팅으로 정리하려 합니다. 먼저, 개발환경부터 정하겠습니다.

> 포스팅 하단에 gradle 로 빌드하는 seed project 저장소 올려두었습니다. 참고 바랍니다.

## 개발 환경

먼저 간추려 말씀드리자면 필수 요소는 spring boot, react, node, yarn 입니다. build시 `"node + yarn"` 환경임을 미리 알려드립니다.

> 개발 툴

툴은 Visual Studio Code를 사용합니다. spring boot 관련 확장을 설치하고 java support하는 확장을 설치해야합니다.

maven 3.8.6을 사용하며, spring boot 종속성과 react내용은 아래를 참고 바랍니다.

> back-end 환경 (종속성 포함)

- jdk 1.8
- java 8
- spring boot 2.7.1
- lombok
- spring web
- jdbc api
- my batis
- h2 database
- postgreSQL driver
- spring boot devtools
- spring configuration processor
- tomcat-embed-jasper : jsp 파일 매핑 404 코드 발생 시 해결방법
- javax.servlet.jstl : 혹은 jstl 사용한다면 추가
- frontend-maven-plugin : Build하기 위함

> front-end 환경

- react 18.1.0

## 폴더 구조

<div id="app" class="p-2 border rounded-3 display-board" style="font-family: 'Montserrat'; letter-spacing: .1px; line-height: 1.0;"><div class="parsed-data" style="font-size: 14px;">
    ├──<span class="badge bg-info">.mvn/</span>
</div><div class="parsed-data" style="font-size: 14px;">
    ├┬─<span class="badge bg-info">src/</span>
</div><div class="parsed-data" style="font-size: 14px;">
    │├┬─<span class="badge bg-info">main/</span>
</div><div class="parsed-data" style="font-size: 14px;">
    ││├──<span class="badge bg-info">frontend/ ✳️</span>
</div><div class="parsed-data" style="font-size: 14px;">
    ││├┬─<span class="badge bg-info">java/com/kimson/seefprj/</span>
</div><div class="parsed-data" style="font-size: 14px;">
    │││├┬─<span class="badge bg-info">restController/</span>
</div><div class="parsed-data" style="font-size: 14px;">
    ││││└──<span class="badge bg-info">TestRestController.java ✳️</span>
</div><div class="parsed-data" style="font-size: 14px;">
    │││└──<span class="badge bg-info">SeedprjApplication.java</span>
</div><div class="parsed-data" style="font-size: 14px;">
    ││├──<span class="badge bg-info">resources/</span>
</div><div class="parsed-data" style="font-size: 14px;">
    ││├──<span class="badge bg-info">static/</span>
</div><div class="parsed-data" style="font-size: 14px;">
    ││├──<span class="badge bg-info">template/</span>
</div><div class="parsed-data" style="font-size: 14px;">
    ││└──<span class="badge bg-info">application.properties</span>
</div><div class="parsed-data" style="font-size: 14px;">
    │└──<span class="badge bg-info">test/</span>
</div><div class="parsed-data" style="font-size: 14px;">
    ├──<span class="badge bg-info">.gitignore</span>
</div><div class="parsed-data" style="font-size: 14px;">
    ├──<span class="badge bg-info">HELP.md</span>
</div><div class="parsed-data" style="font-size: 14px;">
    ├──<span class="badge bg-info">mvnw</span>
</div><div class="parsed-data" style="font-size: 14px;">
    ├──<span class="badge bg-info">mvnw.cmd</span>
</div><div class="parsed-data" style="font-size: 14px;">
    └──<span class="badge bg-info">pom.xml</span>
</div></div>

## Spring Boot Initializr

vscode를 사용하기 때문에 spring initializr를 사용해서 프로젝트를 먼저 받습니다.

![sample](https://user-images.githubusercontent.com/71887242/175612927-c558a33f-dcd0-4cc0-b6d6-e12f18330737.png)

위 내용대로 프로젝트를 하나 받고 서버를 실행하면 not found error가 반갑게 맞이합니다.

controller를 만들어 index 페이지에 연결해도 not found가 발생한다면 개발 환경에서 back-end 종속성 부분에 tomcat-embed-jasper를 추가해보시기 바랍니다.

## React App 생성하기

React프로젝트를 받을 곳이 frontend directory입니다. frontend에서 커멘드를 열어 아래 문구로 react app을 설치합니다.

저는 bash를 사용합니다.

```bash
$ npx create-react-app . # .은 현재 위치에 파일을 뿌려줍니다.
```

그리고 추가로 api 테스트도 같이 진행하기 위해서 react에서 axios 패키지를 설치하고 데이터를 요청해봅시다.

```jsx
/* App.jsx */

import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios("/api/test").then((res) => {
      setData(res.data);
    });
  }, []);

  return <div>서버에서 받은 데이터 : {data}</div>;
}
```

그렇다면 요청을 처리해주는 restController도 있어야 하겠죠.

```java
// TestRestController.java

@RestController
@RequestMapping("/api")
public class TestController {

  @GetMapping("/test")
  public String index() {
    return "test";
  }
}
```

그러고 난 후 개발환경에서 테스트하려면 react와 spring boot를 둘 다 실행해야 합니다.

리액트는 해당 폴더에서 실행하고 spring boot는 mvn명령어 혹은 vscode확장으로 서버 실행을 합니다.

view단은 react에서 확인해야합니다. 문제는 아마 api에 접근못하고 400 bad request가 발생할 겁니다. 이는 다른 포트에 요청하기 때문인데요. 이것을 위해 또 하나 react에서 패키지를 추가해야합니다. proxy middleware입니다.

```bash
$ npm i http-proxy-middleware
```

src 디렉토리 바로 안에 App.js와 같은 위치에 setupProxy.js 파일을 생성합니다.

그리고 내용은 아래와 같이 작성합니다.

```javascript
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8080", // Spring boot 서버 URL or localhost:스프링부트에서 설정한포트번호
      changeOrigin: true,
    })
  );
};
```

즉, react 포트가 3000이라면 spring boot서버의 포트가 8080일 때 3000번 포트 요청을 8080번 포트 요청으로 해주는 고마운 녀석입니다.

그리고 경로 요청할 때는 앞서 axios에서 사용한 것과 같이 `/api/test`라고 요청을 보내면 됩니다.

## Build 설정하기

여기서 제일 헤맸습니다. react를 결합하고 테스트해보는 환경 구축은 단순히 따로 만들어 테스트하면 된다지만 build 옵션을 구성하는게 제가 참고한 페이지에서는 gradle로 build하는 구문이었습니다...

아쉽게도 다른 maven예시를 보면 frontend 폴더구조가 다르고... 디렉토리는 보여주지않고... 환장 파티였습니다.

우선 위의 과정을 쭉 하셨다면 이제 아래에 코드를 복붙만 하면 끝납니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.1</version>
    <relativePath/>
    <!-- lookup parent from repository -->
  </parent>
  <groupId>com.kimson</groupId>
  <artifactId>seedprj</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>seedprj</name>
  <description>Seed project for Spring Boot</description>
  <properties>
    <java.version>1.8</java.version>
    <!-- build options -->
    <frontend-src-dir>${project.basedir}/frontend</frontend-src-dir>
    <node.version>v16.15.0</node.version>
    <yarn.version>v1.22.19</yarn.version>
    <frontend-maven-plugin.version>1.7.6</frontend-maven-plugin.version>
  </properties>
  <dependencies>
    <!-- 종속성들 ... 이 부분은 똑같이 하지 않아도 문제 없습니다. -->
    <!-- 하지만 아래 종속성은 필수 입니다. -->
    <dependency>
			<groupId>com.github.eirslett</groupId>
			<artifactId>frontend-maven-plugin</artifactId>
			<version>1.7.6</version>
		</dependency>
  </dependencies>

  <!-- 여기가 가장 중요합니다. 위의 프로퍼티 중 node.version과 yarn.version도 중요합니다. -->
  <build>
    <plugins>
      <plugin>
        <groupId>com.github.eirslett</groupId>
        <artifactId>frontend-maven-plugin</artifactId>
        <version>1.7.6</version>
        <!-- frontend-maven-plugin Version -->
        <configuration>
          <workingDirectory>src/main/frontend</workingDirectory>
          <!-- React JS 가 설치된 디렉토리 -->
          <installDirectory>target</installDirectory>
          <!-- war & jar 가 생성되는 메이븐 빌드의 타겟 디렉토리 -->
        </configuration>
        <executions>
          <execution>
            <id>install node and yarn</id>
            <goals>
              <goal>install-node-and-yarn</goal>
              <!-- node & npm 설치 -->
            </goals>
            <!-- optional: default phase is "generate-resources" -->
            <configuration>
              <nodeVersion>v16.15.0</nodeVersion>
              <!-- 설치할 nodeJs 의 버전 -->
              <yarnVersion>v1.22.19</yarnVersion>
              <!-- 설치할 npm 의 버전 -->
            </configuration>
          </execution>
          <execution>
            <id>yarn install</id>
            <!-- yarn install 로 package.json 의 모듈을 설치한다. -->
            <goals>
              <goal>yarn</goal>
            </goals>
            <configuration>
              <arguments>install</arguments>
            </configuration>
          </execution>
          <execution>
            <id>yarn run build</id>
            <!-- React Js Build -->
            <goals>
              <goal>yarn</goal>
            </goals>
            <configuration>
              <arguments>run build</arguments>
            </configuration>
          </execution>
        </executions>
      </plugin>

      <plugin>
        <artifactId>maven-antrun-plugin</artifactId>
        <executions>
          <execution>
            <phase>generate-resources</phase>
            <!-- 리소스 생성 -->
            <configuration>
              <target>
                <copy todir="${project.build.directory}/static">
                <!-- 복사할 디렉토리 설정 -->
                  <fileset dir="${project.basedir}/src/main/frontend/build"/>
                  <!-- 가져올 디렉토리 및 파일 -->
                </copy>
              </target>
            </configuration>
            <goals>
              <goal>run</goal>
              <!-- 복사 실행 -->
            </goals>
          </execution>
        </executions>
      </plugin>

      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <configuration>
          <excludes>
            <exclude>
              <groupId>org.projectlombok</groupId>
              <artifactId>lombok</artifactId>
            </exclude>
          </excludes>
        </configuration>
      </plugin>
      <plugin>
        <!-- Build an executable JAR -->
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-jar-plugin</artifactId>
        <version>3.1.0</version>
        <configuration>
          <archive>
            <manifest>
              <mainClass>com.kimson.seedprj.SeedprjApplication</mainClass>
            </manifest>
          </archive>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```

이렇게 설정한 후 build는 vscode 확장을 이용해 maven clean, maven install을 진행합니다.

커멘드를 사용한다면 아래와 같이 실행합니다.

```bash
$ mvn clean install -e
```

-e 옵션은 대충 뿌려주는 에러 메세지를 좀 더 디테일하게 보기 위해 붙였습니다.

완료되었다면 프로젝트 디렉토리에 target 폴더가 생깁니다. 그 안에는 프로젝트 명이 달려있는 jar파일이 생기는데, 아래와 같이 커멘드 입력해서 서버를 실행합니다.

```bash
$ java -jar projectname-0.0.1-SNAPSHOT.jar
```

[http://localhost:8080](http://localhost:8080)으로 접속해보면 위에서 작성했던 App 컴포넌트 내용이 정상적으로 test라는 문구를 서버에서 받아오면 성공입니다.

> build에 관한 설명은 추후에 블로그 포스팅하면서 추가하려합니다.

아마 에러가 발생하는 경우가 있을 수 있습니다. 그래서 제가 겪었던 에러 상황을 아래에 정리했습니다.

## trouble shooting

### No Main Manifest Attribute

이 에러는 manifest가 없기 때문에 발생하는 에러입니다. 해결하기 위해서는 spring boot의 pom.xml에 build 영역에 플러그인을 추가해야합니다.

```xml
<build>
  <plugins>
    <!-- 위에서 설정한 build에 필요한 플러그인들 -->
    <plugin>
      <!-- Build an executable JAR -->
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-jar-plugin</artifactId>
      <version>3.1.0</version>
      <configuration>
        <archive>
          <manifest>
            <mainClass>com.kimson.seedprj.SeedprjApplication</mainClass>
          </manifest>
        </archive>
      </configuration>
    </plugin>
  </plugins>
</build>
```

`mainClass`는 말 그대로 `application.class`를 말합니다. 예를들어 제가 만든 프로젝트의 `application.class`는 위와 같습니다.

`com.kimson.seedprj` 디렉토리에 위치한 `SeedprjApplication.class`를 말하기 때문에 확장자 `*.class`를 제외하고 `com.kimson.seedprj.SeedprjApplication`까지만 적습니다. 해당 내용은 포스팅 하단 참조 링크를 확인 바랍니다.

### Exception in thread "main" java.lang.NoClassDefFoundError

이 에러는 mainClass 경로를 못 찾을 때 입니다. 즉, 위와 연관있는 에러이기 때문에 위의 해결방법으로 안 될 시 다른 방법을 강구해야합니다. 아쉽지만 글 작성되는 지금 시점에서는 다른 방안이 없어 추후 발견되면 업데이트 하겠습니다.

### 도대체 앱 루트에 index.html은 어떻게 매핑하나?

빌드 성공하셨다면 jar 내용물을 보면 힌트를 얻을 수 있습니다. spring boot 폴더 구조에서 resources의 static안에 index.html을 만들면 루트 경로로 매핑되어 정상 출력됩니다.

## Seed Project 받기

이것저것 세팅하면서 두고두고 쓰기 위해 딱 기본 세팅만 되어 있는 프로젝트입니다. maven과 gradle로 나누어 저장소를 만들어 두었습니다.

해당 저장소에 사용방법을 적어두고 개발환경에 대해 적어두었습니다. curl을 이용하거나 git clone하거나 둘 중 하나 택하여 사용하면 됩니다.

물론 커멘드보다 직접 받으시는게 좋으시다면 해당 back단 저장소를 받으시고, frontend를 submodule로 저장했기때문에 frontend 디렉토리를 클릭하시면 front단 저장소로 넘어갑니다.

> 주의  
> node와 yarn의 버전, java, jdk 버전은 꼭 확인하시기 바랍니다.

- yarn 1.22.19
- node 16.15.0
- java8
- jdk 1.8

[Github Repo : Backend Spring Boot + React + Maven](https://github.com/kkn1125/springboot-react-mvn-seed#%EC%82%AC%EC%9A%A9%EB%B0%A9%EB%B2%95)

[Github Repo : Backend Spring Boot + React + Gradle](https://github.com/kkn1125/springboot-react-gradle-seed#%EC%82%AC%EC%9A%A9%EB%B0%A9%EB%B2%95)

[Github Repo : Backend Spring Boot + React + Frontend](https://github.com/kkn1125/springboot-react-front-seed)

---

📚 함께 보면 좋은 내용

[u-nij님 블로그::Spring Boot + React.js 개발환경 연동하기](https://velog.io/@u-nij/Spring-Boot-React.js-%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD-%EC%84%B8%ED%8C%85)

[s_keyyy님 블로그::Spring boot + React build process](https://velog.io/@s_keyyy/Spring-boot-React-build-process)

[create-react-app docs::Proxying API Requests in Development](https://create-react-app.dev/docs/proxying-api-requests-in-development)

[javaTpoint::No Main Manifest Attribute](https://www.javatpoint.com/no-main-manifest-attribute)

[frontend-maven-plugin::github repository](https://github.com/eirslett/frontend-maven-plugin#running-yarn)

[Stackoverflow::Spring Boot Program cannot find main class](https://stackoverflow.com/questions/28451120/spring-boot-program-cannot-find-main-class)

[리뷰나라::앱 루트 (“/”)를 index.html에 매핑하는 방법은 무엇입니까?](http://daplus.net/java-java-spring-boot-%EC%95%B1-%EB%A3%A8%ED%8A%B8-%EB%A5%BC-index-html%EC%97%90-%EB%A7%A4%ED%95%91%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95%EC%9D%80-%EB%AC%B4%EC%97%87%EC%9E%85/)

[Stackoverflow::Exception in thread "main" java.lang.NoClassDefFoundError](https://stackoverflow.com/questions/68789394/spring-boot-jar-launch-error-exception-in-thread-main-java-lang-noclassdeffou)

[Stackoverflow::Spring Boot JSP 404
](https://stackoverflow.com/questions/29782915/spring-boot-jsp-404#answer-47801646)