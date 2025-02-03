// signalRouter.post("/acceptrequests", async (req, res) => {
//     try {
//         const { requestId } = req.body;
//         const cookies = req.cookies;
//         const { token } = cookies;
//         const decodedToken = await jwt.verify(token, "Nirpan@1995")
//         console.log("decodedToken", decodedToken , requestId);
//         const userId = req.params.userId;
//         const user = await User.findOne(userId);
//         if (!user) {
//             return res.status(400).json({ message: 'user not found' })
//         }

//         const updateUser = await User.findByIdAndUpdate(userId, {
//             $pull: { requests: { from: requestId } }
//         },
//             { new: true }
//         )

//         console.log("updateUser", updateUser);

//         if (!updateUser) {
//             return res.status(404).json({ message: 'request not found' })
//         }

//         await User.findByIdAndUpdate(userId, {
//             $push: { friends: requestId },
//         });

//         const friendUser = await User.findByIdAndUpdate(requestId, {
//             $push: { friends: userId },
//         });

//         console.log("friendUser", friendUser);

//         if (!friendUser) {
//             return res.status(404).json({ message: 'Friend not found' });
//         }

//         res.status(200).json({ message: 'Request accepted sucesfully' });


//     } catch (error) {
//         res.status(400).json({ message: "Server Error" });
//     }

// })

// signalRouter.post("/acceptrequests", async (req, res) => {
//     try {
//         const { requestId } = req.body; // Getting the requestId from body
//         const cookies = req.cookies;
//         const { token } = cookies;

//         // Verify the JWT token
//         const decodedToken = await jwt.verify(token, "Nirpan@1995");
//         console.log("decodedToken", decodedToken, requestId);

//         // Use userId from decodedToken or body if needed
//         const userId = decodedToken.userId || req.body.userId;  // Assuming decodedToken contains userId

//         // Find the current user
//         const user = await User.findById(userId);  // Changed findOne to findById
//         if (!user) {
//             return res.status(400).json({ message: 'User not found' });
//         }

//         // Pull the request from the current user
//         const updateUser = await User.findByIdAndUpdate(userId, {
//             $pull: { requests: { from: requestId } },  // Assuming "requests" is an array of objects with a "from" field
//         }, { new: true });

//         console.log("updateUser", updateUser);

//         if (!updateUser) {
//             return res.status(404).json({ message: 'Request not found' });
//         }

//         // Add the requestId to the current user's friends list if it's not already in the array
//         // if (!updateUser.friends.includes(requestId)) {
//             updateUser.friends.push(requestId);
//             await updateUser.save();
//         // }

//         console.log("updatedUser updated:", updateUser);

//         // Add userId to the friend's friends list if it's not already in the array
//         const friendUser = await User.findById(requestId);

//         if (!friendUser) {
//             return res.status(404).json({ message: 'Friend not found' });
//         }

//         // if (!friendUser.friends.includes(userId)) {
//             friendUser.friends.push(userId);
//             await friendUser.save();
//         // }

//         console.log("friendUser updated:", friendUser);  // Check the updated document

//         // Success response
//         res.status(200).json({ message: 'Request accepted successfully' });

//     } catch (error) {
//         console.error("Error during request acceptance:", error);  // Log the error
//         res.status(500).json({ message: "Server Error", error: error.message });  // Return error message for debugging
//     }
// });

// signalRouter.post("/acceptrequests", async (req, res) => {
//     try {
//         const { requestId } = req.body; // Getting the requestId from body
//         const cookies = req.cookies;
//         const { token } = cookies;

//         // Verify the JWT token
//         const decodedToken = await jwt.verify(token, "Nirpan@1995");
//         console.log("decodedToken", decodedToken, requestId);

//         // Use userId from decodedToken or body if needed
//         const userId = decodedToken.userId || req.body.userId;  // Assuming decodedToken contains userId

//         // Find the current user
//         const user = await User.findById(userId);  // Changed findOne to findById
//         if (!user) {
//             return res.status(400).json({ message: 'User not found' });
//         }

//         // Pull the request from the current user
//         const updateUser = await User.findByIdAndUpdate(userId, {
//             $pull: { requests: { from: requestId } },  // Assuming "requests" is an array of objects with a "from" field
//         }, { new: true });

//         console.log("updateUser", updateUser);

//         if (!updateUser) {
//             return res.status(404).json({ message: 'Request not found' });
//         }

//         // Add the requestId to the current user's friends list using .push()
//         const updatedUser = await User.findOne({ _id: userId });
//         updatedUser.friends.push(requestId);  // .push() adds the requestId to the friends array

//         await updatedUser.save();  // Save the updated document
//         console.log("updatedUser after push:", updatedUser);

//         // Add userId to the friend's friends list using .push()
//         const friendUser = await User.findOne({ _id: requestId });
//         friendUser.friends.push(userId);  // .push() adds the userId to the friend's friends array

//         await friendUser.save();  // Save the updated friend document
//         console.log("friendUser after push:", friendUser);

//         if (!friendUser) {
//             return res.status(404).json({ message: 'Friend not found' });
//         }

//         // Success response
//         res.status(200).json({ message: 'Request accepted successfully' });

//     } catch (error) {
//         console.error("Error during request acceptance:", error);  // Log the error
//         res.status(500).json({ message: "Server Error", error: error.message });  // Return error message for debugging
//     }
// });

// signalRouter.post("/acceptrequests", async (req, res) => {
//     try {
//         const { requestId } = req.body; // Getting the requestId from body
//         const cookies = req.cookies;
//         const { token } = cookies;

//         // Verify the JWT token
//         const decodedToken = await jwt.verify(token, "Nirpan@1995");
//         console.log("decodedToken", decodedToken, requestId);

//         // Use userId from decodedToken or body if needed
//         const userId = decodedToken.userId || req.body.userId;  // Assuming decodedToken contains userId

//         // Find the current user
//         const user = await User.findById(userId);  // Changed findOne to findById
//         if (!user) {
//             return res.status(400).json({ message: 'User not found' });
//         }

//         // Pull the request from the current user
//         const updateUser = await User.findByIdAndUpdate(userId, {
//             $pull: { requests: { from: requestId } },  // Assuming "requests" is an array of objects with a "from" field
//         }, { new: true });

//         console.log("updateUser", updateUser);

//         if (!updateUser) {
//             return res.status(404).json({ message: 'Request not found' });
//         }

//         // Add the requestId to the current user's friends list
//         const updatedUser = await User.findByIdAndUpdate(userId, {
//             $addToSet: { friends: requestId },  // Use $addToSet to prevent duplicates
//         }, { new: true });

//         console.log("updatedUser updated:", updatedUser); 

//         updatedUser.friends.push(requestId);
//         await updatedUser.save()

//         // Add userId to the friend's friends list
//         const friendUser = await User.findByIdAndUpdate(requestId, {
//             $addToSet: { friends: userId },  // Same here, use $addToSet to prevent duplicates
//         }, { new: true });

//         console.log("friendUser updated:", friendUser);  // Check the updated document

//         friendUser.friends.push(userId);
//         await friendUser.save()

//         if (!friendUser) {
//             return res.status(404).json({ message: 'Friend not found' });
//         }

//         // Success response
//         res.status(200).json({ message: 'Request accepted successfully' });

//     } catch (error) {
//         console.error("Error during request acceptance:", error);  // Log the error
//         res.status(500).json({ message: "Server Error", error: error.message });  // Return error message for debugging
//     }
// });


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