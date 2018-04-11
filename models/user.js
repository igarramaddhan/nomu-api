let mongoose = require('mongoose');
let Schema = mongoose.Schema;
// create a schema
var userSchema = new Schema(
	{
		username: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		}
	},
	{ collection: 'users' }
);
// we need to create a model using it
var User = mongoose.model('User', userSchema);
module.exports = User;
