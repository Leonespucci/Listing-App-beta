const express = require('express')
const User    = require('../models/user')

const router  = express.Router();

router.get('/register', (req, res) => {
    res.render('auth/register')
})

module.exports = router