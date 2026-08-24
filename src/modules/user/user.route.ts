import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./users.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: role;
      };
    }
  }
}

router.post("/register", userController.registerUser);

// auth(role.ADMIN, role.USER) 

const auth = (...requiredRole: role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1] :
    req.headers.authorization;

    if (!token) {
      throw new Error("You ar no logged in");
    }
    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);
    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }
    const {email, name, id, role} = verifiedToken.data as JwtPayload;

    if(requiredRole.length && !requiredRole.includes(role)){
        throw new Error("Forbidden access")
    }

    const user = await prisma.user.findUnique({
        where: {
            id,
            email,
            name,
            role
        }
    })
 
    if(!user){
        throw new Error("User Not Found")
    }
    if(user.activeStatus === "BLOCK"){
        throw new Error("You account has been blocked. please contact support")
    }    

    req.user = {
        email,
        id,
        name,
        role
    }

    next()
  });
};

router.get(
  "/me", auth(role.ADMIN, role.AUTHOR, role.USER), userController.getMyProfile);

export const userRoutes = router;
