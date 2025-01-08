import express from 'express';
import bcrypt from 'bcrypt';

import User from '../models/userModel.js';

const userController = {
	// Middleware to check credentials and log the user in
	verifyUser: async (req, res, next) => {
		console.log(`😇 Running verifyUser middleware...`);

		try {
			const { username, password } = req.body;
			const foundUser = await User.findOne({ username });
			
      if (!foundUser) {
				return next({
					log: `🤨 User not found`,
					status: 404,
					message: { err: 'Incorrect credential' },
				});
			}

      // Compare imput password versus hashed password
      const isMatched = await bcrypt.compare(password, foundUser.password);
      if (!isMatched) {
        return next({
          log: `🤨 Incorrect credentials`,
          status: 400,
          message: { err: 'Invalid credentials' },
        });
      }

      //Send all of these back to the front-end
      res.locals.approved = isMatched;
      res.locals.username = username;
      res.locals.firstName = foundUser.firstName;
      res.locals.lastName = foundUser.lastName;
      return next();
		} catch (error) {
			return next({
				log: `🤨 Error Occurred in verifyUser middleware: ${error}`,
				status: 500,
				message: { err: 'Unable to log in' },
			});
		}
	},

  // Middleware to create a new instance of user in the DB
  createUser: async (req, res, next) => {
    console.log(`😉 Running createUser middleware...`);

    try {
      const { username, password, email, firstName, lastName } = req.body;
      if (!username || !password || !email || !firstName || !lastName) {
        return next({
          log: `🧐 Missing required fields`,
          status: 400,
          message: { err: 'Missing required inputs' }
        });
      }
      const newUser = await User.create({ username, password, email, firstName, lastName });
      res.locals.newUser = newUser;
      return next();
    } catch (error) {
      return next({
        log: `😥 Error Occurred in createUser middleware: ${error}`,
        status: 500,
        message: { err: 'Unable to create new user' }
      })
    }
  }
};

export default userController;