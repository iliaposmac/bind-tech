import express from 'express'
const router = express.Router()

router.get('/auth', (req, res)=>{
    // res.render('pages/admin/admin')
    res.send('Hello world')
})

export default router