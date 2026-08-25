import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: {
        user,
      },
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user, "user request");

    const profile = await userService.getMyProfileFromDB(
      req.user?.id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user profile fetched successfully",
      data: {
        profile,
      },
    });

    res.send("get my profile route");
  },
);

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id as string;
  const payload = req.body;

  const updateMyProfile = await userService.updateMyProfileInDB(userId, payload)
      sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user profile update successfully",
      data: {
        updateMyProfile,
      },
    });


})

export const userController = {
  registerUser,
  getMyProfile,
  updateMyProfile,
};
