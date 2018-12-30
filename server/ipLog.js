const os = require('os');

function logIPAddress(port) {
  const ifaces = os.networkInterfaces();
  for (let iface in ifaces) {
    const ip = ifaces[iface].find(config => config.address.match(/192\.168/));
    if (ip) {
      console.log(`To bid on your phone, go to http://${ip.address}:${port}`);
    }
  }
}

module.exports = logIPAddress;
