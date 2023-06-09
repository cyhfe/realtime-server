import { RequestHandler } from "express";
import openai from "../openai";
export const handleGeneration: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401);
  }
  const { prompt } = req.body as { prompt: string };
  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json",
      user: user.username,
    });
    const b64_json = response.data.data[0].b64_json;
    res.status(200);
    res.json({
      b64_json: b64_json,
    });
  } catch (error) {
    next(error);
  }
};
