import Web3 from "web3";
import { address } from "./constants.js";
import fetch from "node-fetch";

const ApiKey = "JQSF8SQYBX7J4BZZUJXD2AE7ASJ3IHW8FY";

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://api.bscscan.com/api?apikey=JQSF8SQYBX7J4BZZUJXD2AE7ASJ3IHW8FY"
  )
);

async function referrals(_address) {
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

//console.log(await referrals());
