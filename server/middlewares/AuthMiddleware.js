import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Check if the cookie is present and read the token directly
  const token = req.cookies.jwt || null;

  console.log("Token:", token); // Log the token for debugging

  if (!token) {
    console.log("No token found, user not authenticated.");
    return res.status(401).send("You are not authenticated!");
  }

  try {
    // Decode the token without verification
    const payload = jwt.decode(token);
    req.userId = payload?.userId; // Set userId on the request object

    console.log("Authenticated user ID:", req.userId);
    next();
  } catch (err) {
    console.log("Error decoding token:", err.message);
    return res.status(403).send("Token is not valid!");
  }
};
