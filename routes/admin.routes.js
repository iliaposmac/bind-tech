import express from 'express'
const router = express.Router()

router.get('/admin', (req, res)=>{
    // res.render('pages/admin/admin', {title: 'Admin page'})
    res.send('Hello world')
})

export default router