const express = require('express')
const router = express.Router()
const db = require('../models')
const axios = require('axios')

//CREATE book favorite on button click
router.post('/profile', async (req,res)=>{
    try{
        //create new favorite book
        console.log(req.params.id)
        await db.book.findOrCreate({
            where:{
                title: req.body.title,
                img_url: req.body.img_url,
                userId: res.locals.user.id,
                libraryId: req.body.libraryId
            }
        })
    res.redirect('/users/profile')
    }catch(err){
        res.render('404.ejs')
        console.log(err)
    }
})

//Delete a book from favorites on profile
router.delete('/profile/:id', async (req,res)=>{
    try{
        await db.book.destroy({
            where: {title: req.params.id}
        })
        res.redirect('/users/profile')
    }catch(err){
        console.log(err)
        res.render('404.ejs')
    }

})

//create new comment
router.post('/results/:id', async (req,res)=>{
    console.log(res.locals.user)
    try{
        const newComment = await db.review.create({
            userId: res.locals.user.dataValues.id,
            name: req.body.name,
            content: req.body.content,
            bookId: req.body.id
        })
        const response = await axios.get(`https://openlibrary.org/works/${req.params.id}`)
        const reviews = await db.review.findAll({
            where: {
                bookId: req.params.id
            }
        })
        res.render('books/show.ejs', {
            data : response.data,
            reviews: reviews
        })
    }catch(err){
        console.log(err)
        res.render('404.ejs')
    }
})


//find comment to edit
router.get('/results/:bookid/edit/:id', async (req,res)=>{
    try {
        const review = await db.review.findOne({
            where:{
                bookId: req.params.bookid,
                name: res.locals.user.name
            }
        })
        const response = await axios.get(`https://openlibrary.org/works/${req.params.bookid}`)  
        res.render('books/edit.ejs', {
            review: review,
            data: response.data
        })
    } catch (error) {
        console.log(error)
        res.render('404.ejs')
    }
})
// edit comment in db
router.put('/results/:bookid/edit/:id', async (req,res)=>{
    try {
        const review = await db.review.update({
            bookId: req.body.bookId,
            userId: res.locals.user.id,
            name: req.body.name,
            content: req.body.content
        },{
        where: {
            id: req.params.id
        }
        })
        const response = await axios.get(`https://openlibrary.org/works/${req.params.bookid}`)   
        res.redirect(`/users/results/${req.params.bookid}`)
    } catch (error) {
        console.log(error)
        res.render('404.ejs')
    }
})
