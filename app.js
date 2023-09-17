const express = require('express');
//import express from 'express';
const cookieParser = require('cookie-parser');
const postRoute = require('./routes/postRoute')
const userRoute = require('./routes/userRoute')
const verifyJWT = require("./middleware/verifyJWT")
const app = express();
require("dotenv").config();

// app.get('/blog', (req, res) => {
//     res.send("Welcome to the Node Blog")
// })

// app.get('/', (req, res) => {
//     res.send("Welcome to the Node world")
// })
app.use(express.json())
app.use(cookieParser())
app.use("/user", userRoute)
app.use(verifyJWT)
app.use("/blog", postRoute)

module.exports = app