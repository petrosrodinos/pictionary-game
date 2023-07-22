import { prisma } from "../lib/prismaClient";
const jwt = require("../utils/jwt");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");

export const register = async (req: any, res: any, next: any) => {
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
    throw createError(409, "User already exist");
  }
};

export const login = async (req: any, res: any, next: any) => {
  const { username, password: userPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    res.status(404).json({
      message: "Invalid username/password compination",
    });
  } else {
    const checkPassword = bcrypt.compareSync(userPassword, user.password);

    if (!checkPassword) {
      res.status(404).json({
        message: "Invalid username/password compination",
      });
    }

    const { password, ...userWithoutPassword } = user;

    const accessToken = await jwt.signAccessToken(userWithoutPassword);

    res.status(201).json({
      token: accessToken,
      user: user,
    });
  }
};
