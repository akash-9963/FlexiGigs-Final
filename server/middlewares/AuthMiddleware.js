import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Check if the cookie is present and parse it
  const token = req.cookies.jwt ? JSON.parse(req.cookies.jwt).jwt : null;
  console.log("Token:", token); // Log the token for debugging

  if (!token) {
    console.log("No token found, user not authenticated."); // Log the absence of token
    return res.status(401).send("You are not authenticated!");
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      console.log("Token verification error:", err.message); // Log any verification errors
      return res.status(403).send("Token is not valid!");
    }

    // Set userId on the request object
    req.userId = payload?.userId;
    console.log("Authenticated user ID:", req.userId); // Log the authenticated user ID
    next();
  });
};
