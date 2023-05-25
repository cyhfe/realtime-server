import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const hashPassword = (password: User["password"]) => {
  return bcrypt.hash(password, 5);
};

export const createJWT = (user: User) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    JWT_SECRET
  );
  return token;
};
