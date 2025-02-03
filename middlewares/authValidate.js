
const jwt = require("jsonwebtoken");
// import jwt from 'jsonwebtoken';
const User = require("../models/user")


const userAuth = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        const decodedToken = await jwt.verify(token, "Nirvan@1995")
        const { userId } = decodedToken;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            console.log("user Not found");
             throw new Error("user not found");
        }
        req.user = user;
        next();

    } catch (error) {
        res.status(500).send({message:"validation error"});
    }
}

module.exports = {
    userAuth
}