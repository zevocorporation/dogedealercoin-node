import fetch from "node-fetch";

import Web3 from "web3";
import { abi, address } from "./constants.js";
import { unatomic } from "./utils.js";
//const address = "0xccCa79107205433e743B0FCdcA8206171E07f059";

const web3 = new Web3(
  new Web3.providers.WebsocketProvider("wss://bsc-ws-node.nariox.org:443")
);

const DogeDealer = new web3.eth.Contract(abi, address);

const timers = await DogeDealer.methods.getReferralLeaderboardTimers().call();

const { daily, weekly, monthly } = await DogeDealer.methods
  .getReferralLeaderboardTimers()
  .call()
  .then((res) => {
    return { daily: res[0], weekly: res[1], monthly: res[2] };
  });

const topic0 =
  "0x0d8dab0248928a6463de02d7b1b6172d19bca7c74413c43eb9b3197c7a164fd0";

const ApiKey = "JQSF8SQYBX7J4BZZUJXD2AE7ASJ3IHW8FY";

async function blockbytimestamp(timestamp) {
  const response = await fetch(
    "https://api.bscscan.com/api?module=block&action=getblocknobytime&timestamp=" +
      timestamp +
      "&closest=before&apikey=" +
      ApiKey
  );

  const data = await response.json();

  return data.result;
}

async function rewardLogging(_from, _to) {
  const from = _from;
  const to = _to;
  const response = await fetch(
    "https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=" +
      from +
      "&toBlock=" +
      to +
      "&address=" +
      address +
      "&topic0=" +
      topic0 +
      "&apikey=" +
      ApiKey
  );

  const data = await response.json();

  const log = data.result;

  const rewardLog = new Array();

  for (let reward of log) {
    const log = {
      user: web3.eth.abi.decodeParameter("address", reward.topics[1]),
      leader: web3.eth.abi.decodeParameter("address", reward.topics[2]),
      earn: Number(
        unatomic(web3.eth.abi.decodeParameter("uint256", reward.topics[3]), 9)
      ),
    };

    rewardLog.push(log);
  }

  return rewardLog;
}

export async function getDailyrewards() {
  const end = daily + 8600;

  const fromBlock = await blockbytimestamp(daily);
  const endBlock = await blockbytimestamp(end);

  const dailyRewards = await rewardLogging(fromBlock, endBlock);

  return dailyRewards;
}

export async function getWeeklyrewards() {
  const end = weekly + 604800;

  const fromBlock = await blockbytimestamp(weekly);
  const endBlock = await blockbytimestamp(end);

  const weeklyRewards = await rewardLogging(fromBlock, endBlock);

  return weeklyRewards;
}

export async function getMonthlyrewards() {
  const end = monthly + 2629743;

  const fromBlock = await blockbytimestamp(monthly);
  const endBlock = await blockbytimestamp(end);

  const monthlyRewards = await rewardLogging(fromBlock, endBlock);

  return monthlyRewards;
}

export async function getAllTimeRewards() {
  const fromBlock = "earliest";
  const endBlock = "latest";

  const alltimeRewards = await rewardLogging(fromBlock, endBlock);

  return alltimeRewards;
}

export async function referrals(_address) {
  const from = "earliest";
  const to = "latest";
  const topic0 =
    "0x2311833a6b34f4f41fdf892d645b68a6ccfeaec5f489c18070af217102585771";
  const topic2 = web3.eth.abi.encodeParameter("address", _address);
  const response = await fetch(
    "https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=" +
      from +
      "&toBlock=" +
      to +
      "&address=" +
      address[56] +
      "&topic0=" +
      topic0 +
      "&topic0_2_opr=and" +
      "&topic2=" +
      topic2 +
      "&apikey=" +
      ApiKey
  );
  const data = await response.json();
  const result = data.result;

  let totalReferrals = 0;
  for (let res of result) {
    totalReferrals++;
  }

  return totalReferrals;
}

// console.log({
//   DailyRewards: await getDailyrewards(),
//   WeeklyRewards: await getWeeklyrewards(),
//   MontlyRewards: await getMonthlyrewards(),
//   AllTimeRewards: await getAllTimeRewards(),
// });

//array[0] = sender
//array[1] = leader
//array[2] = amount
