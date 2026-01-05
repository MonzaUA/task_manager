const http = require('http')
const {Server} = require('socket.io')
const app = require('./app')

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
    }
})

app.set('io', io)

io.on('connection', (socket) => {
    console.log('WS connected', socket.id)

    socket.on('disconnect', ()=> {
        console.log('WS disconnected', socket.id)
    })
})




const port = process.env.PORT || 4000;

server.listen(port, () => {
     console.log(`Server is listening on port ${port}`)
})

