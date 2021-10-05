const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: 'qQ8Jy0v3j3pUlOebdVPnNmj7dxOC1Td8sfDIE7PiMnpxceApOWRmWdbP1buzeStt+WeOY+OFyJDqrkLK/DvIC+9vhED7MdqKoZ1D6q+y8WocAqBMqt1SVQX5LZmkVGv3m6j7fX8gW+CPjzPPJ7AdEAdB04t89/1O/w1cDnyilFU=',
    channelSecret: '4dc186c1cecba6df2483e85370fbc0e9'
}
const client = new line.Client(config);
const richmenu = {
    "size": {
        "width": 2500,
        "height": 843
    },
    "selected": true,
    "name": "Nice richmenu",
    "chatBarText": "Tap to open",
    "areas": [
        // 區塊1：
        {
            "bounds": {
                "x": 0,
                "y": 0,
                "width": 833,
                "height": 843
            },
            "action": {
                "type": "message",
                "label": "區塊1",
                "text": "關於鯊科"
            }
        },
        // 區塊2：
        {
            "bounds": {
                "x": 834,
                "y": 0,
                "width": 833,
                "height": 843
            },
            "action": {
                "type": "message",
                "label": "區塊2",
                "text": "關注清單"
            }
        },
        // 區塊3：   
        {
            "bounds": {
                "x": 1667,
                "y": 0,
                "width": 833,
                "height": 843
            },
            "action": {
                "type": "message",
                "label": "區塊3",
                "text": "常見問題"
            }
        }
    ]
}

// client.createRichMenu(richmenu)
//     .then((richMenuId) => console.log(richMenuId))
//     .catch(err => console.error(err))

const richMenuId = "richmenu-ca5b044de5b41f1cf97b1865dbe1cbb0"
const fs = require('fs')
client.setRichMenuImage(richMenuId, fs.createReadStream('./sharkMenu.png'))
    .then(res => console.log(res))
    .catch(err => console.error(err))

client.setDefaultRichMenu(richMenuId)