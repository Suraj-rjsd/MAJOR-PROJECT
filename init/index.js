const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const initdata = require('./data.js').data; 

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

   
    const dataWithOwner = initdata.map(obj => ({
        ...obj,
        owner: '68ae19604e9dd03f70abbeac' 
    }));

    await Listing.insertMany(dataWithOwner);
    console.log('Initial data inserted!');
};

initDB(); //
