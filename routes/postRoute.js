const express = require('express')
const postController = require('../controllers/postController')
const postRouter = express.Router()
postRouter.get('/', postController.index)
postRouter.post('/create', postController.create)
postRouter.get('/1', postController.readOne)
postRouter.get('/edit/1', postController.edit)

module.exports = postRouter