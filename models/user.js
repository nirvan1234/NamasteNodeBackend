const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
     name:{
        type:String,
        required:true,
     },
     email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true   
     },
     password:{
        type:String,
        required:true,
        unique:true,
     },
     image:{
        type:String
     },
     requests:[{
        from:{
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User"
        },
        message:{
            type:String,
            required:true, 
        },
        status:{
            type:String,
            enum:["pending", "accepted", "rejected"],
            default:"pending"
        }
     }],
     freinds:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User", 
        }
     ]
})

const User = mongoose.model('User', userSchema);

module.exports = User;