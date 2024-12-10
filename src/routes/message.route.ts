// @ts-nocheck

import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller";

const messageRoutes = express.Router();

messageRoutes.get("/:id", getMessages);
messageRoutes.post("/send/:id", sendMessage);

export default messageRoutes;
