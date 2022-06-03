module.exports = {
    mysql: {
        PersonalIncomeTax: {
            model: `const {Model} = require('objection')

class PersonalIncomeTax extends Model {
    static get tableName() {
        return 'PersonalIncomeTax'
    }
}

module.exports = PersonalIncomeTax`,

            controller: `const PersonalIncomeTax = require('../models/PersonalIncomeTax');

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

module.exports = new Controller;`
        },

        InsuranceTax: {
            model: `const {Model} = require('objection')

class InsuranceTax extends Model {
    static get tableName() {
        return 'InsuranceTax'
    }
}

module.exports = InsuranceTax`,

            controller: `const InsuranceTax = require('../models/InsuranceTax');

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

module.exports = new Controller;`
        }
    },

    mongo: {
        PersonalIncomeTax:{
            model: `const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    tax: {
        type: Number,
    },
    min: {
        type: Number,
    },
    max: {
        type: Number,
    }
}, {
    collection: "PersonalIncomeTax",
});

module.exports = mongoose.model("PersonalIncomeTaxs", schema);`,

            controller: `const personalIncomeTax = require('../models/PersonalIncomeTax');

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

module.exports = new Controller;`
        },

        InsuranceTax:{
            model: `const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name: {
        type: String,
    },
    tax: {
        type: Number,
    }
}, {
    collection: "InsuranceTax",
});

module.exports = mongoose.model("InsuranceTax", schema);`,

            controller: `const insuranceTax = require('../models/InsuranceTax');

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

module.exports = new Controller;`
        }
    },

    app: `app.post('/', async (request, response) => {
    let gross, socialInsurance, healthInsurance, unemploymentInsurance, tax, net;

    let insuranceController = require('./src/controllers/InsuranceTax');
    let personalIncomeController = require('./src/controllers/PersonalIncomeTax');

    gross = parseInt(request.body.gross);
    var area = parseInt(request.body.area),
        dependents = request.body.dependents || 0,
        unemploymentTaxMax = [884000, 784000, 686000, 614000],
        socialTaxMax = 2384000,
        healthTaxMax = 447000,
        PersonalIncomeTaxDeduction = 11000000,
        FamilyDeduction = 4400000;

    net = parseInt(gross);

    const insurances = await insuranceController.List();
    insurances.forEach((item) => {
        switch (item.name) {
            case 'Social insurance': {
                socialInsurance = gross * item.tax / 100;
                if (socialInsurance > socialTaxMax)
                    socialInsurance = socialTaxMax;
                break;
            }
            case 'Health insurance': {
                healthInsurance = gross * item.tax / 100;
                if (healthInsurance > healthTaxMax)
                    healthInsurance = healthTaxMax
                break;
            }
            case 'Unemployment insurance': {
                unemploymentInsurance = gross * item.tax / 100;
                if (unemploymentInsurance > unemploymentTaxMax[area - 1])
                    unemploymentInsurance = unemploymentTaxMax[area - 1];
                break;
            }
        }
    })

    net = net - (socialInsurance + healthInsurance + unemploymentInsurance);

    tax = 0;

    const personalIncomes = await personalIncomeController.List();
    const personalIncomes_sort = personalIncomes.sort((a, b) => a.tax - b.tax)
    var remain = net - PersonalIncomeTaxDeduction - FamilyDeduction * dependents;
    var personalTaxMax = 0;
    personalIncomes_sort.forEach((item) => {
        if (remain > 0) {
            if (remain <= (parseInt(item.max) - parseInt(item.min)) * 1000000) {
                tax += remain * parseInt(item.tax) / 100;
            } else {
                tax += (parseInt(item.max) - parseInt(item.min)) * 1000000 * parseInt(item.tax) / 100
            }
            remain -= (parseInt(item.max) - parseInt(item.min)) * 1000000;
            personalTaxMax = parseInt(item.tax);
        }
    })

    if (remain > 0) {
        tax += remain * personalTaxMax / 100;
    }

    net -= tax;

    response.render('index', { gross, socialInsurance, healthInsurance, unemploymentInsurance, tax, net });
})`
}