const User = require('../models/user')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')

// Display current logged in user
exports.user_list = async (req, res, next)  => {
    res.send(req.user)
}

// Handle user create on POST
 exports.user_create_post =  async (req, res) => {
    try {
      const user = new User(req.body)
      await user.save()
      sendWelcomeEmail(user.email, user.name)
      const token = await user.generateAuthToken()
      res.status(201).send({ user: user.getPublicProfile(), token })
    } catch (error) {
      res.status(400).send('Error(s)\n' + error)
    }
}

// Handle user login on POST
exports.user_login_post = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user: user.getPublicProfile(), token })
    } catch (error) {
        res.status(400).send('Unable to login')
    }
}

// Handle user logout on POST
exports.user_logout_post = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send(req.user.name + ' has logged out of current session')
    } catch (error) {
        res.status(500).send()
    }
}

// Handle all users logout POST
exports.user_logoutAll_post = async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send(req.user.name + ' has logged out of all sessions')
    } catch (error) {
        res.status(500).send()
    }
}

// Handle user update on PATCH
exports.user_update_patch = async (req, res) => {
    const updates = Object.keys(req.body)
    try {
      updates.forEach((update) => {
          req.user[update] = req.body[update]
      })
      await req.user.save()
      res.send('The following user has been updated\n' + req.user)
    } catch (error) {
     res.status(400).send('Error(s)\n' + error)
    }
}

// Handle user delete on DELETE
exports.user_delete_delete = async (req, res) => {
    try {
      await req.user.remove() // user field gets attached to req in auth
      sendCancelEmail(req.user.email, req.user.name)
      res.send('The following user has been deleted\n' + req.user)
    } catch (error) {
      res.status(500).send('Error(s)\n' + error)
    }
}

// Handle user profile avatar upload on POST
exports.user_upload_post = async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer)
            .resize({ width: 250, height: 250 }).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send('File upload successful')
    } catch (error) {
        res.status(400).send('Unable to upload file')
    }
}

// Handle user profile avatar delete on DELETE
exports.user_upload_delete = async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send('Profile picture has been removed')
    } catch (error) {
        res.status(500).send('Error(s)\n' + error)
    }
}

// Handle user profile avatar display on GET
exports.user_upload_serve = async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send('Unable to fetch profile picture')
    }
}