import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { ILoginUser } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email,
    },
  });

  if (user.activeStatus === "BLOCK") {
    throw new Error("You account has been blocked. please contact support");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Password is incorrect");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshToken: string) => {

  const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret)

  if(!verifiedRefreshToken.success){
    throw new Error(verifiedRefreshToken.error)
  }

   const {id} = verifiedRefreshToken.data as JwtPayload;

   const user = await prisma.user.findFirstOrThrow({
    where: {
      id
    }
   })

   if(user.activeStatus === "BLOCK"){
    throw new Error("Your account is block please contact support")
   }

   const jwtPayload = {id, name: user.name, email: user.email, role: user.role}

   const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires_in as SignOptions)
  
  return{accessToken}

}



export const authService = {
  loginUser,
  refreshToken
};
