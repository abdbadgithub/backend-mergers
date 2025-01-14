import { Request, Response } from "express";
import prisma from "../client";

// Creating a user
export async function createUser(req: Request, res: Response) {
    try {
        const user = await prisma.user.create({
            data: req.body,
        });

        res.status(201).json({
            status: true,
            message: "User Successfully Created",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'server error'
        });
    }
}
export async function getUsers(req: Request, res: Response) {
    const users = await prisma.user.findMany();
    res.json({
        status: true,
        message: "Users Successfully fetched",
        data: users,
    });
}
export async function getUser(req: Request, res: Response) {
    const { userid } = req.params;
    const user = await prisma.user.findFirst({
        where: {
            id: userid,
        },
    });
    res.json({
        status: true,
        message: "User Successfully fetched",
        data: user,
    });
}
// updating a single user
export async function updateUser(req: Request, res: Response) {
    try {
        const { userid } = req.params;

        const user = await prisma.user.findFirst({
            where: {
                id: userid,
            },
        });

        if (!user) {
            return res.status(401).json({
                status: false,
                message: 'User not found',
            });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userid,
            },
            data: req.body,
        });

        res.json({
            status: true,
            message: 'User Successfully updated',
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'server error',
        });
    }
}