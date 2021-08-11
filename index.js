import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Web3 from "web3";
import { URLS, address, abi } from "./constants.js";

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

const chainId = 4;

const DogeDealer = new new Web3(
  new Web3.providers.WebsocketProvider(URLS[chainId])
).eth.Contract(abi, address[chainId]);

// const timers = Promise.resolve(
//   DogeDealer.methods.getReferralLeaderboardTimers().call()
// ); //create a daily,weekly,monthly table using the timers returned

//table structure:
//User
//ReferralList
//ReferralEarnings

//ReferralBy - insert 'by' under refferrer if present or create a new section or table for referrer and store 'by' under refferer

//ReferalRewards - insert the amount under to(referrer) address and user.

DogeDealer.events.ReferredBy({}, (err, res) => {
  if (!err) {
    console.log({
      user: res.returnValues[0], //new user
      referrer: res.returnValues[1], //add user under the referrer //refererlist returns the users stored under referrer
      Daily: res.returnValues[2], //set this value as dailyId and store the result under the DailyId
      Weekly: res.returnValues[3], //set this value as weeklyId and store the result under WeeklyID
      Monthly: res.returnValues[4], //set this value as monthlyId and store the result under MonthlyId
    });
  }
});

DogeDealer.events.ReferralRewards({}, (err, res) => {
  if (!err) {
    console.log({
      user: res.returnValues[0],
      sender: res.returnValues[1],
      amount: res.returnValues[2],
      Daily: res.returnValues[3],
      Weekly: res.returnValues[4],
      Monthly: res.returnValues[5],
    });
  }
});

DogeDealer.events.ReferralRewards().unsubscribe();
DogeDealer.events.ReferredBy().unsubscribe();

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
