const step1 = `
    <p class="title step1title">第 1 步</p>

    <form id="step1Form" onsubmit="onSubmit1(event)">
        <div class="question">
            <img src="./svg/user.svg">
            <input type="text" id="step1-username" placeholder="请输入需要重置密码的账号ID">
        </div>
        <input type="submit" value="下一步">
        <div class="reg">
            <a href="./">返回登录</a>
        </div>
    </form>
`;

const step2 = `
    <p class="title step2title">第 2 步</p>

    <form id="step2Form" onsubmit="onSubmit2(event)">
        <div class="question">
            <img src="./svg/q1.svg">
            <span>最喜欢的颜色</span>
            <div>
                <img src="./svg/lock.svg">
                <input type="text" id="step2-question1" placeholder="请输入问题1的答案">
            </div>
        </div>
    
        <div class="question">
            <img src="./svg/q2.svg">
            <span>最喜欢的音乐</span>
            <div>
                <img src="./svg/lock.svg">
                <input type="text" id="step2-question2" placeholder="请输入问题2的答案">
            </div>
        </div>
    
        <div class="question">
            <img src="./svg/q3.svg">
            <span>最喜欢的数字</span>
            <div>
                <img src="./svg/lock.svg">
                <input type="text" id="step2-question3" placeholder="请输入问题3的答案">
            </div>
        </div>
        <input type="submit" value="下一步">
        <div class="reg">
            <a href="./">返回登录</a>
        </div>
    </form>
`;


const step3 = `
    <p class="title step3title">第 3 步</p>

    <form id="step3Form" onsubmit="onSubmit3(event)">
        <div class="question">
            <img src="./svg/lock.svg">
            <input type="password" id="step3-newpassword1" placeholder="请输入新密码">
        </div>

        <div class="question">
            <img src="./svg/lock.svg">
            <input type="password" id="step3-newpassword2" placeholder="请再次输入新密码">
        </div>
        <input type="submit" value="完成">
        <div class="reg">
            <a href="./">返回登录</a>
        </div>
    </form>
`;

const onSubmit1 = async (event) => {
    event.preventDefault();

    const step = '1';
    const username = document.getElementById('step1-username').value;

    const response = await fetch('ResetPasswordServlet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({step, username})
    })

    const msg = (await response.json())?.msg;

    if (response.status == 200)
        document.getElementById('rightElem').innerHTML = step2;
    else
        alert(msg);
}

const onSubmit2 = async (event) => {
    event.preventDefault();

    const step = '2';
    const answer1 = encodeURI(document.getElementById('step2-question1').value, 'UTF-8');
    const answer2 = encodeURI(document.getElementById('step2-question2').value, 'UTF-8');
    const answer3 = encodeURI(document.getElementById('step2-question3').value, 'UTF-8');

    const response = await fetch('ResetPasswordServlet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({step, answer1, answer2, answer3})
    });

    const msg = (await response.json())?.msg;

    if (response.status == 200)
        document.getElementById('rightElem').innerHTML = step3;
    else
        alert(msg);
}

const onSubmit3 = async (event) => {
    event.preventDefault();

    const step = '3';
    const newpassword1 = document.getElementById('step3-newpassword1').value;
    const newpassword2 = document.getElementById('step3-newpassword2').value;

    if (!/^(?![a-z]+$)(?![A-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,20}$/.test(newpassword1)) {
        alert('密码不符合复杂度要求！请重新输入');
        return;
    }

    if (newpassword1 != newpassword2) {
        alert('两次密码不一致！请重新输入');
        return;
    }


    const response = await fetch('ResetPasswordServlet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({step, newpassword: newpassword1})
    })

    const msg = (await response.json())?.msg;

    if (response.status == 200) {
        alert('密码重置成功！');
        window.location.href = './';
    } else
        alert(msg);
}

function makeAjaxRequest(url, data, successCallback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                successCallback(xhr.responseText);
            } else {
                alert('发生错误，请稍后重试');
            }
        }
    };
    xhr.send(data);
}

document.getElementById('rightElem').innerHTML = step1;
