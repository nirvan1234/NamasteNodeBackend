const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user")
const { userAuth } = require("../middlewares/authValidate");
const ConnectionRequest = require("../models/connectionRequest");


const signalRouter = express.Router();



signalRouter.get("/user/:userId", async (req, res) => {

    try {
        const cookies = req.cookies;
        const { token } = cookies;
        const decodedToken = await jwt.verify(token, "Nirpan@1995")
        console.log("decodedToken", decodedToken);
        const userId = req.params.userId;
        const users = await User.find({ _id: { $ne: userId } })
        res.json(users);

    } catch (error) {
        console.log("error", error);
    }

})



signalRouter.post("/sendrequest", async (req, res) => {
    const { senderId, recieverId, message, name } = req.body;
    // const cookies = req.cookies;
    // const { token } = cookies;
    // const decodedToken = await jwt.verify(token, "Nirpan@1995")
    // console.log("decodedToken", decodedToken);
    // const reciever = await User.findOne(recieverId);
    const connectionRequest = await User.findOne({
        name: name,
    })
    // const reciever = await User.findById({ _id: recieverId });
    console.log("reciever", connectionRequest, req.body);
    if (!connectionRequest) {
        return res.status(404).json({ message: "Reciever not found" })
        // return new throw error();
    }
    // reciever.requests.push({ from: senderId, message })

    connectionRequest.requests.push({ from: senderId, message: message });
    await connectionRequest.save()
    res.status(200).json({ message: "Message send successfully" })

})




signalRouter.get("/getrequests/:userId", async (req, res) => {
    try {
        // const cookies = req.cookies;
        // const { token } = cookies;
        // const decodedToken = await jwt.verify(token, "Nirpan@1995")
        console.log(req.params.userId);
        const userId = req.params.userId;
        const user = await User.findOne({ _id: userId }).populate('requests.from', ["name", "email"])
        // const user = await User.findOne({ name: name});
        // const populateUser = await user.populate('requests.from', 'name email',);
        console.log("user", user);
        if (user) {
            res.json(user.requests);
        } else {
            res.status(400);
            throw new Error("User Not Found")
        }
    } catch (error) {
        console.log(error);
    }
})




signalRouter.post("/acceptrequests", async (req, res) => {
    try {
        const { requestId } = req.body; // Getting the requestId from body
        const cookies = req.cookies;
        const { token } = cookies;

        // Verify the JWT token
        const decodedToken = await jwt.verify(token, "Nirpan@1995");
        console.log("decodedToken", decodedToken, requestId);

        // Use userId from decodedToken or body if needed
        const userId = decodedToken.userId || req.body.userId;  // Assuming decodedToken contains userId

        // Find the current user
        const user = await User.findById(userId);  // Changed findOne to findById
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Pull the request from the current user
        const updateUser = await User.findByIdAndUpdate(userId, {
            $pull: { requests: { from: requestId } },  // Assuming "requests" is an array of objects with a "from" field
        }, { new: true });

        console.log("updateUser", updateUser);

        if (!updateUser) {
            return res.status(404).json({ message: 'Request not found' });
        }

        

        user.freinds.push(requestId);
        await updateUser.save()

        // Add the requestId to the user's friends
        await User.findByIdAndUpdate(userId, {
            $push: { freinds: requestId },
        });

        // Add userId to the friend's friends list
        const friendUser = await User.findByIdAndUpdate(requestId, {
            $push: { freinds: userId },
        });

        console.log("friendUser", friendUser);
        // friendUser.freinds.push(userId);

        if (!friendUser) {
            return res.status(404).json({ message: 'Friend not found' });
        }

        // Success response
        res.status(200).json({ message: 'Request accepted successfully' });

    } catch (error) {
        console.error("Error during request acceptance:", error);  // Log the error
        res.status(500).json({ message: "Server Error", error: error.message });  // Return error message for debugging
    }
});

signalRouter.get("/userFeed/:userId", async (req , res) =>{
    try {
        console.log(req.params.userId);
        const userId = req.params.userId;
        const user = await User.findOne({ _id: userId }).populate('freinds', ["name", "email"])

        res.json(user.freinds);
        
    } catch (error) {
        console.log("error", error)
    }

})



module.exports = signalRouter;