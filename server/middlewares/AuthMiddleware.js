import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Check if the cookie is present and parse it
  const token = req.cookies.jwt ? JSON.parse(req.cookies.jwt).jwt : null;
  console.log("Token:", token); // Log the token for debugging

  // Log a message indicating the middleware is processing the request
  console.log("Verify Token Middleware: Proceeding without checks.");

  // Call next() to allow the request to proceed without any token verification
  next();
};
