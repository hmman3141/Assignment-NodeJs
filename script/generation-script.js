const create = require('./create-script')
const database = require('./database-script')
const model = require('./model-script')
const seed = require('./seed-script')

module.exports = {
    create: create,
    database: database,
    model: model,
    seed: seed
}