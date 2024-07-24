// when we are in development phase only that time it show
if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
// require("dotenv").config();
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("../MajorProjects/models/listing");
// const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        // secret: "mysupersecretcode",
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", ()=> {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    // secret: "mysupersecretcode",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // console.log(res.locals.success);
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "student",
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

// const { error } = require("console");
// // const { listingSchema } = require("./schema.js");
// const { listingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
// const review = require("./models/review.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.js");

// local database
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";   //wanderlust, name of database
// virtual database -mongoAtlas
const dbUrl = process.env.ATLASDB_URL;

// here calling the main fun
main().then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
});

async function main() {
    // local database connection
    // await mongoose.connect(MONGO_URL);
    // virtual database connection
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// // here we are creating a api
// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });

// const validateListing = (req, res, next) => {
//     let {error} = listingSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }
//     else {
//         next();
//     }
// };

// // 
// const validateReview = (req, res, next) => {
//     let{error} = reviewSchema.validate(req.body);
//     if(error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }
//     else {
//         next();
//     }
// };

// // index route
// app.get("/listings", wrapAsync(async(req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
// }));

// // new route
// app.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs");
// });

// // show route
// app.get("/listings/:id", wrapAsync(async(req, res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews"); 
//     res.render("listings/show.ejs", {listing});
// }));

// // Create route
// app.post("/listings", async(req, res, next) => {
//     try {
//         // let listing = req.body.listing;
//         const newListing = new Listing(req.body.listing);
//         await newListing.save();
//         // console.log(listing);
//         res.redirect("/listings");
//     }
//     catch(err) {
//         next(err);
//     }
// });

// // Create route
// // app.post("/listings", wrapAsync(async (req, res, next) => {
//     // after getting req validateListing middleware work
// app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
//     // if(!req.body.listing) {
//     //     throw new ExpressError(400, "send valid data for listing");
//     // }

//     // let result = listingSchema.validate(req.body);
//     // console.log(result);
//     // if(result.error) {
//     //     throw new ExpressError(400, result.error);
//     // }
//     // after validate no need to use if else to validate data

//     // let listing = req.body.listing;
//     const newListing = new Listing(req.body.listing);

//     // if (!newListing.title) {
//     //     throw new ExpressError(400, "Title is missing!");
//     // }
//     // if(!newListing.description) {
//     //     throw new ExpressError(400, "Description is missing!");
//     // }
//     // if (!newListing.location) {
//     //     throw new ExpressError(400, "Location is missing!");
//     // }

//     await newListing.save();
//     // console.log(listing);
//     res.redirect("/listings");
// }));

// // Edit route
// app.get("/listings/:id/edit", wrapAsync(async(req, res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", {listing});
// }));

// // update route
// app.put("/listings/:id", validateListing, wrapAsync(async(req, res) => {
//     // if (!req.body.listing) {
//     //     throw new ExpressError(400, "send valid data for listing");
//     // }
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     res.redirect(`/listings/${id}`);
// }));

// // delete route
// app.delete("/listings/:id", async(req, res) => {
//    let {id} = req.params;
//    let deletedListing = await Listing.findByIdAndDelete(id);
//    console.log(deletedListing);
//    res.redirect("/listings");
// });

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


// // Reviews
// // Post review Route
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req, res) => { //here passing the validateReview as middleware & wrapAsync for error handling
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();

// //     console.log("new review saved");
// //     res.send("new review saved");

//     res.redirect(`/listings/${listing._id}`);
// }));

// // Delete Review Route
// app.delete(
//     "/listings/:id/reviews/:reviewId", 
//     wrapAsync(async(req, res) => {
//         let { id, reviewId } = req.params;

//         await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//         await Review.findByIdAndDelete(reviewId);

//         res.redirect(`/listings/${id}`);
//     })
// );


// app.get("/testListing", async(req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

// app.use((err, req, res, next) => {
//     res.send("something went wrong!");
// });

// if there is no match of our routes then show this error 
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page Not Found"));
});

app.use((err, req, res, next) => {
    // here deconstruct the err
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
    // res.send("something went wrong!");
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});