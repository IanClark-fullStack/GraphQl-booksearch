import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// Import Provider to make Each Request work w/ Apollo Server 
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';
// Create a link to Graph Ql 
const httpLink = createHttpLink({
  uri: '/graphql',
});
// Create middleware for requests to attach JSON web token as a header for all requests. 
const authLink = setContext((_, { headers }) => {
  // Retrieve token from local storage 
  const token = localStorage.getItem('id_token');
  // Return out of this function --> The headers, so that they will be accessible by the httpLink to Read 
  return {
    headers: {
      // Spread the pre-existing headers
      ...headers, 
      // If a token exists, set it back up 
      authorization: token ? `Bearer ${token}` : '',
    },
  }
});

const client = new ApolloClient({
  // Client side setup for middleware authLink execution. Runs before a request hits the GraphQL API. 
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
        <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
    
  );
}

export default App;
