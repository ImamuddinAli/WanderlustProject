const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";   //wanderlust, name of database

// here calling the main fun
main()
    .then(() => {
    console.log("connected to DB");
  })
    .catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    // here deleting the previous all data the insert the latest data
    await Listing.deleteMany({});
    // here assuming one user owner of all previous listing engineer_71030
    initData.data = initData.data.map((obj) => ({ 
        ...obj, 
        owner: "668e7df50745058212d6a13e",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
// calling to the initDB fun
initDB();