import express from 'express'
import dotenv from 'dotenv'
import connectDb from './db/index.js'
import {router} from './router/router.js'

dotenv.config({path: '.env'})
const port = process.env.PORT 
const app = express()

app.use(express.json())
app.use(router)

connectDb()
app.listen(port, async() => {
    try {
        console.log(`Server is running on port ${port}`)
    }catch(error){
        console.log('Internal server error', error)
    }
})