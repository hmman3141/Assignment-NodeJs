const mock = require("./grossToNet");
const { Model } = require('objection');
const { host, port, user, password, dbName } = require('../settings')
var conn = {
    host: host,
    port: port,
    user: user,
    password: password,
    database: dbName
}
const db = require('knex')({
    client: 'mysql',
    connection: conn
})
Model.knex(db);
describe("Start unit test", () => {
  afterAll(() => {
    db.destroy();
  });
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
    test("parameters are valid, Should return value", async () => {
      const gross = 1200000;
      const area = 1;
      const result = await mock.insuranceCalculator(area, gross);
      expect(result.socialInsurance).toEqual(96000);
      expect(result.healthInsurance).toEqual(18000);
      expect(result.unemploymentInsurance).toEqual(12000);
    });
    test("gross are higher than max value, Should return max value", async () => {
      const gross = 50000000;
      const area = 1;
      const result = await mock.insuranceCalculator(area, gross);
      expect(result.socialInsurance).toEqual(2384000);
      expect(result.healthInsurance).toEqual(447000);
      expect(result.unemploymentInsurance).toEqual(500000);
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
    test("parameters are valid, Should return value", async () => {
      const salaryBeforeTax = 46669000;
      const dependents = 0;
      const result = await mock.personalTax(salaryBeforeTax, dependents);
      expect(result.tax).toEqual(5667250);
      expect(result.net).toEqual(41001750);
    });
  });
  describe("Test toNet function()", () => {
    test("gross is invalid, Should return 0 ", async () => {
      const dependents = 0;
      const area = 1;
      const gross = -1;

      const result = await mock.toNet(area, gross, dependents);
      expect(result).toEqual(0);
    });
    test("gross is null, Should return NaN ", async () => {
      const dependents = 0;
      const area = 1;
      const gross = null;

      const result = await mock.toNet(area, gross, dependents);
      expect(result).toEqual(NaN);
    });
    test("area is invalid, Should return NaN ", async () => {
      const dependents = 0;
      const area = -1;
      const gross = 1;

      const result = await mock.toNet(area, gross, dependents);
      expect(result).toEqual(NaN);
    });
    test("dependents is invalid, Should return NaN ", async () => {
      const dependents = -1;
      const area = 1;
      const gross = 1;

      const result = await mock.toNet(area, gross, dependents);
      expect(result).toEqual(NaN);
    });
    test("parameters are valid, Should return value ", async () => {
      const dependents = 0;
      const area = 1;
      const gross = 50000000;

      const result = await mock.toNet(area, gross, dependents);
      expect(result.gross).toEqual(50000000);
      expect(result.socialInsurance).toEqual(2384000);
      expect(result.healthInsurance).toEqual(447000);
      expect(result.unemploymentInsurance).toEqual(500000);
      expect(result.tax).toEqual(5667250);
      expect(result.net).toEqual(41001750);
      const mongoose = require("mongoose");
      mongoose.connection.close();
    });
  });
});