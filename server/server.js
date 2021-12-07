const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const path = require('path');

const { typeDefs, resolvers } = require('./schemas'); 
const { authMiddleware } = require('./utils/auth');

// Create the connection to the Mongo DB
const db = require('./config/connection');
// const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();
// Using the Apollo Server import to create a new Instance of an Apollo Server 
const server = new ApolloServer({
  typeDefs,
  resolvers, 
  // Give all Resolvers access to Context 
    // Context Will then include any values defined on the Request
  context: authMiddleware
});
// Bind the 2 Servers Together
// By applying the express server as middleware 
server.applyMiddleware({ app });



app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });
