/**
 * 解决sweetalert2弹窗问题：
 * https://stackoverflow.com/questions/47935078/sweetalert2-set-dialog-height
 */

var btn_add_group = document.getElementById('btn_add_group');
var btn_create_group = document.getElementById('btn_create_group');
var btn_exit_login = document.getElementById('btn_exit_login');
var btn_ys_qd = document.getElementById('btn_ys_qd');
var btn_user_avatar = document.getElementById('user-avatar');

btn_add_group.onclick = async () => {
    const {value: group_id} = await Swal.fire({
        title: "添加群聊",
        input: "text",
        inputLabel: "请输入群号",
        showCancelButton: true,
        heightAuto: false,
        inputValidator: (value) => {
            if (!value) {
                return "群号不能为空！";
            }
        }
    });
    if (group_id) {
        let msg_add_group = {
            key: user_key,
            user_id: user_id,
            option: 'add_group',
            group_id: group_id
        }
        socket.send(JSON.stringify(msg_add_group));
    }
};

btn_create_group.onclick = async () => {
    const {value: formValues} = await Swal.fire({
        title: "创建群聊",
        heightAuto: false,
        html: `
        <div>
            <div>
                <span>群名：</span>
                <input id="swal-input1" class="swal2-input">
            </div>
            <div>
                <span>群头像：</span>
                <input id="swal-input2" type="file" accept="image/*" class="swal2-file">
            </div>
        </div>
        `,
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
                document.getElementById("swal-input2").files[0]
            ];
        },
    });
    if (formValues[0] != '' && formValues[1] != undefined) {
        const reader = new FileReader();
        reader.onload = function (e) {
            //正则表达式取出base64编码
            var str = e.target.result;
            var match = str.match(/,(.*)/);
            var contentAfterComma = match[1];
            let msg_create_group = {
                key: user_key,
                user_id: user_id,
                option: 'create_group',
                group_name: formValues[0],
                group_icon: contentAfterComma
            }
            socket.send(JSON.stringify(msg_create_group));
        };
        reader.readAsDataURL(formValues[1]);
    } else {
        Swal.fire({
            title: "群名和群头像都不能为空!",
            icon: "error",
            heightAuto: false
        });
    }
}

btn_exit_login.onclick = () => {
    Swal.fire({
        title: "您确定要退出登录吗？",
        showDenyButton: true,
        confirmButtonText: "确定",
        denyButtonText: "取消",
        heightAuto: false
    }).then((result) => {
        if (result.isConfirmed) {
            window.location = '../LogoutServlet';
        }
    });
}

btn_ys_qd.onclick = () => {
    window.open('https://api.bvipc.com/st/st', '_blank');
}

btn_user_avatar.onclick = () => {
    window.open('../ProfileServlet?user_id=' + user_id, '_blank');
}