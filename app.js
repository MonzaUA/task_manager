const express = require('express')
const app = express();
const tasks = require('./routes/tasks')
require ('dotenv').config()
const notFound = require('./middleware/not-found')


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
