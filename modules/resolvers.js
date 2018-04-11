const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Note = require('../models/note');
const User = require('../models/user');
const { noteLogic } = require('./logic');

//adding jwt
const { JWT_SECRET } = require('../config/config');

module.exports = {
	Query: {
		note: async (obj, args, ctx) => {
			try {
				const note = await noteLogic.getOneNote(obj, args, ctx);
				return note;
			} catch (err) {
				throw err;
			}
		},
		notes: async (obj, args, ctx) => {
			try {
				const notes = await noteLogic.getAllNote(obj, args, ctx);
				return notes;
			} catch (err) {
				throw err;
			}
		}
	},
	Mutation: {
		createNote: async (obj, args, ctx) => {
			try {
				const note = await noteLogic.createNote(obj, args, ctx);
				return note;
			} catch (err) {
				throw err;
			}
		},
		updateNote: async (obj, args, ctx) => {
			try {
				const note = await noteLogic.updateNote(obj, args, ctx);
				return note;
			} catch (err) {
				throw err;
			}
		},
		removeNote: async (obj, args, ctx) => {
			try {
				const deletedNote = await noteLogic.deleteNote(obj, args, ctx);
				return deletedNote;
			} catch (err) {
				throw err;
			}
		},
		signUp: async (obj, { username, password }, ctx) => {
			const existingUser = await User.findOne({ username });
			if (!existingUser) {
				const hash = await bcrypt.hash(password, 10);
				await User.create({
					username,
					password: hash
				});
				const user = await User.findOne({ username });
				//adding jwt
				user.token = jwt.sign({ user }, JWT_SECRET);
				ctx.user = Promise.resolve(user);
				return user;
			}
			return Promise.reject('username already exists'); // email already exists
		},
		logIn: async (obj, { username, password }, ctx) => {
			const user = await User.findOne({ username });
			if (user) {
				const validPassword = await bcrypt.compare(password, user.password);
				if (validPassword) {
					//adding jwt
					user.token = jwt.sign({ user: user }, JWT_SECRET);
					ctx.user = Promise.resolve(user);
					return user;
				}
				return Promise.reject('password incorrect');
			}
			return Promise.reject('username not found');
		}
	}
};
