import express from 'express'
import path from 'path'
import router from './routes/tasks.js'
import "dotenv/config";
import {notFound} from './middleware/not-found.js'

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4'; 
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';


const app = express()

app.use(express.json())

app.use(express.static(path.join(process.cwd(), "public")))

//REST
app.use('/api/v1/tasks', router)

//Apollo & GraphQL
async function start(){
    const apollo = new ApolloServer({typeDefs, resolvers})
    await apollo.start()
    
    app.use('/graphql', expressMiddleware(apollo))
    app.use(notFound)
    


    const PORT = process.env.PORT ?? 3000

    app.listen(PORT, ()=> {
    console.log(`Server running on ${PORT}`); 
    })
}



start().catch((err) => {
    console.error(err)
    process.exit(1)
})



