const express = require('express')
const app = express();
const tasks = require('./routes/tasks')
const connectDB = require('./db/connect')
require ('dotenv').config()
//middleware

app.use(express.json())





//routes

app.get('/hello', (req,res) => {
    res.send('Hello in my Task Manager')
})

app.use('/api/v1/tasks',tasks)

// app.get (get all tasks)
// app.get (get specific task)
// app.post (create a new task)
// app.patch (update a task)
// app.delete (remove a task)


const port = 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()
