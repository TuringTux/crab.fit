import dayjs from 'dayjs'
import bcrypt from 'bcrypt'

import { loadEvent, loadPerson, loadStats, storePerson, storeStats } from '../model/methods'

const createPerson = async (req, res) => {
  const { eventId } = req.params
  const { person } = req.body

  try {
    const event = await loadEvent(req, eventId)
    const personResult = await loadPerson(req, eventId, person.name)

    if (event) {
      if (person && personResult === undefined) {
        const currentTime = dayjs().unix()

        // If password
        let hash = null
        if (person.password) {
          hash = await bcrypt.hash(person.password, 10)
        }

        await storePerson(req, person, hash, eventId, currentTime)

        res.status(201).send({ success: 'Created' })

        // Update stats
        const personCountResult = await loadStats(req, 'personCount')
        if (personCountResult) {
          await req.datastore.upsert({
            ...personCountResult,
            value: personCountResult.value + 1,
          })
        } else {
          await storeStats(req, 'personCount', 1)
        }
      } else {
        res.status(400).send({ error: 'Unable to create person' })
      }
    } else {
      res.status(404).send({ error: 'Event does not exist' })
    }
  } catch (e) {
    console.error(e)
    res.status(400).send({ error: 'An error occurred while creating the person' })
  }
}

export default createPerson
