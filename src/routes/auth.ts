import { Router } from "express";
import * as authController from '../controller/auth'
import { privateRoute } from "../middleware/private-route";
export const authRoutes=Router()


authRoutes.post('/singin',authController.singin)
authRoutes.post('/singup',authController.singup)
authRoutes.post('/validate',privateRoute,authController.validate)