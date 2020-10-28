import express from 'express'
const router = express.Router()

router.get('/', (req, res)=>{
    // res.render('pages/admin/admin')
    res.send('Hello from main routes')
})

export default router