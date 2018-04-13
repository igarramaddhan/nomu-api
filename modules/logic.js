const Note = require('../models/note');

const getAuthenticatedUser = ctx => {
	if (ctx.user) {
		return ctx.user;
	}
	console.log('---Unauthorized');
};

const noteLogic = {
	getAllNote: (_, args, ctx) => {
		const data = getAuthenticatedUser(ctx);
		if (data) {
			return Note.find({ userId: data.user._id });
		}
		console.log('---Getting notes failed');
	},
	getOneNote: (_, args, ctx) => {
		const { id } = args;
		const user = getAuthenticatedUser(ctx);
		if (user) {
			return Note.findById(id);
		}
		console.log('---Getting note failed');
	},
	createNote: (_, args, ctx) => {
		const { title, content } = args;
		const data = getAuthenticatedUser(ctx);
		if (data) {
			let newNote = { title: title, content: content, userId: data.user._id };
			return Note.create(newNote);
		}
		console.log('---Creating note failed');
	},
	updateNote: (_, args, ctx) => {
		const { id, title, content } = args;
		const user = getAuthenticatedUser(ctx);
		if (user) {
			return Note.findByIdAndUpdate(id, { title, content }, { new: true });
		}
		console.log('---Updating note failed');
	},
	deleteNote: async (_, args, ctx) => {
		const { id } = args;
		const user = getAuthenticatedUser(ctx);
		if (user) {
			try {
				const deletedNote = await Note.findByIdAndRemove(id);
				if (deletedNote) return 'OK';
				else return 'NOT EXIST';
			} catch (error) {
				console.log(error.message);
			}
		}
		console.log('---Deleting note failed');
	}
};

module.exports = { noteLogic };
