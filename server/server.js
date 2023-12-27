const express = require('express');
const path = require('path');

//importing the apollo server
const { ApolloServer } = require ('apollo-server-express')

//importing all the typeDefs and resolvers
const { typeDefs, resolvers } = require ('./schemas');
const { authMiddleware } = require ('./utils/auth')

//creating the connection to database 
const db = require('./config/connection');

// const routes = require('./routes');

//express Server 
const app = express();
const PORT = process.env.PORT || 3001;

//apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

//applying the apollo server with the express app
server.applyMiddleware({ app });

//parsing the middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const buildPath = path.join(__dirname, "../client/build");
app.use(express.static(buildPath));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});