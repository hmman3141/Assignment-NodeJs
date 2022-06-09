const mongoose = require('mongoose')
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

module.exports = mongoose.model("InsuranceTax", schema);