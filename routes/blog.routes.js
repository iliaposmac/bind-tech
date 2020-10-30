import express from 'express'
import auth from '../middleware/isAuth.mdlw.js'
import firebaseFirestore from '../configuration/firebase.js'
import Comments from '../models/comment.model.js'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

// Initialize firebase
const router = express.Router()

// Get all articles
router.get('/all', async(req, res)=>{
    try {
        firebaseFirestore.collection('articles').orderBy('time', 'asc').onSnapshot((articles)=>{
            const newArticles = articles.docs.map(doc=>({id: doc.id, data: doc.data()}))
            return res.render('pages/articles', {
                articles: newArticles.filter(art=>art.data.posted === true)
            })
        })
    } catch (error) {
        res.status(400).json(error.message)
    }
})

router.get('/add', auth ,(req, res)=>{
    res.render('pages/add-blog')
})

// Post articles
router.post('/add', auth , async(req, res)=>{
    const {title, shortDescription,textContent, postArticle} = req.body
    const user = req.user
    const article = {
        title: title,
        username: user.username,
        shortDescription: shortDescription,
        textContent: textContent,
        userId: user._id.toString(),
        time: new Date().toString(),
        posted: postArticle == true ? "true" : false
    }
    console.log(article)
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
    let commentsFromDb = []
    try {
        commentsFromDb = await Comments.find({articleId: articleId})
    } catch (error) {
        console.log("Find comments from DB error" , error.message)        
    }
    
    let comments = []
    let token = null;
    const cookie = req.get('cookie')
    
    if(cookie){
        token = cookie.split(';')
        .find(c => c.includes('bind_tech='))
        .trim().split('bind_tech=')
        .filter(x => x !=='')[0]
    }

    try {
        const data = await jwt.decode(token, process.env.JWT_SECRET)
        if(data){
            commentsFromDb.map((comment)=>{
                if(comment.userId == data.id){
                    comments.push({comment: comment.comment, name: comment.username, commentId:comment._id, myComment: true})
                }else{
                    comments.push({comment: comment.comment, name: comment.username, commentId:comment._id, myComment: false})
                }
            })
        }
    } catch (error) {
        console.log("Error with data and user JWT",error)
    }
    console.log(comments)
    try {
        firebaseFirestore.collection('articles').get().then(snapshot=>{
            snapshot.docs.map(article => {
                if(article.id == articleId){
                    console.log({id: article.id, data: article.data(), })
                    return res.render('pages/blog-single', {
                        id: article.id,
                        title:article.data().title,
                        article: article.data(),
                        comments: comments
                    })
                }
            })
        })
    } catch (error) {
        console.log("Error with firebase", error)
    }
})

// Add comments to each article separatly
router.post('/:id/comments',async(req, res)=>{

    const cookie = req.get('cookie')
    const token = cookie.split(';')
        .find(c => c.includes('bind_tech='))
        .trim().split('bind_tech=')
        .filter(x => x !=='')[0]
    const data = await jwt.decode(token, process.env.JWT_SECRET)

    if(data){
        const newComment = new Comments({
            username: req.body.name,
            comment:req.body.comment,
            articleId: req.body.articleId,
            userId: data.id
        })
        await newComment.save()
    }else{
        const newComment = new Comments({
            username: req.body.name,
            comment:req.body.comment,
            articleId: req.body.articleId
        })
        await newComment.save()
    }
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

// Update article
router.get('/my_articles/:id/update', auth ,async(req, res)=>{
    const article = await firebaseFirestore.collection('articles').doc(req.params.id).get()
    console.log(article.data().shortDescription)
    res.render('pages/article-update', {
        article: article.data(),
        id: article.id
    })
})

// Update article
router.post('/my_articles/:id/update', auth ,async(req, res)=>{
    const {id, title ,shortDescription, textContent, postArticle} = req.body
    const article = await firebaseFirestore.collection('articles').doc(id).update({
        title: title,
        shortDescription: shortDescription,
        textContent: textContent,
        posted: postArticle === "true" ? true : false
    })
    // console.log(postArticle === "true" ? true : false)
    res.redirect(302, '/blog/my_articles')
})

router.get('/:id/remove_comments', auth , async(req, res)=>{
    try {
        const comment = Comments.findOne({_id: req.params.id})
        await comment.deleteOne()
        res.redirect(302, '/blog/my_articles')
    } catch (error) {
        res.status(400).json(error.message)
    }
})

router.post('/:id/edit_comments', auth , async(req, res)=>{
    try {
        console.log(req.body.comment_update)
        const comment = await Comments.updateOne({_id: req.body.commentId}, {comment: req.body.comment_update})
        res.redirect(302, '/blog/all')
    } catch (error) {
        res.status(400).json(error.message)
    }
})

export default router