import { RequestHandler } from "express";
import prisma from "../db";

export const getAllConversations: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(500);
  }
  try {
    const conversation = await prisma.conversation.findMany({
      where: {
        userId: String(user.id),
      },
    });
    res.status(200);
    res.json({
      conversation,
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

export const deleteConversation: RequestHandler = async (req, res, next) => {
  const user = req.user;
  const { conversationId } = req.params
  if (!user || !conversationId) {
    return res.status(400);
  }
  try {
    await prisma.conversation.delete({
      where: {
        id: conversationId,
      },
    });
    res.status(200);
    res.json({
      message: "Conversation deleted",
    });
  } catch (error) {
    next(error);
  }
}