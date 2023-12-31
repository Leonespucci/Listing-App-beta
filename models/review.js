const mongoose = require('mongoose')
const Schema = mongoose.Schema
const reviewSchema = new Schema({
    rating : {
        type : Number,
        min  : 1,
        max  : 5
    },
    body : String,
});

module.exports = mongoose.model('Review', reviewSchema)