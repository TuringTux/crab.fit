export async function findEvent(req, eventId) {
  const query = req.datastore.createQuery(req.types.event)
    .select('__key__')
    .filter('__key__', req.datastore.key([req.types.event, eventId]))

  return (await req.datastore.runQuery(query))[0][0]
}

export async function findOldPeople(req, threeMonthsAgo) {
  const peopleQuery = req.datastore.createQuery(req.types.person).filter('created', '<', threeMonthsAgo)
  const oldPeople = (await req.datastore.runQuery(peopleQuery))[0]
  return oldPeople
}

export async function findOldEvents(req, threeMonthsAgo) {
  const eventQuery = req.datastore.createQuery(req.types.event).filter('visited', '<', threeMonthsAgo)
  const oldEvents = (await req.datastore.runQuery(eventQuery))[0]
  return oldEvents
}

export async function findPeopleOfEvent(req, eventId) {
  const query = req.datastore.createQuery(req.types.person).filter('eventId', eventId)
  let people = (await req.datastore.runQuery(query))[0]
  return people
}

export async function loadEvent(req, eventId) {
  return (await req.datastore.get(req.datastore.key([req.types.event, eventId])))[0]
}

export async function loadPerson(req, eventId, personName) {
  const query = req.datastore.createQuery(req.types.person)
    .filter('eventId', eventId)
    .filter('name', personName)

  return (await req.datastore.runQuery(query))[0][0]
}

export async function loadStats(req, statName) {
  return (await req.datastore.get(req.datastore.key([req.types.stats, statName])))[0] || null
}

export async function storeEvent(req, eventId, name, currentTime, event) {
  const entity = {
    key: req.datastore.key([req.types.event, eventId]),
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
    key: req.datastore.key(req.types.person),
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
    key: req.datastore.key([req.types.stats, statName]),
    data: { value },
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
