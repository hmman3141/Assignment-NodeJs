const Service = require("../src/services/grossToNet");

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
};