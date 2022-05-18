import 'reflect-metadata'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './resolvers/UserResolver'
import { AppDataSource } from './config/data-source'
import { handleRefreshToken } from './controllers/main'
import { AuthResolver } from './resolvers/AuthResolver'
require('dotenv').config()
;(async () => {
  // Initialize express
  const app = express()
  app.use(cors())
  app.use(cookieParser())

  // Initialize Database
  await AppDataSource.initialize()

  // Routes
  app.get('/', (_req, res, _next) => {
    res.send('Open the /graphql route for more')
  })

  app.post('/refresh_token', handleRefreshToken)

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, AuthResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  })
  await apolloServer.start()
  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(process.env.SERVER_PORT, () => {
    console.log('########################################################')
    console.log(
      '############ SERVER LISTENING ON PORT: ' +
        process.env.SERVER_PORT +
        ' ############'
    )
    console.log('########################################################')
  })
})()
