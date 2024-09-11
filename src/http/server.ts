import fastify from 'fastify'
const { config } = require('dotenv')
config()
const app = fastify()

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🚀 http server running!')
  })
