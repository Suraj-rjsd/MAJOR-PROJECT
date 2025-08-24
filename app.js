const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressErrors = require("./utils/ExpressErrors.js");

const listingRoutes = require('./routes/listing');
const reviewRoutes = require("./routes/review");

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

main().then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/wanderlust');
}

//  Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/review", reviewRoutes);

//  Home
app.get('/', (req, res) => {
  res.send('Hello World!');
});



//  Error Handler
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render('listings/error', { status, message });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
