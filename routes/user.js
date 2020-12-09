const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')
const avatar = require('../middleware/avatar')

/// USER ROUTES ///

// GET request for displaying logged in (authorized) user's profile. 
router.get('/users/me', auth , userController.user_list);

// POST request for creating user
router.post('/users', userController.user_create_post)

// POST request for logging IN user
router.post('/users/login', userController.user_login_post)

// POST request for logging OUT user
router.post('/users/logout', auth, userController.user_logout_post)

// POST request for logging OUT ALL users
router.post('/users/logoutAll', auth, userController.user_logoutAll_post)

// PATCH request for updating user
router.patch('/users/me', auth, userController.user_update_patch)

// DELETE request for deleting user
router.delete('/users/me', auth, userController.user_delete_delete)

// POST request for uploading user profile picture
router.post('/users/me/avatar', auth, avatar.imageUpload('avatar'), userController.user_upload_post, avatar.errorMessage)

// DELETE request for deleting user profile picture
router.delete('/users/me/avatar', auth, userController.user_upload_delete)

// GET request for serving user profile picture
router.get('/users/:id/avatar', userController.user_upload_serve)

module.exports = router;
