import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./socket/socket.js";

dotenv.config({});

// PORT
const PORT = process.env.PORT || 5000;

// ✅ CORS CONFIG (UPDATED FOR PRODUCTION + LOCAL)
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://chat-app-two-tau-38.vercel.app"
  ],
  credentials: true,
};

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// server start
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});