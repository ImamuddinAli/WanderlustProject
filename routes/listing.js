const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema } = require("../schema.js");
// const Listing = require("../MajorProjects/models/listing.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); 
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
// const upload = multer({dest : "upload/"});
const upload = multer({storage});


// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }
//     else {
//         next();
//     }
// };

// here we are combining same paths
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        // validateListing,
        upload.single("listing[image]"),
        wrapAsync(listingController.createListing)
    );
    // .post(upload.single("listing[image]"), (req, res) => {
    //     res.send(req.file);
    // });

// new route
router.get("/new", isLoggedIn,
    listingController.renderNewForm
);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn, 
        isOwner,
        wrapAsync(listingController.destroyListing)
    )


// // index route
// router.get("/", wrapAsync (listingController.index)
// //     (async (req, res) => {
// //     const allListings = await Listing.find({});
// //     res.render("listings/index.ejs", { allListings });
// // })
// );

// // new route
// // router.get("/new", (req, res) => {
// router.get("/new", isLoggedIn, 
//     listingController.renderNewForm
//     // (req, res) => {
//     //     // if(!req.isAuthenticated()) {
//     //     //     req.flash("error", "You must be logged in to create listing!");
//     //     //     // return res.redirect("/listings");
//     //     //     return res.redirect("/login");
//     //     // }
//     // res.render("listings/new.ejs");
//     // }
// );

// // show route
// router.get("/:id", 
//     wrapAsync(listingController.showListing)
// //     async (req, res) => {
// //     let { id } = req.params;
// //     const listing = await Listing.findById(id).populate("reviews").populate("owner");
// //     if(!listing) {
// //         req.flash("error", "Listing you requested for does not exist!")
// //         res.redirect("/listings");
// //     }
// //     console.log(listing);
// //     res.render("listings/show.ejs", { listing });
// // })
// );


// // Create route
// // app.post("/listings", wrapAsync(async (req, res, next) => {
// // after getting req validateListing middleware work
// router.post("/", 
//     validateListing,
//      wrapAsync(listingController.createListing)
// //     async (req, res, next) => {
// //     // if(!req.body.listing) {
// //     //     throw new ExpressError(400, "send valid data for listing");
// //     // }

// //     // let result = listingSchema.validate(req.body);
// //     // console.log(result);
// //     // if(result.error) {
// //     //     throw new ExpressError(400, result.error);
// //     // }
// //     // after validate no need to use if else to validate data

// //     // let listing = req.body.listing;
// //     const newListing = new Listing(req.body.listing);

// //     // if (!newListing.title) {
// //     //     throw new ExpressError(400, "Title is missing!");
// //     // }
// //     // if(!newListing.description) {
// //     //     throw new ExpressError(400, "Description is missing!");
// //     // }
// //     // if (!newListing.location) {
// //     //     throw new ExpressError(400, "Location is missing!");
// //     // }

// //     newListing.owner = req.user._id;
// //     await newListing.save();
// //     req.flash("success", "new Listing Created!");
// //     // console.log(listing);
// //     res.redirect("/listings");
// // })
// );

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm)
//     async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     if(!listing) {
//         req.flash("error", "Listing you requested for does not exist!");
//         res.redirect("/listings");
//     }
//     res.render("listings/edit.ejs", { listing });
// })
);

// // update route
// router.put(
//     "/:id", 
//     validateListing, 
//     isLoggedIn, 
//     isOwner,
//     wrapAsync(listingController.updateListing)
// //         async (req, res) => {
// //     // if (!req.body.listing) {
// //     //     throw new ExpressError(400, "send valid data for listing");
// //     // }
// //     let { id } = req.params;
    
// //     // let listing = await Listing.findById(id);
// //     // if(!listing.owner._id.equals(res.locals.currUser._id)) {
// //     //     req.flash("error", "you don't have permission to edit");
// //     //     return res.redirect(`/listings/${id}`);
// //     // }
// //     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
// //     req.flash("success", "Listing Updated");
// //     res.redirect(`/listings/${id}`);
// // })
// );

// delete route
// router.delete("/:id", isLoggedIn, isOwner, 
//     wrapAsync(listingController.destroyListing)
// //         async (req, res) => {
// //     let { id } = req.params;
// //     let deletedListing = await Listing.findByIdAndDelete(id);
// //     console.log(deletedListing);
// //     req.flash("success", "Listing is Deleted!");
// //     res.redirect("/listings");
// // })
// );

module.exports = router;