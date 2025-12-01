import jwt from 'jsonwebtoken'


export const createJWT=(payload:any)=>{
    return jwt.sign(
        payload,
        process.env.JWT_SECRET as string
    )
}
export const readJWT=(hash:string)=>{
    try{
        return jwt.verify(
            hash,
            process.env.JWT_SECRET as string
        )
    }catch(erro){
        return false
    }
}