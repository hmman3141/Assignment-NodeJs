const mongoose = require('mongoose')
const PersonalIncomeTax = require('./models/PersonalIncomeTax')
const InsuranceTax = require('./models/InsuranceTax')
const { url, dbName } = require('../settings')

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(url + dbName)
            .then(() => {
                console.log('Database connection successful');
            }).then(() => {
                (async () => {
                    const personalIncomeTaxs = await PersonalIncomeTax.find({});
                    if (personalIncomeTaxs.length === 0) {
                        const documents = [
                            { tax: 5, min: 0, max: 5 },
                            { tax: 10, min: 5, max: 10 },
                            { tax: 15, min: 10, max: 18 },
                            { tax: 20, min: 18, max: 32 },
                            { tax: 25, min: 32, max: 52 },
                            { tax: 30, min: 52, max: 80 },
                            { tax: 35, min: 80, max: 100 }
                        ]

                        PersonalIncomeTax.collection.insertMany(documents).then(doc => {
                            console.log(doc)
                        })
                            .catch(err => {
                                console.error(err)
                            });
                    }
                })();
            }).then(() => {
                (async () => {
                    const insuranceTaxs = await InsuranceTax.find({});
                    if (insuranceTaxs.length === 0) {
                        const documents = [
                            { name: 'Social insurance', tax: 8 },
                            { name: 'Health insurance', tax: 1.5 },
                            { name: 'Unemployment insurance', tax: 1 }
                        ]

                        InsuranceTax.collection.insertMany(documents).then(doc => {
                            console.log(doc)
                        })
                            .catch(err => {
                                console.error(err)
                            });
                    }
                })();
            })
            .catch(err => {
                console.error('Database connection error')
            })
    }
}

module.exports = { Database }