import express from 'express'
import path from 'path'
import router from './routes/tasks.js'
import "dotenv/config";
import {notFound} from './middleware/not-found.js'


const app = express()

app.use(express.json())

app.use(express.static(path.join(process.cwd(), "public")))

app.use('/api/v1/tasks', router)
app.use(notFound)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, ()=> {
    console.log(`Server running on ${PORT}`);
    
})