import express from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import { createNewUser } from "./handlers/user";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/user", createNewUser);
// app.use("/api", protect, router);
// app.post("/signin", signin);
// @ts-ignore
app.use((err, req, res, next) => {
  console.log(err);
  res.json({ message: `had an error: ${err}` });
});

export default app;
