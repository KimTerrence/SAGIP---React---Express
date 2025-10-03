import { Router, Request, Response } from "express";
import { db } from "../db";

const router = Router();

interface FieldLocation {
  id: number;
  fieldName: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  fieldLocations?: FieldLocation[];
}

// GET all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT id, first_name AS firstName, last_name AS lastName, email, address FROM users");
    res.json(rows);
  } catch (err) {
    console.error("GET /users error:", err);
    res.status(500).json({ message: "DB error", error: err });
  }
});

// POST user (sync from client)
router.post("/sync", async (req: Request, res: Response) => {
  const user: User = req.body;

  if (!user) {
    return res.status(400).json({ success: false, error: "No user data provided" });
  }

  try {
    // Upsert user based on email
    await db.query(
      `INSERT INTO users (first_name, last_name, email, address)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         first_name = VALUES(first_name),
         last_name = VALUES(last_name),
         address = VALUES(address)`, // email is unique key
      [user.firstName, user.lastName, user.email, user.address]
    );

    // Get user's id
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [user.email]);
    const userId = (rows as any)[0].id;

    // Delete old field locations for this user
    await db.query("DELETE FROM field_locations WHERE user_id = ?", [userId]);

    // Insert current field locations
    if (Array.isArray(user.fieldLocations)) {
      for (const field of user.fieldLocations) {
        await db.query(
          `INSERT INTO field_locations (user_id, field_name)
           VALUES (?, ?)`,
          [userId, field.fieldName]
        );
      }
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error("POST /users/sync error:", err);
    res.status(500).json({ success: false, error: err?.message || err });
  }
});

export default router;
