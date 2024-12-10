import Express, { NextFunction, Request, Response } from "express";
import indexRoute from "./routes";
import bodyParser from "body-parser";
import { config } from "dotenv";
import prisma from "./client";
import { Business, Investor } from "./types";
import authRoutes from "./routes/auth.route";
import { Server } from "socket.io";
import * as http from "node:http";

config();

const app = Express();
// manually create a server
const server = http.createServer(app);

// create a socket server
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

// TODO: FIX THE TS-IGNORE

// @ts-ignore
export const getReceiverSocketId = (receiverId) => {
// @ts-ignore
  return userSocketMap[receiverId];
}

const userSocketMap = {}; // { userId: socketId }

// connect / disconnect to socket server
io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  const userId = socket.handshake.query.userId;

  // store users in memory ( by using an object in this case )
  // @ts-ignore
  if (userId) userSocketMap[userId] = socket.id;

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});
app.use(Express.json());
app.use(bodyParser.json());
app.use(indexRoute);
app.use(authRoutes);
/* Error Handler */
app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(501).json({
    status: false,
    message: "An error occurred",
    error,
  });
});
//routes before authentication
// @ts-ignore
// POST /register: Register a business or investor
// app.post("/register", async (req: Request, res: Response) => {
//   const { type, data }: { type: string; data: Business | Investor } = req.body;
//
//   try {
//     if (type === "business") {
//       const business = await prisma.business.create({ data: data as Business });
//       return res.status(201).json({ message: "Business registered", business });
//     } else if (type === "investor") {
//       const investor = await prisma.investor.create({ data: data as Investor });
//       return res.status(201).json({ message: "Investor registered", investor });
//     } else {
//       return res
//         .status(400)
//         .json({ message: "Invalid type. Use 'business' or 'investor'." });
//     }
//   } catch (error: any) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });
//
// // GET /match: Retrieve matching profiles
// // @ts-ignore
// app.get("/match", async (req: Request, res: Response) => {
//   const { location, minInvestment, maxInvestment } = req.query;
//
//   if (!location || !minInvestment || !maxInvestment) {
//     return res.status(400).json({ message: "Missing query parameters" });
//   }
//
//   try {
//     const businesses = await prisma.business.findMany({
//       where: {
//         location: location as string,
//         requiredInvestment: {
//           gte: parseInt(minInvestment as string),
//           lte: parseInt(maxInvestment as string),
//         },
//       },
//     });
//
//     const investors = await prisma.investor.findMany({
//       where: {
//         location: location as string,
//         AND: [
//           {
//             investmentRange: {
//               // @ts-ignore
//               min: {
//                 lte: parseFloat(maxInvestment as string), // Investor's min should be <= maxInvestment
//               },
//             },
//           },
//           {
//             investmentRange: {
//               // @ts-ignore
//               max: {
//                 gte: parseInt(minInvestment as string), // Investor's max should be >= minInvestment
//               },
//             },
//           },
//         ],
//       },
//     });
//
//     res.status(200).json({ businesses, investors });
//   } catch (error: any) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`server is running on ${port}`);
});
