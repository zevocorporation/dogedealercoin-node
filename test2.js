import Web3 from "web3";
import { abi } from "./constants.js";
const address = "0xccCa79107205433e743B0FCdcA8206171E07f059";

const web3 = new Web3(
  new Web3.providers.WebsocketProvider("wss://bsc-ws-node.nariox.org:443")
);

const DogeDealer = new web3.eth.Contract(abi, address);

const { daily, weekly, monthly } = await DogeDealer.methods
  .getReferralLeaderboardTimers()
  .call()
  .then((res) => {
    return { daily: res[0], weekly: res[1], monthly: res[2] };
  });

console.log(daily, weekly, monthly);
