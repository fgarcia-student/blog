let express = require('express');
let pg = require('pg');
let Sequelize = require('sequelize');
let bodyParser = require('body-parser');
let ejs = require('ejs');
let path = require('path');

let app = express();
let conString;
if(process.env.DATABASE_URL){
	conString = process.env.DATABASE_URL;
}else{
	conString = "postgres:postgres@localhost:5432/blog";
}
let client = new pg.Client(conString);
client.connect();
// let q = client.query('create table threads if not exists(id serial unique not null primary key, title varchar(50), children integer);');
// q.on('end', () => {
// 	client.query('create table posts if not exists(id serial unique not null primary key, author varchar(50), description(255), thread_no integer references threads on delete cascade );');
// });

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
	let q = client.query('select * from threads order by children desc', (err,result) => {
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
	let q = client.query('insert into threads (title,children) values ($1,0)', [threadTitle]);
	q.on('end', () => {
		res.sendStatus(200);
	});
});

app.delete('/threads', (req,res) => {
	let id = req.query.id;
	let pass = true;
	let q = client.query('delete from threads where id=$1',[id],(err) => {
		if(err){
			pass = false;
			res.redirect('/');
		}
	});
	q.on('end',() => {
		res.sendStatus(200);
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
			ret: ret || null,
			id: id
		});
	});
});

app.post('/posts', (req,res) => {
	let obj = JSON.stringify(req.body);
	obj = JSON.parse(obj);
	let postAuthor = obj.author;
	let postContent = obj.post;
	let thread = obj.parentID;
	let q = client.query('insert into posts (author,description,thread_no) values ($1,$2,$3)', [postAuthor,postContent,thread]);
	q.on('end', () => {
		client.query('update threads set children = children + 1 where id=$1',[thread]);
		res.sendStatus(200);
	});
});

app.delete('/posts', (req,res) => {
	let id = req.query.id;
	let pid = req.query.pid;
	let pass = true;
	let q = client.query('delete from posts where id=$1',[id],(err) => {
		if(err){
			pass = false;
			res.redirect('/');
		}
	});
	q.on('end',() => {
		if(pass){
			client.query('update threads set children = children - 1 where id=$1',[pid]);
		}
		res.sendStatus(200);
	});
});

app.get('*', (req,res) => {
	res.redirect('/');
});

app.listen((process.env.PORT || 3000),() => {
	console.log("listening on 3000");
});