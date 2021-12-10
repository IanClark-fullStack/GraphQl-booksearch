const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book!]
    }
    type Book {
        bookId: ID!
        description: String
        title: String
        image: String 
        link: String 
        authors: [String]
    }
    type Auth {
        token: ID!
        user: User
    }
    # Get Requests - api routes
    type Query {
        me: User
        # user:(userId: ID!): User
    }
    # ---------------> Ask
    input BookContent {
        bookId: ID!
        description: String
        title: String
        image: String 
        link: String 
        authors: [String]
    }
    # Post, Put and Delete Requests
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(content: BookContent!): User
        removeBook(bookId: ID!): User
    }

    
`;

module.exports = typeDefs;