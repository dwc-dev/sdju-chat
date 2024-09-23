<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>注册成功</title>
</head>
<body>
<script src="./Tools/sweetalert2.all.min.js"></script>
<script>
    Swal.fire({
        title: "注册成功，账号为：${id}",
        icon: "success",
        button: "登录",
    }).then(() => {
        window.location = './Login';
    });
</script>
</body>
</html>