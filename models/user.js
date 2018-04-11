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
		},
		//adding jwt
		token: {
			type: String,
			required: false
		}
	},
	{ collection: 'users' }
);
// we need to create a model using it
var User = mongoose.model('User', userSchema);
module.exports = User;
