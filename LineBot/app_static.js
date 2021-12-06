const express = require('express');
const app = express();
 
//setting middleware
app.use(express.static(__dirname + '/public')); //Serves resources from public folder
 
const server = app.listen(5050, function () {
  console.log('[靜態資料服務已準備就緒]');
});