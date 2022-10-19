/**
 * A storage-agnostic model of the data types used by the application.
 *
 * These model classes do not care (and should not know) if e.g. datastore or some
 * other database API is used.
 */

class Event {
    name
    created
    times
    timezone
    visited
}

class Person {
    name
    password
    eventId
    created
    availability
}

class Stats {
    value
}
