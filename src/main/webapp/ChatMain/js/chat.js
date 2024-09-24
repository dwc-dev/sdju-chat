var current_chat = {
    type: undefined,
    id: undefined,
    name: undefined,
    item: undefined,
};

var lastTime = 0;
var chatBoxOriStyle = "";

inputNoticeText = "按Ctrl + Enter键发送消息";
inputNoticeFlag = true;

const socket = new WebSocket(SERVER_ADDRESS);

socket.addEventListener("open", (event) => {
    let msg_login = {
        key: user_key,
        user_id: user_id,
        option: "login",
    };
    socket.send(JSON.stringify(msg_login));
    setInterval(function () {
        socket.send(JSON.stringify({msg: "heart"}));
    }, 1000 * 10);
});

socket.addEventListener("close", (event) => {
    console.log("WebSocket connection closed");
    alert("与服务器断开连接！\n" + SERVER_ADDRESS);
    location.reload();
});

socket.addEventListener("message", (event) => {
    msg_obj = JSON.parse(event.data);
    messageType = msg_obj[0].msg_type;
    if (messageType === "loginSuccess") {
        let msg_get_list = {
            key: user_key,
            user_id: user_id,
            option: "get_list",
        };
        let msg_get_headIcon = {
            key: user_key,
            user_id: user_id,
            option: "get_headIcon",
        };
        socket.send(JSON.stringify(msg_get_list));
        socket.send(JSON.stringify(msg_get_headIcon));
    } else if (messageType === "list") {
        msg_obj.forEach((item) => {
            if (item.msg_type) return;
            let chat_item = {
                id: item.group_id,
                name: item.group_name,
                icon: item.group_icon,
                type: "group",
            };
            createChatItem(chat_item);
        });
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false,
        });
        document.getElementById("loader").style.display = "none";
        document.getElementById("chat-container").style.display = "";
        Toast.fire({
            icon: "success",
            title: "登录成功！",
        });
    } else if (messageType === "headIconUrl") {
        let headIcon = document.getElementById("headIcon");
        headIcon.setAttribute("src", msg_obj[1].user_icon);
    } else if (messageType === "history_group") {
        document.querySelector(".lite-chatbox").innerHTML = "";
        let last = 0;
        msg_obj.forEach((item) => {
            if (item.msg_type) {
                lastTime = 0;
                return;
            }
            if (item.timestamp - last > 300000) {
                let date = new Date(item.timestamp);
                Y = date.getFullYear() + "/";
                M = date.getMonth() + 1 + "/";
                D = date.getDate() + " ";
                h = date.getHours() + ":";
                m =
                    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                const tip = {
                    messageType: "tipsNormal",
                    html: Y + M + D + h + m,
                };
                addTip(".lite-chatbox", tip, "beforeend");
                last = item.timestamp;
                lastTime = last;
            }
            var chat_msg = {
                messageType: "raw",
                headIcon: item.user_icon,
                name: item.nickname,
                position: user_id === item.sender_id ? "right" : "left",
                html: item.content,
                user_id: item.sender_id,
            };
            addMessage(".lite-chatbox", chat_msg, "beforeend");
        });
        let chatBox = document.querySelector(".lite-chatbox");
        setTimeout(function () {
            if (chatBox.scrollHeight > chatBox.clientHeight) {
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        }, 300);
    } else if (messageType === "new_msg_group") {
        if (
            msg_obj[1].group_id != current_chat.id ||
            current_chat.type != "group"
        ) {
            return;
        }
        let flag = false;
        let chatBox = document.querySelector(".lite-chatbox");
        scrollCheck =
            Math.abs(
                chatBox.scrollTop + chatBox.clientHeight - chatBox.scrollHeight
            ) <= 60;
        if (
            chatBox.scrollHeight > chatBox.clientHeight &&
            (scrollCheck || user_id === msg_obj[1].sender_id)
        ) {
            flag = true;
        }

        if (msg_obj[1].timestamp - lastTime > 300000) {
            let date = new Date(msg_obj[1].timestamp);
            Y = date.getFullYear() + "/";
            M = date.getMonth() + 1 + "/";
            D = date.getDate() + " ";
            h = date.getHours() + ":";
            m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            const tip = {
                messageType: "tipsNormal",
                html: Y + M + D + h + m,
            };
            addTip(".lite-chatbox", tip, "beforeend");
            lastTime = msg_obj[1].timestamp;
        }

        var chat_msg = {
            messageType: "raw",
            headIcon: msg_obj[1].user_icon,
            name: msg_obj[1].nickname,
            position: user_id === msg_obj[1].sender_id ? "right" : "left",
            html: msg_obj[1].content,
            user_id: msg_obj[1].sender_id,
        };
        addMessage(".lite-chatbox", chat_msg, "beforeend");
        setTimeout(function () {
            if (flag) {
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        }, 300);
    } else if (messageType === "add_group") {
        if (msg_obj[1].result === "success") {
            document.getElementById("chatList").innerHTML = `
            <div class="chat-list-top">
                <p>群聊</p>
            </div>
            `;
            let msg_get_list = {
                key: user_key,
                user_id: user_id,
                option: "get_list",
            };
            socket.send(JSON.stringify(msg_get_list));
            Swal.fire({
                title: "添加成功",
                text: `成功进入群聊：${msg_obj[1].group_name}[${msg_obj[1].group_id}]`,
                icon: "success",
                heightAuto: false,
            });
        } else {
            Swal.fire({
                title: "添加失败!",
                icon: "error",
                heightAuto: false,
            });
        }
    } else if (messageType === "create_group") {
        if (msg_obj[1].result === "success") {
            document.getElementById("chatList").innerHTML = `
            <div class="chat-list-top">
                <p>群聊</p>
            </div>
            `;
            let msg_get_list = {
                key: user_key,
                user_id: user_id,
                option: "get_list",
            };
            socket.send(JSON.stringify(msg_get_list));
            Swal.fire({
                title: "创建成功",
                text: `群聊：${msg_obj[1].group_name}[${msg_obj[1].group_id}]`,
                icon: "success",
                heightAuto: false,
            });
        } else {
            Swal.fire({
                title: "创建失败!",
                icon: "error",
                heightAuto: false,
            });
        }
    } else if (messageType === "exit_group") {
        if (msg_obj[1].result === "success") {
            document.getElementById("chatList").innerHTML = `
            <div class="chat-list-top">
                <p>群聊</p>
            </div>
            `;
            current_chat.id = undefined;
            current_chat.name = undefined;
            current_chat.type = undefined;
            current_chat.item = undefined;
            let msg_get_list = {
                key: user_key,
                user_id: user_id,
                option: "get_list",
            };
            socket.send(JSON.stringify(msg_get_list));
            document.getElementById("chatWindow").innerHTML = `
            <div class="initial-image">
                <img src="img/chat.svg" alt="Initial Image">
            </div>
            `;
            Swal.fire({
                title: "退出成功",
                icon: "success",
                heightAuto: false,
            });
        } else {
            Swal.fire({
                title: "退出失败!",
                icon: "error",
                heightAuto: false,
            });
        }
    } else if (messageType === "key_verify") {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false,
        });
        if (msg_obj[1].result === "key_error") {
            Toast.fire({
                icon: "error",
                title: "key验证失败(key_error)!",
            });
        } else if (msg_obj[1].result === "server_error") {
            Toast.fire({
                icon: "error",
                title: "key验证失败(server_error)!",
            });
        }
    }
});

function createChatItem(chat_item) {
    const chatList = document.getElementById("chatList");
    const newChatItem = document.createElement("div");
    newChatItem.classList.add("chat-item");
    newChatItem.innerHTML = `
      <div class="avatar" style="background: url(${chat_item.icon});background-size: cover;"></div>
      <div class="chat-name">${chat_item.name}</div>
    `;
    chat_item.item = newChatItem;
    if (current_chat.item !== undefined && current_chat.id === chat_item.id) {
        current_chat.item = newChatItem;
        current_chat.item.style.backgroundColor = "#f0f0f0";
    }
    newChatItem.onclick = function () {
        switchChat(chat_item);
    };
    chatList.appendChild(newChatItem);
}

function switchChat(chat_item) {
    current_chat.type = chat_item.type;
    current_chat.id = chat_item.id;
    current_chat.name = chat_item.name;

    if (current_chat.item !== undefined) {
        current_chat.item.style.backgroundColor = "";
    }

    chat_item.item.style.backgroundColor = "#f0f0f0";
    current_chat.item = chat_item.item;

    const chatWindow = document.getElementById("chatWindow");
    const chatBox = document.querySelector(".lite-chatbox");

    if (chatBox == null) {
        chatWindow.innerHTML = "";
        chatWindow.innerHTML = `
        <div class="top">
            <p id="top"></p>
            <img src="./img/x.svg" style="
            height: 20px;
            width: 20px;
            opacity: 0.75;
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
            "
            title="退出群聊"
            id="exit_group"
            />
        </div>
        <div class="lite-chatmaster">
            <div class="lite-chatbox"><div class="loader child""></div></div>
            <div class="lite-chattools">
                <div class="lite-chatbox-tool" id="emojiMart" style="display:none"></div>
                <div id="toolMusk" style="display:none"></div>
            </div>
<div class="lite-chatinput">
    <hr class="boundary">
    <button class="tool-button float-left" id="emojiBtn" title="表情" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
                d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10">
            </path>
            <path
                d="M8 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 8 7M16 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 16 7M15.232 15c-.693 1.195-1.87 2-3.349 2-1.477 0-2.655-.805-3.347-2H15m3-2H6a6 6 0 1 0 12 0">
            </path>
        </svg>
    </button>
    <button class="tool-button float-left" id="imageBtn" title="插入图片" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
                d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm-6 336H54a6 6 0 0 1-6-6V118a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v276a6 6 0 0 1-6 6zM128 152c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zM96 352h320v-80l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L192 304l-39.515-39.515c-4.686-4.686-12.284-4.686-16.971 0L96 304v48z">
            </path>
        </svg>
    </button>
    <button class="tool-button float-left" id="fileBtn" title="发送文件" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            <path
                d="M527.9 224H480v-48c0-26.5-21.5-48-48-48H272l-64-64H48C21.5 64 0 85.5 0 112v288c0 26.5 21.5 48 48 48h400c16.5 0 31.9-8.5 40.7-22.6l79.9-128c20-31.9-3-73.4-40.7-73.4zM48 118c0-3.3 2.7-6 6-6h134.1l64 64H426c3.3 0 6 2.7 6 6v42H152c-16.8 0-32.4 8.8-41.1 23.2L48 351.4zm400 282H72l77.2-128H528z">
            </path>
        </svg>
    </button>
    <button class="tool-button float-right" id="editFullScreen" title="全屏编辑" type="button">
        <svg svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <path
                d="M17.066667 2.844444C11.377778 2.844444 8.533333 5.688889 5.688889 8.533333 2.844444 11.377778 0 14.222222 0 19.911111v364.088889c0 2.844444 0 5.688889 2.844444 5.688889h5.688889l122.311111-122.311111 164.977778 164.977778c2.844444 2.844444 8.533333 5.688889 11.377778 5.688888 5.688889 0 8.533333-2.844444 11.377778-5.688888l110.933333-110.933334c2.844444-2.844444 5.688889-8.533333 5.688889-11.377778 0-5.688889-2.844444-8.533333-5.688889-11.377777l-159.288889-170.666667L389.688889 8.533333c2.844444-2.844444 2.844444-2.844444 0-5.688889 0-2.844444-2.844444-2.844444-2.844445-2.844444L17.066667 2.844444zM17.066667 1024c-5.688889 0-8.533333-2.844444-11.377778-5.688889-2.844444-2.844444-5.688889-8.533333-5.688889-11.377778V640c0-2.844444 0-5.688889 2.844444-5.688889h5.688889l122.311111 122.311111 164.977778-164.977778c2.844444-2.844444 8.533333-5.688889 11.377778-5.688888 5.688889 0 8.533333 2.844444 11.377778 5.688888l110.933333 110.933334c2.844444 2.844444 5.688889 8.533333 5.688889 11.377778s-2.844444 8.533333-5.688889 11.377777l-164.977778 164.977778 119.466667 119.466667c2.844444 2.844444 2.844444 2.844444 0 5.688889 0 2.844444-2.844444 2.844444-5.688889 2.844444L17.066667 1024zM1006.933333 2.844444c5.688889 0 8.533333 2.844444 11.377778 5.688889 2.844444 2.844444 5.688889 5.688889 5.688889 11.377778v364.088889c0 2.844444 0 5.688889-2.844444 5.688889h-5.688889l-122.311111-122.311111-164.977778 164.977778c-2.844444 2.844444-8.533333 5.688889-11.377778 5.688888-5.688889 0-8.533333-2.844444-11.377778-5.688888l-110.933333-110.933334c-2.844444-2.844444-5.688889-8.533333-5.688889-11.377778 0-5.688889 2.844444-8.533333 5.688889-11.377777l164.977778-164.977778L640 14.222222c-2.844444-2.844444-2.844444-2.844444 0-5.688889-5.688889-8.533333-2.844444-8.533333-2.844444-8.533333l369.777777 2.844444z m0 1021.155556c5.688889 0 8.533333-2.844444 11.377778-5.688889 2.844444-2.844444 5.688889-8.533333 5.688889-11.377778V640c0-2.844444 0-5.688889-2.844444-5.688889h-5.688889l-122.311111 122.311111-164.977778-164.977778c-2.844444-2.844444-8.533333-5.688889-11.377778-5.688888-5.688889 0-8.533333 2.844444-11.377778 5.688888l-110.933333 110.933334c-2.844444 2.844444-5.688889 8.533333-5.688889 11.377778s2.844444 8.533333 5.688889 11.377777l164.977778 164.977778-119.466667 119.466667c-2.844444 2.844444-2.844444 2.844444 0 5.688889 0 2.844444 2.844444 2.844444 5.688889 2.844444l361.244444 5.688889z">
            </path>
        </svg>
    </button>
    <button class="tool-button float-right" id="exitFullScreen" style="display:none" title="退出" type="button">
        <svg svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <path
                d="M422.648199 431.157895c5.67313 0 8.509695-2.836565 11.346261-5.67313 2.836565-2.836565 5.67313-8.509695 5.67313-11.346261V51.058172c0-2.836565 0-5.67313-2.836565-5.67313h-5.67313L306.34903 170.193906 141.828255 5.67313C138.99169 2.836565 133.31856 0 130.481994 0c-5.67313 0-11.34626 2.836565-14.182825 5.67313L5.67313 116.299169c-2.836565 2.836565-5.67313 8.509695-5.67313 11.34626 0 5.67313 2.836565 11.34626 5.67313 14.182826L170.193906 303.512465l-119.135734 119.135734c-2.836565 2.836565-2.836565 2.836565 0 5.673131 0 2.836565 2.836565 2.836565 5.67313 2.836565h365.916897z m0 156.01108c5.67313 0 8.509695 2.836565 11.346261 5.67313 2.836565 2.836565 5.67313 8.509695 5.67313 11.346261v365.916897c0 2.836565 0 5.67313-2.836565 5.67313h-5.67313L306.34903 850.969529 141.828255 1015.490305c-2.836565 2.836565-8.509695 5.67313-11.346261 5.67313-5.67313 0-8.509695-2.836565-11.34626-5.67313L8.509695 904.864266c-5.67313-2.836565-8.509695-8.509695-8.509695-11.34626s2.836565-8.509695 5.67313-11.346261L170.193906 717.65097l-119.135734-119.135735c-2.836565-2.836565-2.836565-2.836565 0-5.67313 0-2.836565 2.836565-2.836565 5.67313-2.836565l365.916897-2.836565z m175.867036-156.01108c-5.67313 0-8.509695-2.836565-11.34626-5.67313-2.836565-2.836565-5.67313-8.509695-5.67313-11.346261V51.058172c0-2.836565 0-5.67313 2.836565-5.67313h5.67313L714.814404 170.193906 879.33518 5.67313c2.836565-2.836565 8.509695-5.67313 11.34626-5.67313 5.67313 0 8.509695 2.836565 11.346261 5.67313l110.626039 110.626039c5.67313 2.836565 8.509695 8.509695 8.509695 11.34626 0 5.67313-2.836565 8.509695-5.67313 11.346261L850.969529 303.512465l119.135734 119.135734c2.836565 2.836565 2.836565 2.836565 0 5.673131 0 2.836565-2.836565 2.836565-5.67313 2.836565H598.515235z m0 156.01108c-5.67313 0-8.509695 2.836565-11.34626 5.67313-2.836565 2.836565-5.67313 8.509695-5.67313 11.346261v365.916897c0 2.836565 0 5.67313 2.836565 5.67313h5.67313l121.972299-121.972299 164.520776 164.520776c2.836565 2.836565 8.509695 5.67313 11.34626 5.67313 5.67313 0 8.509695-2.836565 11.346261-5.67313l110.626039-110.626039c2.836565-2.836565 5.67313-8.509695 5.67313-11.34626s-2.836565-8.509695-5.67313-11.346261L850.969529 717.65097l119.135734-119.135735c2.836565-2.836565 2.836565-2.836565 0-5.67313 0-2.836565-2.836565-2.836565-5.67313-2.836565l-365.916898-2.836565z">
            </path>
        </svg>
    </button>
    <!--输入框必须设置box-sizing: border-box否则会出现横向滚动条-->
    <div class="editor chatinput" aria-label="input area" contenteditable="true" ref="editor" style="box-sizing: border-box;color:gray;">${inputNoticeText}</div>
    <button class="send">发送</button>
</div>
        </div>
      `;
        loadInput();
        chatInput = document.querySelector(".chatinput");

        chatInput.addEventListener("blur", function (event) {
            if (chatInput.innerHTML == "") {
                chatInput.innerHTML = inputNoticeText;
                inputNoticeFlag = true;
                chatInput.style.color = "gray";
            }
        });

        chatInput.addEventListener("focus", function (event) {
            if (inputNoticeFlag) {
                chatInput.innerHTML = "";
                chatInput.style.color = "black";
                inputNoticeFlag = false;
            }
        });

        var sendMessage = function () {
            if (
                document.querySelector(".chatinput").innerHTML == "" ||
                inputNoticeFlag
            )
                return;
            if (current_chat.type === "group") {
                let msg = {
                    option: "new_message_group",
                    sender_id: user_id,
                    group_id: current_chat.id,
                    content: document.querySelector(".chatinput").innerHTML,
                    user_id: user_id,
                    key: user_key,
                };
                socket.send(JSON.stringify(msg));
            }
            document.querySelector(".chatinput").innerHTML = "";
            document.querySelector(".chatinput").focus();
        };
        document
            .querySelector(".chatinput")
            .addEventListener("keydown", function (event) {
                if (
                    (event.ctrlKey || event.metaKey) &&
                    (event.key === "Enter" || event.keyCode === 13)
                ) {
                    event.preventDefault();
                    sendMessage();
                }
            });
        document.querySelector(".send").onclick = sendMessage;
        document.getElementById("exit_group").onclick = () => {
            Swal.fire({
                title: "确定要退出群聊？",
                showDenyButton: true,
                confirmButtonText: "确定",
                denyButtonText: "取消",
                heightAuto: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    let msg = {
                        option: "exit_group",
                        user_id: user_id,
                        group_id: current_chat.id,
                        key: user_key,
                    };
                    socket.send(JSON.stringify(msg));
                }
            });
        };
    } else {
        chatBox.innerHTML = '<div class="loader child""></div>';
        chatInput.innerHTML = inputNoticeText;
        inputNoticeFlag = true;
        chatInput.style.color = "gray";
    }
    document.getElementById(
        "top"
    ).innerHTML = `${current_chat.name}(${current_chat.id})`;
    document.querySelector(".lite-chatbox").focus();

    let msg_get_history = {
        key: user_key,
        user_id: user_id,
        option: "get_history",
        chat_type: current_chat.type,
        chat_id: current_chat.id,
    };
    socket.send(JSON.stringify(msg_get_history));
}
