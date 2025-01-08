import express from 'express';

import userController from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/login', userController.verifyUser, (_req, res) => {
	console.log(`✅ Passed all middleware for '/login' route`);
  res.status(200).json({
		message: 'Successfully Logged In',
		data: {
			username: res.locals.username,
			firstName: res.locals.firstName,
			lastName: res.locals.lastName,
			approved: res.locals.approved,
		},
	});
});

userRouter.post('/signup', userController.createUser, (_req, res) => {
  console.log(`✅ Passed all middleware for '/signup' route`);
	res.status(200).json({
		message: 'Successfully created a new user',
		data: res.locals.newUser,
	});
});

export default userRouter;