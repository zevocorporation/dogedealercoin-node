const fetch = require("node-fetch");

const Web3 = require("web3");
const { abi, address, startBlock } = require("./constants.js");
const { unatomic } = require("./utils.js");
//const address = "0xccCa79107205433e743B0FCdcA8206171E07f059";

const web3 = new Web3(
  new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org/")
);

const DogeDealer = new web3.eth.Contract(abi, address);

const topic0 = DogeDealer.events.ReferralRewards().arguments[0].topics[0];

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

async function rewardLogging(_from) {
  const from = _from;
  const to = "latest";
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
      user: "null",
      leader: web3.eth.abi.decodeParameter("address", reward.topics[1]),
      earn: Number(
        unatomic(web3.eth.abi.decodeParameter("uint256", reward.topics[2]), 9)
      ),
    };

    rewardLog.push(log);
  }

  return rewardLog;
}

async function getAllTimeRewards() {
  const fromBlock = "earliest";

  const alltimeRewards = await rewardLogging(fromBlock);

  return alltimeRewards;
}

async function referrals(_address) {
  const from = "earliest";
  const to = "latest";
  const topic0 = DogeDealer.events.ReferredBy().arguments[0].topics[0];
  const topic2 = web3.eth.abi.encodeParameter("address", _address);
  const response = await fetch(
    "https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=" +
      from +
      "&toBlock=" +
      to +
      "&address=" +
      address +
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

async function getDailyrewards() {
  const from = "earliest";
  const to = "latest";
  const currentIteration = await DogeDealer.methods.getIterations().call();
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
    const data = web3.eth.abi.decodeParameters(
      ["address", "uint256", "uint256", "uint256", "uint256"],
      reward.data
    );

    const dailyIteration = data[1];

    if (dailyIteration === currentIteration[1]) {
      const log = {
        user: "null",
        leader: web3.eth.abi.decodeParameter("address", reward.topics[1]),
        earn: Number(
          unatomic(web3.eth.abi.decodeParameter("uint256", reward.topics[2]), 9)
        ),
      };

      rewardLog.push(log);
    }
  }

  console.log(rewardLog);

  return rewardLog;
}

async function getWeeklyrewards() {
  const from = "earliest";
  const to = "latest";
  const currentIteration = await DogeDealer.methods.getIterations().call();
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
    const data = web3.eth.abi.decodeParameters(
      ["address", "uint256", "uint256", "uint256", "uint256"],
      reward.data
    );

    const dailyIteration = data[2];

    if (dailyIteration === currentIteration[2]) {
      const log = {
        user: data[0],
        leader: web3.eth.abi.decodeParameter("address", reward.topics[1]),
        earn: Number(
          unatomic(web3.eth.abi.decodeParameter("uint256", reward.topics[2]), 9)
        ),
      };

      rewardLog.push(log);
    }
  }

  console.log(rewardLog);

  return rewardLog;
}

async function getMonthlyrewards() {
  const from = "earliest";
  const to = "latest";
  const currentIteration = await DogeDealer.methods.getIterations().call();
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
    const data = web3.eth.abi.decodeParameters(
      ["address", "uint256", "uint256", "uint256", "uint256"],
      reward.data
    );

    const dailyIteration = data[3];

    if (dailyIteration === currentIteration[3]) {
      const log = {
        user: data[0],
        leader: web3.eth.abi.decodeParameter("address", reward.topics[1]),
        earn: Number(
          unatomic(web3.eth.abi.decodeParameter("uint256", reward.topics[2]), 9)
        ),
      };

      rewardLog.push(log);
    }
  }

  console.log(rewardLog);

  return rewardLog;
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

module.exports = {
  getDailyrewards,
  getWeeklyrewards,
  getMonthlyrewards,
  getAllTimeRewards,
  referrals,
};
