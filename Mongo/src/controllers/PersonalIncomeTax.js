const personalIncomeTax = require('../models/PersonalIncomeTax');

class Controller {
    async List() {
        try {
            let data = await personalIncomeTax.find({});
            return data;
        } catch (err) {
            return err;
        }
    }
}

module.exports = new Controller;