import dayjs from 'dayjs'
import bcrypt from 'bcrypt'

import { storePerson } from '../model/methods'

const createPerson = async (req, res) => {
  const { eventId } = req.params
  const { person } = req.body

  try {
    const event = (await req.datastore.get(req.datastore.key([req.types.event, eventId])))[0]
    const query = req.datastore.createQuery(req.types.person)
      .filter('eventId', eventId)
      .filter('name', person.name)
    const personResult = (await req.datastore.runQuery(query))[0][0]

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
        const personCountResult = (await req.datastore.get(req.datastore.key([req.types.stats, 'personCount'])))[0] || null
        if (personCountResult) {
          await req.datastore.upsert({
            ...personCountResult,
            value: personCountResult.value + 1,
          })
        } else {
          await req.datastore.insert({
            key: req.datastore.key([req.types.stats, 'personCount']),
            data: { value: 1 },
          })
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
