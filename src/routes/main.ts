import { Router } from "express";
import * as mainController from '../controller/main'

export const mainRoutes=Router()


mainRoutes.get('/posts',mainController.getAllPosts)
mainRoutes.get('/post/:slug',mainController.getPost)
mainRoutes.get('/posts/:slug/related',mainController.getRelatedPost)

