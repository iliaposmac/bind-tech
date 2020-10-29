import express from 'express'
import auth from '../middleware/isAuth.mdlw.js'
import firebase from 'firebase'
import firebaseFirestore from '../configuration/firebase.js'

// Initialize firebase
const router = express.Router()

router.get('/all', async(req, res)=>{
    firebaseFirestore.collection('articles').orderBy('time', 'asc').onSnapshot((articles)=>{
        const newArticles = articles.docs.map(doc=>({id: doc.id, data: doc.data()}))
        return res.render('pages/articles', {
            articles: newArticles
        })
    })
})

router.get('/add', auth ,(req, res)=>{
    res.render('pages/add-blog')
})

// Post articles
router.post('/add', auth , async(req, res)=>{
    const {title, shortDescription,textContent} = req.body
    const user = req.user
    console.log(req.body)
    const article = {
        title: title,
        username: user.username,
        shortDescription: shortDescription,
        textContent: textContent,
        userId: user._id.toString(),
        time: new Date().toString()
    }
    try {
        const newArticle = await firebaseFirestore.collection('articles').add(article)
        if(newArticle){
            return res.redirect('/blog/all')
        }
    } catch (error) {   
        return res.status(400).json({
            message: error.message
        })
    }
    return res.status(200).json(newArticle)
})

// Get single article
router.get('/articles/:articleId', async(req, res)=>{
    const articleId = req.params.articleId
    // console.log(firebaseFirestore.collection('articles'))
    firebaseFirestore.collection('articles').get().then(snapshot=>{
        const articleFromDB = snapshot.docs.map(article => {
            if(article.id == articleId){
                console.log({id: article.id, data: article.data()})
                // return res.status(200).json({id: article.id, data: article.data()})
                return res.render('pages/blog-single', {
                    id: article.id,
                    title:article.data().title,
                    article: article.data()
                } )
            }
        })
    })
})

export default router