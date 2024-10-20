import { Router } from "express";
import {
  addGig,
  checkGigOrder,
  editGig,
  getGigData,
  getUserAuthGigs,
  searchGigs,
  addReview,
} from "../controllers/GigsController.js";
import multer from "multer";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const upload = multer({ dest: "uploads/" });

export const gigRoutes = Router();

// Route to add a new gig
gigRoutes.post("/add", verifyToken, upload.array("images"), addGig);

// Route to get user's gigs
gigRoutes.get("/get-user-gigs", verifyToken, getUserAuthGigs);

// Route to get gig data by ID
gigRoutes.get("/get-gig-data/:gigId", getGigData);

// Route to edit a gig by ID
gigRoutes.put("/edit-gig/:gigId", verifyToken, upload.array("images"), editGig);

// Route to search for gigs
gigRoutes.get("/search-gigs", searchGigs);

// Route to check an order for a specific gig
gigRoutes.get("/check-gig-order/:gigId", verifyToken, checkGigOrder);

// Route to add a review specifically for a gig by ID
gigRoutes.post("/add-review/:gigId", verifyToken, addReview);

export default gigRoutes;
