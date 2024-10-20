import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getSellerData } from "../controllers/DashboardController.js";

export const dashboardRoutes = Router();

// Route to get seller data, protected by token verification
dashboardRoutes.get("/seller", verifyToken, getSellerData);

export default dashboardRoutes;
