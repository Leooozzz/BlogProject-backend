import { RequestHandler, Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import z from "zod";
import {
  createPost,
  createPostSlug,
  deletePost,
  getAllPosts,
  getPostBySlug,
  handleCover,
  updatePost,
} from "../services/post";
import { getUserById } from "../services/user";
import { coverToUrl } from "../utils/cover-to-url";

export const addPosts = async (req: ExtendedRequest, res: Response) => {
  if (!req.user) return false;
  const schema = z.object({
    title: z.string(),
    tags: z.string(),
    body: z.string(),
  });
  const data = schema.safeParse(req.body);
  if (!data.success)
    return res.json({ error: data.error.flatten().fieldErrors });
  if (!req.file) {
    return res.json({ error: "Sem arquivo" });
  }
  const coverName = await handleCover(req.file);
  if (!coverName) {
    return res.json({ error: "Imagem não enviada" });
  }

  const slug = await createPostSlug(data.data.title);

  const newPost = await createPost({
    authorID: req.user.id,
    slug,
    title: data.data.title,
    tags: data.data.tags,
    body: data.data.body,
    cover: coverName,
  });
  const author = await getUserById(newPost.authorID);
  res.status(201).json({
    post: {
      id: newPost.id,
      slug: newPost.slug,
      title: newPost.title,
      createdAt: newPost.createdAt,
      cover: coverToUrl(newPost.cover),
      tags: newPost.tags,
      authorName: author?.name,
    },
  });
};
export const editPost = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;

  const schema = z.object({
    status: z.enum(["PUBLISHED", "DRAFT"]).optional(),
    title: z.string().optional(),
    body: z.string().optional(),
    tags: z.string().optional(),
  });
  const data = schema.safeParse(req.body);
  if (!data.success)
    return res.json({ error: data.error.flatten().fieldErrors });
  const post = await getPostBySlug(slug);
  if (!post) {
    return res.json({ error: "post inexistente" });
  }
  let coverName: string | false = false;
  if (req.file) {
    coverName=await handleCover(req.file);
  }
  const updatedPost=await updatePost(slug,{
    updateAt: new Date(),
    status: data.data.status ?? undefined,
    title: data.data.title ?? undefined,
    tags: data.data.tags ?? undefined,
    body: data.data.body ?? undefined,
    cover: coverName ? coverName:undefined
  });
  const author = await getUserById (updatedPost.authorID)
  res.json({
    post:{
      id:updatedPost.id,
      status:updatedPost.status,
      slug:updatedPost.slug,
      title:updatedPost.title,
      createdAt:updatedPost.createdAt,
      cover:coverToUrl(updatedPost.cover),
      tags:updatedPost.tags,
      authorName: author?.name
    }
  })
};
export const getPosts = async (req:ExtendedRequest, res:Response) => {
  let page=1;
  if(req.query.page){
    page=parseInt(req.query.page as string)
    if(page <=0){
      return res.json({error:"pagina inexistente"})
    }
  }
  let posts=await getAllPosts(page)
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
};
export const getPost: RequestHandler = async (req, res) => {};
export const removePost = async (req:ExtendedRequest, res:Response) => {

  const {slug}=req.params;
  
  const post = await getPostBySlug(slug)
  if(!post){
    return res.json({error:"Post inexistente"})
  }
  await deletePost(post.slug)
  res.json({error:null})
};
