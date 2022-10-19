export async function loadEvent(req, eventId) {
  const query = req.datastore.createQuery(req.types.event)
    .select('__key__')
    .filter('__key__', req.datastore.key([req.types.event, eventId]))

  return (await req.datastore.runQuery(query))[0][0]
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
