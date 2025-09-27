import express from "express";
import cors from "cors";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import pestRoutes from "./routes/pest";
import { initDB } from "./db";
import path from "path"

const app = express();
app.use(cors());
app.use(express.json());

// Serve static uploads folder
app.use("/uploads/pests", express.static(path.join(__dirname, "uploads/pests")));
app.use("/uploads/lifecycle", express.static(path.join(__dirname, "uploads/lifecycle")));


//Root route
app.get("/", (req, res) => {
  res.send("Hello World 🚀");
});

//User routes
app.use("/users", userRoutes);

//Auth routes
app.use("/auth", authRoutes);

//Pest Routes
app.use("/pests", pestRoutes);

const PORT = 5000;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
});