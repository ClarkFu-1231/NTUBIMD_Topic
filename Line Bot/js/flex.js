module.exports.text_message = function text_message(params) {
    let text_m = "安安你好"
    text = {
        "type": "flex",
        "altText": "this is a flex message",
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": text_m
              },
              {
                "type": "text",
                "text": "world"
              }
            ]
          }
        }
      }
    return text
}