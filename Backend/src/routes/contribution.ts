import { Router, Request, Response } from "express";
import { connection } from "../db/connection";

import { authenticateToken } from "../services/authentication";
import { checkDonor, checkNGO } from "../services/checkRole";
import { validateContributionInput } from "../services/validators";

const router: Router = Router();

/* ------------------------------------------
   1️ CREATE CONTRIBUTION
   POST /contributions
-------------------------------------------*/
router.post(
  "/",
  authenticateToken,
  checkDonor,
  validateContributionInput,
  (req: any, res: Response) => {
    const c = req.body;

    const query = `
      INSERT INTO contributions
      (donation_id, donor_id, contribution_quantity, pickup_date_time, notes, status)
      VALUES (?, ?, ?, ?, ?, 'Scheduled')
    `;

    connection.query(
      query,
      [
        c.donation_id,
        req.user.id,
        c.contribution_quantity,
        c.pickup_date_time || null,
        c.notes || null
      ],
      err => {
        if (err) return res.status(500).json(err);

        return res
          .status(200)
          .json({ message: "Contribution confirmed successfully." });
      }
    );
  }
);

/* ------------------------------------------
   2️ GET DONOR CONTRIBUTION HISTORY
   GET /contributions/donor/me
-------------------------------------------*/
router.get(
  "/donor/me",
  authenticateToken,
  checkDonor,
  (req: any, res: Response) => {
    const query = `
      SELECT c.*, d.donation_type, d.location,
             d.pickup_date_time AS ngo_schedule
      FROM contributions c
      JOIN donations d ON c.donation_id = d.id
      WHERE c.donor_id = ?
      ORDER BY c.created_at DESC
    `;

    connection.query(query, [req.user.id], (err, results) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(results);
    });
  }
);

/* ------------------------------------------
   3️ GET CONTRIBUTIONS FOR A DONATION (NGO)
   GET /contributions/donation/:id
-------------------------------------------*/
router.get(
  "/donation/:id",
  authenticateToken,
  checkNGO,
  (req: any, res: Response) => {
    const donationId = req.params.id;

    const query = `
      SELECT c.*, u.name AS donor_name
      FROM contributions c
      JOIN users u ON c.donor_id = u.id
      JOIN donations d ON c.donation_id = d.id
      WHERE c.donation_id = ?
      AND d.ngo_id = ?
      ORDER BY c.created_at DESC
    `;

    connection.query(
      query,
      [donationId, req.user.id],
      (err, results) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json(results);
      }
    );
  }
);

/* ------------------------------------------
   4️ UPDATE CONTRIBUTION STATUS
   PUT /contributions/:id/status
-------------------------------------------*/
router.put(
  "/:id/status",
  authenticateToken,
  (req: Request, res: Response) => {
    const id = req.params.id;
    const { status } = req.body;

    const valid = ["Scheduled", "PickedUp", "Cancelled"];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const query = `
      UPDATE contributions
      SET status = ?
      WHERE id = ?
    `;

    connection.query(query, [status, id], (err, results: any) => {
      if (err) return res.status(500).json(err);

      if (!results.affectedRows) {
        return res
          .status(404)
          .json({ message: "Contribution not found" });
      }

      return res
        .status(200)
        .json({ message: "Status updated successfully" });
    });
  }
);

export default router;
