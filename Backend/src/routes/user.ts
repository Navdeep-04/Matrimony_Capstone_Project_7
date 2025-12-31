import { Router, Request, Response } from "express";
import { connection } from "../db/connection";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

import { authenticateToken, RequestWithUser } from "../services/authentication";
import { checkAdmin } from "../services/checkRole";

dotenv.config();

const router: Router = Router();

/* ------------------------- SIGNUP ------------------------- */
router.post("/signup", (req: Request, res: Response) => {
  const user = req.body;

  // Basic validation
  if (!user.name || !user.email || !user.password) {
    return res.status(400).json({
      message: "Name, email and password are required"
    });
  }

  const role =
    user.role && ["Donor", "NGO", "Admin"].includes(user.role)
      ? user.role
      : "Donor";

  const contactInfo = user.contactNumber || user.contact_info || "";

  let query = "SELECT id FROM users WHERE email = ?";

  connection.query(query, [user.email], (err, results: any[]) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    query = `
      INSERT INTO users (name, email, password, role, contact_info)
      VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
      query,
      [user.name, user.email, user.password, role, contactInfo],
      err2 => {
        if (err2) return res.status(500).json(err2);

        return res.status(200).json({ message: "Successfully Registered" });
      }
    );
  });
});


/* ------------------------- LOGIN ------------------------- */
router.post("/login", (req: Request, res: Response) => {
  const user = req.body;

  const query = `
    SELECT id, name, email, password, role
    FROM users
    WHERE email = ?
  `;

  connection.query(query, [user.email], (err, results: any[]) => {
    if (err) return res.status(500).json(err);

    if (!results.length || results[0].password !== user.password) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const payload = {
      id: results[0].id,
      email: results[0].email,
      role: results[0].role
    };

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN as string, {
      expiresIn: "8h"
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      role: results[0].role,
      name: results[0].name
    });
  });
});

/* --------------------- FORGOT PASSWORD -------------------- */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

router.post("/forgotPassword", (req: Request, res: Response) => {
  const user = req.body;

  const query = `
    SELECT email, password, name
    FROM users
    WHERE email = ?
  `;

  connection.query(query, [user.email], (err, results: any[]) => {
    if (err) return res.status(500).json(err);

    if (!results.length) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const u = results[0];

    const mailOptions = {
      from: process.env.EMAIL,
      to: u.email,
      subject: "Password Recovery - Donation & Charity Portal",
      html: `
        <p><b>Hello ${u.name || ""},</b></p>
        <p>Your login details:</p>
        <p><b>Email:</b> ${u.email}<br><b>Password:</b> ${u.password}</p>
        <p><a href="http://localhost:4200/">Click here to login</a></p>
      `
    };

    transporter.sendMail(mailOptions, mailErr => {
      if (mailErr) {
        return res.status(500).json({ message: "Failed to send email" });
      }

      return res.status(200).json({ message: "Password sent to your email" });
    });
  });
});

/* ---------------------- GET USERS (ADMIN) ------------------ */
router.get(
  "/get",
  authenticateToken,
  checkAdmin,
  (_req: Request, res: Response) => {
    const query = `
      SELECT id, name, email, contact_info
      FROM users
      WHERE role = 'Donor'
    `;

    connection.query(query, (err, results) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(results);
    });
  }
);

/* ------------------------- UPDATE ROLE ---------------------- */
router.patch(
  "/update",
  authenticateToken,
  checkAdmin,
  (req: Request, res: Response) => {
    const user = req.body;

    const query = `
      UPDATE users SET role = ? WHERE id = ?
    `;

    connection.query(query, [user.role, user.id], (err, results: any) => {
      if (err) return res.status(500).json(err);

      if (!results.affectedRows) {
        return res.status(404).json({ message: "User id does not exist" });
      }

      return res.status(200).json({ message: "User updated successfully" });
    });
  }
);

/* ----------------------- TOKEN CHECK ------------------------ */
router.get("/checkToken", authenticateToken, (_req, res) => {
  return res.status(200).json({ valid: true });
});

/* ---------------------- CHANGE PASSWORD --------------------- */
router.post(
  "/changePassword",
  authenticateToken,
  (req: RequestWithUser, res: Response) => {
    const body = req.body;
    const email = req.user!.email;

    const query = `
      SELECT password FROM users
      WHERE email = ? AND password = ?
    `;

    connection.query(query, [email, body.oldPassword], (err, results: any[]) => {
      if (err) return res.status(500).json(err);

      if (!results.length) {
        return res.status(400).json({ message: "Incorrect old password" });
      }

      const update = `
        UPDATE users SET password = ?
        WHERE email = ?
      `;

      connection.query(update, [body.newPassword, email], err2 => {
        if (err2) return res.status(500).json(err2);

        return res.status(200).json({
          message: "Password updated successfully"
        });
      });
    });
  }
);

export default router;
