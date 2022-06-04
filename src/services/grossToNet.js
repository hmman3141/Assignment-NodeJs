const insuranceController = require('../controllers/InsuranceTax')
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

module.exports = { insuranceCalculator, personalTax, toNet }