const express = require('express');
const router = express.Router();
const passport = require('passport');
const initializePassport = require('../config/passport')


router.get('/', (req, res) => {
    res.sendFile('/public/login.html', { root: "./"});
});

router.post('/', (req, res, next) => {
    passport.authenticate('local',{
        successRedirect : '/views/profile',
        failureRedirect : '/',
        failureFlash : true,
    })(req,res,next);
});


module.exports = router;