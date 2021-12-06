const { AuthenticationError } = require('apollo-server-express');

const { User } = require('../models'); 
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // Get One User by either Username or ID 
        user: async () => {
            return User.findOne({ _ })
        }
    }
}