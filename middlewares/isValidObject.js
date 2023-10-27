const mongoose = require('mongoose')

module.exports = (redirectUrl = '/') => {
    return async (req, res, next) =>  {
        //param id, place_id, etc ini tergantung ya dengan url :id 
        //proses ini akan mencari param idnya
        const paramId = ['id', 'place_id', 'review_id'].find(param => req.params[param])
        
        //jika tidak ada param nya atau cuman /place lolos
        if(!paramId) {
            return next()
        }

        //id param
        const id = req.params[paramId]
        //jika id yang di kirimkan tidak valid maka akan di redirect ke url yang sudah di tentukan
        //url yang di contohkan disini adalah /place/:id jika id tersebut salah di redirect ke url yang sudah di tentukan
        if(!mongoose.Types.ObjectId.isValid(id)){
        req.flash('error_msg', 'invalid Id / Data Tidak Di Temukan')
        return res.redirect(redirectUrl)
       }

       //jika tidak ada apa apa maka lolos
       next()
    }
}