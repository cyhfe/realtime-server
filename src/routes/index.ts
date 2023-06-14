import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { getAllUsers, getUserById } from "../handlers/user";
import {
  getAllConversations,
  createConversation,
  deleteConversation,
} from "../handlers/conversation";
import { getAllMessages, sendMessage } from "../handlers/message";
import {
  handleEditUpload,
  handleGeneration,
  handleVariationsUpload,
} from "../handlers/images";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

router.delete("/conversation/:conversationId", deleteConversation);

/**
 * Message
 */
router.get("/message", getAllMessages);

router.post("/message", sendMessage);

/**
 * images
 */

router.post("/images/generations", handleGeneration);

router.post(
  "/images/variations/upload",
  upload.single("file"),
  handleVariationsUpload
);

router.post(
  "/images/edit/upload",
  upload.fields([{ name: "file" }, { name: "mask" }]),
  handleEditUpload
);

export default router;
