import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcrypt";

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

app.post("/api/users/register", async (req: Request, res: Response) => {
  const { name, email, password, profilePhoto } = req.body;

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if(isUserExist){
    throw new Error("User with this email already exists")
  }
  const hasPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hasPassword
    }
  })

  const profile = await prisma.profile.create({
    data: {
      userId: createdUser.id,
      profilePhoto
    }
  })

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    omit: {password: true},
    include: {
      profile: true
    }
  })

  res
    .status(httpStatus.CREATED)
    .json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: {
        user
      }
     });
});

export default app;
