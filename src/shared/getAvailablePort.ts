const portfinder = require('portfinder')

export default async function getAvailablePort () {
  portfinder.basePort = 8000
  portfinder.highestPort = portfinder.basePort + 1000

  return portfinder.getPortPromise()
}
