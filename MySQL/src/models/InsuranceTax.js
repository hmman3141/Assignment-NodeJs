const {Model} = require('objection')

class InsuranceTax extends Model {
    static get tableName() {
        return 'InsuranceTax'
    }
}

module.exports = InsuranceTax