const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status:{
        type: String,
        enum:{
            values:["ignored", "interested","accepted","rejected"],
            message:`is incorrect status type`
        },
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
},
)


// //compound Indexing
// connectionSchema.index({toUserId: 1 , fromUserId :1});

// connectionSchema.pre("save", function(){
//     const connection = this;
//     // check if fromUserId is same as toUserId
//     if(connection.fromUserId.equals(toUserId)){
//         throw new Error("Cannot send connection request to same person")
//     }
//     next();
// })

const ConnectionRequest =  mongoose.model("connectionRequest",connectionSchema);

module.exports = ConnectionRequest;