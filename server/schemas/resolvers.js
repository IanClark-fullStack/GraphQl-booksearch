const { AuthenticationError } = require('apollo-server-express');

const { User } = require('../models'); 
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select("-__v -password");
                return userData;
            }
            throw new AuthenticationError('Please login first');
        },
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Wrong password or email');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Wrong password or email');
            }

            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user); 
            
            return { token, user };
        }, 
        
        saveBook: async (parent, { input }, context) => {
            if (context.user) {
                console.log(context.user);
                const updatedUser = await User.findOneAndUpdate( 
                    { _id: context.user._id }, 
                    { $addToSet: { savedBooks: input } },
                    { new: true, runValidators: true }
                );

                return updatedUser;
            }; 
            throw new AuthenticationError('You need to be logged in to perform this action.');
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: {savedBooks: { bookId: bookId }} },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You need to logged in to perform this action');
        },
    }
};

module.exports = resolvers; 