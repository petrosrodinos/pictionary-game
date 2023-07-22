import { prisma } from "../lib/prismaClient";
import { NextFunction, Request, Response } from "express";

const jwt = require("../utils/jwt");
const bcrypt = require("bcryptjs");

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, email, role, age } = req.body;

  //checks if user exists here
  //you can use the findUnique method on login function

  const hasedPassword = bcrypt.hashSync(password, 8);

  try {
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hasedPassword,
        email: email,
        role: role,
        age: age,
      },
    });

    const { password, ...userWithoutPassword } = user;

    const accessToken = await jwt.signAccessToken(userWithoutPassword);

    res.status(201).json({
      token: accessToken,
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(409).json({
      message: "Could not create user",
    });
  }
};

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
