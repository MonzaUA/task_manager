import express, {Application} from 'express' 
import tasks from './routes/tasks'
import notFound from './middleware/notFound'

const app: Application = express()

//middleware
app.use(express.json())
app.use(express.static('public'))

//routes
app.use('api/v1/tasks', tasks)
app.use(notFound)

const port = process.env.PORT || 4020

app.listen(port, ()=> {
    console.log(`Server is listerning on port ${port}`)
})


