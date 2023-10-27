import { RequestHandler } from "express";
import prisma from "../db";
import openai from "../openai";

export const getAllMessages: RequestHandler = async (req, res, next) => {
  const user = req.user;
  const conversationId = req.query.conversationId as string;
  const skip = Number(req.query.skip) || 0;

  if (!user || !conversationId) {
    return res.status(400);
  }
  try {
    const take = 10;
    const [messages, count] = await prisma.$transaction([
      prisma.aiMessage.findMany({
        where: {
          conversationId,
        },
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.aiMessage.count({
        where: {
          conversationId,
        },
      }),
    ]);

    messages.reverse();

    res.status(200);
    res.json({
      messages,
      count,
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
    const context = await prisma.aiMessage.findMany({
      where: {
        conversationId,
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        role: true,
        content: true,
      },
    });

    const chatContext = [...context, { role: Role.USER, content }] as {
      role: Role;
      content: string;
    }[];

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: chatContext,
      max_tokens: 1500,
      temperature: 1,
    });

    const question = await prisma.aiMessage.create({
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
    const anwser = await prisma.aiMessage.create({
      data: {
        conversationId,
        content: aiContent,
        role: Role.ASSISTANT,
      },
    });
    const count = await prisma.aiMessage.count({
      where: {
        conversationId,
      },
    });
    const messages = [question, anwser];
    res.status(200);
    res.json({
      messages,
      count,
    });
  } catch (error) {
    next(error);
  }
};
