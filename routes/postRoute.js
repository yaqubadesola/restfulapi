const express = require('express')
const postController = require('../controllers/postController')
const postRouter = express.Router()
postRouter.get('/', postController.index)
postRouter.post('/create', postController.create)
postRouter.get('/:id', postController.readOne)
postRouter.put('/edit/:id', postController.edit)
postRouter.delete('/:id', postController.destroy)
module.exports = postRouter