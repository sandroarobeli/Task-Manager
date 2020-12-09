const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController')
const auth = require('../middleware/auth')

/// TASK ROUTES ///


// GET request for listing tasks
router.get('/tasks', auth, taskController.task_list)

// GET request for displaying a particular task
router.get('/tasks/:id', auth, taskController.task_detail)

// POST request for creating task
router.post('/tasks', auth, taskController.task_create_post)

// PATCH request for updating task
router.patch('/tasks/:id', auth, taskController.task_update_patch)

// DELETE request for deleting task
router.delete('/tasks/:id', auth, taskController.task_delete_delete)

module.exports = router