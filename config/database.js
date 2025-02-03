const mongoose = require("mongoose");

const uri = "mongodb+srv://nirvan:nirvanadev@podify.7khfe.mongodb.net/"



const connectDB = async() =>{
    await mongoose.connect("mongodb+srv://nirvan:nirvanadev@podify.7khfe.mongodb.net/")
}

module.exports = connectDB;