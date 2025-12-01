import { Request } from "express";
import { User } from "../../generated/prisma/client";

type UserWithouPassword=Omit<User,"password">
export type ExtendedRequest=Request & {
    user?:UserWithouPassword

}