const TYPES = {
  event: process.env.NODE_ENV === 'production' ? 'Event' : 'DevEvent',
  person: process.env.NODE_ENV === 'production' ? 'Person' : 'DevPerson',
  stats: process.env.NODE_ENV === 'production' ? 'Stats' : 'DevStats',
}

export async function findEvent(req, eventId) {
  const query = req.datastore.createQuery(TYPES.event)
    .select('__key__')
    .filter('__key__', req.datastore.key([TYPES.event, eventId]))

  return (await req.datastore.runQuery(query))[0][0]
}

export async function findOldPeople(req, threeMonthsAgo) {
  const peopleQuery = req.datastore.createQuery(TYPES.person).filter('created', '<', threeMonthsAgo)
  const oldPeople = (await req.datastore.runQuery(peopleQuery))[0]
  return oldPeople
}

export async function findOldEvents(req, threeMonthsAgo) {
  const eventQuery = req.datastore.createQuery(TYPES.event).filter('visited', '<', threeMonthsAgo)
  const oldEvents = (await req.datastore.runQuery(eventQuery))[0]
  return oldEvents
}

export async function findPeopleOfEvent(req, eventId) {
  const query = req.datastore.createQuery(TYPES.person).filter('eventId', eventId)
  let people = (await req.datastore.runQuery(query))[0]
  return people
}

export async function loadEvent(req, eventId) {
  return (await req.datastore.get(req.datastore.key([TYPES.event, eventId])))[0]
}

export async function loadPerson(req, eventId, personName) {
  const query = req.datastore.createQuery(TYPES.person)
    .filter('eventId', eventId)
    .filter('name', personName)

  return (await req.datastore.runQuery(query))[0][0]
}

export async function loadStats(req, statName) {
  return (await req.datastore.get(req.datastore.key([TYPES.stats, statName])))[0] || null
}

export async function storeEvent(req, eventId, name, currentTime, event) {
  const entity = {
    key: req.datastore.key([TYPES.event, eventId]),
    data: {
      name: name,
      created: currentTime,
      times: event.times,
      timezone: event.timezone,
    },
  }

  await req.datastore.insert(entity)
}

export async function storePerson(req, person, hash, eventId, currentTime) {
  const entity = {
    key: req.datastore.key(TYPES.person),
    data: {
      name: person.name.trim(),
      password: hash,
      eventId: eventId,
      created: currentTime,
      availability: [],
    },
  }

  await req.datastore.insert(entity)
}

export async function storeStats(req, statName, value) {
  await req.datastore.insert({
    key: req.datastore.key([TYPES.stats, statName]),
    data: { value },
  })
}

export async function upsertEvent(req, entity, visited) {
  await req.datastore.upsert({
    ...entity,
    visited: visited
  })
}

export async function upsertPerson(req, entity, availability) {
  await req.datastore.upsert({
    ...entity,
    availability: availability
  })
}

export async function upsertStats(req, entity, value) {
  await req.datastore.upsert({
    ...entity,
    value: value,
  })
}

export async function deleteEvents(req, events) {
  await req.datastore.delete(events.map(event => event[req.datastore.KEY]))
}

export async function deletePeople(req, people) {
  await req.datastore.delete(people.map(person => person[req.datastore.KEY]))
}

export async function deletePerson(req, person) {
  await req.datastore.delete(person[req.datastore.KEY])
}

export function getEventIds(req, events) {
  return events.map(e => e[req.datastore.KEY].name)
}
