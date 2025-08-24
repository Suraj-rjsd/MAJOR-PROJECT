const mongoose = require('mongoose');
const Listing = require('../listing.js');
const initdata = require('./data.js').data; // Access the array directly


main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata);
    console.log('Initial data inserted:');
};
 initDB(); // Call here after definition



