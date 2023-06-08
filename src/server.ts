import express, { NextFunction, Request, Response } from "express";
import router from "./routes";
import morgan from "morgan";
import cors from "cors";
import { createNewUser, signin, me } from "./handlers/user";
import { protect } from "./modules/auth";
import { body } from "express-validator";
import { inputValidate } from "./utils/inputValidate";
import { createServer } from "http";

import { Configuration, OpenAIApi } from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log(OPENAI_API_KEY);

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  "/user",
  body(["password", "username"]).notEmpty(),
  inputValidate,
  createNewUser
);

app.post("/signin", signin);

app.post("/me", body(["token"]).notEmpty(), inputValidate, me);

app.post("/chatgpt", async (req, res) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "Say this is a test",
      max_tokens: 7,
      temperature: 0,
    });

    console.log(response);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json(500);
  }
});

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
