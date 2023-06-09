import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { getAllUsers, getUserById } from "../handlers/user";
import {
  getAllConversations,
  createConversation,
} from "../handlers/conversation";
import { getAllMessages, sendMessage } from "../handlers/message";
import { handleGeneration } from "../handlers/images";

const router = Router();

/**
 * User
 */
router.get("/user", getAllUsers);
router.get("/user/:id", getUserById);

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res.json({ message: `had an error`, code: 500 });
});

/**
 * Conversation
 */
router.get("/conversation", getAllConversations);

router.post("/conversation", createConversation);

/**
 * Message
 */
router.get("/message", getAllMessages);

router.post("/message", sendMessage);

/**
 * images
 */

router.post("/images/generations", handleGeneration);

export default router;
