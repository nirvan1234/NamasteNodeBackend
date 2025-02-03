const express = require("express");
const { validateSignUpData } = require("../utils/validate")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const User = require("../models/user")
const cookieParser = require('cookie-parser')


const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
    try {
        validateSignUpData(req);
        const { name, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: passwordHash })
        await user.save();
        res.status(200).json({ message: "user registered successfully!!" , user})

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error registering the user" })
    }

})

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user && user.password !== password) {
            return res.status(401).json({ message: "Email/Password is invalid" })
        }
        // const isPasswordValid = await bcrypt.compare(password , user.password)
        // if (isPasswordValid) {
        //create a JWT token
        // const secretKey = crypto.randomBytes(32).toString('hex');
        console.log("===", user._id);
        const secretKey = "Nirpan@1995"
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "7d" });


        //add the token to cookies and send the response back to the user
        res.cookie("token", token);
        // res.send("Login Succesfully !!")

        res.status(200).json({ token, user});
        // } else {
        //     throw new error("Email/Password is invalid");
        // }

        // const secretKey = crypto.randomBytes(32).toString('hex');
        // const token = jwt.sign({ userId: user._id }, secretKey);
        // res.status(200).json({ token });
        // if(user.password !== password){
        //   return res.status(401).json({message:"Password is invalid"})
        // }

    } catch (error) {
        res.status(500).json({ message: "Error in Login" })
    }

})

authRouter.post("/logout", async (req , res) =>{
   res.cookie("token", null , {
    expires: new Date(Date.now()),
   })
   res.send("Logout Successful!");
})

module.exports = authRouter;