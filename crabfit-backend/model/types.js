import { Sequelize, DataTypes } from 'sequelize'

// TODO The database should not be created just here (and ideally also not only in-memory)
const sequelize = new Sequelize('sqlite::memory:')

// TODO The properties are certainly not all strings...
export const Event = sequelize.define('Event', {
    name: DataTypes.STRING,
    created: DataTypes.STRING,
    times: DataTypes.STRING,
    timeZone: DataTypes.STRING,
    // TODO Are there more?
})

// TODO The properties are certainly not all strings...
export const Person = sequelize.define('Person', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    eventId: DataTypes.STRING,
    created: DataTypes.STRING,
    availability: DataTypes.STRING,
    // TODO Are there more?
})

// TODO The properties are certainly not all strings...
export const Stats = sequelize.define('Stats', {
    value: DataTypes.STRING,
    // TODO Are there more?
})
