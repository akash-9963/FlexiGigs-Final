import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Check if the cookie is present and read the token directly
  const token = req.cookies.jwt || null;

  console.log("Token:", token); // Log the token for debugging

  if (!token) {
    console.log("No token found, user not authenticated.");
    return res.status(401).send("You are not authenticated!");
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      console.log("Token verification error:", err.message);
      return res.status(403).send("Token is not valid!");
    }

    // Set userId on the request object
    req.userId = payload?.userId;
    console.log("Authenticated user ID:", req.userId);
    next();
  });
};
