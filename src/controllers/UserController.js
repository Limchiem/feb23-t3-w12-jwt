// Import express library
const express = require('express');
const { User } = require('../models/UserModel');
const { comparePassword, generateJwt } = require('../functions/userAuthFunctions');

// Make an instance of a router
const router = express.Router();

// Customise route
// GET localhost:3000/users/
// Expect all user in db

router.get("/", async (request, response) => {
	let result = await User.find({});

	response.json({result});
})

// GET localhost:3000/users/laijhjsdaljfdhbsal
router.get("/:id", async (request, response) => {
	let result = await User.findOne({_id: request.params.id});

	response.json({result});
})

// POST localhost:3000/users/
router.post("/", async (request, response) => {
	let newUser = await User.create(request.body).catch(error => error);

	response.json(newUser);
})

// POST localhost:3000/users/login
// request.body = {username: "admin", password: "Password1"}
// respond with {jwt: "sadagagsa"}
router.post("/login", async (request, response) => {
	// Find user by provided username 
	let targetUser = await User.findOne({username: request.body.username}).catch(error => error);

	// Check if user provided the correct password
	let isPasswordCorrect = await comparePassword(request.body.password, targetUser.password);

	if (!isPasswordCorrect){
		response.status(403).json({error:"You are not authorised to do this!"});
	}

	// If they provided the correct, generate a JWT
	let freshJwt = generateJwt(targetUser._id.toString());

	// respond with the JWT 
	response.json({
		jwt: freshJwt
	});

});

// GET localhost:3000/users/verify
// JWT in request.header["jwt"] or request.headers["authorisation"]
// respond with {jwt: "sadagagsa", valid: true}
router.get("/verify", async (request, response) => {

})

// GET localhost:3000/users/regenerate
// JWT in request.header["jwt"] or request.headers["authorisation"]
// respond with {jwt: "sadagagsa", valid: true}
router.get("/regenerate", async (request, response) => {

})

module.exports = router;