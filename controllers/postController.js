
 const index = (req, res) => {
    res.send("Welcome to the Node world")
}

 const readOne = (req, res) => {
    res.send("Welcome to the Node Blog first Post")
}

const create = (req, res) => {
    console.log("Request params ", req.body)
    res.send("Welcome to the Node Blog first Post")
}

 const edit = (req, res) => {
    res.send("I want to edit first Post")
}
module.exports = {
    index: index,
    readOne: readOne,
    edit: edit,
    create:create
}