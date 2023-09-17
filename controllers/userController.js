const db = require('../models')
const Validator = require('fastest-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv").config()
const User = db.User


const create = (req, res) => {
    console.log("Request params ", req.body)
    try {
        //
        bcrypt.hash(req.body.password, 10).then(hashedPassword =>  {
                console.log("Hasehed Password = ",hashedPassword)
                    const userData = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        password: hashedPassword,
                        email: req.body.email
                    } 

                    const schema = {
                            firstName: { type: "string", min: 5, max: 50 },
                            lastName: { type: "string", min: 5, max: 50 },                            
                            email: { type: "email",  min: 5, max: 50 }
                    };
                    const validateData = new Validator()
                    const check = validateData.compile(schema)
                    //const validateChecker = validateData.validate(postData,schema);
                    if (check(userData) !== true) {
                        return res.status(400).json({ errors: check(userData) })
                    }
                    User.create(userData).then(result => {
                        res.status(201).json({
                            message: "User created successfully",
                            user:userData
                        })
                    }).catch(err => {
                        res.status(404).json({
                            message: "User could not be created successfully"
                        })
                    })
            }).catch(err => {
            console.log("error is here ", err)
            res.status(500).json({message: err.message})
        })
       

    } catch (error) {
        res.status(500).json({
            message: "User could not be created successfully - Something went wrong",
            error: error.message
            })
    }
    
}

const logIn = async(req, res) => {
     try {
        const {email, password} = req.body
        if (!email || !password) return res.status(401).json({ message: "Email and Password are required" })
         const checkUser = await User.findOne({ where: { email: email } })
         if(!checkUser) return res.status(401).json({ message: "Email/Password is required" })
         const passwordMatch = bcrypt.compare(password, checkUser.password)
         if (!passwordMatch) return res.status(401).json({ message: "Email/Password is required" })
         //Generate Access and Refresh token then save refresh token to user's DB
         if (passwordMatch && checkUser) {
             checkUser.password = ""
             checkUser.refreshToken = ""
            //console.log("checkUser = ",checkUser)
            const accessToken = jwt.sign(
                { userDet: checkUser },
                process.env.ACCESS_SECRET_KEY,
                { expiresIn: "60s" }
            )

            const refreshToken = jwt.sign(
                { userDet: checkUser },
                process.env.REFRESH_SECRET_KEY,
                { expiresIn: "1d" }
             )
             
             //Test if both access token and refresh token are valid
            const updateUserData = {
                //
                refreshToken:refreshToken,
            }
            const [userRow, postRes] = await User.update(updateUserData, { where: { email: checkUser.email } })
                if (userRow > 0) {
                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        sameSite: "None",
                        secure: false,
                        maxAge: 24 * 60 * 60 * 1000,
                    });
                    res.status(200).json({accessToken})
            }
         }
   } catch (error) {
        res.status(500).json({ message:error.message})
   }
}

const getRefreshToken = async (req, res) => {
    const cookies = req.cookies
    // console.log("cookies req = ",req.cookies)
    if (!cookies?.refreshToken) return res.status(403).json({ message: "You are forbidden (unauthorized) 1" })
    const { refreshToken } = cookies
    const getUser = await User.findOne({ where: { refreshToken: refreshToken } })
    if (!getUser?.refreshToken) return res.status(403).json({ message: "You are forbidden (unauthorized) 2" })
     jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({message:"Invalid/Expired refresh token "+err.message})
         if (decoded) {
        console.log("decoded = ",decoded)
        const { email } = decoded.userDet
        if (email === getUser.email) {
            getUser.password = ""
            getUser.refreshToken = ""
            const accessToken = jwt.sign(
            { userDet: getUser },//payload that contains claim
            process.env.ACCESS_SECRET_KEY,
            { expiresIn: "60s" }
            )
        res.status(200).json({accessToken})
        } else {
            return res.status(401).json({message:"Unauthorized to access this resource"});
        }
    }
  });
}
module.exports = {
    // index: index,
    // readOne: readOne,
    // edit: edit,
    logIn,
    create,
    getRefreshToken
}