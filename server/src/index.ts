import express from "express";
import cors from "cors";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import { initDB } from "./db";

const app = express();
app.use(cors());
app.use(express.json());

//Root route
app.get("/", (req, res) => {
  res.send("Hello World 🚀");
});

//User routes
app.use("/users", userRoutes);

//Auth
app.use("/auth", authRoutes);

const PORT = 5000;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
});