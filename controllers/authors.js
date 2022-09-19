const express = require('express')
const router = express.Router()
const db = require('../models')
const axios = require('axios')

//api call for author results
router.post('/results', async (req,res)=>{
    try {
        const response = await axios.get(`https://openlibrary.org/search/authors.json?q=${req.body.author}`)
        console.log(response.data)
        res.render('authors/results.ejs', {results: response.data.docs})

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
router.post('/users/profile', async (req,res)=>{
    try{
        //create new favorite author
        await db.author.create({
            where:{
                name: req.body.name,
                userId: res.locals.user.id,
            }
        })
    res.redirect('/users/profile')
    }catch(err){
        res.render('404.ejs')
        console.log(err)
    }
})


module.exports = router