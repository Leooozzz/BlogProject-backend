import express from 'express'
import cors from 'cors'


const server=express()

server.use(cors())
server.use(express.urlencoded({extended:true}))
server.use(express.json())



server.listen(4444,()=>{
    console.log("http://localhost:4444")
})