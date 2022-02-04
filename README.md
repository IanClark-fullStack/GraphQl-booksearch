# MERN - Book Search Engine (RESTful API to GraphQL API Conversion)
  ------
  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  ## Table of Contents
  ------

  * [Description](#description)
  * [Installation](#installation)
  * [Usage](#usage)
  * [Tests](#tests)
  * [Questions & Contributions](#questions-contribute)
  * [Credits](#credits)
  * [Licenses](#licenses)

  ## Description
  ------
  ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)  ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white) ![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white) ![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black) 
  
  MERN - Stack application and book search engine.  Allows users to search and browse books using Google Books API, as well as save and manage books on their individual profile.  
  ![image](https://user-images.githubusercontent.com/90655370/146276880-e656cb70-d5b6-459e-9159-7b3e0616ab04.png)

  ![image](https://user-images.githubusercontent.com/90655370/146277136-b68e5e41-029e-4e0f-8f9c-2c8abdbc99af.png)

  _Previously written with a RESTful API_ 
  The application now runs using Apollo Server and Apollo Provider in order handle requests
  - Fetch replaced by GraphQL queries. 
  - Put, Post and Delete replaced by GraphQL Mutations.
  - User auth is attached as middleware, and accessible by each request through context. 
  
  #### [Deployed Live at Heroku](https://stark-beach-08646.herokuapp.com/)
  
  **Written w/**
  MERN, MongoDB, NoSQL, REST, GraphQl, Apollo Server, JWToken, React, Node, Express, Heroku, MongoDB Atlas, Apollo Provider


  ## Installation
  ------
  - Clone the repo to your machine. Navigate to the parent directory in your terminal and ```npm i``` all dependencies.
  - Launch both the backend & frontend servers concurrently simply by running ```npm run develop``` 

  ## Usage
  ------
 This repository can be used as reference on how to successfully refactor an existing application using from RESTful API to GraphQL API. 
  - In order to do so, I would recommend comparing both versions side-by-side. Specifically from the previous [RESTful Architecture Commit](https://github.com/IanClark-fullStack/GraphQl-booksearch/commit/19d2900ca20751889400587a1cb3038af0a7299d)

The bulk of the work for converting. 

#### Back-end 

* `server.js`: Implement the Apollo Server and apply it to the Express server as middleware.

* `auth.js`: Update the auth middleware function to work with the GraphQL API.

* `Schemas` directory:

	* `resolvers.js`: Query and mutation functionality to work with the Mongoose models.

	* `typeDefs.js`: `Query` and `Mutation` types

			* `me`: Returns a `User` type.

			* `login`: Accepts email and password; Returns an `Auth` type.

			* `addUser`: Accepts username, email, and password; Returns an `Auth` type.

			* `saveBook`: Accepts a book author's array, description, title, bookId, image, and link; Returns a `User` type.
			* `removeBook`: Accepts `bookId`; Returns a `User` type.
			

		* `Auth` type:

			* `token`

			* `user` (References the `User` type.)

#### Front-End 

* `queries.js: GET_ME`, executes the `me` query set up using Apollo Server.

* `mutations.js`:

	* `LOGIN_USER` executes `loginUser` mutation set up using Apollo Server.

	* `ADD_USER` executes `addUser` mutation.

	* `SAVE_BOOK` executes `saveBook` mutation.

	* `REMOVE_BOOK` executes `removeBook` mutation.

* `App.js`: Apollo Provider setup to make every request work with the Apollo Server.
	
* `SearchBooks.js`: Apollo `useMutation()` Hook - Executes `SAVE_BOOK` mutation in the `handleSaveBook()` function. 

* `SavedBooks.js: useQuery()` Hook:  Executes `GET_ME` query on load and saved to `userData`.

	* `useMutation()` Hook: Executes `REMOVE_BOOK` mutation in the `handleDeleteBook()` function.

* `SignupForm.js`: `ADD_USER` mutation functionality.

* `LoginForm.js`: `LOGIN_USER` mutation functionality.


  
  - You can also use this repo as a solid starting point for MERN-stack applications using Google Books API. 

  ## Contributing
  ------
  Fork and critique as you see fit!

  
  ## Questions
  ------
  [visit my github](https://www.github.com/ianclark-fullstack) 
  Reach out w/ Additional Questions. 
  ianclark.fullstack@gmail.com
  

  
  ### License
   2021 - MIT
  [MIT Info](https://choosealicense.com/licenses/mit/)
