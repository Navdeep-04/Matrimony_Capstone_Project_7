import { Router, Request, Response } from "express";
import { connection } from "../db/connection";

import { authenticateToken } from "../services/authentication";
import { checkDonor, checkNGO } from "../services/checkRole";
import { validatePickupInput } from "../services/validators";

const router: Router = Router();

/* ---------------------------------------------------------
   1️⃣ SCHEDULE PICKUP (Donor)
   POST /pickups/schedule
---------------------------------------------------------*/
router.post(
  "/schedule",
  authenticateToken,
  checkDonor,
  validatePickupInput,
  (req: any, res: Response) => {
    const { donation_id, pickup_date_time, notes } = req.body;

    const checkQuery = `
      SELECT COUNT(*) AS cnt
      FROM contributions
      WHERE donation_id = ? AND pickup_date_time = ?
    `;

    connection.query(
      checkQuery,
      [donation_id, pickup_date_time],
      (err, result: any[]) => {
        if (err) return res.status(500).json(err);

        if (result[0].cnt > 0) {
          return res.status(409).json({
            message: "Pickup slot already booked — please choose another time"
          });
        }

        const insertQuery = `
          INSERT INTO contributions
          (donation_id, donor_id, contribution_quantity, pickup_date_time, notes, status)
          VALUES (?, ?, 0, ?, ?, 'Scheduled')
        `;

        connection.query(
          insertQuery,
          [donation_id, req.user.id, pickup_date_time, notes || null],
          err2 => {
            if (err2) return res.status(500).json(err2);

            return res
              .status(200)
              .json({ message: "Pickup scheduled successfully" });
          }
        );
      }
    );
  }
);

/* ---------------------------------------------------------
   2️⃣ DONOR PICKUP LIST
   GET /pickups/donor/me
---------------------------------------------------------*/
router.get(
  "/donor/me",
  authenticateToken,
  checkDonor,
  (req: any, res: Response) => {
    const query = `
      SELECT c.id, c.pickup_date_time, c.status,
             d.donation_type, d.location
      FROM contributions c
      JOIN donations d ON d.id = c.donation_id
      WHERE c.donor_id = ?
      ORDER BY c.pickup_date_time DESC
    `;

    connection.query(query, [req.user.id], (err, results) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(results);
    });
  }
);

/* ---------------------------------------------------------
   3️⃣ NGO VIEW PICKUPS FOR DONATION
   GET /pickups/ngo/:donationId
---------------------------------------------------------*/
router.get(
  "/ngo/:donationId",
  authenticateToken,
  checkNGO,
  (req: any, res: Response) => {
    const donationId = req.params.donationId;

    const query = `
      SELECT c.id, c.pickup_date_time, c.status, u.name AS donor_name
      FROM contributions c
      JOIN users u ON u.id = c.donor_id
      JOIN donations d ON d.id = c.donation_id
      WHERE c.donation_id = ? AND d.ngo_id = ?
      ORDER BY c.pickup_date_time ASC
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

/* ---------------------------------------------------------
   4️⃣ UPDATE PICKUP STATUS
   PUT /pickups/:id/status
---------------------------------------------------------*/
router.put(
  "/:id/status",
  authenticateToken,
  (req: Request, res: Response) => {
    const id = req.params.id;
    const { status } = req.body;

    const validStatuses = ["Scheduled", "PickedUp", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid pickup status" });
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
          .json({ message: "Pickup record not found" });
      }

      return res
        .status(200)
        .json({ message: "Pickup status updated successfully" });
    });
  }
);

export default router;
