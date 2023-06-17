import express, { NextFunction, Request, Response } from "express";
import router from "./routes";
import morgan from "morgan";
import cors from "cors";
import { createNewUser, signin, me } from "./handlers/user";
import { protect } from "./modules/auth";
import { body } from "express-validator";
import { validateErrorHandler } from "./utils/validate";
import { createServer } from "https";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// createNewUser
app.post(
  "/user",
  body("username")
    .trim()
    .notEmpty()
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9]{3,12}$/)
    .withMessage("用户名必须是3-12位中文、英文、数字"),
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 12 })
    .withMessage("密码必须是3-12位"),
  validateErrorHandler,
  createNewUser
);

app.post("/signin", signin);

app.post("/me", body("token").notEmpty(), validateErrorHandler, me);

app.use("/api", protect, router);

app.use("*", (req, res) => {
  res.status(404);
  res.json({ message: `had an error` });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(500);
  res.json({ message: `had an error` });
});

const httpServer = createServer(app);

export default httpServer;
