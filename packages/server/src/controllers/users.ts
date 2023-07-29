import { prisma } from "../lib/prismaClient";
import { NextFunction, Request, Response } from "express";
import { cloudinary } from "../utils/cloudinary";


const jwt = require("../utils/jwt");
const bcrypt = require("bcryptjs");

// GIA TO REGISTER

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, email, role, age,avatar } = req.body;

  const hasedPassword = bcrypt.hashSync(password, 8);

  try {
    const result = await cloudinary.uploader.upload(avatar, {
        folder: "avatars", // να βαλω result.url στο avatar
      })
      const user = await prisma.user.create({
      data: {
        username: username,
        password: hasedPassword,
        email: email,
        role: role,
        age: age,
        avatar: result.url,
      },
    });

    const { password, ...userWithoutPassword } = user;

    const accessToken = await jwt.signAccessToken(userWithoutPassword);

    res.status(201).json({
      token: accessToken,
      ...userWithoutPassword,
    });
  } catch (err) {
    res.status(409).json({
      message: "Could not create user",
    });
  }
};

//GIA TO LOGIN

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password: userPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "Invalid username/password compination",
    });
  } else {
    const checkPassword = bcrypt.compareSync(userPassword, user.password);

    if (!checkPassword) {
      return res.status(404).json({
        message: "Invalid username/password compination",
      });
    }

    const { password, ...userWithoutPassword } = user;

    const accessToken = await jwt.signAccessToken(userWithoutPassword);

    return res.status(201).json({
      token: accessToken,
      ...user,
    });
  }
};

