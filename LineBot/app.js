// 引用linebot SDK
let linebot = require('linebot');

// 用於辨識Line Channel的資訊
let bot = linebot({
  channelId: 'channelId',
  channelSecret: 'channelSecret',
  channelAccessToken: 'channelAccessToken'
});

// 當有人傳送訊息給Bot時
bot.on('message', function (event) {
  //引用child_process SDK的spawn
  //console.log(event.message.text)
  let spawn = require("child_process").spawn
  //spawn一個子程序('command',['filedir/filename',[inputValue]])
    let process = spawn('python', [
    "./CallMe.py",
    event.message.text
  ]);
  //Bot回傳給User
  function pushbacktoline(replyMsg){
    // 使用event.reply(要回傳的訊息)方法可將訊息回傳給使用者
    event.reply(replyMsg).then(function (data) {
      // 當訊息成功回傳後的處理
      console.log(data);
    }).catch(function (error) {
      // 當訊息回傳失敗後的處理
      console.log('error');
      console.log(error);
    });
  };
  //應該是取得回傳資訊
  process.stdout.on('data', (data) => {
    //將data轉為json格式
    //console.log(data)
    let replyMsg =  JSON.parse(data)
    console.log(replyMsg)
    /*
    "Type"的值
    text        00000001:1
    image       00000010:2
    video       00000100:4
    sticker     00001000:8
    audio       00010000:16
    location    00100000:32
    imagemap    01000000:64
    template    10000000:128
    */
    let tp=replyMsg["Type"]
    if (tp==1){
      pushbacktoline(replyMsg["Result"][1])
    }
    //console.log(replyMsg["Text"])
    let img={type:'image',
    originalContentUrl:replyMsg["Result"][2],
    previewImageUrl:replyMsg["Result"][2]}
    pushbacktoline(img)
  });
});
// Bot所監聽的webhook路徑與port
bot.listen('/linewebhook', 3000, function () {
    console.log('[BOT已準備就緒]');
});