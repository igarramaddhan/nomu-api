const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect('mongodb://localhost:27017/nomu');
var db = mongoose.connection;
db.on('error', () => {
	console.log('---FAILED to connect to mongoose');
});
db.once('open', () => {
	console.log('+++Connected to mongoose');
});

app.listen(8080, () => {
	console.log('+++Express Server is Running!!!');
});
