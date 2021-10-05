const mysql = require('mysql');


var config =
{
    host: '127.0.0.1',
    user: 'root',
    password: 'C23670424989',
    database: 'line-bot',
    port: 3306,
    ssl: true
};

const conn = new mysql.createConnection(config);

conn.connect(
    function (err) {
        if (err) {
            console.log("!!! Cannot connect !!! Error:");
            throw err;
        }
        else {
            console.log("Connection established.");
        }
    });

//資料庫連線設定    

module.exports.show_follow = function show_follow(user_id) {
    return new Promise((resolve) => {
        conn.query('SELECT * FROM follow_list where user_id = ' + "'" + String(user_id) + "'",
            function (err, results) {
                if (err) throw err;
                var follow_lest = []
                if (results[0].follow_1 != null) {
                    follow_lest.push(results[0].follow_1)
                }
                if (results[0].follow_2 != null) {
                    follow_lest.push(results[0].follow_2)
                }
                if (results[0].follow_3 != null) {
                    follow_lest.push(results[0].follow_3)
                }
                if (results[0].follow_4 != null) {
                    follow_lest.push(results[0].follow_4)
                }
                if (results[0].follow_5 != null) {
                    follow_lest.push(results[0].follow_5)
                }
                resolve(follow_lest)
            })
    })
}

//顯示使用者關注清單

module.exports.new_user_creat = function new_user_creat(user_id) {
    conn.query('INSERT INTO follow_list (user_id) VALUES (?);', [user_id],
        function (err, results) {
            if (err) throw err;
        })
};

//為第一次加入好友的使用者建立關注清單

module.exports.insertData_load = function insertData_load(user_id, stock) {
    conn.query('SELECT * FROM follow_list where user_id = ' + "'" + String(user_id) + "'",
        function (err, results) {
            if (err) throw err;
            if (results[0].follow_1 == null) {
                let location = "follow_1"
                UPDATE(user_id, stock, location)
            } else if (results[0].follow_2 == null) {
                let location = "follow_2"
                UPDATE(user_id, stock, location)
            } else if (results[0].follow_3 == null) {
                let location = "follow_3"
                UPDATE(user_id, stock, location)
            } else if (results[0].follow_4 == null) {
                let location = "follow_4"
                UPDATE(user_id, stock, location)
            } else if (results[0].follow_5 == null) {
                let location = "follow_5"
                UPDATE(user_id, stock, location)
            } else {
                console.log("關注清單已滿")
            }

        })
};

//確認清單欄位是否有空值

function UPDATE(user_id, stock, location) {
    conn.query('UPDATE follow_list SET ' + location + ' = ? WHERE user_id = ?', [String(stock), String(user_id)],
        function (err, results, fields) {
            if (err) throw err;
        })
};

//新增關注代號

module.exports.remove_Data_load = function remove_Data_load(user_id, stock) {
    conn.query('SELECT * FROM follow_list where user_id = ' + "'" + String(user_id) + "'",
        function (err, results) {
            if (err) throw err;
            if (String(results[0].follow_1) == String(stock)) {
                let location = "follow_1"
                UPDATE_remove(user_id, stock, location)
            } else if (String(results[0].follow_2) == String(stock)) {
                let location = "follow_2"
                UPDATE_remove(user_id, stock, location)
            } else if (String(results[0].follow_3) == String(stock)) {
                let location = "follow_3"
                UPDATE_remove(user_id, stock, location)
            } else if (String(results[0].follow_4) == String(stock)) {
                let location = "follow_4"
                UPDATE_remove(user_id, stock, location)
            } else if (String(results[0].follow_5) == String(stock)) {
                let location = "follow_5"
                UPDATE_remove(user_id, stock, location)
            }
        })
};

//確認移除股票代號在清單欄位內的位置

function UPDATE_remove(user_id, stock, location) {
    conn.query('UPDATE follow_list SET ' + location + ' = ? WHERE user_id = ?', [null, String(user_id)],
        function (err, results, fields) {
            if (err) throw err;
        })
};

//移除股票代號

module.exports.check_message = function check_message(user_id, message) {
    let messages = String(message)
    let user_ids = String(user_id)
    if (messages.substr(0, 1) == "+") {
        stock = messages.substr(1, 4)
        insertData_load(user_ids, stock)
    }
    else if (messages.substr(0, 1) == "-") {
        stock = messages.substr(1, 4)
        remove_Data_load(user_ids, stock)
    }
}

//確認使用者訊息
