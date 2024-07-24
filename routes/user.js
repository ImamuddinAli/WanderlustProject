const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");

const userController = require("../controllers/users.js");
const { render } = require("ejs");

// here we combining the same-same route
router.route("/signup")
    .get(wrapAsync
        (userController.renderSignupForm)
    )
    .post(
        wrapAsync(userController.signup)
    )

router.route("/login")
    .get(
        userController.renderLoginForm 
    )
    .post(
        passport.authenticate("local", {
            failureRedirect: '/login',
            failureFlash: true
        }),
        userController.login
    )

// router.get("/signup", 
//     userController.renderSignupForm
// //     (req, res) => {
// //     // res.send("form");
// //     res.render("users/signup.ejs");
// // }
// );

// router.post("/signup", 
//     wrapAsync(userController.signup)
// //         async(req, res) => {
// //     try {
// //         let { username, email, password } = req.body;
// //         const newUser = new User({ email, username });
// //         const registeredUser = await User.register(newUser, password);
// //         console.log(registeredUser);
// //         req.login(registeredUser, (err) => {
// //             if(err) {
// //                 return next(err);
// //             }
// //             req.flash("success", "welcome to Wanderlust");
// //             res.redirect("/listings");
// //         });
       
// //     }catch(e) {
// //         req.flash("error", e.message);
// //         res.redirect("/signup");
// //     }
// // })
// );

// router.get("/login",
//     userController.renderLoginForm 
// //     (req, res) => {
// //     res.render("users/login.ejs");
// // }
// );

// router.post("/login", 
//     passport.authenticate("local", {
//         failureRedirect: '/login', 
//         failureFlash: true
//     }), 
//     userController.login
//     // async(req, res) => {
//     //     // res.send("Welcome to Wanderlust! You are logged in!")
//     //     req.flash("success", "welcome back to Wanderlust!");
//     //     res.redirect("/listings");
//     // }
// );

router.get("/logout", 
    userController.logout
    // (req, res, next) => {
    // req.logout((err) => {
    //     if(err) {
    //         return next(err);
    //     }
    //     req.flash("success", "you are logged out!");
    //     res.redirect("/listings");
    // })
    // }
);

module.exports = router;