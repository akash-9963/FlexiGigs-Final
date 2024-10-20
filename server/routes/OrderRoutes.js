import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  confirmOrder,
  createOrder,
  getBuyerOrders,
  getSellerOrders,
} from "../controllers/OrdersControllers.js";

export const orderRoutes = Router();

orderRoutes.post("/create", verifyToken, createOrder); // Check controller for MongoDB compatibility
orderRoutes.put("/success", verifyToken, confirmOrder); // Check controller for MongoDB compatibility
orderRoutes.get("/get-buyer-orders", verifyToken, getBuyerOrders); // Check controller for MongoDB compatibility
orderRoutes.get("/get-seller-orders", verifyToken, getSellerOrders); // Check controller for MongoDB compatibility
