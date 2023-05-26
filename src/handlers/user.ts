import { RequestHandler } from "express";
import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

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
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password),
      },
    });

    const token = createJWT(user);
    res.json({ token });
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
      res.status(401);
      res.json({ message: "nope" });
      return;
    }
    const isValid = await comparePasswords(req.body.password, user.password);

    if (!isValid) {
      res.status(401);
      res.json({ message: "nope" });
      return;
    }

    const token = createJWT(user);
    res.json({ token });
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
