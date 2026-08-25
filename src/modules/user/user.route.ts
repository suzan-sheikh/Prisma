import { Router } from "express";
import { userController } from "./users.controller";
import { role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/register", userController.registerUser);

// auth(role.ADMIN, role.USER)

router.get(
  "/me",
  auth(role.ADMIN, role.AUTHOR, role.USER),
  userController.getMyProfile,
);

router.put("/my-profile", auth(role.ADMIN, role.USER, role.AUTHOR), userController.updateMyProfile)



export const userRoutes = router;
