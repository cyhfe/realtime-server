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
import prisma from "./db";

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

interface User {
  username: string;
  id: string;
}

io.on("connection", (socket) => {
  const user = JSON.parse(socket.handshake.auth.user) as User;
  onlineList.add(user);
  const onlineListJSON = JSON.stringify(Array.from(onlineList));
  io.emit("chat/updateOnlineList", onlineListJSON);
  console.log("connect", onlineListJSON);

  socket.join(user.id);
  socket.on(
    "chat/privateMessage",
    async ({ content, to }: { content: string; to: string }) => {
      await prisma.privateMessage.create({
        data: {
          fromUserId: user.id,
          toUserId: to,
          content,
        },
      });
      const privateMessages = await prisma.privateMessage.findMany({
        where: {
          OR: [
            {
              fromUserId: user.id,
              toUserId: to,
            },
            {
              fromUserId: to,
              toUserId: user.id,
            },
          ],
        },
      });

      io.to([to, user.id]).emit("chat/updatePrivateMessages", privateMessages);
    }
  );

  socket.on("disconnect", () => {
    onlineList.delete(user);
    // console.log(onlineList, "delete");
    const onlineListJSON = JSON.stringify(Array.from(onlineList));
    io.emit("chat/updateOnlineList", onlineListJSON);
    console.log("disconnect", onlineListJSON);
  });
});

export default httpServer;
