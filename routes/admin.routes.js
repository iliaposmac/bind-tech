import express from 'express'
import firebaseFirestore from '../configuration/firebase.js' 
import admin from '../middleware/user_role.mdlw.js'
import auth from '../middleware/isAuth.mdlw.js'
const router = express.Router()

// Get all articles
router.get('/articles',auth, admin ,async(req, res)=>{
    const articles = []
    const fireStore = await firebaseFirestore.collection('articles').get()
    fireStore.docs.map(snapshot => {
        articles.push({...snapshot.data(), id: snapshot.id})
    })
    console.log(articles)
    res.render('pages/admin/admin', {
        articles: articles
    })
})

// Remove article
router.post('/remove/:id', auth, admin ,async(req,res)=>{
    try {
        const article = await firebaseFirestore.collection('articles').doc(req.body.articleId).delete()
        if(!article){
            res.status(200).json(req.body)
        }else{
            res.status(400).json('Cant delete')
        }
    } catch (error) {
        res.status(400).json(error)
    }
})
export default router