import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

import { contract } from "./contract.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://18.219.63.230:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const CONNECTION_URL =
  "mongodb+srv://bscgamble:targetFIXED08@@cluster0.77pbx.mongodb.net/Dogedealer?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

contract();

const connect = mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log(`mongodb connected`))
  .catch((error) => console.log(`${error} did not connect`));

server.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
