module.exports = {
    mysql: {
        connectdb: `const { Model } = require('objection');
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
        });
    }
}

module.exports = { Database }`,
        app: `const { Database } = require('./src/connectdb.js')
new Database();

const { Model } = require('objection');
const { host, port, user, password, dbName } = require('./settings')
var conn = {
    host: host,
    port: port,
    user: user,
    password: password,
    database: dbName
}
const db = require('knex')({
    client: 'mysql',
    connection: conn
})
Model.knex(db);

const app = express();`
    },
    mongo: {
        connectdb: `const mongoose = require('mongoose')
const {url, dbName} = require('../settings')

class Database {
    constructor(){
        this._connect();
    }

    _connect(){
        mongoose.connect(url + dbName)
        .then(() => {
            console.log('Database connection successful')
        })
        .catch(err => {
            console.error('Database connection error')
        })
    }
}

module.exports = {Database}`,
        app: `const { Database } = require('./src/connectdb.js')\nnew Database();\n\nconst app = express();`
    }
}