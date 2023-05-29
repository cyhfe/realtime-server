import express, { NextFunction, Request, Response } from "express";
import router from "./routes/api";
import morgan from "morgan";
import cors from "cors";
import { createNewUser, signin, me } from "./handlers/user";
import { protect } from "./modules/auth";
import { body } from "express-validator";
import { inputValidate } from "./utils/inputValidate";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { log } from "console";

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
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const onlineList = new Set();

io.on("connection", (socket) => {
  const user = socket.handshake.auth.user;
  onlineList.add(user);
  const onlineListJSON = Array.from(onlineList);
  io.emit("chat/updateOnlineList", onlineListJSON);
  console.log("connect", onlineListJSON);

  socket.on("disconnect", () => {
    onlineList.delete(user);
    // console.log(onlineList, "delete");
    const onlineListJSON = Array.from(onlineList);
    io.emit("chat/updateOnlineList", onlineListJSON);
    console.log("disconnect", onlineListJSON);
  });
});

export default httpServer;
