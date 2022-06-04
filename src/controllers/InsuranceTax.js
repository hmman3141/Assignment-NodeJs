const InsuranceTax = require('../models/InsuranceTax');

class Controller {
    async List() {
        try{
            const insuranceTax = await InsuranceTax.query();
            return insuranceTax;
        }catch(err){
            console.log(err);
        }
    }
}

module.exports = new Controller;