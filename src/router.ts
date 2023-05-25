import { Router } from "express";
import prisma from "./db";
import { UserPayload } from "./types";
import { Request } from "express";
const router = Router();

router.get("/", async (req, res) => {
  console.log(req.user);
  res.json({ meg: " api" });
});
export default router;
