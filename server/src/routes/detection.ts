import { Router } from "express";
import { db } from "../db";
import multer from "multer";
import path from "path";
import { RowDataPacket } from "mysql2/promise";
import fs from "fs";

const router = Router();

// Ensure uploads/detections folder exists
const uploadFolder = path.join(__dirname, "../uploads/detections");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

// GET all detection logs
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute<RowDataPacket[]>(`
      SELECT dl.id, dl.pestName, dl.imagePath, dl.dateDetected, u.email, u.id AS userId
      FROM detection_logs dl
      JOIN users u ON dl.userId = u.id
      ORDER BY dl.dateDetected DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch detection logs" });
  }
});

// POST /sync
router.post("/sync", upload.single("image"), async (req, res) => {
  try {
    const { email, pestName, dateDetected } = req.body;

    // Use consistent web-accessible path
    const imagePath = req.file ? `/uploads/detections/${req.file.filename}` : null;

    // Get user ID
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) return res.status(400).json({ error: "User not found" });
    const userId = rows[0].id;

    // Insert detection log
    const query = `
      INSERT INTO detection_logs (userId, pestName, imagePath, dateDetected)
      VALUES (?, ?, ?, ?)
    `;
    await db.execute(query, [userId, pestName, imagePath, dateDetected]);

    res.json({ success: true, imagePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to sync detection log" });
  }
});

export default router;
