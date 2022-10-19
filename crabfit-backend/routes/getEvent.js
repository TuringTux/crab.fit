import dayjs from 'dayjs'
import { loadEvent } from '../model/methods'

const getEvent = async (req, res) => {
  const { eventId } = req.params

  try {
    const event = await loadEvent(req, eventId)

    if (event) {
      res.send({
        id: eventId,
        ...event,
      })

      // Update last visited time
      await req.datastore.upsert({
        ...event,
        visited: dayjs().unix()
      })
    } else {
      res.status(404).send({ error: 'Event not found' })
    }
  } catch (e) {
    console.error(e)
    res.status(404).send({ error: 'Event not found' })
  }
}

export default getEvent
