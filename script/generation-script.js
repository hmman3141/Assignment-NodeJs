const create = require('./create-script')
const database = require('./database-script')
const model = require('./model-script')
const seed = require('./seed-script')

module.exports = {
    create: {
        index: create.index,
        settings: create.settings,
        app: create.app
    },
    database: {
        mysql: {
            connectdb: database.mysql.connectdb,
            app: database.mysql.app
        },
        mongo: {
            connectdb: database.mongo.connectdb,
            app: database.mongo.app
        }
    },
    model: {
        mysql: {
            PersonalIncomeTax: {
                model: model.mysql.PersonalIncomeTax.model,
                controller: model.mysql.PersonalIncomeTax.controller
            },
            InsuranceTax: {
                model: model.mysql.InsuranceTax.model,
                controller: model.mysql.InsuranceTax.controller
            }
        },
        mongo: {
            PersonalIncomeTax: {
                model: model.mongo.PersonalIncomeTax.model,
                controller: model.mongo.PersonalIncomeTax.controller
            },
            InsuranceTax: {
                model: model.mongo.InsuranceTax.model,
                controller: model.mongo.InsuranceTax.controller
            }
        },
        app: model.app
    },
    seed: {
        mysql: seed.mysql,
        mongo: seed.mongo
    }
}