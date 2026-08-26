import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

//create post api 
router.post("/", auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.createPost);

// Post get api
router.get("/", postController.getAllPosts);
router.get("/status", auth(Role.ADMIN), postController.getPostsStatus);
router.get("/my-posts", auth(Role.USER, Role.AUTHOR, Role.ADMIN), postController.getMyPosts);
router.get("/:postId", postController.getPostById);

//Post update api
router.patch("/:postId", auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.updatePost)

// post delete api
router.delete("/:postId", auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.deletePost)


export const postRoutes = router;
