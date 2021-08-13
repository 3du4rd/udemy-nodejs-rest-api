const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.getUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then(user => {
      if (!user) {
        const error = new Error('Could not find User.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'User fetched.', user: user });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateUser = (req, res, next) => {
  const userId = req.params.userId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const name = req.body.name;
  const status = req.body.status;

  User.findById(userId)
    .then(user => {
      if (!user) {
        const error = new Error('Could not find User.');
        error.statusCode = 404;
        throw error;
      }
      if (user._id.toString() !== req.userId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
      }

      user.name = name;
      user.status = status;
      return user.save();
    })
    .then(result => {
      res.status(200).json({ message: 'User updated!', user: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then(user => {
      if (!user) {
        const error = new Error('Could not find user.');
        error.statusCode = 404;
        throw error;
      }
      if (user._id.toString() !== req.userId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
      }
      return User.findByIdAndRemove(userId);
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Deleted user.' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getUserStatus = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ status: user.status });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateUserStatus = (req, res, next) => {
  const newStatus = req.body.status;
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
      }
      user.status = newStatus;
      return user.save();
    })
    .then(result => {
      res.status(200).json({ message: 'User updated.' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};