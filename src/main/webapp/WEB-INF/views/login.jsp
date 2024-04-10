<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>로그인</title>
    <link href="/css/login.css" rel="stylesheet" type="text/css">
</head>

<body>
    <form class="form-signin" method="post" action="/login-process">
        <div class="background-wrap">
          <div class="background"></div>
        </div>

        <form id="accesspanel" action="login" method="post">
          <h1 id="litheader">TODO</h1>
          <div class="inset">
            <p>
              <input type="text" name="userid" id="email" placeholder="Email address">
            </p>
            <p>
              <input type="password" name="pw" id="password" placeholder="Access code">
            </p>
            <div style="text-align: center;">
              <div class="checkboxouter">
                <input type="checkbox" name="rememberme" id="remember" value="Remember">
                <label class="checkbox"></label>
              </div>
              <label for="remember">Remember me for 14 days</label>
            </div>
            <input class="loginLoginValue" type="hidden" name="service" value="login" />
          </div>
          <p class="p-container">
            <input type="submit" name="Login" id="go" value="login">
          </p>
        </form>
    </form>
</body>
</html>