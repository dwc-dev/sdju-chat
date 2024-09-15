// 获取文件输入框和头像预览元素
const avatarInput = document.getElementById('avatar');
const avatarPreview = document.getElementById('avatar-preview');

// 监听文件输入框的变化
avatarInput.addEventListener('change', function () {
    // 获取用户选择的文件
    const file = avatarInput.files[0];
    if (file) {
        // 使用FileReader来读取文件并显示预览
        const reader = new FileReader();
        reader.onload = function (e) {
            avatarPreview.src = e.target.result;
            avatarPreview.style.display = '';

            //正则表达式取出base64编码
            var str = e.target.result;
            var match = str.match(/,(.*)/);
            var contentAfterComma = match[1];
            document.getElementById('avatar_base64').value = contentAfterComma;
        };
        reader.readAsDataURL(file);
    } else {
        // 如果用户取消选择文件，则清空预览
        avatarPreview.src = '#';
        avatarPreview.style.display = 'none';
        //清除base64
        document.getElementById('avatar_base64').value = '';
    }
});