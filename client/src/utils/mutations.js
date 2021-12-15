import { gql } from '@apollo/client';

// LOGIN_USER Mutation - executes the loginUser set up using Apollo Server.
export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token 
            user {
                _id 
                username
            }
        }
    }
`;

// ADD_USER Mutation - executes the addUser set up using Apollo Server.
export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
                email
                bookCount
                savedBooks {
                    bookId
                    description
                    title
                    image
                    link
                    authors
                }
            }
        }
    }
`;

// SAVE_BOOK Mutation - executes the saveBook set up using Apollo Server.
export const SAVE_BOOK = gql`
    mutation saveBook($input: BookContent!) {
        saveBook(input: $input) 
        {
            _id
            username
            bookCount
            savedBooks {
                bookId
                title
                authors
                description
                image
                link
            }
            
        }
    }
`;

// REMOVE_BOOK Mutation - executes the removeBook set up using Apollo Server.
export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
        removeBook(bookId: $bookId) {
            _id 
            username
            bookCount
            savedBooks {
                bookId
                title
                authors
                description
                image
                link
            }
        }
    }
`;