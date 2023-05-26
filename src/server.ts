import express, { NextFunction, Request, Response } from "express";
import router from "./routes/api";
import morgan from "morgan";
import cors from "cors";
import { createNewUser, signin } from "./handlers/user";
import { protect } from "./modules/auth";
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/user", createNewUser);
app.post("/signin", signin);

app.use("/api", protect, router);

app.use("*", (req, res) => {
  res.json({ message: `had an error`, code: 404 });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.json({ message: `had an error`, code: 500 });
});

export default app;
