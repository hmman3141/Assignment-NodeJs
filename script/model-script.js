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
        PersonalIncomeTax: {
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

        InsuranceTax: {
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
    let gross, tax;

    let grossToNet = require('./src/services/grossToNet')

    gross = parseInt(request.body.gross);
    var area = parseInt(request.body.area),
        dependents = request.body.dependents || 0;

    response.render('index', await grossToNet.toNet(area, gross, dependents));
})`,

    services: `const insuranceController = require('../controllers/InsuranceTax')
const personalIncomeController = require('../controllers/PersonalIncomeTax')

async function insuranceCalculator(area, gross) {
    if (gross == null || area == null || area <= 0 || area >= 5)
        return NaN;

    if (gross <= 0)
        return 0;

    const insurances = await insuranceController.List();
    var unemploymentTaxMax = [884000, 784000, 686000, 614000],
        socialTaxMax = 2384000,
        healthTaxMax = 447000,
        socialInsurance, healthInsurance, unemploymentInsurance;

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

    return { socialInsurance: socialInsurance, healthInsurance: healthInsurance, unemploymentInsurance: unemploymentInsurance };
}

async function personalTax(salaryBeforeTax, dependents) {
    if (dependents < 0 || dependents === null)
        return NaN;

    if (salaryBeforeTax <= 0)
        return 0;

    var PersonalIncomeTaxDeduction = 11000000,
        FamilyDeduction = 4400000;

    const personalIncomes = await personalIncomeController.List();
    const personalIncomes_sort = personalIncomes.sort((a, b) => a.tax - b.tax)
    var personalTaxMax = 0,
        tax = 0;
    var remain = salaryBeforeTax - PersonalIncomeTaxDeduction - FamilyDeduction * dependents;

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
    salaryBeforeTax -= tax;

    return { tax: tax, net: salaryBeforeTax };
}

async function toNet(area, gross, dependents) {
    if (gross <= 0)
        return 0;

    const insurance = await insuranceCalculator(area, gross);

    var net = gross - (insurance.socialInsurance + insurance.healthInsurance + insurance.unemploymentInsurance);
    const tax = await personalTax(net, dependents);

    return {
        gross,
        socialInsurance: insurance.socialInsurance,
        healthInsurance: insurance.healthInsurance,
        unemploymentInsurance: insurance.unemploymentInsurance,
        tax: tax.tax,
        net: tax.net
    }
}

module.exports = { insuranceCalculator, personalTax, toNet }`,

    unittest: {
        grossToNet_testjs: `const mock = require("./grossToNet");

describe("Start unit test", () => {
  describe("Test insuranceCalculator function()", () => {
    test("gross is null, Should return NaN", async () => {
      const gross = null;
      const area = 1;
      const result = await mock.insuranceCalculator(area, gross);
      expect(result).toEqual(NaN);
    });
    test("area is null, Should return NaN", async () => {
      const gross = 1200000;
      const area = null;
      const result = await mock.insuranceCalculator(area, gross);
      expect(result).toEqual(NaN);
    });
    test("gross is invalid, Should return 0", async () => {
      const gross = -1;
      const area = 1;
      const result = await mock.insuranceCalculator(area, gross);
      expect(result).toEqual(0);
    });
    test("area is invalid, Should return NaN", async () => {
      const gross = 1200000;
      const area = -1;
      const result = await mock.insuranceCalculator(area, gross);
      expect(result).toEqual(NaN);
    });
  });
  describe("Test personalTax function()", () => {
    test("dependents is invalid, Should return 0", async () => {
      const salaryBeforeTax = 11635000;
      const dependents = -1;
      const result = await mock.personalTax(salaryBeforeTax, dependents);
      expect(result).toEqual(NaN);
    });
    test("salaryBeforeTax is invalid, Should return 0", async () => {
      const salaryBeforeTax = -1;
      const dependents = 1;
      const result = await mock.personalTax(salaryBeforeTax, dependents);
      expect(result).toEqual(0);
    });
  });
  describe("Test toNet function()", () => {
    test("gross is valid, Should return 0 ", async () => {
      const dependents = 0;
      const area = 1;
      const gross = -1;

      const result = await mock.toNet(area, gross, dependents);
      expect(result).toEqual(0);
    });
  });
});`,

        grossToNet: `const Service = require("../src/services/grossToNet");

exports.insuranceCalculator = async (area, gross) => {
  const data = await Service.insuranceCalculator(area, gross);
  switch (data) {
    case 0:
      return 0;
    case NaN:
      return NaN;
    default:
      return data;
  }
};
exports.personalTax = async (net, dependents) => {
  const data = await Service.personalTax(net, dependents);
  switch (data) {
    case 0:
      return 0;
    case NaN:
      return NaN;
    default:
      return data;
  }
};
exports.toNet = async (depend, area, gross) => {
  const data = await Service.toNet(depend, area, gross);
  switch (data) {
    case 0:
      return 0;
    case NaN:
      return NaN;
    default:
      return data;
  }
};`
    }
}