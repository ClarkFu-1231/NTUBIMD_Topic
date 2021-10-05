// // Promise function 建構式
// const oneSecond = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         // 一秒後回傳資料
//         resolve('one second')
//     }, 1000);
// })

// const twoSecond = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         // 兩秒後回傳資料
//         resolve('two second')
//     }, 2000);
// })

// const threeSecond = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         // 三秒後回傳資料
//         resolve('three second')
//     }, 3000);
// })

// 等到三個 Promise 都成功回傳後，才執行接下去的流程
// Promise.all([oneSecond, twoSecond, threeSecond])
//     .then(([oneSecond, twoSecond, threeSecond]) => {
//         console.log(oneSecond, twoSecond, threeSecond)
//     })

// 利用async/await 能將Promise改造成能利用return
// async function oneSecond_return() {
//     const oneSecond = await oneSecond;
//     return oneSecond
// }

//使用者呼叫watch_list

// let t = ""
//   Promise.all([index.show_follow(event.source.userId)])
//     .then(([oneSecond]) => {
//       oneSecond.forEach(element => Promise.all([index2.list(element)])
//         .then(([oneSecond]) => {
//           t = t + "\n" + oneSecond
//         }));
//     })
//   setTimeout(() => {
//     // 三秒後回傳資料
//     event.reply(t).then(function (data) {
//       // 當訊息成功回傳後的處理
//     })
//   }, 5000);



