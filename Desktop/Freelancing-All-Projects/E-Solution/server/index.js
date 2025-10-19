import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config({ path: "./.env" });

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "dist")));

app.use(
  cors({
    origin: "http://localhost:5173", // Dev mode
    credentials: true,
  })
);

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/user", userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Resource Not Found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: err.message || "Something Went Wrong" });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("✅ MONGO CONNECTED");
  app.listen(process.env.PORT, () => {
    console.log(`🚀 SERVER RUNNING on port ${process.env.PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MONGO CONNECTION ERROR:", err);
});
