const Websocket = require("ws");
const mysql = require("mysql");
const axios = require("axios");

const PORT = 1003;
const MYSQL_ADDRESS = process.env.MYSQL_ADDRESS;
const MYSQL_USERNAME = process.env.MYSQL_USERNAME;
const MYSQL_PASSWORD = process.env.PASSWORD;
const MYSQL_DATABASE = process.env.DATABASE;
const PIC_WEBSITE = process.env.PIC_SITE_URL;

const PIC_UPLOAD_ADDRESS = "http://localhost:1002/upload";
const KEY_VERIFY_ADDRESS = "http://sdju-chat-tomcat:8080/VerifyServlet";

const con_mysql = mysql.createConnection({
    host: MYSQL_ADDRESS,
    user: MYSQL_USERNAME,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    charset: "UTF8MB4_UNICODE_CI",
});

const wss = new Websocket.Server({port: PORT});
console.log(`WebSocket server listening on port ${PORT}`);

var userId_ws_Map = new Map();
var ws_userId_Map = new Map();

con_mysql.connect((err) => {
    if (err) {
        console.log("mysql connect error:\n", err);
        process.exit(-1);
    }
    console.log("mysql connect success!");

    wss.on("connection", (ws) => {
        //console.log('Client connected');

        ws.on("message", function (message) {
            //console.log(message.toString());

            const msg = JSON.parse(message.toString());

            if (!msg.key || !msg.user_id) {
                console.error("miss user_id or user_key !");
                return;
            }

            //console.log(msg);
            verifyKey(msg.user_id, msg.key)
                .then((result) => {
                    if (result === false) {
                        ws.send(
                            JSON.stringify([
                                {msg_type: "key_verify"},
                                {result: "key_error"},
                            ])
                        );
                        return;
                    }

                    console.log(msg);

                    if (msg.option === "get_list") {
                        let sql_query_usergroup = `SELECT *
                                                   FROM \`Group\`
                                                   WHERE \`group_id\` IN
                                                         (SELECT \`group_id\` FROM \`UserGroup\` WHERE \`user_id\` = ${msg.user_id})`;
                        //console.log(sql_query_usergroup)
                        con_mysql.query(sql_query_usergroup, (error, results) => {
                            if (error) throw error;
                            let info = {
                                msg_type: "list",
                            };
                            let arr = JSON.parse(JSON.stringify(results));
                            arr.unshift(info);
                            ws.send(JSON.stringify(arr));
                        });
                    } else if (msg.option === "get_headIcon") {
                        let sql_query_userHeadIcon = `SELECT user_icon
                                                      FROM \`User\`
                                                      WHERE \`user_id\` = ${msg.user_id}`;
                        con_mysql.query(sql_query_userHeadIcon, (error, results) => {
                            if (error) throw error;
                            let info = {
                                msg_type: "headIconUrl",
                            };
                            let arr = JSON.parse(JSON.stringify(results));
                            arr.unshift(info);
                            ws.send(JSON.stringify(arr));
                        });
                    } else if (
                        msg.option === "get_history" &&
                        msg.chat_type === "group"
                    ) {
                        let sql_1 = `SELECT message_id, sender_id, group_id, content, timestamp, user_icon, nickname
                                     FROM \`Message\`, \`User\`
                                     WHERE sender_id = user_id AND group_id = ${msg.chat_id}
                                     ORDER BY \`timestamp\``;
                        con_mysql.query(sql_1, (error, results) => {
                            if (error) throw error;
                            let info = {
                                msg_type: "history_group",
                            };
                            let arr = JSON.parse(JSON.stringify(results));
                            arr.unshift(info);
                            ws.send(JSON.stringify(arr));
                            //console.log(JSON.stringify(arr));
                        });
                    } else if (msg.option === "login") {
                        userId_ws_Map.set(msg.user_id, ws);
                        ws_userId_Map.set(ws, msg.user_id);
                        //console.log(`${msg.user_id} in`);
                        let arr = [{msg_type: "loginSuccess"}];
                        ws.send(JSON.stringify(arr));
                    } else if (msg.option === "new_message_group") {
                        let timestamp = new Date().getTime();
                        let sql_insert_groupMessage = `INSERT INTO \`Message\`(\`sender_id\`, \`group_id\`, \`content\`, \`timestamp\`)
                                                       VALUES (${
                                                                       msg.sender_id
                                                               }, ${msg.group_id}, '${msg.content.replace(
                                                               /'/g,
                                                               "\\'"
                                                       )}', ${timestamp})`;
                        con_mysql.query(sql_insert_groupMessage, (error, results) => {
                            if (error) throw error;
                            let sql_query_message = `SELECT message_id,
                                                            sender_id,
                                                            group_id,
                                                            content, timestamp, user_icon, nickname
                                                     FROM \`Message\`, \`User\`
                                                     WHERE sender_id=user_id AND timestamp = ${timestamp}`;
                            con_mysql.query(sql_query_message, (error, results) => {
                                if (error) throw error;
                                let newMsg = JSON.parse(JSON.stringify(results))[0];
                                let sql_query_groupMenbers = `SELECT \`user_id\`
                                                              FROM \`UserGroup\`
                                                              WHERE \`group_id\` = ${msg.group_id}`;
                                con_mysql.query(sql_query_groupMenbers, (error, results) => {
                                    if (error) throw error;
                                    res = JSON.parse(JSON.stringify(results));
                                    res.forEach((element) => {
                                        let client = userId_ws_Map.get(element.user_id);
                                        if (client != undefined) {
                                            client.send(
                                                JSON.stringify([{msg_type: "new_msg_group"}, newMsg])
                                            );
                                        }
                                    });
                                });
                            });
                        });
                    } else if (msg.option === "add_group") {
                        let sql_add_group = `INSERT INTO \`UserGroup\` (\`user_id\`, \`group_id\`)
                                             VALUES ('${msg.user_id}', '${msg.group_id}');`;
                        con_mysql.query(sql_add_group, (error, results) => {
                            let arr;
                            if (error) {
                                arr = [{msg_type: "add_group"}, {result: "error"}];
                                ws.send(JSON.stringify(arr));
                            } else {
                                let sql_find_groupName = `SELECT group_name
                                                          FROM \`Group\`
                                                          WHERE group_id = '${msg.group_id}'`;
                                con_mysql.query(sql_find_groupName, (err, res) => {
                                    arr = [
                                        {msg_type: "add_group"},
                                        {
                                            result: "success",
                                            group_id: msg.group_id,
                                            group_name: res[0].group_name,
                                        },
                                    ];
                                    ws.send(JSON.stringify(arr));
                                });
                            }
                        });
                    } else if (msg.option === "create_group") {
                        group_id = generateRandomNumber();
                        const uploadData = {
                            data: msg.group_icon,
                            name: "groupIcon_" + group_id,
                        };
                        axios
                            .post(PIC_UPLOAD_ADDRESS, uploadData)
                            .then((response) => {
                                console.log(response.data);
                                var iconUrl =
                                    PIC_WEBSITE + uploadData.name + ".webp";
                                sql_1 = `INSERT INTO \`Group\` (\`group_id\`, \`group_name\`, \`group_create_time\`, \`group_icon\`)
                                         VALUES ('${group_id}', '${msg.group_name}', CURRENT_TIMESTAMP, '${iconUrl}')`;
                                con_mysql.query(sql_1, (err, res) => {
                                    if (err) {
                                        ws.send(
                                            JSON.stringify([
                                                {msg_type: "create_group"},
                                                {result: "error"},
                                            ])
                                        );
                                        return;
                                    }
                                    sql_2 = `INSERT INTO \`UserGroup\` (\`user_id\`, \`group_id\`)
                                             VALUES ('${msg.user_id}', '${group_id}')`;
                                    con_mysql.query(sql_2, (err, res) => {
                                        if (err) {
                                            ws.send(
                                                JSON.stringify([
                                                    {msg_type: "create_group"},
                                                    {result: "error"},
                                                ])
                                            );
                                            return;
                                        }
                                        let arr = [
                                            {msg_type: "create_group"},
                                            {
                                                result: "success",
                                                group_id: group_id,
                                                group_name: msg.group_name,
                                            },
                                        ];
                                        ws.send(JSON.stringify(arr));
                                    });
                                });
                            })
                            .catch((error) => {
                                console.error(
                                    "Error uploading image:",
                                    error.response ? error.response.data : error.message
                                );
                                ws.send(
                                    JSON.stringify([
                                        {msg_type: "create_group"},
                                        {result: "error"},
                                    ])
                                );
                            });
                    } else if (msg.option === "exit_group") {
                        let sql_exit_group = `DELETE
                                              FROM \`UserGroup\`
                                              WHERE \`user_id\` = ${msg.user_id}
                                                AND \`group_id\` = ${msg.group_id}`;
                        con_mysql.query(sql_exit_group, (err, res) => {
                            if (err) {
                                ws.send(
                                    JSON.stringify([
                                        {msg_type: "exit_group"},
                                        {result: "error"},
                                    ])
                                );
                                return;
                            }
                            ws.send(
                                JSON.stringify([
                                    {msg_type: "exit_group"},
                                    {result: "success"},
                                ])
                            );
                        });
                    } else if (msg.option === "upload_file") {
                        let timestamp = new Date().getTime();

                        let content = `<iframe src="${msg.downloadWidget}" scrolling="no" border="0" frameborder="no" framespacing="0" height="110"></iframe>`;

                        let sql_insert_groupMessage = `INSERT INTO \`Message\`(\`sender_id\`, \`group_id\`, \`content\`, \`timestamp\`)
                                                       VALUES (${msg.user_id}, ${msg.group_id}, '${content}',
                                                               ${timestamp})`;

                        con_mysql.query(sql_insert_groupMessage, (error, results) => {
                            if (error) throw error;
                            let sql_query_message = `SELECT message_id,
                                                            sender_id,
                                                            group_id,
                                                            content, timestamp, user_icon, nickname
                                                     FROM \`Message\`, \`User\`
                                                     WHERE sender_id=user_id AND timestamp = ${timestamp}`;
                            con_mysql.query(sql_query_message, (error, results) => {
                                if (error) throw error;
                                let newMsg = JSON.parse(JSON.stringify(results))[0];
                                let sql_query_groupMenbers = `SELECT \`user_id\`
                                                              FROM \`UserGroup\`
                                                              WHERE \`group_id\` = ${msg.group_id}`;
                                con_mysql.query(sql_query_groupMenbers, (error, results) => {
                                    if (error) throw error;
                                    res = JSON.parse(JSON.stringify(results));
                                    res.forEach((element) => {
                                        let client = userId_ws_Map.get(element.user_id);
                                        if (client != undefined) {
                                            client.send(
                                                JSON.stringify([{msg_type: "new_msg_group"}, newMsg])
                                            );
                                        }
                                    });
                                });
                            });
                        });
                    }
                })
                .catch((error) => {
                    ws.send(
                        JSON.stringify([
                            {msg_type: "key_verify"},
                            {result: "server_error"},
                        ])
                    );
                });
        });

        ws.on("close", () => {
            outUserId = ws_userId_Map.get(ws);
            //console.log(`${outUserId} out`);
            userId_ws_Map.delete(outUserId);
            ws_userId_Map.delete(ws);
        });
    });
});

function generateRandomNumber() {
    let eightDigitNumber = "";

    // 确保第一位不是0
    eightDigitNumber += Math.floor(Math.random() * 9) + 1;

    // 生成剩余的7位数字
    for (let i = 1; i < 8; i++) {
        eightDigitNumber += Math.floor(Math.random() * 10);
    }

    return eightDigitNumber;
}

async function verifyKey(user_id, user_key) {
    try {
        const params = new URLSearchParams();
        params.append("user_id", user_id);
        params.append("verify_key", "ShnZ$V2yHrKilovecxk3Z!~5v");

        const response = await axios({
            url: KEY_VERIFY_ADDRESS,
            method: "POST",
            headers: {"content-type": "application/x-www-form-urlencoded"},
            data: params,
        });

        //console.log(`user_key:${user_key} , real_key:${response.data.key}`);
        return response.data.key === user_key;
    } catch (error) {
        //console.error('Error verifying key:', error.response ? error.response.data : error.message);
        return false;
    }
}
