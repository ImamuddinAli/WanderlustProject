const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
module.exports.createReview = async (req, res) => { //here passing the validateReview as middleware & wrapAsync for error handling
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");

    //     console.log("new review saved");
    //     res.send("new review saved");

    res.redirect(`/listings/${listing._id}`);
};

// deleteReview
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};