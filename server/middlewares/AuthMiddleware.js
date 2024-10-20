import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt ? JSON.parse(req.cookies.jwt).jwt : null; // Safely handle missing cookies
  if (!token) return res.status(401).send("You are not authenticated!");

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) return res.status(403).send("Token is not valid!");

    req.userId = payload?.userId; // Set userId on the request
    next();
  });
};
