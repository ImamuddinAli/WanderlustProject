const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// here we are creating a schema
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        // type: String,
        // set: (v) => v == "" ? "default link" : v,
        // // default : "https://www.istockphoto.com/photo/palm-trees-in-miami-beach-gm1346099359-423963227",
        // default: "https://www.bing.com/ck/a?!&&p=f5211a7fbaba9f20JmltdHM9MTcyMDIyNDAwMCZpZ3VpZD0yZGNiMDBmNi1mMjYxLTY5MDQtMjM2ZC0xNGM0ZjM2NzY4YjQmaW5zaWQ9NTU5OQ&ptn=3&ver=2&hsh=3&fclid=2dcb00f6-f261-6904-236d-14c4f36768b4&u=a1L2ltYWdlcy9zZWFyY2g_cT1ob21lJTIwaW1hZ2UmRk9STT1JUUZSQkEmaWQ9MUZBN0VBODRBNUJDQkRBNkU4NDcxNEJERkMwMTlCQjYyQkY0QTRDQw&ntb=1",
        // set: (v) => 
        //     v === ""
        //         ? "https://www.bing.com/ck/a?!&&p=f5211a7fbaba9f20JmltdHM9MTcyMDIyNDAwMCZpZ3VpZD0yZGNiMDBmNi1mMjYxLTY5MDQtMjM2ZC0xNGM0ZjM2NzY4YjQmaW5zaWQ9NTU5OQ&ptn=3&ver=2&hsh=3&fclid=2dcb00f6-f261-6904-236d-14c4f36768b4&u=a1L2ltYWdlcy9zZWFyY2g_cT1ob21lJTIwaW1hZ2UmRk9STT1JUUZSQkEmaWQ9MUZBN0VBODRBNUJDQkRBNkU4NDcxNEJERkMwMTlCQjYyQkY0QTRDQw&ntb=1" 
        //      : v,

        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        enum: ["mountains", "arctic", "farms", "deserts"]
    },
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id : {$in: listing.review}});
    }
});

// here we are creating model with the help of schema
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;