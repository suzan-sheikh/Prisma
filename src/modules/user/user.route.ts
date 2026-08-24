import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./users.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/register", userController.registerUser);

// auth(role.ADMIN, role.USER)

router.get(
  "/me",
  auth(role.ADMIN, role.AUTHOR, role.USER),
  userController.getMyProfile,
);

export const userRoutes = router;
