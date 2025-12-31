import { Response, NextFunction } from "express";
import { RequestWithUser } from "./authentication";

export function checkAdmin(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.role !== "Admin") {
    return res
      .status(403)
      .json({ message: "Access denied — Admin role required" });
  }
  next();
}

export function checkNGO(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.role !== "NGO") {
    return res
      .status(403)
      .json({ message: "Access denied — NGO role required" });
  }
  next();
}

export function checkDonor(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.role !== "Donor") {
    return res
      .status(403)
      .json({ message: "Access denied — Donor role required" });
  }
  next();
}
