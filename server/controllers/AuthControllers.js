import { PrismaClient, Prisma } from "@prisma/client";
import { genSalt, hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { renameSync } from "fs";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Generate password hash
const generatePassword = async (password) => {
  const salt = await genSalt();
  return await hash(password, salt);
};

// Token expiration time
const maxAge = 3 * 24 * 60 * 60; // 3 days

// Create JWT token
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt ? JSON.parse(req.cookies.jwt).jwt : null;
  if (!token) return res.status(401).send("You are not authenticated!");

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) return res.status(403).send("Token is not valid or expired!");
    req.userId = payload?.userId; // Set userId on the request
    next();
  });
};

// Signup function
export const signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and Password are required");
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: await generatePassword(password),
      },
    });
    const token = createToken(email, user.id);
    return res.status(201).json({
      user: { id: user?.id, email: user?.email },
      jwt: token, // Optionally send JWT
    });
  } catch (err) {
    console.error(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(400).send("Email Already Registered");
      }
    }
    return res.status(500).send("Internal Server Error");
  }
};

// Login function
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and Password are required");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(400).send("Invalid Password");
    }

    const token = createToken(email, user.id);
    res.cookie('jwt', JSON.stringify({ jwt: token }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: maxAge * 1000,
    });

    return res.status(200).json({
      user: { id: user?.id, email: user?.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Get user info function
export const getUserInfo = async (req, res) => {
  verifyToken(req, res, async () => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
      });
      if (!user) return res.status(404).send("User not found");

      return res.status(200).json({
        user: {
          id: user?.id,
          email: user?.email,
          image: user?.profileImage,
          username: user?.username,
          fullName: user?.fullName,
          description: user?.description,
          isProfileSet: user?.isProfileInfoSet,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
  });
};

// Set user info function
export const setUserInfo = async (req, res) => {
  verifyToken(req, res, async () => {
    const { userName, fullName, description } = req.body;

    if (!userName || !fullName || !description) {
      return res.status(400).send("Username, Full Name, and Description are required.");
    }

    try {
      const existingUserName = await prisma.user.findUnique({
        where: { username: userName },
      });
      if (existingUserName) {
        return res.status(400).json({ userNameError: true });
      }

      await prisma.user.update({
        where: { id: req.userId },
        data: {
          username: userName,
          fullName,
          description,
          isProfileInfoSet: true,
        },
      });
      return res.status(200).send("Profile data updated successfully.");
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          return res.status(400).json({ userNameError: true });
        }
      }
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
  });
};

// Set user image function
export const setUserImage = async (req, res) => {
  verifyToken(req, res, async () => {
    if (!req.file) {
      return res.status(400).send("Image not included.");
    }

    const date = Date.now();
    const fileName = `uploads/profiles/${date}${req.file.originalname}`;

    try {
      renameSync(req.file.path, fileName);
      await prisma.user.update({
        where: { id: req.userId },
        data: { profileImage: fileName },
      });
      return res.status(200).json({ img: fileName });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
  });
};
