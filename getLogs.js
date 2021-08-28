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

//console.log(topic0);

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
    const data = web3.eth.abi.decodeParameters(
      ["address", "uint256", "uint256", "uint256", "uint256"],
      reward.data
    );
    //console.log(data);

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
  const currentIteration = await DogeDealer.methods.getIterations().call();
  const from = 0;
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

  let MonthlyReferral = 0;
  let WeeklyReferral = 0;
  let DailyReferral = 0;

  for (let logs of result) {
    const logData = web3.eth.abi.decodeParameters(
      ["uint256", "uint256", "uint256"],
      logs.data
    );

    if (currentIteration[1] === logData[0]) {
      DailyReferral++;
    }
    if (currentIteration[2] === logData[1]) {
      WeeklyReferral++;
    }
    if (currentIteration[3] === logData[2]) {
      MonthlyReferral++;
    }
  }
  //console.log(DailyReferral, WeeklyReferral, MonthlyReferral);
  return { DailyReferral, WeeklyReferral, MonthlyReferral };
}

async function getDailyrewards() {
  const from = await getStartBlock("Daily");
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
    //console.log("daily", data);

    // console.log(
    //   "Daily current:",
    //   currentIteration[1],
    //   "Daily log:",
    //   dailyIteration
    // );

    if (currentIteration[1] === dailyIteration) {
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

  //console.log(rewardLog);

  return rewardLog;
}

async function getWeeklyrewards() {
  const from = await getStartBlock("Weekly");
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

    const weeklyIteration = data[2];

    // console.log(
    //   "weekly current:",
    //   currentIteration[2],
    //   "weekly log:",
    //   weeklyIteration
    // );

    if (weeklyIteration === currentIteration[2]) {
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

  // console.log(rewardLog);

  return rewardLog;
}

async function getMonthlyrewards() {
  const from = await getStartBlock("Monthly");
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

    const monthlyIteration = data[3];
    // console.log(
    //   "monthly current:",
    //   currentIteration[3],

    //   "monthly log:",
    //   monthlyIteration
    // );

    if (monthlyIteration === currentIteration[3]) {
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

  //console.log(rewardLog);

  return rewardLog;
}
async function getStartBlock(condition) {
  const from = "0";
  const to = "latest";
  const topic0 =
    DogeDealer.events.LeaderboardCompletion().arguments[0].topics[0];
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

  const logs = data.result;
  //console.log(logs);

  let x = 0;

  let y = 0;

  for (let log of logs) {
    const index = web3.utils.hexToNumber(log.timeStamp);

    if (index > x) {
      x = index;
      y = web3.utils.hexToNumber(log.blockNumber);
    }
  }

  const originBlock = await web3.eth.getBlock(startBlock).then((res) => {
    return res.number;
  });

  const currentBlock = await web3.eth.getBlockNumber();

  if (condition === "Daily") {
    const z = y - originBlock;
    const start = z + originBlock;
    //console.log(originBlock);

    return start;
  }

  if (condition === "Weekly") {
    const a = Math.round(y - Number(608400 / 3));
    return a;
  }

  if (condition === "Monthly") {
    const a = Math.round(y - Number(2592000 / 3));
    return a;
  }

  //console.log("startBlock", y - startTimestamp + startTimestamp);
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
