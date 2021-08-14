import fetch from "node-fetch";
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

const counts = await blockbytimestamp();

console.log(counts);
