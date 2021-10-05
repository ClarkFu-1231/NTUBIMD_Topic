// 引用linebot SDK
const linebot = require('linebot');
var follow_watch_two = require('./js/follow_watch_two');
var follow_watch_one = require('./js/follow_watch_one');
var flex = require("./js/flex");
var fuzzball = require('./Fuzzball.js/fuzzball');

// 用於辨識Line Channel的資訊
var bot = linebot({
  channelId: '1656110228',
  channelSecret: '4dc186c1cecba6df2483e85370fbc0e9',
  channelAccessToken: 'qQ8Jy0v3j3pUlOebdVPnNmj7dxOC1Td8sfDIE7PiMnpxceApOWRmWdbP1buzeStt+WeOY+OFyJDqrkLK/DvIC+9vhED7MdqKoZ1D6q+y8WocAqBMqt1SVQX5LZmkVGv3m6j7fX8gW+CPjzPPJ7AdEAdB04t89/1O/w1cDnyilFU='
});

function stock() {
  let url = "https://zh.wikipedia.org/zh-tw/%E8%82%A1%E7%A5%A8"
  return url
}
function Futures() {
  let url = "https://zh.wikipedia.org/wiki/%E6%9C%9F%E8%B4%A7"
  return url
}
function Bond() {
  let url = "https://zh.wikipedia.org/wiki/%E5%80%BA%E5%88%B8"
  return url
}
function FinanceReport(stock) {
  let url = "https://goodinfo.tw/StockInfo/StockFinDetail.asp?RPT_CAT=IS_M_QUAR_ACC&STOCK_ID=" + stock
  return url
}

function Select(text) {
  let number = text.length
  let know = text.indexOf('道')
  let answer = text.substring(know + 1, know + 3)
  switch (answer) {
    case '股票':
      finanswer = stock();
      break;
    case '期貨':
      finanswer = Futures();
      break;
    case '債券':
      finanswer = Bond();
      break;
    default:
      finanswer = '沒有符合的條件';
  }
  return (finanswer)
}

function Finance_Report(text) {
  let number = text.length
  let know = text.indexOf('表')
  let answer = text.substring(know + 1, know + 5)
  return (FinanceReport(answer))
}

function knowQuestion(que) {

  let know = "N"
  if (a = que.match("我想知道") != null) {
    answer = Select(que)
    know = "Y"
    return (answer)
  }
  if (b = que.match("財務報表") != null) {
    answer = Finance_Report(que)
    know = "Y"
    return (answer)
  }
  if (know = "N") {
    answer = "沒有符合的條件"
    return (answer)
  }

}

// 當有人傳送訊息給Bot時
bot.on('message', function (event) {
  var message = fuzzball.user_question(event.message.text)
  if (event.message.text == "關注清單") {
    let t = ""
    Promise.all([follow_watch_one.show_follow(event.source.userId)])
      .then(([oneSecond]) => {
        oneSecond.forEach(element => Promise.all([follow_watch_two.list(element)])
          .then(([oneSecond]) => {
            t = t + oneSecond
          }));
      })
    setTimeout(() => {
      // 三秒後回傳資料
      event.reply(t).then(function (data) {
        // 當訊息成功回傳後的處理
      })
    }, 2000);
  }
  if (event.message.text == "安安") {
    event.reply(flex.text_message()).then(function (data) {
      // 當訊息成功回傳後的處理
    })
  }
  if (event.message.text.substr(0,1) =="+"){
    let stock = event.message.text.substr(1,4)
    event.reply("將股票代號："+stock+"加入關注清單").then(function (data) {
      // 當訊息成功回傳後的處理
      follow_watch_one.insertData_load(event.source.userId,stock)
    })
  }
  if (event.message.text.substr(0,1) =="-"){
    let stock = event.message.text.substr(1,4)
    event.reply("將股票代號："+stock+"從關注清單移除").then(function (data) {
      // 當訊息成功回傳後的處理
      follow_watch_one.remove_Data_load(event.source.userId,stock)
    })
  }
  setTimeout(() => {
    // 三秒後回傳資料
    event.reply(message).then(function (data) {
      // 當訊息成功回傳後的處理
    })
  }, 3000);
  // event.message.text是使用者傳給bot的訊息
  // 準備要回傳的內容
  // var answer = knowQuestion(event.message.text)
  // var replyMsg = answer;
});

bot.on('follow', function (event) {
  userId = String(event.source.userId)
  index.new_user_creat(userId)
  event.reply("謝謝加入好友").then(function (data) {
    // 當訊息成功回傳後的處理
  }).catch(function (error) {
    // 當訊息回傳失敗後的處理
  });
});


// Bot所監聽的webhook路徑與port
bot.listen('/linewebhook', 3000, function () {
  console.log('[BOT已準備就緒]');
});

