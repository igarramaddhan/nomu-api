const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Note = require('../models/note');
const User = require('../models/user');

//adding jwt
const { JWT_SECRET } = require('../config/config');

module.exports = {
	Query: {
		note: (obj, { id }, context) => {
			if (context.headers && context.headers.authorization) {
				return Note.findById(id);
			} else {
				throw new Error('Need authorization token');
			}
		},
		notes: (obj, args, context) => {
			if (context.headers && context.headers.authorization) {
				return Note.find();
			} else {
				throw new Error('Need authorization token');
			}
		}
	},
	Mutation: {
		createNote: (obj, args, context) => {
			if (context.headers && context.headers.authorization) {
				return Note.create(args);
			} else {
				throw new Error('Need authorization token');
			}
		},
		updateNote: (obj, { id, title, content }, context) => {
			if (context.headers && context.headers.authorization) {
				return Note.findByIdAndUpdate(id, { title, content }, { new: true });
			} else {
				throw new Error('Need authorization token');
			}
		},
		removeNote: async (obj, { id }, context) => {
			if (context.headers && context.headers.authorization) {
				try {
					const deletedNote = await Note.findByIdAndRemove(id);
					if (deletedNote) return 'OK';
					else return 'NOT EXIST';
				} catch (error) {
					throw error;
				}
			} else {
				throw new Error('Need authorization token');
			}
		},
		signUp: async (obj, { username, password }) => {
			const existingUser = await User.findOne({ username });
			if (existingUser) {
				throw new Error('Username already used');
			}
			const hash = await bcrypt.hash(password, 10);
			await User.create({
				username,
				password: hash
			});
			const user = await User.findOne({ username });
			//adding jwt
			user.token = jwt.sign({ _id: user._id }, JWT_SECRET);
			return user;
		},
		logIn: async (obj, { username, password }) => {
			const user = await User.findOne({ username });
			if (!user) {
				throw new Error('User does not exist');
			}
			const validPassword = await bcrypt.compare(password, user.password);
			if (!validPassword) {
				throw new Error('Password is incorrect');
			}
			//adding jwt
			user.token = jwt.sign({ _id: user._id }, JWT_SECRET);
			return user;
		}
	}
};
