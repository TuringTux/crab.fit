import { Keyv } from 'keyv'

const isProduction = process.env.NODE_ENV === 'production'

const events = new Keyv({namespace: isProduction ? 'Event' : 'DevEvent' })
const people = new Keyv({namespace: isProduction ? 'Person' : 'DevPerson' })
const stats = new Keyv({namespace: isProduction ? 'Stat' : 'DevStats'})

export async function findOldPeople(threeMonthsAgo) { // TODO Migrate to keyv
  const peopleQuery = datastore.createQuery(TYPES.person).filter('created', '<', threeMonthsAgo)
  const oldPeople = (await datastore.runQuery(peopleQuery))[0]
  return oldPeople
}

export async function findOldEvents(threeMonthsAgo) { // TODO Migrate to keyv
  const eventQuery = datastore.createQuery(TYPES.event).filter('visited', '<', threeMonthsAgo)
  const oldEvents = (await datastore.runQuery(eventQuery))[0]
  return oldEvents
}

export async function findPeopleOfEvent(eventId) { // TODO Migrate to keyv
  const query = datastore.createQuery(TYPES.person).filter('eventId', eventId)
  let people = (await datastore.runQuery(query))[0]
  return people
}

export async function loadEvent(eventId) {
  return await events.get(eventId)
}

export async function loadPerson(eventId, personName) { // TODO Migrate to keyv
  const query = datastore.createQuery(TYPES.person)
    .filter('eventId', eventId)
    .filter('name', personName)

  return (await datastore.runQuery(query))[0][0]
}

export async function loadStats(statName) {
  return await stats.get(statName) || null
}

export async function storeEvent(eventId, name, currentTime, event) {
  await events.set(eventId, {
    id: eventId,
    name: name,
    created: currentTime,
    times: event.times,
    timezone: event.timezone,
  })
}

export async function storePerson(person, hash, eventId, currentTime) { // TODO Migrate to keyv
  const entity = {
    key: datastore.key(TYPES.person),
    data: {
      name: person.name.trim(),
      password: hash,
      eventId: eventId,
      created: currentTime,
      availability: [],
    },
  }

  await datastore.insert(entity)
}

export async function storeStats(statName, value) {
  await stats.set(statName, {
    id: statName,
    value
  })
}

export async function upsertEvent(event, visited) {
  await events.set(event.id, {
    ...event,
    visited
  })
}

export async function upsertPerson(entity, availability) { // TODO Migrate to keyv
  await datastore.upsert({
    ...entity,
    availability: availability
  })
}

export async function upsertStats(stat, value) {
  await stats.upsert(stat.id, {
    ...stat,
    value: value,
  })
}

export async function deleteEvents(events) { // TODO Migrate to keyv
  await datastore.delete(events.map(event => event[datastore.KEY]))
}

export async function deletePeople(people) { // TODO Migrate to keyv
  await datastore.delete(people.map(person => person[datastore.KEY]))
}

export async function deletePerson(person) { // TODO Migrate to keyv
  await datastore.delete(person[datastore.KEY])
}

export function getEventIds(es) {
  return es.map(e => e.id)
}
