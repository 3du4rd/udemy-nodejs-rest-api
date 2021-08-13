const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// router.get('/:userId', userController.getUser);

// router.put(
//   '/:userId', isAuth,
//   [
//     body('name')
//       .trim()
//       .isLength({ min: 5 }),
//     body('status')
//       .trim()
//       .isLength({ min: 5 })
//   ],
//   userController.updateUser
// );

// router.delete('/:userId', isAuth, userController.deleteUser);

router.get('/status', isAuth, userController.getUserStatus);

router.patch(
  '/status',
  isAuth,
  [
    body('status')
      .trim()
      .not()
      .isEmpty()
  ],
  userController.updateUserStatus
);

module.exports = router;