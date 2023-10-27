const express  = require('express')
const Place    = require('../models/place') //Model place
const {placeSchema} = require('../schemas/place') //Schemas
const wrapAsync = require('../utils/wrapAsync')
const ErrorHandler = require('../utils/ErrorHandler')
const isValidObject = require('../middlewares/isValidObject')

const router = express.Router()


//validator
const validatePlace = (req, res, next) => {
    const { error } = placeSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ErrorHandler(msg, 400))
        console.log(msg);
    } else {
        next()
    }
}


//Get data from place
router.get('/', wrapAsync(async (req, res) => {
    const places = await Place.find()
    res.render('places/index', {places})
}))

//Create Data Place
router.get('/create', (req, res) => {
    res.render('places/create')
})

router.post('/create', validatePlace ,wrapAsync (async (req, res, next) => {
    const place = new Place(req.body)
    await place.save()
    req.flash('success_msg', 'Berhasil Menambahkan Data')
    res.redirect(`/places/${place._id}`)
}))
//end

//Show data from place
router.get('/:id', isValidObject('/places'), wrapAsync(async (req, res) => {
    const {id} = req.params
    const place = await Place.findById(id).populate('reviews')
    res.render('places/show', {place})
}));

//update data place
router.get('/:id/edit',isValidObject('/places'), wrapAsync(async (req, res) => {
    const {id} = req.params
    const place = await Place.findById(id)
    res.render('places/edit', {place})
}))

router.put('/:id', isValidObject('/places'), validatePlace ,wrapAsync(async(req, res) => {
    const {id} = req.params
    const {...place} = req.body
    await Place.findByIdAndUpdate(id, place)
    req.flash('success_msg', 'Berhasil Update Data')
    res.redirect(`/places/${id}`)
}))
//end

//Delete Place
router.delete('/:id', isValidObject('/places'), wrapAsync(async (req, res) => {
    const {id} = req.params
    await Place.findByIdAndDelete(id)
    req.flash('success_msg', 'Berhasil Menghapus Data')
    res.redirect('/places')
}))
//end

module.exports = router