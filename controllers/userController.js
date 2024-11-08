const passwordValidator = require('password-validator')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/User")

var schema = new passwordValidator();
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                              // Must have 1 uppercase  letters
    .has().lowercase(1)                              // Must have 1 lowercase letters
    .has().digits(1)                                // Must have 1 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values



    function registerUser(req, res) {
        if (schema.validate(req.body.password)) {
            const data = new User(req.body)
            bcrypt.hash(req.body.password, 12, async (error, hash) => {
                if (error)
                    res.status(500).send({ result: "Fail", reason: "Internal Server Error | Hash Password Doesn't Generated" })
                else {
                    try {
                        data.password = hash
                        await data.save()
    
                        jwt.sign({ data }, process.env.JWT_SECRET_KEY, (error, token) => {
                            if (error)
                                res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
                            else
                                res.send({ result: "Done", data: data, token: token, message: "User Record Created SuccessFully" })
                        })
                    } catch (error) {    
                        const errorMessage = {}
                        error.keyValue?.username ? errorMessage.username = "User Name Already Exist" : ""
                        error.keyValue?.email ? errorMessage.email = "Email Address Already Exist" : ""
                        error.errors?.name ? errorMessage.name = error.errors.name.message : ""
                        error.errors?.username ? errorMessage.username = error.errors.username.message : ""
                        error.errors?.email ? errorMessage.email = error.errors.email.message : ""
                        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : ""
                        error.errors?.password ? errorMessage.password = error.errors.password.message : ""
    
                        Object.values(errorMessage).filter((x) => x !== "").length === 0 ?
                            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
                            res.send({ result: "Fail", reason: errorMessage })
                    }
                }
            })
        }
        else
            res.send({ result: "Fail", reason: { password: "Invalid Password!!! Password Must Contains atleast 1 Digit, 1 Upper Case, 1 Lower Case Character and should not contain any space and length must be within 8-100 " } })
    }


    async function login(req, res) {
        try {
            let data = await User.findOne({
                $or: [
                    { email: req.body.username },
                    { username: req.body.username }
                ]
            })
            if (data && await bcrypt.compare(req.body.password, data.password)) {
                jwt.sign({ data }, process.env.JWT_SECRET_KEY, (error, token) => {
                    if (error)
                        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
                    else
                        res.send({ result: "Done", data: data, token: token })
                })
            }
            else
                res.status(401).send({ result: "Fail", reason: "Username or Password Invalid" })
        } catch (error) {
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
        }
    }

    async function getAllUsers(req, res) {
        try {
            const data = await User.find()
            if (data)
                res.send({ result: "Done", data: data })
            else
                res.send({ result: "Fail", reason: "Users  Not Found" })
        } catch (error) {
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
        }
    }

    async function getSingleUser(req, res) {
        try {
            const data = await User.findOne({ _id: req.params._id })
            if (data)
                res.send({ result: "Done", data: data })
            else
                res.send({ result: "Fail", reason: "Invalid ID, Record Not Found" })
        } catch (error) {
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
        }
    }



    async function updateUser(req,res) {
        try {
            const data = await User.findOne({ _id: req.params._id })
            if (data) {
                data.name = req.body.name ?? data.name
                data.phone = req.body.phone ?? data.phone
                data.address = req.body.address ?? data.address
                data.pin = req.body.pin ?? data.pin
                data.city = req.body.city ?? data.city
                data.state = req.body.state ?? data.state
                if(req.file){
                    try {
                        const fs = require("fs")
                        fs.unlinkSync(data.pic)
                    } catch (error) {
                        res.json(error)
                    }
                    data.pic = req.file.path
                }
                await data.save()
                res.send({ result: "Done", message: "Post Updated SuccessFully" })
            }
            else
                res.send({ result: "Fail", reason: "Invalid ID, User Not Found" })
        } catch (error) {
            const errorMessage = {}
            error.keyValue ? errorMessage.title = "Title Already Exist" : ""
            Object.values(errorMessage).find(x => x !== "") ?
                res.status(500).send({ result: "Fail", ...errorMessage }) :
                res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
        }
    }


    // async function updateUser(req, res) {
    //     console.log('hitted')
    //     try {
    //         const data = await User.findOne({ _id: req.params._id })
    //         console.log(data,'jbdfhd')
    //         if (data) {
    //             console.log(req.body,'body')
    //             data.name = req.body.name ?? data.name
    //             data.phone = req.body.phone ?? data.phone
    //             data.address = req.body.address ?? data.address
    //             data.pin = req.body.pin ?? data.pin
    //             data.city = req.body.city ?? data.city
    //             data.state = req.body.state ?? data.state
    //             if (req.file) {
    //                 try {
    //                     const fs = require("fs")
    //                     fs.unlinkSync(data.pic)
    //                 } catch (error) {
    //                     res.json(error)
    //                  }
    //                 data.pic = req.file.path
    //             }
    //             await data.save()
    //             res.send({ result: "Done", data: data, message: "Profile Updated SuccessFully" })
    //         }
    //         else
    //             res.send({ result: "Fail", reason: "Invalid ID, Record Not Found" })
    //     } catch (error) {
    //         const errorMessage = []
    //         error.keyValue ? errorMessage.push({ name: "User Already Exist" }) : ""
    
    //         errorMessage.length === 0 ?
    //             res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
    //             res.status(500).send({ result: "Fail", reason: errorMessage })
    //     }
    // }


    module.exports={registerUser,login,getSingleUser,updateUser,getAllUsers}