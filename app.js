const express = require('express');
//import express from 'express';
const postRoute = require('./routes/postRoute')
const app = express();

// app.get('/blog', (req, res) => {
//     res.send("Welcome to the Node Blog")
// })

// app.get('/', (req, res) => {
//     res.send("Welcome to the Node world")
// })
app.use(express.json())
app.use("/blog",postRoute)
module.exports = app