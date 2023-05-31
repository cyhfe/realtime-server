import { RequestHandler } from "express";
import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";
import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../types";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Exclude keys from user
function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[]
): Omit<User, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}

export const createNewUser: RequestHandler = async (req, res, next) => {
  const ADMIN_SECRET = process.env.ADMIN_SECRET as string;
  const isAdmin = req.body.secrets === ADMIN_SECRET;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    if (user) {
      res.status(400);
      res.json({ message: "用户已存在" });
      return;
    }
  } catch (error) {
    next(error);
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password),
        role: isAdmin ? "ADMIN" : "MEMBER",
        privateRoom: {
          create: {},
        },
      },
    });

    // await prisma.privateRoom.create({
    //   data: {
    //     userId: user.id,
    //   },
    // });

    const token = createJWT(user);
    const userWithoutPassword = exclude(user, ["password"]);
    res.status(200);
    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const signin: RequestHandler = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });
    if (!user) {
      res.status(400);
      res.json({ message: "用户名不存在" });
      return;
    }
    const isValid = await comparePasswords(req.body.password, user.password);

    if (!isValid) {
      res.status(400);
      res.json({ message: "密码错误" });
      return;
    }

    const token = createJWT(user);
    const userWithoutPassword = exclude(user, ["password"]);

    res.status(200);
    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    if (!users.length) {
      return res.json({
        msg: "no users",
        code: 404,
      });
    }
    const usersWithoutPassword = [];
    for (let user of users) {
      const userWithoutPassword = exclude(user, ["password"]);
      usersWithoutPassword.push(userWithoutPassword);
    }
    res.json({ users: usersWithoutPassword });
  } catch (error) {
    next(error);
  }
};

export const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.json({ meg: "not found", code: 404 });
    }
    const userWithoutPassword = exclude(user, ["password"]);
    res.json({ user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

export const me = (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const user = jwt.verify(token, JWT_SECRET) as UserPayload;
    if (!user) {
      res.status(401);
      res.json({ message: "not valid token" });
      return;
    }

    res.json({ user });
  } catch (e) {
    console.error(e);
    res.status(401);
    res.json({ message: "not valid token" });
    return;
  }
};
