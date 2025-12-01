import { prisma } from "../libs/prisma";
import bcrypt from "bcryptjs";

type createUserProps = {
  name: string;
  email: string;
  password: string;
};
export const createUser = async ({
  name,
  email,
  password,
}: createUserProps) => {
  email = email.toLowerCase();
  const user = await prisma.user.findFirst({
    where: { email },
  });
  if (user) return;

  const newPassword =await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: { name, email, password: newPassword },
  });
};

type verifyUserProps={
  email:string,
  password:string
}

export const verifyUser=async({email,password}:verifyUserProps)=>{
    const user =await prisma.user.findFirst({
      where:{email}
    })
    if(!user) return false
    if(!bcrypt.compareSync(password,user.password)) return false

    return user
}

export const getUserById=async(id:number)=>{
  return await prisma.user.findUnique({
    where:{id},
    select:{
      id:true,
      name:true,
      email:true,
      status:true
    }
  })
}