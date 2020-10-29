import express from 'express'
import auth from '../middleware/isAuth.mdlw.js'
const router = express.Router()

router.get('/blogs', (req, res)=>{
    // res.render('pages/admin/admin')
    res.send('Hello world')
})

export default router