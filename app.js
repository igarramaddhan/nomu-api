let bodyParser = require('body-parser');
let path = require('path');
let express = require('express');
let mongoose = require('mongoose');
let graphqlHTTP = require('express-graphql');
const jwt = require('express-jwt');

let User = require('./models/user');
let Note = require('./models/note');
let schema = require('./modules/schema');
const { JWT_SECRET } = require('./config/config');

let app = express();

app.use(bodyParser.json());
app.use(
	'/graphql',
	graphqlHTTP(req => ({
		schema,
		graphiql: true
	})),
	jwt({
		secret: JWT_SECRET,
		credentialsRequired: false
	})
);

app.get('/', (req, res) => {
	res.send('Hello');
});

module.exports = app;
