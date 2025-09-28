import { Router } from "express";
import { db } from "../db";
import multer from "multer";
import path from "path";

const router = Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "pestImg") cb(null, path.join(__dirname, "../uploads/pests"));
    else if (file.fieldname === "lifeCycleImg") cb(null, path.join(__dirname, "../uploads/lifecycle"));
    else cb(null, path.join(__dirname, "../uploads/others"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Helper to safely parse controlMethods
const parseControlMethods = (input: any) => {
  if (!input) return { Cultural: [], Biological: [], Chemical: [] };
  if (typeof input === "string") {
    try {
      return JSON.parse(input);
    } catch {
      return { Cultural: [], Biological: [], Chemical: [] };
    }
  }
  return input;
};

// GET all pests with control methods
router.get("/", async (req, res) => {
  try {
    const [pests] = await db.query(
      `SELECT * FROM pest`
    );

    const pestIds = (pests as any).map((p: any) => p.idPest);
    let controlMethods: any[] = [];

    if (pestIds.length > 0) {
      const [rows] = await db.query(`SELECT * FROM controlmethod WHERE idPest IN (?)`, [pestIds]);
      controlMethods = rows as any[];
    }

    const result = (pests as any).map((p: any) => {
      const methods = controlMethods.filter(m => m.idPest === p.idPest);
      const grouped: any = { Cultural: [], Biological: [], Chemical: [] };
      methods.forEach(m => grouped[m.type].push(m.description));
      return { ...p, controlMethods: grouped };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB error" });
  }
});

// POST add pest and control methods
router.post(
  "/",
  upload.fields([
    { name: "pestImg", maxCount: 1 },
    { name: "lifeCycleImg", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { pestName, tagalogName, identifyingMarks, whereToFind, damage, lifeCycle, controlMethods, host } = req.body;
      const controlMethodsObj = parseControlMethods(controlMethods);

      const pestImgPath =
        req.files && (req.files as any).pestImg
          ? `/uploads/pests/${(req.files as any).pestImg[0].filename}`
          : "";
      const lifeCycleImgPath =
        req.files && (req.files as any).lifeCycleImg
          ? `/uploads/lifecycle/${(req.files as any).lifeCycleImg[0].filename}`
          : "";

      const [result] = await db.query(
        `INSERT INTO pest (pestName, tagalogName, pestImg, identifyingMarks, whereToFind, damage, lifeCycle, lifeCycleImg, host)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [pestName, tagalogName, pestImgPath, identifyingMarks, whereToFind, damage, lifeCycle, lifeCycleImgPath, host]
      );
      const pestId = (result as any).insertId;

      const inserts: any[] = [];
      for (const type of ["Cultural", "Biological", "Chemical"]) {
        if (controlMethodsObj[type]?.length > 0) {
          controlMethodsObj[type].forEach((desc: string) => inserts.push([pestId, type, desc]));
        }
      }
      if (inserts.length > 0) {
        await db.query(`INSERT INTO controlmethod (idPest, type, description) VALUES ?`, [inserts]);
      }

      res.status(201).json({ message: "Pest added successfully", id: pestId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "DB insert error" });
    }
  }
);

// PUT update pest and its control methods
router.put(
  "/:id",
  upload.fields([
    { name: "pestImg", maxCount: 1 },
    { name: "lifeCycleImg", maxCount: 1 },
  ]),
  async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const { id } = req.params;
      const { pestName, tagalogName, identifyingMarks, whereToFind, damage, lifeCycle, controlMethods, host } = req.body;
      const controlMethodsObj = parseControlMethods(controlMethods);

      const pestImgPath =
        req.files && (req.files as any).pestImg
          ? `/uploads/pests/${(req.files as any).pestImg[0].filename}`
          : null;
      const lifeCycleImgPath =
        req.files && (req.files as any).lifeCycleImg
          ? `/uploads/lifecycle/${(req.files as any).lifeCycleImg[0].filename}`
          : null;

      const fields = [
        "pestName = ?",
        "tagalogName = ?",
        "identifyingMarks = ?",
        "whereToFind = ?",
        "damage = ?",
        "lifeCycle = ?",
        "host = ?"
      ];
      const values: any[] = [pestName, tagalogName, identifyingMarks, whereToFind, damage, lifeCycle, host];

      if (pestImgPath) {
        fields.push("pestImg = ?");
        values.push(pestImgPath);
      }
      if (lifeCycleImgPath) {
        fields.push("lifeCycleImg = ?");
        values.push(lifeCycleImgPath);
      }
      values.push(id);

      await connection.query(`UPDATE pest SET ${fields.join(", ")} WHERE idPest = ?`, values);

      // Delete old control methods
      await connection.query(`DELETE FROM controlmethod WHERE idPest = ?`, [id]);

      const inserts: any[] = [];
      for (const type of ["Cultural", "Biological", "Chemical"]) {
        if (controlMethodsObj[type]?.length > 0) {
          controlMethodsObj[type].forEach((desc: string) => inserts.push([id, type, desc]));
        }
      }
      if (inserts.length > 0) {
        await connection.query(`INSERT INTO controlmethod (idPest, type, description) VALUES ?`, [inserts]);
      }

      await connection.commit();
      connection.release();

      res.json({ message: "Pest and control methods updated successfully" });
    } catch (err) {
      await connection.rollback();
      connection.release();
      console.error(err);
      res.status(500).json({ message: "DB update error" });
    }
  }
);

// DELETE pest by ID
router.delete("/:id", async (req, res) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const { id } = req.params;

    // 1. Delete control methods first (foreign key dependency)
    await connection.query(`DELETE FROM controlmethod WHERE idPest = ?`, [id]);

    // 2. Delete the pest
    const [result] = await connection.query(`DELETE FROM pest WHERE idPest = ?`, [id]);

    await connection.commit();
    connection.release();

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: "Pest not found" });
    }

    res.json({ message: "Pest deleted successfully" });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("❌ Failed to delete pest:", err);
    res.status(500).json({ message: "Failed to delete pest" });
  }
});



router.get("/hosts", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT DISTINCT host FROM pest WHERE host IS NOT NULL AND host != ''`);
    const hosts = (rows as any).map((row: any) => row.host);
    res.json(hosts);
  } catch (err) {
    console.error("Failed to fetch hosts:", err);
    res.status(500).json({ message: "Failed to fetch hosts" });
  }
});


export default router;
