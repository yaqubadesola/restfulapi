const db = require('../models')
const Validator = require('fastest-validator')
const Post = db.Post
const index = async(req, res) => {
   try {
       const allPost = await Post.findAll()
       if (res.status(200) && allPost) {
           res.status(200).json({ data: allPost })
       } else {
           res.status(400).json({ message:"No record found"})
       }
   } catch (error) {
        res.status(500).json({ message:error.message})
   }
}

 const readOne = async(req, res) => {
     try {
       const id = req.params.id
       const post = await Post.findByPk(id)
       if (res.status(200) && post) {
           res.status(200).json({ data: post })
       } else {
           res.status(400).json({ message:"No record found"})
       }
   } catch (error) {
        res.status(500).json({ message:error.message})
   }
}

const create = async (req, res) => {
    console.log("Request params ", req.body)
    try {
        const postData = {
            title: req.body.title,
            description: req.body.description,
            userId: req.body.userId,
            categoryId: req.body.categoryId
        } 
        
        const schema = {
            title: { type: "string", min: 5, max: 50 },
            description: { type: "string", min: 10, max: 255 },
            userId: { type: "number", integer: true },
            categoryId: { type: "number", integer: true }
        };
        const validateData = new Validator()
        const check = validateData.compile(schema)
        //const validateChecker = validateData.validate(postData,schema);
        if (check(postData) !== true) {
            return res.status(400).json({ errors: check(postData) })
        }
        const postRes = await Post.create(postData)
        if (res.status(201) && postRes) {
            res.status(201).json({
                message: "Post created successfully",
                post:postData
            })
        } else {
            res.status(404).json({
                message: "Post could not be created successfully"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Post could not be created successfully - Something went wrong",
            error: error.message
            })
    }
    
}

 const edit = async(req, res) => {
     try {
         const postData = {
            //
            title: req.body.title,
            description: req.body.description,
            userId: req.body.userId,
            categoryId: req.body.categoryId
        }
         const id = req.params.id
         //[0]
       const [postRow, postRes] = await Post.update(req.body, { where: { id: id } })
       console.log("postssss ",postRes)
       if (res.status(200) && postRow > 0) {
           res.status(200).json({ data: "Record edited successfully" })
       } else {
           res.status(400).json({ message:"No record found"})
       }
   } catch (error) {
        res.status(500).json({ message:error.message})
   }
}

const destroy = async(req, res) => {
    try {
        const id = req.params.id
        const post = await Post.destroy({ where: { id: id } })
       if (res.status(200) && post) {
           res.status(200).json({ data: "Deleted Successfully" })
       } else {
           res.status(400).json({ message:"No record found"})
       }
    } catch (error) {
        res.status(500).json({ message:error.message})
    }
}

module.exports = {
    index: index,
    readOne: readOne,
    edit: edit,
    create: create,
    destroy:destroy
}