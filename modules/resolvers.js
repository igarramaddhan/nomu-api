const bcrypt = require('bcrypt');

const Note = require('../models/note');
const User = require('../models/user');

module.exports = {
	Query: {
		note: (obj, { id }) => Note.findById(id),
		notes: () => Note.find()
	},
	Mutation: {
		createNote: (obj, args) => Note.create(args),
		updateNote: (obj, { id, title, content }) =>
			Note.findByIdAndUpdate(id, { title, content }, { new: true }),
		removeNote: async (obj, { id }) => {
			try {
				await Note.findByIdAndRemove(id);
				return 'OK';
			} catch (error) {
				throw error;
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

			return user;
		}
	}
};
