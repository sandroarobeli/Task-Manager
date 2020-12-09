const Task = require('../models/task')

// List all tasks
exports.task_list = async (req, res, next) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort                 
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        return next('Error:\n' + error) // keep return next(error) format till FRONT-end
    }
}

// Display a particular task
exports.task_detail = async (req, res) => {
    try {
        const _id = req.params.id
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send('Task not found')
        }
        res.send(task)
    } catch (error) {
        res.status(500).send('Error(s)\n' + error)
    }
}

// Handle task create on POST
exports.task_create_post = async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send('Error\n' + error)
    }
}

// Handle task update on PATCH
exports.task_update_patch = async (req, res) => {
    const updates = Object.keys(req.body)
    try {
        const _id = req.params.id
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send('Task not found')
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send('Error(s)\n' + error)
    }
}

// Handle task delete on DELETE
exports.task_delete_delete = async (req, res) => {
    try {
      const _id = req.params.id
      const task = await Task.findOneAndDelete({ _id, owner: req.user._id })
      if (!task) {
        return res.status(404).send('Task not found')
      }
      res.send('The following task has been deleted\n' + task)
    } catch (error) {
      res.status(500).send('Error(s)\n' + error)
    }
}