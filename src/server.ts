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

interface User {
  username: string;
  id: string;
}
const onlineList = new Set<User>();

io.on("connection", (socket) => {
  function updateOnlineList() {
    const onlineListJSON = JSON.stringify(Array.from(onlineList));
    socket.emit("chat/updateOnlineList", onlineListJSON);
  }

  async function createChanel(channelName: string) {
    const existChanel = await prisma.chanel.findUnique({
      where: {
        name: channelName,
      },
    });
    if (existChanel) {
      socket.emit("chat/error", "该频道名已被使用");
      return;
    }
    await prisma.chanel.create({
      data: {
        name: channelName,
        userId: user.id,
      },
    });
    updateChanels();
  }

  async function updateUsers() {
    const users = await prisma.user.findMany();
    socket.emit("chat/updateUsers", users);
  }

  async function updateChanels() {
    const chanels = await prisma.chanel.findMany();
    io.emit("chat/updateChanels", chanels);
  }
  async function updatePrivateMessages(to: string) {
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
    socket.emit("chat/updatePrivateMessages", privateMessages);
  }

  async function onEnterChanel(chanelId: string) {
    await socket.join(chanelId);
    const data = await io.in(chanelId).fetchSockets();
    const users = data.map((socket) => {
      return JSON.parse(socket.handshake.auth.user) as User;
    });
    console.log("enter", users);

    socket.broadcast.to(chanelId).emit("chat/enterChanel", user);
    io.to(chanelId).emit("chat/updateChanelUsers", users);

    const messages = await prisma.chanelMessage.findMany({
      where: {
        toChanelId: chanelId,
      },
    });
    socket.emit("chat/updateChanelMessages", messages);
  }

  async function onLeaveChanel(chanelId: string) {
    await socket.leave(chanelId);
    const data = await io.in(chanelId).fetchSockets();

    const users = data.map((socket) => {
      return JSON.parse(socket.handshake.auth.user) as User;
    });

    console.log("le", users);

    socket.broadcast.to(chanelId).emit("chat/leaveChanel", user);
    socket.broadcast.to(chanelId).emit("chat/updateChanelUsers", users);
  }

  async function onGetChanel(chanelId: string) {
    const chanel = await prisma.chanel.findUnique({
      where: {
        id: chanelId,
      },
    });
    socket.emit("chat/getChanel", chanel);
  }

  async function onChanelMessage({
    chanelId,
    content,
  }: {
    chanelId: string;
    content: string;
  }) {
    await prisma.chanelMessage.create({
      data: {
        fromUserId: user.id,
        toChanelId: chanelId,
        content,
      },
    });

    const messages = await prisma.chanelMessage.findMany({
      where: {
        toChanelId: chanelId,
      },
    });

    io.to(chanelId).emit("chat/updateChanelMessages", messages);
  }

  const user = JSON.parse(socket.handshake.auth.user) as User;
  onlineList.add(user);
  socket.join(user.id);
  const onlineListJSON = JSON.stringify(Array.from(onlineList));
  io.emit("chat/updateOnlineList", onlineListJSON);

  socket.on("chat/updateOnlineList", updateOnlineList);
  socket.on("chat/createChanel", createChanel);
  socket.on("chat/updateUsers", updateUsers);
  socket.on("chat/updateChanels", updateChanels);
  socket.on("chat/updatePrivateMessages", updatePrivateMessages);
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
  socket.on("chat/enterChanel", onEnterChanel);
  socket.on("chat/leaveChanel", onLeaveChanel);
  socket.on("chat/getChanel", onGetChanel);
  socket.on("chat/chanelMessage", onChanelMessage);

  socket.on("disconnect", () => {
    onlineList.delete(user);
    const onlineListJSON = JSON.stringify(Array.from(onlineList));
    io.emit("chat/updateOnlineList", onlineListJSON);
  });
});

export default httpServer;
