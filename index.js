let express = require('express');
let pg = require('pg');
let ejs = require('ejs');
let path = require('path');

let app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req,res) => {
	res.render("index");
});

app.get('/portfolio', (req,res) => {
	res.sendFile(path.join(__dirname,'/public/portfolio.html'));
});

app.listen(3000,() => {
	console.log("listening on 3000");
});