const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;

const app = express();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/todoapp';
const ObjectID = require('mongodb').ObjectID;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

MongoClient.connect(url, (err, client) => {
	console.log('MongoDB Connected');
	if (err) throw err;

	db = client.db('acme');
	Todos = db.collection('todos');
	app.listen(port, () => {
		console.log('Server running on port ' + port);
	});
});

app.get('/', (req, res, next) => {
	Todos.find({}).toArray((err, todos) => {
		if (err) {
			return console.log(err);
		}
		res.render('index', {
			todos : todos
		});
	});
});

app.post('/todo/add', (req, res, next) => {
	const todo = {
		text: req.body.text,
		body: req.body.body
	}

	Todos.insertOne(todo, (err, response) => {
		if (err) { 
			return console.log(err); 
		}
		console.log('Todo added...');
		res.redirect('/');
	});
});

app.delete('/todo/delete/:id', (req, res, next) => {
	const query = { _id: ObjectID(req.params.id) };
	Todos.deleteOne(query, (err, response) => {
		if (err) {
			return console.log(err);
		}
		console.log('Todo removed');
		res.send(200);
	});
});