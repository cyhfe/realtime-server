import { RequestHandler } from "express";
import prisma from "../db";

export const getAllMessages: RequestHandler = async (req, res, next) => {
  const user = req.user;
  const params = req.params;
  console.log(params);
  if (!user) {
    return res.status(500);
  }
  try {
    const messages = await prisma.aiMessage.findMany({
      // where: {
      //   conversationId:
      // },
    });
    res.status(200);
    res.json({
      messages,
    });
  } catch (error) {
    next(error);
  }
};

export const createConversation: RequestHandler = async (req, res, next) => {
  const user = req.user;
  const { name } = req.body;
  if (!user) {
    return res.status(500);
  }
  try {
    const conversation = await prisma.conversation.create({
      data: {
        name,
        userId: String(user.id),
      },
    });
    res.status(200);
    console.log(conversation);
    res.json({
      conversation,
    });
  } catch (error) {
    next(error);
  }
};
