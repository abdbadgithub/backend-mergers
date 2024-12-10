import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../client";

const SECRET_KEY = process.env.SECRET_KEY || "default_secret";

// Register a Business or Investor
export const register = async (req: Request, res: Response) => {
    const { type, data }: { type: "business" | "investor"; data: any } = req.body;

    try {
        if (type === "business") {
            const business = await prisma.business.create({ data });
            return res.status(201).json({ message: "Business registered", business });
        } else if (type === "investor") {
            const investor = await prisma.investor.create({ data });
            return res.status(201).json({ message: "Investor registered", investor });
        } else {
            return res.status(400).json({ message: "Invalid type. Use 'business' or 'investor'." });
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// Login a Business or Investor
export const login = async (req: Request, res: Response) => {
    const { type, name }: { type: "business" | "investor"; name: string } = req.body;

    try {
        let user;
        if (type === "business") {
            user = await prisma.business.findUnique({ where: { name } });
        } else if (type === "investor") {
            // @ts-ignore
            user = await prisma.investor.findUnique({ where: { name } });
        } else {
            return res.status(400).json({ message: "Invalid type. Use 'business' or 'investor'." });
        }

        if (!user) {
            return res.status(404).json({ message: `${type} not found.` });
        }

        const token = jwt.sign({ id: user.id, type }, SECRET_KEY, { expiresIn: "1h" });
        res.status(200).json({ token, user });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

// Protected Route
export const protectedRoute = async (req: Request, res: Response) => {
    const { id, type } = req.body;

    try {
        let user;
        if (type === "business") {
            user = await prisma.business.findUnique({ where: { id } });
        } else if (type === "investor") {
            user = await prisma.investor.findUnique({ where: { id } });
        }

        if (!user) {
            return res.status(404).json({ message: `${type} not found.` });
        }

        res.status(200).json({ message: `Welcome ${user.name}`, user });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Error accessing protected route", error: error.message });
    }
};
