import { NextFunction, Request, Response } from "express";
import { cloudinary } from "../utils/cloudinary";
import { ExtendedRequest } from "../interfaces";
import { isBase64 } from "../utils/file";
import { POINTS_PER_LEVEL } from "../constants/game";
import User from "../models/user";

const jwt = require("../utils/jwt");
const bcrypt = require("bcryptjs");

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, role, age, avatar } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 8);

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

    const newUser = new User({
      username: username,
      password: hashedPassword,
      role: role,
      age: age,
      avatar: avatarUrl,
    });

    const savedUser = await newUser.save();

    // Using destructuring to exclude password from the savedUser object
    const { password: _, ...userWithoutPassword } = savedUser._doc;

    const accessToken = await jwt.signAccessToken({
      id: userWithoutPassword._id,
      username: userWithoutPassword.username,
    });

    res.status(201).json({
      token: accessToken,
      ...userWithoutPassword,
    });
  } catch (err: any) {
    if (err.code === 11000 && err.keyPattern.username) {
      res.status(409).json({
        message: "Username already exists",
      });
    } else {
      console.log(err);
      res.status(500).json({
        message: "Could not register.",
        error: JSON.stringify(err),
      });
    }
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  // const { username, password: userPassword } = req.body;
  // const user: any = await prisma.user.findUnique({
  //   where: {
  //     username,
  //   },
  // });
  // if (!user) {
  //   return res.status(404).json({
  //     message: "Invalid username/password compination",
  //   });
  // } else {
  //   const checkPassword = bcrypt.compareSync(userPassword, user.password);
  //   if (!checkPassword) {
  //     return res.status(404).json({
  //       message: "Invalid username/password compination",
  //     });
  //   }
  //   let loggedInuser = exclude(user, "password");
  //   const accessToken = await jwt.signAccessToken(loggedInuser);
  //   return res.status(201).json({
  //     token: accessToken,
  //     ...loggedInuser,
  //   });
  // }
};

export const updateUser = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  // const { id } = req.params;
  // const { username, password, role, age, avatar, level, xp, game } = req.body;
  // let hasedPassword;
  // if (req.userId !== id) {
  //   return res.status(401).json({
  //     message: "You are not authorized",
  //   });
  // }
  // if (password) {
  //   hasedPassword = bcrypt.hashSync(password, 8);
  // }
  // try {
  //   let avatarUrl;
  //   if (avatar) {
  //     if (avatar.length <= 500) {
  //       avatarUrl = avatar;
  //     } else {
  //       const result = await cloudinary.uploader.upload(avatar, {
  //         folder: "avatars",
  //       });
  //       avatarUrl = result.url;
  //     }
  //   }
  //   let dataToUpdate: any = {
  //     username,
  //     password: hasedPassword,
  //     role,
  //     age,
  //     avatar: avatarUrl,
  //     level,
  //     xp,
  //   };
  //   if (game) {
  //     dataToUpdate = {
  //       ...dataToUpdate,
  //       games: {
  //         push: {
  //           points: game.points,
  //           rank: game.rank,
  //           date: new Date(),
  //         },
  //       },
  //     };
  //   }
  //   const user: any = await prisma.user.update({
  //     where: {
  //       id,
  //     },
  //     data: dataToUpdate,
  //   });
  //   res.status(201).json(exclude(user, "password"));
  // } catch (err) {
  //   res.status(409).json({
  //     message: "Username already exists",
  //     error: JSON.stringify(err),
  //   });
  // }
};

export const getUser = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  // const { id } = req.params;
  // if (req.userId !== id) {
  //   return res.status(401).json({
  //     message: "You are not authorized",
  //   });
  // }
  // try {
  //   const user: any = await prisma.user.findUnique({
  //     where: {
  //       id,
  //     },
  //   });
  //   if (user && user.games) {
  //     user.games.sort((a: any, b: any) => {
  //       return b.date.getTime() - a.date.getTime();
  //     });
  //   }
  //   if (user && user.games && user.games.length > 10) {
  //     user.games = user.games.slice(0, 10);
  //   }
  //   res.status(201).json(exclude(user, "password"));
  // } catch (err) {
  //   res.status(409).json({
  //     message: "Could not get user",
  //     error: JSON.stringify(err),
  //   });
  // }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  // try {
  //   const sortDirection = req.query.sort;
  //   let orderBy: any;
  //   if (sortDirection) {
  //     orderBy = {
  //       level: sortDirection,
  //     };
  //   }
  //   const users: any = await prisma.user.findMany({
  //     orderBy: orderBy,
  //     select: {
  //       username: true,
  //       xp: true,
  //       level: true,
  //       avatar: true,
  //       games: true,
  //     },
  //     // orderBy: [{ level: "desc" }, { xp: "desc" }],
  //   });
  //   if (users && users.length > 0) {
  //     users.sort((a: any, b: any) => {
  //       return POINTS_PER_LEVEL * b.level + b.xp - (POINTS_PER_LEVEL * a.level + a.xp);
  //     });
  //   }
  //   res.status(200).json(users);
  // } catch (err) {
  //   res.status(409).json({
  //     message: "Could not get users",
  //   });
  // }
};

function exclude(user: any, ...keys: any) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
