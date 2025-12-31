import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthUser extends JwtPayload {
  id: number;
  email: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user?: AuthUser;
}

export function authenticateToken(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.ACCESS_TOKEN as string, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    req.user = decoded as AuthUser; // attach user payload
    next();
  });
}

