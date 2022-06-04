const insuranceTax = require('../models/InsuranceTax');

class Controller {
    async List() {
        try {
            let data = await insuranceTax.find({});
            return data;
        } catch (err) {
            return err;
        }
    }
}

module.exports = new Controller;