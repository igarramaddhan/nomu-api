let mongoose = require('mongoose');
let Schema = mongoose.Schema;
// create a schema
var noteSchema = new Schema(
	{
		title: {
			type: String
		},
		content: {
			type: String
		}
	},
	{ collection: 'notes' }
);
// we need to create a model using it
var Note = mongoose.model('Note', noteSchema);
module.exports = Note;
