import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  addMessage,
  getMessages,
  getUnreadMessages,
  markAsRead,
} from "../controllers/MessageControllers.js";

export const messageRoutes = Router();

messageRoutes.post("/add-message/:orderId", verifyToken, addMessage); // Check controller for MongoDB compatibility
messageRoutes.get("/get-messages/:orderId", verifyToken, getMessages); // Check controller for MongoDB compatibility
messageRoutes.get("/unread-messages", verifyToken, getUnreadMessages); // Check controller for MongoDB compatibility
messageRoutes.put("/mark-as-read/:messageId", verifyToken, markAsRead); // Check controller for MongoDB compatibility
