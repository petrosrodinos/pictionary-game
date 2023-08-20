import { prisma } from "../utils/prismaClient";
import { NextFunction, Request, Response } from "express";
import { cloudinary } from "../utils/cloudinary";
import { ExtendedRequest } from "../interfaces";
import { isBase64 } from "../utils/file";

const jwt = require("../utils/jwt");
const bcrypt = require("bcryptjs");

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, role, age, avatar } = req.body;

  const hasedPassword = bcrypt.hashSync(password, 8);

  let avatarUrl;

  try {
    if (avatar.length <= 500) {
      avatarUrl = avatar;
    } else {
      const result = await cloudinary.uploader.upload(avatar, {
        folder: "avatars",
      });
      avatarUrl = result.url;
    }

    console.log("avatarUrl", avatarUrl);

    const user = await prisma.user.create({
      data: {
        username: username,
        password: hasedPassword,
        role: role,
        age: age,
        avatar: avatarUrl,
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

    let loggedInuser = exclude(user, "password");

    const accessToken = await jwt.signAccessToken(loggedInuser);

    return res.status(201).json({
      token: accessToken,
      ...loggedInuser,
    });
  }
};

export const updateUser = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { username, password, role, age, avatar, level, xp, game } = req.body;

  let hasedPassword;

  if (req.userId !== id) {
    return res.status(401).json({
      message: "You are not authorized",
    });
  }

  if (password) {
    hasedPassword = bcrypt.hashSync(password, 8);
  }

  try {
    let avatarUrl;

    if (avatar) {
      if (avatar.length <= 500) {
        avatarUrl = avatar;
      } else {
        const result = await cloudinary.uploader.upload(avatar, {
          folder: "avatars",
        });
        avatarUrl = result.url;
      }
    }

    let dataToUpdate: any = {
      username: username,
      password: hasedPassword,
      role: role,
      age: age,
      avatar: avatarUrl,
      level: level,
      xp: xp,
    };

    if (game) {
      dataToUpdate = {
        ...dataToUpdate,
        games: {
          push: {
            points: game.points,
            rank: game.rank,
            date: new Date(),
          },
        },
      };
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: dataToUpdate,
    });

    res.status(201).json(exclude(user, "password"));
  } catch (err) {
    res.status(409).json({
      message: "Could not update user",
      error: JSON.stringify(err),
    });
  }
};

export const addGameToUser = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { points, rank } = req.body;

  if (req.userId !== id) {
    return res.status(401).json({
      message: "You are not authorized",
    });
  }

  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        games: {
          points: points,
          rank: rank,
          date: new Date(),
        },
      },
    });

    res.status(201).json(exclude(user, "password"));
  } catch (err) {
    res.status(409).json({
      message: "Could not update user",
      error: JSON.stringify(err),
    });
  }
};

export const getUser = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (req.userId !== id) {
    return res.status(401).json({
      message: "You are not authorized",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    res.status(201).json(exclude(user, "password"));
  } catch (err) {
    res.status(409).json({
      message: "Could not get user",
      error: JSON.stringify(err),
    });
  }
};

function exclude(user: any, ...keys: any) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
