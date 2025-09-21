import { Router } from "express";
import { db } from "../db";

const router = Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "DB error" });
  }
});

export default router;
