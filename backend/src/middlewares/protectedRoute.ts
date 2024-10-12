import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.js";

interface DecodedToken extends JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
      };
    }
  }
}

interface Token {
  id: string;
  token: string;
  userId: string;
}

const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Authorization token missing" });
    }

    const accessTokenSecret = process.env.JWT_SECRET;

    if (!accessTokenSecret) {
      throw new Error(
        "JWT_SECRET or JWT_REFRESH_SECRET is not defined in environment variables"
      );
    }

    const decoded = jwt.verify(token, accessTokenSecret) as DecodedToken;

    if (typeof decoded !== "object" || !decoded.user) {
      throw new Error("Invalid token structure");
    }

    const activeTokens = await prisma.token.findMany({
      where: {
        userId: decoded.user.id,
      },
    });

    const tokenExists = activeTokens.some((t: Token) => t.token === token);

    if (!tokenExists) {
      return res.status(401).json({ msg: "Token is not valid" });
    }

    if (activeTokens.length > 3) {
      return res
        .status(403)
        .json({ msg: "You can only log in on three devices simultaneously." });
    }

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default protectedRoute;
