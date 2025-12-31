import { Router, Request, Response } from "express";
import { connection } from "../db/connection";
import { authenticateToken } from "../services/authentication";

const router: Router = Router();

/**
 * ADMIN DASHBOARD SUMMARY
 * GET /dashboard/summary
 */
router.get(
  "/summary",
  authenticateToken,
  (_req: Request, res: Response) => {
    const data: any = {};

    // 1️ Count NGOs
    const queryNGO = `
      SELECT COUNT(id) AS ngoCount
      FROM users
      WHERE role = 'NGO'
    `;

    connection.query(queryNGO, (err, results: any[]) => {
      if (err) return res.status(500).json(err);
      data.ngos = results[0].ngoCount;

      // 2️ Count Donors
      const queryDonors = `
        SELECT COUNT(id) AS donorCount
        FROM users
        WHERE role = 'Donor'
      `;

      connection.query(queryDonors, (err2, results2: any[]) => {
        if (err2) return res.status(500).json(err2);
        data.donors = results2[0].donorCount;

        // 3️ Donation Status Summary
        const queryDonations = `
          SELECT
            COUNT(id) AS totalDonations,
            SUM(status = 'Pending') AS pending,
            SUM(status = 'Confirmed') AS confirmed,
            SUM(status = 'Completed') AS completed,
            SUM(status = 'Cancelled') AS cancelled
          FROM donations
        `;

        connection.query(queryDonations, (err3, results3: any[]) => {
          if (err3) return res.status(500).json(err3);
          data.donations = results3[0];

          // 4️ Contribution Count
          const queryContributions = `
            SELECT COUNT(id) AS contributionCount
            FROM contributions
          `;

          connection.query(queryContributions, (err4, results4: any[]) => {
            if (err4) return res.status(500).json(err4);
            data.contributions = results4[0].contributionCount;

            return res.status(200).json({ data });
          });
        });
      });
    });
  }
);

export default router;
