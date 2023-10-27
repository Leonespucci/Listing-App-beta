// import package
const EjsMate  = require('ejs-mate')
const express  = require('express')
const app      = express()
const mongoose = require('mongoose')
const path     = require('path') 
const methodOverride = require('method-override')
const ErrorHandler = require('./utils/ErrorHandler')
const flash        = require('connect-flash')
const session      = require('express-session')
const passport     = require('passport')
const localStrategy = require('passport-local')
const User         = require('./models/user')


//mongodb setup connect
mongoose.connect('mongodb://192.168.1.100:2626/bestpoints')
.then((result) => {
    console.log('conneted to mongodb');
}).catch((err) => {
    console.log(err);
    console.log('error to connect mongodb');
})

//config setup express
app.engine('ejs', EjsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))


//middleware
//method overide atau menimpa contoh untuk hapus dan update
app.use(methodOverride('_method'))
//agar terbaca ketika submit form 
app.use(express.urlencoded({
    extended : true
}))
//session and cookie
app.use(session({
    secret : 'this-secret-key-from-me',
    resave : false,
    saveUninitialized : false,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7, //7 days
        maxAge: 1000 * 60 * 60 * 24 * 7   
    }
}))
//flash
app.use(flash())

//passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser()) //setter
passport.deserializeUser(User.serializeUser()) //getter

//local flash
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})
// end


//Route 
app.get('/', (req, res) => {
    res.render('home')
})

// app.get('/register', async (req,res) => {
//     const user = new User({
//         email : 'user@mail.com',
//         username: 'user'
//     })

//     const newUser = await User.register(user, 'password')
//     console.log(newUser);
// })

// Route place
app.use('/places', require('./routes/places'))
// Route review
app.use('/places/:place_id/reviews', require('./routes/reviews'))
// Route Register/Login
app.use('/', require('./routes/users'))



//error handling
app.all('*', (req, res, next) => {
    next(new ErrorHandler('Halaman Tidak Di Temukan', 404))
})

app.use((err, req, res, next ) => {
    let {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh Tidak, Ada Sesuatu Yang Error'
    // if(err.name == 'CastError') {
    //     err.message = 'ForBidden'
    //     err.statusCode  = 403
    // }
    if(err.name == 'ValidationError') {
        err.message = 'Validation Error'
        err.statusCode  = 401
    }
    console.log(err.stack);
    res.status(statusCode).render('error', {err})
})

//listen server
app.listen(2006, () => {
    console.log('running at http://127.0.0.1:2006')
})