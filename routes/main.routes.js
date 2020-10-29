import express from 'express'
const router = express.Router()

router.get('/', (req, res)=>{
    res.render('pages/index', {title: "Home page"})
})

export default router