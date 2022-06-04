const mock = require("./grossToNet");

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
});