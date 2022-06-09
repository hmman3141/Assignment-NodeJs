const {Model} = require('objection')

class PersonalIncomeTax extends Model {
    static get tableName() {
        return 'PersonalIncomeTax'
    }
}

module.exports = PersonalIncomeTax