import { NextFunction, Request, Response } from "express";
import { cloudinary } from "../utils/cloudinary";
import { ExtendedRequest } from "../interfaces";
import { isBase64 } from "../utils/file";
import { POINTS_PER_LEVEL } from "../constants/game";
import User from "../models/user";

const jwt = require("../utils/jwt");
const bcrypt = require("bcryptjs");

export const register = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { username, password, role, age, avatar } = req.body;

  console.log("BODY", req.body);

  const hashedPassword = bcrypt.hashSync(password, 8);

  let avatarUrl;

  try {
    //if it is an avatar selected from ui
    // if (avatar.length <= 500) {
    //   avatarUrl = avatar;
    // } else {
    //   const result = await cloudinary.uploader.upload(avatar, {
    //     folder: "avatars",
    //   });
    //   avatarUrl = result.url;
    // }

    //if it is an avatar selected from ui
    if (avatar && avatar.include("http")) {
      avatarUrl = avatar;
    } else {
      avatarUrl = process.env.API_URL + "/" + req.file.path;
    }

    console.log("FILE", req.file);

    const newUser = new User({
      username: username,
      password: hashedPassword,
      role: role,
      age: age,
      avatar: avatarUrl,
    });

    const savedUser = await newUser.save();

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
  const { username, password: userPassword } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: "Invalid username/password combination",
      });
    }

    const checkPassword = bcrypt.compareSync(userPassword, user.password);
    if (!checkPassword) {
      return res.status(404).json({
        message: "Invalid username/password combination",
      });
    }

    const loggedInUser = exclude(user.toObject(), "password");

    const accessToken = await jwt.signAccessToken({
      id: loggedInUser._id,
      username: loggedInUser.username,
    });

    return res.status(200).json({
      token: accessToken,
      ...loggedInUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while trying to log in",
    });
  }
};

export const updateUser = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { username, password, role, age, avatar, level, xp, game, category, words } = req.body;
  let hashedPassword;

  if (req.userId !== id) {
    return res.status(401).json({
      message: "You are not authorized",
    });
  }

  if (password) {
    hashedPassword = bcrypt.hashSync(password, 8);
  }

  try {
    let avatarUrl;

    // if (avatar) {
    //   if (avatar.length <= 500) {
    //     avatarUrl = avatar;
    //   } else {
    //     const result = await cloudinary.uploader.upload(avatar, {
    //       folder: "avatars",
    //     });
    //     avatarUrl = result.url;
    //   }
    // }

    if (avatar && avatar.include("http")) {
      avatarUrl = avatar;
    } else {
      avatarUrl = process.env.API_URL + "/" + req.file.path;
    }

    let dataToUpdate: any = {
      username,
      role,
      age,
      avatar: avatarUrl,
      level,
      xp,
      words,
    };
    if (hashedPassword) {
      dataToUpdate.password = hashedPassword;
    }
    if (game) {
      dataToUpdate.$push = {
        games: {
          points: game.points,
          rank: game.rank,
          date: new Date(),
        },
      };
    }

    if (category) {
      dataToUpdate.$push = {
        categories: category,
      };
    }

    const user = await User.findByIdAndUpdate(id, dataToUpdate, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { password: _, ...userWithoutPassword } = exclude(user.toObject(), "password");

    res.status(200).json(userWithoutPassword);
  } catch (err: any) {
    if (err.code === 11000 && err.keyPattern.username) {
      res.status(409).json({
        message: "Username already exists",
      });
    } else {
      res.status(500).json({
        message: "An error occurred while updating",
        error: JSON.stringify(err),
      });
    }
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
    const user = await User.findById(id, "-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.games) {
      user.games.sort((a: any, b: any) => {
        return b.date.getTime() - a.date.getTime();
      });
    }

    if (user.games && user.games.length > 10) {
      user.games = user.games.slice(0, 10);
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "Could not get user",
      error: JSON.stringify(err),
    });
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sortDirection = req.query.sort as "asc" | "desc" | undefined;

    // You can set up default sorting here
    let sortCriteria = {};
    if (sortDirection) {
      sortCriteria = {
        level: sortDirection === "asc" ? 1 : -1,
      };
    }

    const users = await User.find({}, "username xp level avatar games").sort(sortCriteria).exec();

    if (users && users.length > 0) {
      users.sort((a: any, b: any) => {
        return POINTS_PER_LEVEL * b.level + b.xp - (POINTS_PER_LEVEL * a.level + a.xp);
      });
    }

    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({
      message: "Could not get users",
      error: err.message,
    });
  }
};

function exclude(user: any, ...keys: any) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
