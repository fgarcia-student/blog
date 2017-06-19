let express = require('express');
let pg = require('pg');
let bodyParser = require('body-parser');
let ejs = require('ejs');
let path = require('path');

let app = express();
let conString = "postgres:postgres@localhost:5432/blog";
let client = new pg.Client(conString);
client.connect();

app.use(express.static('public'));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req,res) => {
	res.render('index');
});

app.get('/portfolio', (req,res) => {
	res.sendFile(path.join(__dirname,'/public/portfolio.html'));
});

app.get('/threads', (req,res) => {
	let ret = [];
	let q = client.query('select * from threads', (err,result) => {
		for(let i = 0; i < result.rows.length; i++){
			let obj = {};
			obj.id = result.rows[i].id;
			obj.title = result.rows[i].title;
			obj.children = result.rows[i].children || 0;
			ret.push(obj);
		}
	});
	q.on('end', (result) => {
		res.render('allthreads',{
			ret: ret
		});
	});
});

app.post('/threads', (req,res) => {
	let obj = JSON.stringify(req.body);
	obj = JSON.parse(obj);
	let threadTitle = obj.title;
	let q = client.query('insert into threads (title) values ($1)', [threadTitle]);
	q.on('end', () => {
		res.send(200);
	});
});

app.get('/posts', (req,res) => {
	let ret = [];
	let id = req.query.id;
	let q = client.query('select * from posts where thread_no=$1', [id], (err, result) => {
		for (let i = 0; i < result.rows.length; i++) {
			let obj = {};
			obj.id = result.rows[i].id;
			obj.author = result.rows[i].author;
			obj.description = result.rows[i].description;
			obj.thread_no = result.rows[i].thread_no;
			ret.push(obj);
		}
	});
	q.on('end', () => {
		res.render('allposts', {
			ret: ret
		});
	});
});

app.get('*', (req,res) => {
	res.redirect('/');
});

app.listen(3000,() => {
	console.log("listening on 3000");
});