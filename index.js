const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const User = require("./models/user")
const Message = require("./models/message");
const connectDB = require("./config/database")
const { validateSignUpData } = require("./utils/validate")
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken");

// import userAuth from "./middleware/auth"


const crypto = require('crypto');

const app = express();
const port = 8000;


var cors = require('cors');
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// cookieParser is a middleware used by server to store our token  and we can get the token for validating all apis hit
app.use(cookieParser());


app.use(bodyParser.urlencoded({ extended: false }));

//middleware to convert JSON object to javaScript object we can also use exprss.json() in place of bodyParser
app.use(bodyParser.json());




connectDB().
    then(() => {
        console.log("Database connection established");
        app.listen(4000, () => {
            console.log("Server is listening at 4000...")
        })
    }).catch(() => {
        console.log("Database connection cannnot be established");
    })


// const { userAuth } = require("./middleware/auth");

// app.post("/register", async (req, res) => {
//     // validateSignUpData(req)
//     // const { name, email, password } = req.body;
//     // const newUser = new User({ name, email, password })
//     // console.log(req.body);
//     // newUser.save().then(
//     //     () => {
//     //         res.status(200).json({ message: "user registered successfully!!" })
//     //     }
//     // ).catch(error => {
//     //     console.log("Error registering");
//     //     res.status(500).json({ message: "Error registering the user" })
//     // }
//     // )
//     // console.log(validateSignUpData(req));

//     try {
//         validateSignUpData(req);
//         const { name, email, password } = req.body;
//         const passwordHash = await bcrypt.hash(password, 10);
//         const newUser = new User({ name, email, password: passwordHash })
//         await newUser.save();
//         res.status(200).json({ message: "user registered successfully!!" })

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Error registering the user" })
//     }

// })


// app.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email: email });
//         if (!user && user.password !== password) {
//             return res.status(401).json({ message: "Email/Password is invalid" })
//         }
//         // const isPasswordValid = await bcrypt.compare(password , user.password)
//         // if (isPasswordValid) {
//         //create a JWT token
//         // const secretKey = crypto.randomBytes(32).toString('hex');
//         console.log("===", user._id);
//         const secretKey = "Nirpan@1995"
//         const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "7d" });


//         //add the token to cookies and send the response back to the user
//         res.cookie("token", token);
//         // res.send("Login Succesfully !!")

//         res.status(200).json({ token });
//         // } else {
//         //     throw new error("Email/Password is invalid");
//         // }

//         // const secretKey = crypto.randomBytes(32).toString('hex');
//         // const token = jwt.sign({ userId: user._id }, secretKey);
//         // res.status(200).json({ token });
//         // if(user.password !== password){
//         //   return res.status(401).json({message:"Password is invalid"})
//         // }

//     } catch (error) {
//         res.status(500).json({ message: "Error in Login" })
//     }

// })


const authRouter = require("./routes/auth");
const signalRouter = require("./routes/signal")
const tinderRouter = require("./routes/tinder");
const ConnectionRequest = require("./models/connectionRequest");



app.use("/", authRouter);
app.use("/", signalRouter);
app.use("/", tinderRouter);

const http = require('http').createServer(app);

const io = require('socket.io')(http);

//{"userId" : "socket ID"}

const userSocketMap = {};

io.on('connection', socket => {
  console.log('a user is connected', socket.id);

  const userId = socket.handshake.query.userId;

  console.log('userid', userId);

  if (userId !== 'undefined') {
    userSocketMap[userId] = socket.id;
  }

  console.log('user socket data', userSocketMap);

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    delete userSocketMap[userId];
  });

  socket.on('sendMessage', ({senderId, receiverId, message}) => {
    const receiverSocketId = userSocketMap[receiverId];

    console.log('receiver Id', receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', {
        senderId,
        message,
      });
    }
  });
});

http.listen(6000, () => {
  console.log('Socket.IO running on port 3000');
});

app.post('/sendMessage', async (req, res) => {
  try {
    const {senderId, receiverId, message} = req.body;

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();

    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      console.log('emitting recieveMessage event to the reciver', receiverId);
      io.to(receiverSocketId).emit('newMessage', newMessage);
    } else {
      console.log('Receiver socket ID not found');
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log('ERROR', error);
  }
});

app.get('/messages', async (req, res) => {
  try {
    const {senderId, receiverId} = req.query;

    const messages = await Message.find({
      $or: [
        {senderId: senderId, receiverId: receiverId},
        {senderId: receiverId, receiverId: senderId},
      ],
    }).populate('senderId', ['_id', 'message','name']);

    res.status(200).json(messages);
  } catch (error) {
    console.log('Error', error);
  }
});


// const http = require("http").createServer(app);

// const io = require("socket.io")(http);

// const userSocketMap = {};

// io.on('connection', socket => {
//     console.log("id", socket.id);
//     const userId = socket.handshake.query.userId;
//     console.log("userId", userId);
//     if (userId !== undefined) {
//         userSocketMap[userId] = socket.id;
//     }

//     console.log("user socket data", userSocketMap)
//     socket.on("disconnect", () => {
//         console.log("user disconnected", socket.id);

//         delete userSocketMap[userId];
//     })

//     socket.on("sendMessage", ({ senderId, recieverId, message }) => {
//         const recieverSocketId = userSocketMap(recieverId);

//         if (recieverSocketId) {
//             io.to(recieverSocketId).emit('recieveMessage',
//                 {
//                     senderId,
//                     message
//                 })
//         }

//     })
// })

// http.listen(6000, ()=>{
//     console.log("socket.io running on 6000")
// })

// app.post("user/send/:status/:toUserId", async (req , res) =>{
//     console.log("hiiti", req.params.toUserId , req.params.status)
//     try {
//         const cookies = req.cookies;
//         const { token } = cookies;
//         const decodedToken = await jwt.verify(token, "Nirpan@1995")
//         const fromUserId = decodedToken.userId;
//         const toUserId = req.params.toUserId;
//         const status = req.params.status;

//         const newConnectionRequest = new ConnectionRequest({
//             fromUserId,
//             toUserId,
//             status
//         })

//         await newConnectionRequest.save();

//         res.json({
//             message:"Connections Request send successfully!"
//         })


//     } catch (error) {
//         res.status(400).send("ERROR : " + error.message);
//     }

// })

// app.get("/user/:userId", async (req, res) => {

//     try {
//         const cookies = req.cookies;
//         const { token } = cookies;
//         const decodedToken = await jwt.verify(token, "Nirpan@1995")
//         console.log(decodedToken);
//         const userId = req.params.userId;
//         const users = await User.find({ _id: { $ne: userId } })
//         res.json(users);

//     } catch (error) {
//         console.log("error", error);
//     }

// })

// app.post("/sendrequest", async (req, res) => {
//     const { senderId, recieverId, message } = req.body;
//     const reciever = await User.findOne(recieverId)
//     // const reciever = await User.findById(recieverId);
//     console.log("reciever", reciever, req.body);
//     if (!reciever) {
//         return res.status(404).json({ message: "Reciever not found" })
//         // return new throw error();
//     }
//     // reciever.requests.push({ from: senderId, message })

//     reciever.requests.push({ from: senderId, message: message });
//     await reciever.save()
//     res.status(200).json({ message: "Message send successfully" })

// })


// app.get("/getrequests/:userId", async (req, res) => {
//     try {
//         const cookies = req.cookies;
//         const { token } = cookies;
//         const decodedToken = await jwt.verify(token, "Nirpan@1995")
//         console.log(req.params.userId);
//         const userId = req.params.userId;
//         const user = await User.findOne({ _id: userId });
//         const populateUser = await user.populate('requests.from', 'name email',);
//         if (user) {
//             res.json(user.requests);
//         } else {
//             res.status(400);
//             throw new Error("User Not Found")
//         }
//     } catch (error) {
//         console.log(error);
//     }
// })

// app.post("/acceptrequests", async (req, res) => {
//     try {
//         const { userId, requestId } = req.body;
//         const user = await User.findOne(userId);
//         if (!user) {
//             return res.status(400).json({ message: 'user not found' })
//         }
//         console.log(user);
//         const updateUser = await User.findByIdAndUpdate(
//             userId,
//             {
//                 $pull: { requests: { from: requestId } }
//             },
//             { new: true }
//         )

//         if (!updateUser) {
//             return res.status(404).json({ message: 'request not found' })
//         }

//         await findByIdAndUpdate(userId, {
//             $push: { friends: requestId },
//         });

//         const friendUser = await User.findByIdAndUpdate(requestId, {
//             $push: { friends: userId },
//         });

//         if (!friendUser) {
//             return res.status(404).json({ message: 'Friend not found' });
//         }

//         res.status(200).json({ message: 'Request accepted sucesfully' });


//     } catch (error) {

//     }

// })