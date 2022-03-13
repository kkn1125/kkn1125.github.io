---
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-12-06 21:27:46 +0900
title:  "[JAVA] URL 경로의 내용 읽어오기"
author: Kimson
categories: [ java ]
image: assets/images/post/covers/TIL-java.png
tags: [ read, url, til ]
description: "URL 경로 내용 읽어오기

`api`를 사용하다보니 데이터를 가져오고 사용할 일이 많아졌습니다. `JSOUP`을 사용하는 방법도 있지만 베이직한 것부터 차츰 기록하려합니다."
featured: false
hidden: false
rating: 3
toc: true
profile: false
keysum: false
keywords: ""
published: true
---

# URL 경로 내용 읽어오기

`api`를 사용하다보니 데이터를 가져오고 사용할 일이 많아졌습니다. `JSOUP`을 사용하는 방법도 있지만 베이직한 것부터 차츰 기록하려합니다.

```java
@RestController
public class RestController {
    @GetMapping(value = "/list", produces = "application/text; charset=utf8")
    public String getList() throws IOException {
        URL url = new URL("https://your/api.path");
        URLConnection urlConnection = url.openConnection();
        HttpURLConnection connection = null;

        if(urlConnection instanceof HttpURLConnection)
        {
            connection = (HttpURLConnection) urlConnection;
        }
        else
        {
            System.out.println("error");
        }
        
        BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String urlString = "";
        String current = "";

        while((current = in.readLine()) != null)
        {
            urlString += current+"\n";
        }
        
        System.out.println(urlString);
        return urlString;
    }
}
```

`javascript`를 사용하기에는 제한도 많고 `all origins`를 매번 사용하자니 성에 안차서 여러 시도를 하다가 `java`로 가져오고 객체로 만드는 등의 연습을 하다가 까먹을 까 해서 기록합니다.