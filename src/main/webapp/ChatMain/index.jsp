<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%!
    String websocketAddress = System.getenv("FRONTEND_WEBSOCKET_ADDRESS");
    String fileUploadAddress = System.getenv("FRONTEND_FILE_UPLOAD_ADDRESS");
%>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>SDJU.CHAT-在线社交群聊及文件共享平台</title>
    <link type="text/css" href="css/litewebchat.min.css" rel="stylesheet"/>
    <link type="text/css" href="css/litewebchat_input.min.css" rel="stylesheet"/>
    <link type="text/css" href="css/index.css" rel="stylesheet"/>
    <link type="text/css" href="css/file-widget.css" rel="stylesheet"/>
    <script src="../Tools/show.js"></script>

    <script>
        function getCookieValue(cookieName) {
            var name = cookieName + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var cookieArray = decodedCookie.split(';');

            for (var i = 0; i < cookieArray.length; i++) {
                var cookie = cookieArray[i];
                while (cookie.charAt(0) == ' ') {
                    cookie = cookie.substring(1);
                }
                if (cookie.indexOf(name) == 0) {
                    return cookie.substring(name.length, cookie.length);
                }
            }

            return "";
        }

        var user_id = getCookieValue("user_id");
        var user_key = getCookieValue("user_key");

        if (user_id === '' || user_key === '') {
            window.location = '../Login/';
        }

        user_id = Number(user_id);

        const SERVER_ADDRESS = "<%= websocketAddress %>";
        const FILE_UPLOAD_ADDRESS = "<%= fileUploadAddress %>";

    </script>

</head>

<body>
<div class="loader child" id="loader"></div>
<div class="chat-container" style="display: none;" id="chat-container">
    <!-- 左侧边栏 -->
    <div class="sidebar">
        <div class="side-top">
            <div class="user-avatar" id="user-avatar">
                <img id="headIcon" alt="">
            </div>
        </div>
        <div class="side-bottom">
            <div class="sidebar-icon" id="btn_ys_qd" style="display: none">
                <img src="img/ys_round.png" alt="">
            </div>
            <div class="sidebar-icon-bottom" title="加入群聊" id="btn_add_group">
                <img src="img/add_group.svg" alt="">
            </div>
            <div class="sidebar-icon-bottom" title="创建群聊" id="btn_create_group">
                <img src="img/create_group.svg" alt="">
            </div>
            <div class="sidebar-icon-bottom" title="退出登录" id="btn_exit_login">
                <img src="img/exit.svg" alt="">
            </div>
        </div>
    </div>

    <!-- 聊天列表 -->
    <div class="chat-list" id="chatList">
        <div class="chat-list-top">
            <p>群聊</p>
        </div>
    </div>

    <!-- 聊天框 -->
    <div class="chat-window" id="chatWindow">
        <div class="initial-image">
            <img src="img/chat.svg" alt="Initial Image">
        </div>
    </div>

</div>

<!--<script src="https://cdn.jsdelivr.net/npm/emoji-mart@latest/dist/browser.js"></script>-->
<script src="js/sweetalert2.all.min.js"></script>
<script src="js/chat.js"></script>
<script src="js/browser.js"></script>
<script src="js/litewebchat_render.js"></script>
<script src="js/litewebchat_input.js"></script>
<script src="js/btn_listener.js"></script>

</body>


</html>