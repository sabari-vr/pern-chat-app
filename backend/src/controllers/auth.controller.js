import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // https://avatar-placeholder.iran.liara.run/
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await prisma.user.create({
      data: {
        fullName,
        username,
        password: hashedPassword,
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
      },
    });

    if (newUser) {
      const accessTokenSecret = process.env.JWT_SECRET;
      const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

      if (!accessTokenSecret || !refreshTokenSecret) {
        throw new Error(
          "JWT_SECRET or JWT_REFRESH_SECRET is not defined in environment variables"
        );
      }

      const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
      const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;

      const payload = {
        user: {
          id: newUser.id,
        },
      };

      const accessToken = jwt.sign(payload, accessTokenSecret, {
        expiresIn: accessTokenLife,
      });

      const refreshToken = jwt.sign(payload, refreshTokenSecret, {
        expiresIn: refreshTokenLife,
      });

      await prisma.token.create({
        data: {
          userId: newUser.id,
          token: accessToken,
        },
      });

      res.status(201).json({
        refreshToken,
        accessToken,
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          username: newUser.username,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "All feilds are required" });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const activeTokens = await prisma.token.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (activeTokens.length >= 3) {
      const oldestToken = activeTokens[0];
      await prisma.token.delete({
        where: {
          id: oldestToken.id,
        },
      });
    }

    const accessTokenSecret = process.env.JWT_SECRET;
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
      throw new Error(
        "JWT_SECRET or JWT_REFRESH_SECRET is not defined in environment variables"
      );
    }

    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
    const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;

    const payload = {
      user: {
        id: user.id,
      },
    };

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: accessTokenLife,
    });

    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: refreshTokenLife,
    });

    await prisma.token.create({
      data: {
        userId: user.id,
        token: accessToken,
      },
    });

    res.status(200).json({
      refreshToken,
      accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ error: "unautherized!" });
    }
    const token = authHeader.split(" ")[1];

    await prisma.token.deleteMany({
      where: {
        token: token,
      },
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const refreshAccessToken = async (req, res) => {
  const { accessToken: oldAccessToken, refreshToken } = req.body;

  if (!refreshToken || !oldAccessToken) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Type guard to check if 'decoded' is a JwtPayload
    if (typeof decoded !== "object" || !("user" in decoded)) {
      return res.sendStatus(403); // Forbidden
    }

    const payload = decoded;

    const newAccessToken = jwt.sign(
      { user: payload.user, email: payload.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_LIFE }
    );

    const updatedToken = await prisma.token.updateMany({
      where: {
        userId: payload.user.id,
        token: oldAccessToken,
      },
      data: { token: newAccessToken },
    });

    if (!updatedToken) {
      return res.sendStatus(403); // Forbidden
    }

    res.json({ accessToken: newAccessToken, refreshToken });
  } catch (err) {
    console.error(err.message);
    res.sendStatus(403); // Forbidden
  }
};
