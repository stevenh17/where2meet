const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    type: String,
    coordinates: Array
});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;
