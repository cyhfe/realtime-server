import { Router } from "express";
import prisma from "./db";
const router = Router();

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ users });
});
export default router;
