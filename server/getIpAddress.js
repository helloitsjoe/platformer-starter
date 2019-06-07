const os = require('os');

function getIpAddress() {
  const ifaces = os.networkInterfaces();
  for (let iface in ifaces) {
    const ip = ifaces[iface].find(config => config.address.match(/192\.168/));
    if (ip) {
      return ip.address;
    }
  }
}

module.exports = getIpAddress;
