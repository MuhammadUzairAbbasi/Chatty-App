import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { server, app } from "./lib/socket.js";
import path from "path";

dotenv.config();

const port = process.env.PORT || 3000;

const __dirname = path.resolve();

// allow to extract data from req.body
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "Production") {
  app.use(express.static(__dirname, "../frontend/dist"));

  app.get("*", (req, res) => {
    res.sendFile(__dirname, "../frontend", "dist", "index.html");
  });
}

server.listen(port, () => {
  console.log(`Port Running on port ${port}`);
  connectDB();
});
