import { Router, Request, Response } from "express";
import { connection } from "../db/connection";

import { authenticateToken } from "../services/authentication";
import { checkNGO } from "../services/checkRole";
import { validateDonationInput } from "../services/validators";


const router: Router = Router();

/* ------------------------------------------
   1️⃣ CREATE DONATION  (POST /donations)
-------------------------------------------*/
router.post(
  "/",
  authenticateToken,
  checkNGO,
  validateDonationInput,
  (req: any, res: Response) => {
    const d = req.body;

    const query = `
      INSERT INTO donations
      (ngo_id, donation_type, quantity_or_amount, location, pickup_date_time, images, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      query,
      [
        req.user.id,
        d.donation_type,
        d.quantity_or_amount,
        d.location,
        d.pickup_date_time,
        d.images || null,
        d.priority || "Normal"
      ],
      err => {
        if (err) return res.status(500).json(err);

        return res
          .status(200)
          .json({ message: "Donation request created successfully." });
      }
    );
  }
);

/* ------------------------------------------
   2️⃣ LIST DONATIONS  (GET /donations)
-------------------------------------------*/
router.get("/", authenticateToken, (_req: Request, res: Response) => {
  const query = `
    SELECT d.*, u.name AS ngo_name
    FROM donations d
    JOIN users u ON d.ngo_id = u.id
    ORDER BY d.created_at DESC
  `;

  connection.query(query, (err, results) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(results);
  });
});

/* ------------------------------------------
   3️⃣ UPDATE DONATION  (PUT /donations/:id)
-------------------------------------------*/
router.put(
  "/:id",
  authenticateToken,
  checkNGO,
  validateDonationInput,
  (req: any, res: Response) => {
    const id = req.params.id;
    const d = req.body;

    const query = `
      UPDATE donations
      SET donation_type = ?, quantity_or_amount = ?, location = ?,
          pickup_date_time = ?, images = ?, priority = ?, status = ?
      WHERE id = ? AND ngo_id = ?
    `;

    connection.query(
      query,
      [
        d.donation_type,
        d.quantity_or_amount,
        d.location,
        d.pickup_date_time,
        d.images || null,
        d.priority || "Normal",
        d.status || "Pending",
        id,
        req.user.id
      ],
      (err, results: any) => {
        if (err) return res.status(500).json(err);

        if (!results.affectedRows) {
          return res.status(404).json({
            message: "Donation not found or not owned by this NGO"
          });
        }

        return res
          .status(200)
          .json({ message: "Donation updated successfully." });
      }
    );
  }
);

/* ------------------------------------------
   4️⃣ CANCEL DONATION  (PATCH /donations/:id/cancel)
-------------------------------------------*/
router.patch(
  "/:id/cancel",
  authenticateToken,
  checkNGO,
  (req: any, res: Response) => {
    const id = req.params.id;

    const query = `
      UPDATE donations
      SET status = 'Cancelled'
      WHERE id = ? AND ngo_id = ?
    `;

    connection.query(query, [id, req.user.id], (err, results: any) => {
      if (err) return res.status(500).json(err);

      if (!results.affectedRows) {
        return res.status(404).json({
          message: "Donation not found or not owned by this NGO"
        });
      }

      return res
        .status(200)
        .json({ message: "Donation cancelled successfully." });
    });
  }
);

export default router;
