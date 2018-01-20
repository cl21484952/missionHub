const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config/database')

// Register
router.post('/register', (req, res, next) => {
    let stuff = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    };
    let newUser = new User(stuff);

    User.addUser(newUser, (err, user) => {
        if (err){
            res.json({success: false, msg: "failed to register user"});
        } else {
            res.json({success: true, msg: "registered successfully"});
        }
    })
});


router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err){
            throw err;
        }
        if (!user){
            // Does not find the user
            return res.json({success:false, msg:'User not found'});
        }

        console.log(password, user.password);
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch){

                // v2 to v3
                const token = jwt.sign(user.toObject(), config.secret, {
                    expiresIn: 604800 // 1 week of seconds
                });

                res.json({
                    "success": true,
                    "token": 'JWT '+token,
                    "user": {
                        "id": user._id,
                        "name": user.name,
                        "username": user.username,
                        "email": user.email
                    }
                })
            } else {
                return res.json({success: false, msg: 'Wrong password'});
            }

        })
    })
});

// Profile
router.get('/profile', passport.authenticate('jwt', {"session": false}), (req, res, next) => {
    res.json({"user": req.user});
});

module.exports = router;


/*
// Register
router.post('/register', (req, res, next) => {
    let stuff = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    };
    let newUser = new User(stuff);

    User.addUser(newUser, (err, user) => {
        if (err){
            res.json({success: false, msg: "failed to register user"});
        } else {
            res.json({success: true, msg: "registered successfully"});
        }
    })
});
*/
