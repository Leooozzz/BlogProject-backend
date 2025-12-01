import { RequestHandler } from "express"
import z, { email, string } from "zod"
import { createUser, verifyUser } from "../services/user"
import { createToken } from "../services/auth"

export const singin:RequestHandler=async(req,res)=>{
    const schema=z.object({
        email:z.string().email(),
        password:z.string()
    })
    const data=schema.safeParse(req.body);
    if(!data.success){
        return res.json({error:data.error.flatten().fieldErrors})
    }
    const user=await verifyUser(data.data)
    if(!user){
      return res.json({error:"Acesso negado"})
    }
    const token=createToken(user)

    res.json({
        user:{
            id:user.id,
            name:user.name,
            email:user.email
        },
        token
    })

}
export const singup:RequestHandler=async(req,res)=>{
    const schema=z.object({
        name:z.string(),
        email:z.string().email(),
        password:z.string()
    })
    const data =schema.safeParse(req.body);
    if(!data.success){
        return res.json({error:data.error.flatten().fieldErrors})
    }
    const newUser=await createUser(data.data)
    if(!newUser){
        return res.json({error:"erro ao criar usuario"})
    }
    const token=createToken(newUser)
    res.status(201).json({
        user:{
            id:newUser.id,
            name:newUser.name,
            email:newUser.email
        },
        token
        

    })
}
export const validate:RequestHandler=async(req,res)=>{
        
}