import express from 'express' // const express = require('express')
import tasks from './routes/tasks.js' // const tasks = require('./routes/tasks')
import notFound from './middleware/not-found.js' // const notFound = require('./middleware/not-found')


const app = express();

//middleware

app.use(express.json())
app.use(express.static('./public'))

//routes
app.use('/api/v1/tasks',tasks)
app.use(notFound)

const port = process.env.PORT || 4000;

app.listen(port, () => {
     console.log(`Server is listening on port ${port}`)
})
