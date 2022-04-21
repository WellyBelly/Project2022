const express = require('express');
const router = express.Router();
const register = require('../models/register_model');
const passport = require('passport');



router.get('/login', (req, res) => {
    res.sendFile('/public/login.html', { root: "./"});
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local',{
        successRedirect : '/users/profile',
        failureRedirect : '/',
        failureFlash : true,
    })(req,res,next);
});



router.get('/register', (req, res) => {
    res.sendFile('/public/register.html', { root: "./"});
});

router.post('/register', (req, res) => {
    console.log('req.body: ', req.body.username);
    register.register(req.body.username, req.body.pwd)
        .then(result => {
            if (result.error) {
                res.json({ error: result.error });
            } else {
                res.sendFile('/public/login.html', {root: "./"});
            }
        })
});



router.get('/profile', (req, res) => {
    res.sendFile('/views/profile.html', { root: "./"})
})


module.exports = router;