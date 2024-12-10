import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";

const SECRET_KEY = process.env.SECRET_KEY || "default_secret";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Token required" });

  try {
    const decoded = jwt.verify(token as string, SECRET_KEY) as JwtPayload;
    req.body.id = decoded.id;
    req.body.type = decoded.type;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
