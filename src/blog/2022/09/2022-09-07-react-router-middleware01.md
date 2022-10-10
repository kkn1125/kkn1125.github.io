---
slug: "/react-router-middleware/"
layout: post
date: 2022-09-07 19:25:29 +0900
title: "[REACT] react-router-dom에 middleware를 설정해보자"
author: Kimson
categories: [react]
image: /images/post/covers/TIL-react.png
tags: [express, typescript, router, react, middleware, til]
description: "react-router-dom에는 미들웨어 설정이 따로 없다.

아예 없는 것은 아닙니다만 리액트에서 미들웨어처럼? 사용하는 방법이 있습니다.

필요한 예로는 로그인하지 않은 상태에서 로그인이 필요한 서비스에 접근하려할 때 등인데요, 아래는 예시 코드로서 기록해둡니다."
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

# react-router-dom에는 미들웨어 설정이 따로 없다.

아예 없는 것은 아닙니다만 리액트에서 미들웨어처럼? 사용하는 방법이 있습니다.

필요한 예로는 로그인하지 않은 상태에서 로그인이 필요한 서비스에 접근하려할 때 등인데요, 아래는 예시 코드로서 기록해둡니다.

```tsx
const AuthProtectedRoute = ({ children }) => {
  const params = useParams();
  const { warningSnack } = useSnack();
  const users = useContext(UserContext);
  const [cookies] = useCookies(["token"]);
  const hasToken = Object.keys(cookies.token || {}).length !== 0;
  const [protect, setProtect] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (params.num !== undefined && isNaN(Number(params.num))) {
      setError(true);
    } else if (users.num && hasToken) {
      setProtect(false);
      warningSnack("로그인 된 상태에서 접근 할 수 없습니다.");
    }
  }, [users.num]);

  if (!protect) {
    return <Navigate to='/' replace />;
  } else if (error) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Routes path='about' element={<About />} />
        <Route path='mentees'>
          <Route index element={<Programs />} />
          <Route
            path='profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}
```

진행중인 프로젝트의 코드 일부입니다. pathVariable이 넘버가 아닐 때, 토큰정보가 없을 때와 유저 정보가 브라우저에 없으면 메인페이지로 돌려버립니다. 에러사인이 true값을 가지면 notfound페이지로 돌려버리는 내용입니다.

---

📚 함께 보면 좋은 내용

[ROBIN WIERUCH::React Router 6:Authentication](https://www.robinwieruch.de/react-router-authentication/)

[Vijit Ail LogRocket::Complete guide to authentication with React Router v6](https://blog.logrocket.com/complete-guide-authentication-with-react-router-v6/)
