// routes/auth-routes.js
const express = require("express");
const router = express.Router();

// Import User model
const User = require("../models/user");

// Require Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    // if username or password field is empty
    if (username === "" || password === "") {
        res.render("auth/signup", { message: "Indicate username and password" });
        return;
    }

    // If username is already taken in DB 
    User.findOne({ username })
        .then(user => {
            if (user !== null) {
                res.render("auth/signup", { message: "The username already exists" });
                return;
            }

            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            const newUser = new User({
                username,
                password: hashPass
            });

            newUser.save((err) => {
                if (err) {
                    res.render("auth/signup", { message: "Something went wrong" });
                } else {

                    User
                        .find()
                        .then((users) => {
                            console.log('Users --------------------------', users);
                        }
                        )
                    // redirect user back to 
                    res.redirect("/");
                }
            });
        })
        .catch(error => {
            next(error)
        })
});

module.exports = router;