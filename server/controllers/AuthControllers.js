import { Prisma, PrismaClient } from "@prisma/client";
import { genSalt, hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { renameSync } from "fs";

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

// Signup function
export const signup = async (req, res, next) => {
  try {
    const prisma = new PrismaClient();
    const { email, password } = req.body;

    if (email && password) {
      const user = await prisma.user.create({
        data: {
          email,
          password: await generatePassword(password),
        },
      });
      return res.status(201).json({
        user: { id: user?.id, email: user?.email },
        jwt: createToken(email, user.id), // Optional: You can keep it if needed
      });
    } else {
      return res.status(400).send("Email and Password Required");
    }
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(400).send("Email Already Registered");
      }
    } else {
      return res.status(500).send("Internal Server Error");
    }
    throw err;
  }
};

// Login function
export const login = async (req, res, next) => {
  try {
    const prisma = new PrismaClient();
    const { email, password } = req.body;

    if (email && password) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        return res.status(404).send("User not found");
      }

      const auth = await compare(password, user.password);
      if (!auth) {
        return res.status(400).send("Invalid Password");
      }

      // Create token
      const token = createToken(email, user.id);
      
      // Set token in a cookie
      res.cookie('jwt', JSON.stringify({ jwt: token }), {
        httpOnly: true, // Prevent client-side access
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'None', // Allow cross-origin requests
        maxAge: maxAge * 1000, // Max age set to 3 days
      });

      return res.status(200).json({
        user: { id: user?.id, email: user?.email },
      });
    } else {
      return res.status(400).send("Email and Password Required");
    }
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

// Get user info function
export const getUserInfo = async (req, res, next) => {
  try {
    if (req?.userId) {
      const prisma = new PrismaClient();
      const user = await prisma.user.findUnique({
        where: {
          id: req.userId,
        },
      });
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
    }
  } catch (err) {
    res.status(500).send("Internal Server Occured");
  }
};

// Set user info function
export const setUserInfo = async (req, res, next) => {
  try {
    if (req?.userId) {
      const { userName, fullName, description } = req.body;
      if (userName && fullName && description) {
        const prisma = new PrismaClient();
        const userNameValid = await prisma.user.findUnique({
          where: { username: userName },
        });
        if (userNameValid) {
          return res.status(200).json({ userNameError: true });
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
      } else {
        return res
          .status(400)
          .send("Username, Full Name and description should be included.");
      }
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(400).json({ userNameError: true });
      }
    } else {
      return res.status(500).send("Internal Server Error");
    }
    throw err;
  }
};

// Set user image function
export const setUserImage = async (req, res, next) => {
  try {
    if (req.file) {
      if (req?.userId) {
        const date = Date.now();
        let fileName = "uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path, fileName);
        const prisma = new PrismaClient();

        await prisma.user.update({
          where: { id: req.userId },
          data: { profileImage: fileName },
        });
        return res.status(200).json({ img: fileName });
      }
      return res.status(400).send("Cookie Error.");
    }
    return res.status(400).send("Image not included.");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Occured");
  }
};
