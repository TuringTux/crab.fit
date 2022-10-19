import { loadStats } from '../model/methods'
import packageJson from '../package.json'

const stats = async (req, res) => {
  let eventCount = null
  let personCount = null

  try {
    const eventResult = await loadStats(req, 'eventCount')
    const personResult = await loadStats(req, 'personCount')

    if (eventResult) {
      eventCount = eventResult.value
    }
    if (personResult) {
      personCount = personResult.value
    }

  } catch (e) {
    console.error(e)
  }

  res.send({
    eventCount,
    personCount,
    version: packageJson.version,
  })
}

export default stats
