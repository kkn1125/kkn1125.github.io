---
slug: "/spring-jdbc-template01"
layout: post
modified: 2022-03-14 00:09:35 +0900
date:   2021-10-19 18:23:12 +0900
title:  "[SPRING] JDBC Template 사용 기록"
author: Kimson
categories: [ spring ]
image: assets/images/post/covers/TIL-spring.png
tags: [ jdbc, template, til ]
description: "JDBC Template 사용법

오랜만에 JAVA를 사용했습니다. 요즘 만들고 싶은게 많아서 js를 쭉 쓰다보니 점점 JAVA를 잊어가는 느낌입니다.

MyBatis를 spring-boot에서는 간단하게 사용했었지만 spring에서는 Mybatis를 구현해 본 적이 없어서 이것저것 하던 중 jdbc template도 한 번 써봐야겠다 싶어서 사용법만 기록하려합니다."
featured: false
hidden: false
rating: 4.5
toc: true
profile: false
keysum: false
keywords: ""
published: true
---

# JDBC Template 사용법

오랜만에 JAVA를 사용했습니다. 요즘 만들고 싶은게 많아서 js를 쭉 쓰다보니 점점 JAVA를 잊어가는 느낌입니다.

MyBatis를 spring-boot에서는 간단하게 사용했었지만 spring에서는 Mybatis를 구현해 본 적이 없어서 이것저것 하던 중 jdbc template도 한 번 써봐야겠다 싶어서 사용법만 기록하려합니다.

## RootConfig 설정

```java
@Configuration
@EnableWebMvc
@ComponentScan(basePackages = {"com.test.web"})
public class RootConfig {
	@Bean
	public DataSource dataSource()
	{
		DriverManagerDataSource mysqlConfig = new DriverManagerDataSource();
		mysqlConfig.setDriverClassName("com.mysql.jdbc.Driver");
		mysqlConfig.setUrl("jdbc:mysql://localhost:3306/kimsontest");
		mysqlConfig.setUsername("kimsontest");
		mysqlConfig.setPassword("kimsontest");
		return mysqlConfig;
	}
}
```

RootConfig로 db를 연결하고 datasource를 받아 사용하려합니다.

## template 사용전

```java
@Repository
public class UserDao implements DAOImpl<User>
{
   @Autowired
	DataSource source;
	
	@Override
	public List<User> getUserList() {
      Connection con = null;
      PreparedStatement st = null;
      ResultSet rs = null;
      String sql = null;
      List<User> list = new ArrayList<User>();
      try {
         con = source.getConnection();
         sql = "SELECT * FROM user";
         st = con.prepareStatement(sql);
         rs = st.executeQuery();
         while(rs.next()) {
            User user = new User();
            user.setNum(rs.getInt("num"));
            user.setNamez(rs.getString("namez"));
            user.setAge(rs.getInt("age"));
            user.setId(rs.getString("id"));
            user.setPw(rs.getString("pw"));
            list.add(user);
         }
      } catch(Exception ex) {
         ex.getStackTrace();
      } finally {
         try {
            if(con != null)con.close();
            if(st != null)st.close();
            if(rs != null)rs.close();
         } catch(Exception ex) {
            ex.getStackTrace();
         }
      }
      return list;
   }
}
```

template을 쓰기 전에는 각 메서드를 만들때마다 연결하고 연결을 끊고 하는 구문이 필요한 기능만큼 많아져서 때로는 수정 할 때 어디를 빼먹었고 어디서 오류나는지 많이 애를 먹었습니다.

그런데 template을 사용하면서 느낀 것은 코드량이 많이 줄었다는 것을 바로 느낄 수 있었습니다.

## template 사용 후

```java
@Repository
public class UserDao implements DAOImpl<User>
{
   @Autowired
	DataSource source;
	
	@Override
	public List<User> getUserList() {
      JdbcTemplate jdbcTemplate = new JdbcTemplate(source);
      // dataSource를 인자로 넘겨줍니다.
		List<User> list = jdbcTemplate.query("SELECT * FROM user", new Object[] {}, new RowMapper<User>() {
			@Override
			public User mapRow(ResultSet rs, int rowNum) throws SQLException {
				User u = new User();
				u.setNum(rs.getInt("num"));
				u.setNamez(rs.getString("namez"));
				u.setAge(rs.getInt("age"));
				u.setId(rs.getString("id"));
				u.setPw(rs.getString("pw"));
				return u;
			}
		});
		return list;
   }
}
```

여전히 rs를 통해 가져와서 VO에 담고 데이터를 넘겨주는 것은 번거롭지만(Mybatis에 비해) 훨씬 간결해진 모습입니다.

JPA를 배워서 나중에는 MyBatis 등 여러가지를 비교하는 포스팅을 할 예정입니다. 많이 먼 이야기지만요...

```java
@ComponentScan(basePackages = {"com.test.web"})
@Controller
@RequestMapping("/")
public class HomeController {
	
	@Autowired
	UserDao dao;
	
	@GetMapping("")
	public String home(Model model) {
		model.addAttribute("list", dao.getUserList());
		return "root.home";
	}
}
```

template로 연결된 getUserList함수를 사용해서 모든 유저를 가져오는 방법은 기존에 데이터베이스 연결해서 사용하던 모습과 별 다를게 없습니다.

```html
<!-- jstl 불러온 후 -->
<c:forEach var="item" item="${list}">
   ${item.namz}
</c:forEach>
```

여기까지 기록용으로 남기는 짤막한 jdbc template였습니다. udpate나 delete는 필요할 때 찾아서 사용해도 될 것 같습니다.