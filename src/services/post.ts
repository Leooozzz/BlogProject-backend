import { v4 } from "uuid"
import fs from 'fs/promises'
import slug from "slug";
import { prisma } from "../libs/prisma";

export const handleCover=async(file:Express.Multer.File)=>{
    const allowed=['image/jpeg','image/jpg','image/png']
    if(allowed.includes(file.mimetype)){
        const coverName= `${v4()}.jgp`;
        try{
        await fs.rename(
            file.path,
            `./public/images/covers/${coverName}`
        );
    }catch(error){
            return false
        }
        return coverName
    }
    return false
}
export const getPostBySlug=async(slug:string)=>{
    return await prisma.post.findUnique({
        where:{slug},
        include:{
            users:{
                select:{
                    name:true
                }
            }
        }
    })
}
export const createPostSlug=async(title:string)=>{
    let newSlug=slug(title);
    let keepTrying=true
    let postCount=1
    while(keepTrying){
        const post =await getPostBySlug(newSlug)
        if(!post){
            keepTrying=false
        }else{
            newSlug=slug(`${title} ${++postCount}`)
        }
    }

    return newSlug
}