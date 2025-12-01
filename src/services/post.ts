import { v4 } from "uuid"
import fs from 'fs/promises'
import slug from "slug";
import { prisma } from "../libs/prisma";
import { Prisma } from "../../generated/prisma/client";

export const handleCover=async(file:Express.Multer.File)=>{
    const allowed=['image/jpeg','image/jpg','image/png']
    if(allowed.includes(file.mimetype)){
        const coverName = `${v4()}.jpg`;
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
type CreatePostProps ={
    authorID:number,
    slug:string,
    title:string,
    tags:string,
    body:string,
    cover:string
}
export const createPost=async(data:CreatePostProps)=>{
    return await prisma.post.create({data})
}

export const updatePost=async(slug:string,data:Prisma.PostUpdateInput)=>{
    return await prisma.post.update({
        where:{slug},
        data
    })
}


export const deletePost=async(slug:string)=>{
    return await prisma.post.delete({where:{slug}})
}


export const getAllPosts=async(page:number)=>{
    if(page<=0) return []
    const posts=await prisma.post.findMany({
        include:{
            users:{
                select:{
                    name:true
                }
            }
        },
        orderBy:{
            createdAt:'desc'
        },
        take:5,
        skip:(page-1)*5
    })
    return posts
}
export const getPublishedPosts=async(page:number)=>{
    if(page<=0) return []
    const posts=await prisma.post.findMany({
        where:{status:'PUBLISHED'},
        include:{
            users:{
                select:{
                    name:true
                }
            }
        },
        orderBy:{
            createdAt:'desc'
        },
        take:5,
        skip:(page - 1) * 5
    })
    return posts
}

export const getPostWithSameTags=async(slug:string)=>{
    const posts = await prisma.post.findUnique({where:{slug}})
    if(!posts) return [];
    const tags=posts.tags.split(',')
    if(tags.length === 0 ){
        return []
    }
    const post=await prisma.post.findMany({
        where:{
            status:'PUBLISHED',
            slug:{not:slug},
            OR:tags.map(term=>({
                tags:{
                    contains: term,
                    mode:'insensitive'
                }
            }))
        },include:{
            users:{
                select:{
                    name:true
                }
            }
        },
        orderBy:{
            createdAt:'desc'
        },
        take:10
    })
    return post
}