const express = require('express')
const router = express.Router()
const db = require('../models')
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const axios = require('axios')
// GET /users/new -- render a form to create a new user
router.get('/new', (req,res) =>{
    res.render('users/new.ejs')
})

// POST /users -- create a new user in the db
router.post('/', async (req,res)=>{
    try {
        //hash the password from req.body
        const hashedPassword = bcrypt.hashSync(req.body.password, 12)
        //create a new user
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                email: req.body.email,
                name: req.body.name
            },
            defaults: {
                password: hashedPassword
            } 
        })

        //if user was found...send them to login form
        if(!created){
            console.log('user exists already')
            res.redirect('/users/login?message=Please log into your account to continue')
        }else{
            //store the new user's id as a cookie
            // res.cookie('key', value)
            const encryptedUserId = crypto.AES.encrypt(newUser.id.toString(), process.env.ENC_SECRET)
            const encryptedUserIdString = encryptedUserId.toString()
            res.cookie('userId', encryptedUserIdString)
            //redirect to the homepage
            res.redirect('/users/profile')
        }

    } catch(err) {
        console.log(err)
        res.send('server error')
    }
})

// GET /users/login -- show a login form to the user
router.get('/login', (req,res) =>{
    console.log(req.query)
    res.render('users/login.ejs', {
        //if req.query message exists, pass the message, otherwise pass in null
        //ternary operator
        //condition ? expression if truthy : expression if falsy
        message: req.query.message ? req.query.message : null
    })
})
// POST /users/login -- accept a payload of form data and use it to log a user in
router.post('/login', async (req,res)=>{
    try{
        const user = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })
        const noLoginMessage = 'Incorrect username or password'
        // look up user in the db using spplied email
        //if user is not found -- send them back to login form
        if(!user) {
            console.log('user not found')
            res.redirect('/users/login?message=' + noLoginMessage)
        //if the user is found but has wrong password -- send back to login form
        } else if (!bcrypt.compareSync(req.body.password, user.password)){
            console.log('wrong password')
            res.redirect('/users/login?message=' + noLoginMessage)
        //if user is found and supplied pw matches what's in the db -- log in
        }else {
            const encryptedUserId = crypto.AES.encrypt(user.id.toString(), process.env.ENC_SECRET)
            const encryptedUserIdString = encryptedUserId.toString()
            res.cookie('userId', encryptedUserIdString)
            res.redirect('/users/profile')
        }
    }catch(err){
        console.log(err)
        res.send('server error')
    }
})

// GET /users/logout -- log out a user by clearing the stored cookie
router.get('/logout', (req,res) =>{
    // clear the cookie
    res.clearCookie('userId')
    //redirect to home page
    res.redirect('/')
})
// Load profile page if user logged in
router.get('/profile', async (req,res)=>{
    //if user is not logged...redirect
    try{
        if(!res.locals.user){
            res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource.')
        }else{
            const books = await db.book.findAll({
                where: {userId: 1}
            })
            res.render('users/profile.ejs', {
                books: books,
                user: res.locals.user
            })
        }
    }catch(err){
        console.log(err)
    }
})

// render search page if signed in
router.get('/search', (req,res)=>{
    res.render('users/search.ejs')
})



//Hit book api with search result
router.post('/results', (req,res)=>{
        const url = `http://openlibrary.org/search.json?title=${req.body.book}` // interpolate search into url  
    // } else if (req.body.author){//if author search
    //     url = `https://openlibrary.org/search/authors.json?q=${req.body.author}`
    console.log(url)
    axios.get(url)
        .then(response=>{
            // console.log(response.data.docs)
            if(response.data){
                res.render('books/results.ejs', {results: response.data.docs} )
            }else{
                res.send('server error')
            }
        }).catch(err =>{
            console.log(err)
            res.send('poop')
        })
})


//Going to show page with details on selected book
router.get('/results/:id', async (req,res)=>{
    try{
         // call for book details
        const detailResponse = await axios.get(`https://openlibrary.org/works/${req.params.id}`)
        const authorResponse = await axios.get(`https://openlibrary.org/authors/${req.params.id}.json`)
        // console.log(authorGrab.data)
        //send to show page
        // console.log(detailResponse)
        res.render('books/show.ejs', {
            data : detailResponse.data,
            authorData : authorResponse.data
        })
    }catch(err){
            console.log(err)
            res.send('server error')
    }
})

//author api call
router.post('/results/authors', async (req,res)=>{
    try {
        const response = await axios.get(`http://openlibrary.org/authors.json?q=${req.body.author}`)
        // console.log(response.data)
        // res.render('authors/results.ejs', {results: response.data.docs})
        res.send('poop')
    } catch (error) {
        console.log(error)
        res.send('hi bud')
    }
})
// route to show page for AUTHORS
router.get('/results/authors/:id', async (req,res)=>{
    const response = await axios.get(`https://openlibrary.org/authors/${req.params.id}.json`)
    // console.log(response.data)
    res.render('authors/show.ejs', {data : response.data})
})

//CREATE book favorite on button click
router.post('/profile', async (req,res)=>{
    try{
        // console.log(req.body.libraryId)
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
        res.send('sarva error')
        console.log(err)
    }
})


//Delete a book from favorites on profile
router.post('/profile/:id', async (req,res)=>{
    try{
        await db.book.destroy({
            where: {title: req.params.id}
        })
        res.redirect('/users/profile')
    }catch(err){
        console.log(err)
        res.send('server error')
    }

})

//create new comment
router.post('/users/results/:id', async (req,res)=>{
    console.log(req.body.name, req.body.content, req.params.id)
    try{
        const newComment = await db.review.create({
            userId: res.locals.user,
            name: req.body.name,
            content: req.body.content,
            bookId: req.params.id
        })
        console.log(req.params.id)
        res.redirect(`/results/${req.params.id}`)
    }catch(err){
        console.log(err)
        res.send('server error')
    }
})




module.exports = router