import express from 'express'
import cors from 'cors'
import { mainRoutes } from './routes/main'
import { authRoutes } from './routes/auth'
import { adminRoutes } from './routes/admin'


const server=express()

server.use(cors())
server.use(express.urlencoded({extended:true}))
server.use(express.json())

server.use('/',mainRoutes)
server.use('/auth',authRoutes)
server.use('/admin',adminRoutes)

server.listen(4444,()=>{
    console.log("http://localhost:4444")
})