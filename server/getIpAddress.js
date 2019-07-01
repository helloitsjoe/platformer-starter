const os = require('os');

function getIpAddress() {
  const ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach(iface => {
    const ip = ifaces[iface].find(config => config.address.match(/192\.168/));
    if (ip) {
      return ip.address;
    }
    return null;
  });
}

module.exports = getIpAddress;
