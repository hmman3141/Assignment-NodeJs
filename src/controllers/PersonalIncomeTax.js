const PersonalIncomeTax = require('../models/PersonalIncomeTax');

class Controller {
    async List() {
        try{
            const personalIncomeTax = await PersonalIncomeTax.query();
            return personalIncomeTax;
        }catch(err){
            console.log(err);
        }
    }
}

module.exports = new Controller;