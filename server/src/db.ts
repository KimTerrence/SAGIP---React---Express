import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

export async function initDB() {
  try {
    // Ensure database exists
    await db.query("CREATE DATABASE IF NOT EXISTS sagip");
    await db.query("USE sagip");

    // Ensure users table exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Database initialized");

    // Check if any users exist
    const [rows]: any = await db.query("SELECT COUNT(*) as count FROM users");
    if (rows[0].count === 0) {
      // Create default admin
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await db.query(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        ["admin@sagip.com", hashedPassword, "admin"]
      );
      console.log("✅ Default admin created (email: admin@sagip.com, password: admin123)");
    }
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
}