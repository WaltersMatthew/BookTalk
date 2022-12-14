const express = require('express')
const router = express.Router()
const db = require('../models')
const axios = require('axios')

//api call for author results
router.post('/results', async (req,res)=>{
    try {
        const response = await axios.get(`https://openlibrary.org/search/authors.json?q=${req.body.author}`)
        res.render('authors/results.ejs', {
            //send data along to display on results page
            results: response.data.docs, 
            searchParams: req.body.author
        })
    } catch (error) {
        console.log(error)
        res.render('404.ejs')
    }
})
    
    
// route to show page for AUTHORS
router.get('/results/:id', async (req,res)=>{
    const response = await axios.get(`https://openlibrary.org/authors/${req.params.id}.json`)
    res.render('authors/show.ejs', {data : response.data})
})

//create favorite on click
router.post('/favorites', async (req,res)=>{
    try{
        //create new favorite author
        await db.author.create({
                name: req.body.name,
                //authorId is formatted "/authors/OLXXXX"
                authorId: req.body.authorId,
                userId: res.locals.user.id,
        })
    res.redirect('/users/profile')
    }catch(err){
        res.render('404.ejs')
        console.log(err)
    }
})

//Delete author fave on click
router.delete('/:id', async (req,res)=>{
    try{
        await db.author.destroy({
            //author id is "/authors/OLXXXXX" DO NOT CHANGE!!
            where: {authorId: `/authors/${req.params.id}`}
        })
        res.redirect('/users/profile')
    }catch(err){
        console.log(err)
        res.render('404.ejs')
    }

})
module.exports = router