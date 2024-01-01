const express = require('express')
const router  = express.Router();
const User    = require('../models/user')
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');


router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.post('/register', wrapAsync(async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const existingUsername= await User.findOne({username})
        const  existingEmail= await User.findOne({email})
        const  existingUsernameAndEmail= await User.findOne({username, email})
        if(existingUsernameAndEmail){req.flash('error_msg', 'email dan username sudah terdaftar sebelumnya');res.redirect('/register')}
        if(existingEmail){req.flash('error_msg', 'Email sudah terdaftar');res.redirect('/register')}
        if(existingUsername){req.flash('error_msg', 'username sudah ada');res.redirect('/register')}
        await User.register(user, password);
        req.flash('success_msg', 'Berhasil Register Silahkan Login')
        res.redirect('/login')

    } catch (error) {
        req.flash('error_msg', error.message)
    }
}))

router.get('/login', (req, res) => {
    res.render('auth/login')
})

// Contoh menggunakan Express.js
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: {
        type: 'error_msg',
        msg: 'Invalid password or username'
    }
}), (req, res) => {
    // Set pesan sukses langsung di sini, bukan menggunakan req.flash
    req.flash('success_msg', 'You Are Logged In');
    
    // Render template 'app' dengan menyertakan pesan flash 'success_msg'
    res.render('layouts/app', { success_msg: req.flash('success_msg') });
});

module.exports = router