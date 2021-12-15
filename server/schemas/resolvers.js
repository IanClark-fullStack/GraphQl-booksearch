const { AuthenticationError } = require('apollo-server-express');

const { User } = require('../models'); 
const { signToken } = require('../utils/auth');

const resolvers = {
        // user: async (parent, { userId }) => {
            //     return User.findOne({ _id: userId });
            // },
    // Get One User by either Username or ID 
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select("-__v -password");
                return userData;
            }
            throw new AuthenticationError('Please login first');
        },
    },
        // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
        // {body} is destructured req.body
    Mutation: {
        // ------- POST (We have to create a Token) : Mutation 
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            // In case we can't find a user 
            if (!user) {
                throw new AuthenticationError('Wrong password or email');
            }
            // Using the pre-existing Helper 
            const correctPw = await user.isCorrectPassword(password);
            // In the case we can't verify the password 
            if (!correctPw) {
                throw new AuthenticationError('Wrong password or email');
            }
            // In all other cases, let's create a new token 
            const token = signToken(user);
            return { token, user };
        },
    // ------- POST : Mutation 
        // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user); 
            // Return both together 
            return { token, user };
        }, 
    // ------- PUT : Mutation 
        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        // user comes from `req.user` created in the auth middleware function
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