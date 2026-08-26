import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import { userRoutes } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { postRoutes } from "./modules/post/post.router";
import { commentRoutes } from "./modules/comment/comment.roter";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.get("/", async (req: Request, res: Response) => {
  const user = await prisma.user.findMany();
  console.log(user);
  res.send("Server is Running");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

export default app;
