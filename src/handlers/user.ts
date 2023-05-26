import { RequestHandler } from "express";
import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

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
    res.json({ users });
  } catch (error) {
    next(error);
  }
};
