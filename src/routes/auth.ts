import { Router } from "express";
import * as authController from '../controller/auth'
export const authRoutes=Router()


authRoutes.post('/singup',authController.singin)
authRoutes.post('/singup',authController.singup)
//authRoutes.post('/validate',authController.validate)