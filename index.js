const express= require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const APP_PORT = 8080

const app= express()
const server = require('http').createServer(app)
const whitelist = ['http://localhost:3000']
const io = require('socket.io')(server, {
  cors: whitelist.map(origin=>{origin})
})

io.on('connection', ()=> {
  console.log('a user connected')
})

const socket = require('./src/middleware/socket')

app.use(socket(io))

app.use(bodyParser.urlencoded({extended: false}))
app.use(cors(whitelist))
app.use(morgan('dev'))

const chatRouter = require('./src/routes/chat')
app.use('/chat', chatRouter)

app.get('/', (req, res)=> {
  res.send({
    success: true,
    message: 'Backend running!'
  })
})

server.listen(APP_PORT, ()=> {
  console.log(`App listening on port ${APP_PORT}`)
})