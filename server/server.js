const { ApolloServer } = require("@apollo/server")
const { authMiddleware }= require("./utils/auth")
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express')
const path = require('path')
const db = require('./config/connection')
const { resolvers, typeDefs }= require("./schemas")

const app = express()
const PORT = process.env.PORT || 3001

const server = new ApolloServer({
  resolvers,
  typeDefs,
})

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')))
}

// app.use(routes)
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, "../client/"))
})

const startServer = async ()=>{
  await server.start()
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use('/graphql', expressMiddleware(server, {context: authMiddleware}));
  // server.applyMiddleware({app})
}

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`))
  console.log(`GraphQL server is up and running as http://localhost:${PORT}${server.graphqlPath}`)
})

startServer()