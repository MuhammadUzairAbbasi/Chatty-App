import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

// allow to extract data from req.body
app.use(express.json({limit:"50mb"}));
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

app.listen(port, () => {
  console.log(`Port Running on port ${port}`);
  connectDB();
});
