import { RequestHandler, Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import z from "zod";
import { createPost, createPostSlug, handleCover } from "../services/post";
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
    authorID:req.user.id,
    slug,
    title:data.data.title,
    tags:data.data.tags,
    body:data.data.body,
    cover:coverName
  });
  const author=await getUserById(newPost.authorID)
  res.status(201).json({
    post:{
      id:newPost.id,
      slug:newPost.slug,
      title:newPost.title,
      createdAt:newPost.createdAt,
      cover:coverToUrl(newPost.cover),
      tags:newPost.tags,
      authorName:author?.name
    }
  })
};
export const editPost: RequestHandler = async (req, res) => {
  
};
export const getPosts: RequestHandler = async (req, res) => {};
export const getPost: RequestHandler = async (req, res) => {};
export const removePost: RequestHandler = async (req, res) => {};
