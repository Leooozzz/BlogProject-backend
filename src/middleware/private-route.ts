
import { verifyRequest } from "../services/auth";
import { Request, Response, NextFunction } from "express";
import { ExtendedRequest } from "../types/extended-request";

export const privateRoute=async(req:ExtendedRequest,res:Response,next:NextFunction)=>{
    const user=await verifyRequest(req)
    if(!user){
      return  res.status(401).json({error:"acesso negado"})
    }
    req.user=user
    next()

}