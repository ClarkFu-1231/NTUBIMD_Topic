var mysql = require('mysql');
var http = require('http');
var path = require('path');

// Some constances
const express = require('express')
const app = express()
const hostName = 'localhost';
const port = 3000;
// Setup static folder
app.use(express.static(__dirname + "/static/"));
// Creating mysql connection pool
var con  = mysql.createPool({
	connectionLimit : 100,
	host: "localhost",
	user: "root",
	password: "password",
	database:"test"
});

// JSON Response of table query
app.get('/1101.json', (req, res) => {
	res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
	con.query("SELECT * FROM stock1101", function (err, result) {
		res.write(JSON.stringify(result));
		res.end();
	});
})

// JSON Response of table query
app.get('/2330.json', (req, res) => {
	res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
	con.query("SELECT * FROM stock2330", function (err, result) {
		res.write(JSON.stringify(result));
		res.end();
	});
})

// JSON Response of table query
app.get('/2610.json', (req, res) => {
	res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
	con.query("SELECT * FROM stock2610", function (err, result) {
		res.write(JSON.stringify(result));
		res.end();
	});
})
// rendering html file.
app.get('/', (req, res) => {
	console.log(req.url);
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('1101, 2330, 2610');
})

// rendering html file.
app.get('/1101', (req, res) => {
	console.log(req.url);
	res.sendFile(path.join(__dirname + '/html/1101.html'));
})
// rendering html file.
app.get('/2330', (req, res) => {
	console.log(req.url);
	res.sendFile(path.join(__dirname + '/html/2330.html'));
})
// rendering html file.
app.get('/2610', (req, res) => {
	console.log(req.url);
	res.sendFile(path.join(__dirname + '/html/2610.html'));
})


app.listen(port, () => console.log(`Example app listening on port  http://${hostName}:${port}`))