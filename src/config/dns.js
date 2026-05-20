const dns = require("dns");

const configureDns = () => {
  const configuredServers = (process.env.NODE_DNS_SERVERS || "")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  const fallbackServers =
    process.env.NODE_ENV === "production"
      ? configuredServers
      : configuredServers.length > 0
        ? configuredServers
        : ["8.8.8.8", "1.1.1.1"];

  if (fallbackServers.length > 0) {
    dns.setServers(fallbackServers);
  }

  dns.setDefaultResultOrder("ipv4first");
};

module.exports = configureDns;
