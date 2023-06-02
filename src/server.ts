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

const chatSocket = io.of("/chat");

chatSocket.on("connection", (socket) => {
  let channel: string | undefined;

  function updateOnlineList() {
    const onlineListJSON = JSON.stringify(Array.from(onlineList));
    socket.emit("chat/updateOnlineList", onlineListJSON);
  }

  async function createChannel(channelName: string) {
    console.log("create");
    const existChannel = await prisma.channel.findUnique({
      where: {
        name: channelName,
      },
    });
    if (existChannel) {
      socket.emit("chat/error", "该频道名已被使用");
      return;
    }
    await prisma.channel.create({
      data: {
        name: channelName,
        userId: user.id,
      },
    });
    updateChannels();
  }

  async function updateUsers() {
    const users = await prisma.user.findMany();
    socket.emit("chat/updateUsers", users);
  }

  async function updateChannels() {
    const channels = await prisma.channel.findMany();
    chatSocket.emit("chat/updateChannels", channels);
  }
  async function updatePrivateMessages(to: string) {
    const updatePrivateMessages = await prisma.privateMessage.findMany({
      where: {
        OR: [
          {
            fromUserId: user.id,
            toUserId: to,
          },
          {
            toUserId: user.id,
            fromUserId: to,
          },
        ],
      },
      include: {
        from: {
          select: {
            id: true,
            createdAt: true,
            username: true,
            avatar: true,
          },
        },
        to: {
          select: {
            id: true,
            createdAt: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    socket.emit("updatePrivateMessages", updatePrivateMessages);
  }

  async function onEnterChannel(channelId: string) {
    channel = channelId;
    await socket.join(channelId);
    const sockets = await chatSocket.in(channelId).fetchSockets();
    const users = sockets.map((socket) => {
      return JSON.parse(socket.handshake.auth.user) as User;
    });

    socket.broadcast.to(channelId).emit("chat/enterChannel", user);
    chatSocket.to(channelId).emit("chat/updateChannelUsers", users);

    const messages = await prisma.channelMessage.findMany({
      where: {
        toChannelId: channelId,
      },
      include: {
        from: {
          select: {
            id: true,
            createdAt: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
    socket.emit("chat/updateChannelMessages", messages);
  }

  async function onLeaveChannel(channelId: string) {
    channel = void 0;
    await socket.leave(channelId);
    const sockets = await chatSocket.in(channelId).fetchSockets();

    const users = sockets.map((socket) => {
      return JSON.parse(socket.handshake.auth.user) as User;
    });

    socket.broadcast.to(channelId).emit("chat/leaveChannel", user);
    socket.broadcast.to(channelId).emit("chat/updateChannelUsers", users);
  }

  async function onGetChannel(channelId: string) {
    const channel = await prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });
    socket.emit("chat/getChannel", channel);
  }

  async function onChannelMessage({
    channelId,
    content,
  }: {
    channelId: string;
    content: string;
  }) {
    const newMessage = await prisma.channelMessage.create({
      data: {
        fromUserId: user.id,
        toChannelId: channelId,
        content,
      },
    });

    const newMessageWithUser = await prisma.channelMessage.findUnique({
      where: {
        id: newMessage.id,
      },
      include: {
        from: {
          select: {
            id: true,
            createdAt: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    chatSocket
      .to(channelId)
      .emit("chat/updateChannelMessage", newMessageWithUser);
  }

  async function onPrivateMessage({
    content,
    to,
  }: {
    content: string;
    to: string;
  }) {
    if (!content) return;
    const newMessage = await prisma.privateMessage.create({
      data: {
        fromUserId: user.id,
        toUserId: to,
        content,
      },
    });

    const newMessageWithUser = await prisma.privateMessage.findUnique({
      where: {
        id: newMessage.id,
      },
      include: {
        from: {
          select: {
            id: true,
            createdAt: true,
            username: true,
            avatar: true,
          },
        },
        to: {
          select: {
            id: true,
            createdAt: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    chatSocket
      .to([to, user.id])
      .emit("chat/newPrivateMessage", newMessageWithUser);
  }

  async function onUpdateToUser(toUserId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: toUserId,
      },
      select: {
        id: true,
        createdAt: true,
        username: true,
        avatar: true,
      },
    });
    socket.emit("updateToUser", user);
  }

  const user = JSON.parse(socket.handshake.auth.user) as User;
  onlineList.add(user);
  socket.join(user.id);
  const onlineListJSON = JSON.stringify(Array.from(onlineList));
  chatSocket.emit("chat/updateOnlineList", onlineListJSON);

  socket.on("chat/updateOnlineList", updateOnlineList);
  socket.on("chat/createChannel", createChannel);
  socket.on("chat/updateUsers", updateUsers);
  socket.on("chat/updateChannels", updateChannels);
  socket.on("updatePrivateMessages", updatePrivateMessages);
  socket.on("updateToUser", onUpdateToUser);
  socket.on("chat/privateMessage", onPrivateMessage);
  socket.on("chat/enterChannel", onEnterChannel);
  socket.on("chat/leaveChannel", onLeaveChannel);
  socket.on("chat/getChannel", onGetChannel);
  socket.on("chat/channelMessage", onChannelMessage);

  socket.on("disconnect", () => {
    onlineList.delete(user);
    const onlineListJSON = JSON.stringify(Array.from(onlineList));
    chatSocket.emit("chat/updateOnlineList", onlineListJSON);
    channel && onLeaveChannel(channel);
  });
});

const canvasSocket = io.of("/canvas");
canvasSocket.on("connection", (socket) => {
  socket.on("drawing", (data) => socket.broadcast.emit("drawing", data));
  socket.on("clear", () => socket.broadcast.emit("clear"));
  socket.on("changeStrokeColor", (data) =>
    socket.broadcast.emit("changeStrokeColor", data)
  );
  socket.on("disconnect", () => {});
});
export default httpServer;
