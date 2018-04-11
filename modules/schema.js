const { makeExecutableSchema } = require('graphql-tools');

const resolvers = require('./resolvers');

const typeDefs = [
	`
	type Query {
		note(_id: String): Note
		notes: [Note]		
	}

	type Note {
		_id: String
		title: String
		content: String
	}

	type User {
		_id: String
		username: String
	}

	type Mutation {
		createNote(title: String, content: String): Note
		updateNote(id: String, title: String, content: String): Note
		removeNote(id: String): String
		signUp(username: String!, password: String!): User
		logIn(username: String!, password: String!): User
	}

	schema {
		query: Query
		mutation: Mutation
	}
`
];

module.exports = makeExecutableSchema({ typeDefs, resolvers });
