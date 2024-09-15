<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .profile-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
        }

        .img {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 200px;
            height: 200px;
            margin-right: 20px;
            overflow: hidden;
        }

        .img img {
            flex: 0 0 auto;
            width: 200px;
            height: 200px;
            border: 2px solid #ccc;
            box-sizing: border-box;
            border-radius: 50%;
            object-fit: cover;
        }

        .personal-info {
            flex: 1;
            display: flex;
            justify-content: flex-start;
            flex-direction: column;
            align-items: flex-start;
        }
    </style>
    <title>个人资料</title>
</head>

<body>
<div class="container">
    <div class="profile-wrapper">
        <div class="img">
            <img src="${user_icon}" alt="用户头像">
        </div>
        <div class="personal-info">
            <h2>个人资料</h2>
            <p>
                <strong>账号:</strong> ${user_id}
            </p>
            <p>
                <strong>昵称:</strong> ${nickname}
            </p>
            <p>
                <strong>性别:</strong> ${sex}
            </p>
            <p>
                <strong>生日:</strong> ${birthday}
            </p>
            <p>
                <strong>邮箱:</strong> ${email}
            </p>
            <p>
                <strong>地址:</strong> ${address}
            </p>
            <p>
                <strong>个人介绍:</strong> ${personal_profile}
            </p>
        </div>
    </div>
</div>
</body>

</html>