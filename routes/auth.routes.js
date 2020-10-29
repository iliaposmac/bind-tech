import express from 'express'
import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const router = express.Router()

// Get login page
router.get('/login', (req, res)=>{
    res.render('pages/login', {title: "Login page"})
})
// Get reg page
router.get('/registration', (req, res)=>{
    res.render('pages/reg', {title:"Registration page"})
})

// Reg process
router.post('/registration', async(req, res)=>{
    const {username, email, password} = req.body
    const userFind = await User.findOne({username: username})
    if(!userFind){
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = new User ({
            username: username,
            email: email,
            password: hashedPassword
        })
        await newUser.save()
        return res.status(200).json(newUser)
    }   
    return res.status(400).json({
        message: "User exists"
    })
})

// Login process
router.post('/login', async(req, res)=>{
    const {username, password} = req.body
    const userFind = await User.findOne({username: username})
    if(!userFind){
        return res.status(400).json({
            message: 'User doesnt exist'
        })
    }
    const comparePass = await bcrypt.compare(password, userFind.password)
    if(!comparePass){
        return res.status(400).json({
            message: 'Incorrect data'
        })
    }
    const token = await jwt.sign({role: userFind.role, username: userFind.username, id: userFind._id}, process.env.JWT_SECRET, {expiresIn: '2h'})
    res.cookie('bind_tech', token, {
        maxAge: 2*60*60*1000
    })
    return res.redirect(302, '/blog/add')
})

// Logout
router.get('/logout', (req, res)=>{
    try {
        res.cookie('bind_tech')
        res.clearCookie('bind_tech')
        res.redirect('/login')
    } catch (error) {
        res.status(400).json(error)
    }
})

export default router