import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./users.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";

const router = Router();

router.post("/register", userController.registerUser);

router.get("/me", (req: Request, res: Response, next: NextFunction) => {

    const {accessToken} = req.cookies;
    console.log(accessToken);

    const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);

    if(typeof verifiedToken === "string"){
        throw new Error(verifiedToken)
    }

    console.log(verifiedToken);
    const {email, name, id, role} = verifiedToken;

    const requiredRole = ["USER", "ADMIN", "AUTHOR"]

    if(!requiredRole.includes(role)){
        return res.status(403).json({
            success: false,
            statusCode: 403,
            message: "Forbidden"
        })
    }

    next()





    

    

}, userController.getMyProfile);

export const userRoutes = router;
