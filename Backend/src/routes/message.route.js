import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getUserforSidebar,
  sendMessage,
} from "../controllers/message.controller.js";
import { getMessages } from "../controllers/message.controller.js";

const route = express.Router();

route.get("/users", protectRoute, getUserforSidebar);
route.get("/:id", protectRoute, getMessages);

route.post("/send/:id", protectRoute, sendMessage);

export default route;
