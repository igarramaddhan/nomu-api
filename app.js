let bodyParser = require('body-parser');
let path = require('path');
let express = require('express');
let mongoose = require('mongoose');
let graphqlHTTP = require('express-graphql');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');

let User = require('./models/user');
let Note = require('./models/note');
let schema = require('./modules/schema');
const { JWT_SECRET } = require('./config/config');

let app = express();

const auth = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const { user } = await jsonwebtoken.verify(token, JWT_SECRET);
		req.user = user;
	} catch (err) {
		console.log('---Unauthorized');
	}
	next();
};

app.use(
	'/graphql',
	cors(),
	bodyParser.json(),
	auth,
	jwt({
		secret: JWT_SECRET,
		credentialsRequired: false
	}),
	graphqlHTTP(req => ({
		schema,
		context: {
			user: req.user
		}
	}))
);
app.use(
	'/graphiql',
	graphqlHTTP({
		schema,
		graphiql: true
	})
);

app.get('/', (req, res) => {
	res.send('Hello');
});

module.exports = app;
