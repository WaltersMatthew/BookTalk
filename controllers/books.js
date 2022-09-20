const express = require('express')
const router = express.Router()
const db = require('../models')
const axios = require('axios')

//Hit book api with search result
router.post('/results', async (req,res)=>{
    try{
        const response = await axios.get(`http://openlibrary.org/search.json?title=${req.body.book}`) // interpolate search into url  
        console.log(response.data)

        res.render('books/results.ejs', {
            //need search params to display on results page
            results: response.data.docs, 
            searchParams: req.body.book
        })
    } catch(err){
        console.log(err)
        res.render('404.ejs')
    }
})


//api call on specific book
router.get('/results/:id', async (req,res)=>{
    try{
         // call for book details
        const detailResponse = await axios.get(`https://openlibrary.org/works/${req.params.id}`)
        const authorResponse = await axios.get(`https://openlibrary.org/authors/${req.params.id}.json`)
        //send to show page
        const reviews = await db.review.findAll({
            where: {
                bookId: req.params.id
            }
        })
        //send all necessary model data to display
        res.render('books/show.ejs', {
            data : detailResponse.data,
            authorData : authorResponse.data.docs,
            reviews: reviews
        })
    }catch(err){
            console.log(err)
            res.render('404.ejs')
    }
})

//CREATE book favorite on button click
router.post('/favorites', async (req,res)=>{
    try{
        //create new favorite book
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
router.delete('/:id', async (req,res)=>{
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
        // comment columns
        const newComment = await db.review.create({
            userId: res.locals.user.dataValues.id,
            name: res.locals.user.dataValues.name,
            content: req.body.content,
            bookId: req.body.id
        })
        //get all book and review info to display on show page
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
                userId: res.locals.user.id
            }
        })
        //api call to use response data
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
        res.redirect(`/books/results/${req.params.bookid}`)
    } catch (error) {
        console.log(error)
        res.render('404.ejs')
    }
})

module.exports = router