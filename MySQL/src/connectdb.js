const { Model } = require('objection');
const { host, port, user, password, dbName } = require('../settings')

var conn = {
    host: host,
    port: port,
    user: user,
    password: password,
}

var knex = require('knex')({
    client: 'mysql',
    connection: conn
});

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        knex.raw('CREATE DATABASE IF NOT EXISTS ' + dbName).then(() => {
            knex.destroy();
            conn.database = dbName;
            knex = require('knex')({
                client: 'mysql',
                connection: conn
            })

            knex.schema.createTableIfNotExists('PersonalIncomeTax', (table) => {
                table.increments('id').primary();
                table.integer('tax').notNullable();
                table.integer('min').notNullable();
                table.integer('max').notNullable();
            }).then(() => {
                Model.knex(knex);
                const PersonalIncomeTax = require('./controllers/PersonalIncomeTax');
                (async () => {
                    const value = await PersonalIncomeTax.List();
                    if (value.length === 0) {
                        knex('PersonalIncomeTax').insert([
                            { tax: 5, min: 0, max: 5 },
                            { tax: 10, min: 5, max: 10 },
                            { tax: 15, min: 10, max: 18 },
                            { tax: 20, min: 18, max: 32 },
                            { tax: 25, min: 32, max: 52 },
                            { tax: 30, min: 52, max: 80 },
                            { tax: 35, min: 80, max: 100 }
                        ]).then(() => { ; });
                    }
                })();
            })

            knex.schema.createTableIfNotExists('InsuranceTax', (table) => {
                table.increments('id').primary();
                table.string('name').notNullable();
                table.float('tax').notNullable();
            }).then(() => {
                Model.knex(knex);

                const InsuranceTax = require('./controllers/InsuranceTax');
                (async () => {
                    const value = await InsuranceTax.List();
                    if (value.length === 0) {
                        knex('InsuranceTax').insert([
                            { name: 'Social insurance', tax: 8 },
                            { name: 'Health insurance', tax: 1.5 },
                            { name: 'Unemployment insurance', tax: 1 }
                        ]).then(() => { ; });
                    }
                })();
            })
        });
    }
}

module.exports = { Database }