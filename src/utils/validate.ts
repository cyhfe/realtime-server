import { RequestHandler } from "express";
import { validationResult } from "express-validator";

export const validateErrorHandler: RequestHandler = function (req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(400);
    return res.send({ message: result.array()?.[0].msg ?? "error" });
  }
  next();
};
