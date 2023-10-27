const express  = require('express')
const Review   = require('../models/review') //Model review
const Place    = require('../models/place') //Model place
const {reviewSchema} = require('../schemas/review') //Schemas review
const wrapAsync = require('../utils/wrapAsync')
const ErrorHandler = require('../utils/ErrorHandler')
const isValidObject = require('../middlewares/isValidObject')

const router = express.Router({mergeParams : true})


//validator
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ErrorHandler(msg, 400))
        console.log(msg);
    } else {
        next()
    }
}


//Rating
router.post('/', validateReview ,wrapAsync(async (req, res) => {
    const review = new Review(req.body)
    const {place_id}   = req.params
    const place  = await Place.findById(place_id)
    place.reviews.push(review)
    await review.save()
    await place.save()
    req.flash('success_msg', 'Berhasil Menambahkan Review')
    res.redirect(`/places/${place_id}`)
}))

router.delete('/:review_id', isValidObject('/:place_id'), wrapAsync( async(req, res) => {
    const {place_id, review_id} = req.params
    await Place.findByIdAndUpdate(place_id, {$pull: {reviews : review_id}})
    await Review.findByIdAndDelete(review_id)
    req.flash('success_msg', 'Berhasil Menghapus Review')
    res.redirect(`/places/${place_id}`)
}))
//end

module.exports = router