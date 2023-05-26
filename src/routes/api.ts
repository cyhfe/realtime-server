import { RequestHandler, Router } from "express";
import prisma from "../db";
import { UserPayload } from "../types";
import { Request, Response, NextFunction } from "express";
import { getAllUsers, getUserById } from "../handlers/user";
import { permission } from "../modules/auth";
import { validationResult } from "express-validator";
const router = Router();

const inputValidate: RequestHandler = function (req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.send({ errors: result.array(), code: 400 });
  }
  next();
};

/**
 * User
 */
router.get("/user", permission, getAllUsers);
router.get("/user/:id", permission, getUserById);

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res.json({ message: `had an error`, code: 500 });
});

export default router;
