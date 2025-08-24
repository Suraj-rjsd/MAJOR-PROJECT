const { date } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment:String,
    ratings:{
        type:Number,
        min:1,
        max:5
    },
    CreatedAt:{
        type:Date,
        default:Date.now()
    }
})
module.exports=mongoose.model("Review", reviewSchema)