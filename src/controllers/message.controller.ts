// @ts-nocheck

import { PrismaClient } from "@prisma/client";
import { getReceiverSocketId, io } from "../app";

const prisma = new PrismaClient();

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    // if chat already exists
    let chat = await prisma.chat.findFirst({
      where: {
        AND: [{ senderId: senderId }, { receiverId: receiverId }],
      },
    });

    // if chat does not exist -- create new one
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          senderId: senderId,
          receiverId: receiverId,
          message: "",
          timestamp: new Date(),
        },
      });
    }

    // create new message
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        body: message,
        chatId: chat.id,
      },
    });

    // add message to the chat's messages array
    if (newMessage) {
      chat = await prisma.chat.update({
        where: { id: chat.id },
        data: {
          Message: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });
    }

    // Socket implementation
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user.id;

    // get all messages for this chat
    const chat = await prisma.chat.findFirst({
      where: {
        AND: [{ senderId: senderId }, { receiverId: receiverId }],
      },
      include: {
        Message: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) return res.status(200).json([]);

    res.status(200).json(chat.Message);
  } catch (error) {
    console.log("Error in getMessages controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
