const Note = require('../models/note');

const getAuthenticatedUser = ctx => {
	if (ctx.user) {
		return ctx.user;
	}
	console.log('---Unauthorized');
};

const noteLogic = {
	getAllNote: (_, args, ctx) => {
		const { userId } = args;
		const user = getAuthenticatedUser(ctx);
		if (user) {
			return Note.find({ userId });
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
		const { title, content, userId } = args;
		const user = getAuthenticatedUser(ctx);
		if (user) {
			return Note.create(args);
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
