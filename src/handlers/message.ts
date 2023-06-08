import { RequestHandler } from "express";
import prisma from "../db";
import axios from "axios";
const API_COMPLETIONS = "https://api.openai.com/v1/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getAllMessages: RequestHandler = async (req, res, next) => {
  const user = req.user;
  const conversationId = req.query.conversationId as string;

  if (!user || !conversationId) {
    return res.status(400);
  }
  try {
    const messages = await prisma.aiMessage.findMany({
      where: {
        conversationId: conversationId,
      },
    });
    res.status(200);
    res.json({
      messages,
    });
  } catch (error) {
    next(error);
  }
};

enum Role {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export const sendMessage: RequestHandler = async (req, res, next) => {
  const user = req.user;
  const { content, conversationId } = req.body as {
    content: string;
    conversationId: string;
  };
  if (!user) {
    return res.status(500);
  }
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: Role.USER, content }],
    });
    await prisma.aiMessage.create({
      data: {
        conversationId,
        content,
        role: Role.USER,
      },
    });

    const aiContent = completion.data.choices[0].message?.content;
    if (!aiContent) {
      return res.status(500);
    }
    await prisma.aiMessage.create({
      data: {
        conversationId,
        content: aiContent,
        role: Role.ASSISTANT,
      },
    });
    const messages = await prisma.aiMessage.findMany({
      where: {
        conversationId,
      },
    });
    res.status(200);
    res.json({
      messages,
    });
  } catch (error) {
    next(error);
  }
};
