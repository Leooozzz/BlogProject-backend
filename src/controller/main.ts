import { RequestHandler } from "express"
import { getPostBySlug, getPostWithSameTags, getPublishedPosts } from "../services/post";
import { coverToUrl } from "../utils/cover-to-url";

export const getAllPosts:RequestHandler=async(req,res)=>{
    let page=1;
    if(req.query.page){
        page=parseInt(req.query.page  as string)
        if(page <=0){
            return res.json({error:"pagina inexistente"})
        }
    }
    let posts=await getPublishedPosts(page)
    
    const postsToReturn=posts.map(post=>({
        id:post.id,
        status:post.status,
        title:post.title,
        createdAt:post.createdAt,
        cover:coverToUrl(post.cover),
        authorName:post.users.name,
        tags:post.tags,
        slug:post.slug
      }))
      return res.json({posts:postsToReturn,page})
}
export const getPost:RequestHandler=async(req,res)=>{
    const {slug}=req.params;
    
      const post=await getPostBySlug(slug)
      if(!post ||   (post && post.status !== 'PUBLISHED')){
        return res.json({error:'post inexistente '})
      }
      res.json({
        post:{
          id:post.id,
          title:post.title,
          createdAt:post.createdAt,
          cover:coverToUrl(post.cover),
          authorName:post.users.name,
          tags:post.tags,
          body:post.body,
          slug:post.slug
        }
      })
}
export const getRelatedPost:RequestHandler=async(req,res)=>{
        const {slug}=req.params
        let posts=await getPostWithSameTags(slug)

        const postsToReturn=posts.map(post=>({
        id:post.id,
        title:post.title,
        createdAt:post.createdAt,
        cover:coverToUrl(post.cover),
        authorName:post.users.name,
        tags:post.tags,
        slug:post.slug
      }))
      res.json({posts:postsToReturn})
}