import express from 'express'
import auth from '../middleware/isAuth.mdlw.js'
import firebaseFirestore from '../configuration/firebase.js'
import Comments from '../models/comment.model.js'

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
    const commentsFromDb = await Comments.find({articleId: articleId})
    const comments = commentsFromDb.map((comment)=>{
        return {comment: comment.comment, name: comment.username}
    })
    console.log(comments)
    firebaseFirestore.collection('articles').get().then(snapshot=>{
        snapshot.docs.map(article => {
            if(article.id == articleId){
                console.log({id: article.id, data: article.data()})
                return res.render('pages/blog-single', {
                    id: article.id,
                    title:article.data().title,
                    article: article.data(),
                    comments: comments
                })
            }
        })
    })
})

// Add comments to each article separatly
router.post('/:id/comments', async(req, res)=>{
    const newComment = new Comments({
        username: req.body.name,
        comment:req.body.comment,
        articleId: req.body.articleId
    })
    await newComment.save()
    res.redirect(302, '/blog/all')
})


// Get user's articles
router.get('/my_articles', auth ,async(req, res)=>{
    const user = req.user
    const articles = []
    const fireStore = await firebaseFirestore.collection('articles').get()
    fireStore.docs.map(snapshot => {
        if(snapshot.data().userId == user._id){
            articles.push({...snapshot.data(), id: snapshot.id})
        }
    })
    // console.log(articles)
    res.render('pages/user-articles', {
        articles: articles
    })
})


// Delete user's article
router.post('/my_articles/remove/:id', async(req, res)=>{
    console.log(req.body)
    try {
        const article = await firebaseFirestore.collection('articles').doc(req.body.articleId).delete()
        if(article){
            res.status(200).json(req.body)
        }else{
            res.status(200).redirect('/blog/my_articles')
        }
    } catch (error) {
        res.status(400).json(error)
    }
})
export default router