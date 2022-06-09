const mongoose = require('mongoose')
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

module.exports = mongoose.model("PersonalIncomeTaxs", schema);