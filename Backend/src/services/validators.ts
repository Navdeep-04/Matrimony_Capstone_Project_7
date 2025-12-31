import { Request, Response, NextFunction } from "express";

/* ------------------------------------------
   Donation Validation
-------------------------------------------*/
export function validateDonationInput(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const d = req.body;

  if (!d.donation_type || !d.quantity_or_amount || !d.location || !d.pickup_date_time) {
    res.status(400).json({ message: "All required fields must be provided" });
    return;
  }

  if (Number(d.quantity_or_amount) <= 0) {
    res.status(400).json({ message: "Quantity must be greater than 0" });
    return;
  }

  const pickupTime = new Date(d.pickup_date_time);
  if (isNaN(pickupTime.getTime()) || pickupTime < new Date()) {
    res.status(400).json({ message: "Pickup date must be a valid future date" });
    return;
  }

  const allowedTypes = ["Food", "Funds", "Clothes", "Medicine", "Other"];
  if (!allowedTypes.includes(d.donation_type)) {
    res.status(400).json({ message: "Invalid donation type" });
    return;
  }

  next();
}

/* ------------------------------------------
   Contribution Validation
-------------------------------------------*/
export function validateContributionInput(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const c = req.body;

  if (!c.donation_id || !c.contribution_quantity) {
    res
      .status(400)
      .json({ message: "donation_id and contribution_quantity are required" });
    return;
  }

  if (Number(c.contribution_quantity) <= 0) {
    res
      .status(400)
      .json({ message: "Contribution quantity must be greater than 0" });
    return;
  }

  if (c.pickup_date_time) {
    const pickupTime = new Date(c.pickup_date_time);
    if (isNaN(pickupTime.getTime()) || pickupTime < new Date()) {
      res
        .status(400)
        .json({ message: "Pickup date must be a valid future date" });
      return;
    }
  }

  next();
}

/* ------------------------------------------
   Pickup Validation
-------------------------------------------*/
export function validatePickupInput(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { donation_id, pickup_date_time } = req.body;

  if (!donation_id || !pickup_date_time) {
    res
      .status(400)
      .json({ message: "donation_id and pickup_date_time are required" });
    return;
  }

  const pickupTime = new Date(pickup_date_time);
  if (isNaN(pickupTime.getTime()) || pickupTime < new Date()) {
    res
      .status(400)
      .json({ message: "Pickup date must be a valid future date" });
    return;
  }

  next();
}
