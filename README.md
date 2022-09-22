# BookTalk
[Live deployment](https://booktalk-waltersmatthew.koyeb.app/) <br/>
[Github repo](https://github.com/WaltersMatthew/BookTalk)

## Welcome to your new social hub for all things books!

---

* Add your favorite books, authors, and genres to your profile
* View book details from your profile
* Leave reviews on books for all to see

---

I will be using the [Open Library](https://openlibrary.org) API to populate all data and render the JSON into a simple, easy to read format. 

# Proof of concept on API

JSON results<br/>
<img src="img/titleJson.png" width='500'/> <br/>
Cover art results <br/>
<img src="img/coverArt.png" width='500'/> <br/>
Author photo results <br/>
<img src="img/authorPhoto.png" width='500'/>

---

# Tech stack:

* Node.js
* EJS
* express-ejs-layouts
* Express.js
* Sequelize
* PostgresQL
* Bootstrap 5
* Axios
* bcrypt
* cookie-parser
* crypto-js
* dotenv
* method-override

---

# Installation Instructions:

To run BookTalk on your local machine, first fork and clone this repository. Then follow these steps:

* In your terminal, navigate to the cloned repository. Run the command:
```
npm -install 
```
or 
```
npm i
```
to install all of the packages needed to run the app.

* You will need to add a few files for functionality. In your terminal in the same location as above, run the following command:
```touch .env``` 
* In the ```.gitignore``` file, add ```node_modules``` and ```.env```

* In the ```.env``` file, you need to add 3 variables. First, an ```ENC_KEY``` which can be a random string. For example, you would write:
```
ENC_KEY='super_secret_string'
```

* Next, set up your config.json:
    * username and password for your postgres account
    * database: ```"booktalk"```
    * dialect: ```"postgres"```
* You will need to create the database for this project and migrate the models to it. In your terminal, run the following two commands:
```
createdb booktalk
sequelize db:migrate
```
* You're all set! run the ```nodemon``` command in your cloned repository and navigate to ```localhost.3000``` in your browswer.
* Enjoy!
---

# ERDs

---

<img src='img/ERD.png' width='500'/><br/>

---

# Restful routing chart

---

|Crud action | route | description |
| :-------: | :----: |  :--------: |
|   BOOKS  |
| READ | /books/results| show search results |
| READ | /books/results/:id | show single book result |
| CREATE | /books/:bookId | leave a review |
| CREATE | /books/:bookId | create new favorite in db |
| UPDATE | /books/:bookId | edit a review |
| DESTROY | /users/profile | delete fave book |
|  AUTHORS  | 
| READ | /authors/results| show search results |
| READ | /authors/results/:id | show single author result |
| CREATE | /authors/:bookId | create new favorite in db |
| DESTROY | /users/profile | delete fave author |
| USERS |
| READ | / | show home page with login/signup |
| CREATE | /users/new | make new user |
| READ | /users/profile | show user's profile with faved books/authors |
| READ | /users/search | call api to search list of book/author results |

---

# Wireframes

---

<img src='img/wireframe.png' width='500'/> <br/>

---

# User stories

---

* As a user, I want to search for books

* As a user, I want to read details about new books

* As a user, I want to add books to my favorites list in my profile

* As a user, I want to learn more about authors

* As a user, I want to add favorite authors to my profile

* As a user, I want to leave reviews on books I've read


---

# MVP goals

* Query API and render results on page when searched
* sign up and log in users with unique usernames
* Add books to favorites in profile
* Delete books in profile
* Leave reviews on books
* Edit reviews

# Stretch goals

* Add authors to favorites in profiles ✔️
* Delete authors in profile ✔️
* 0-5 ratings on favorited books in profile
* View all profiles
* Add profiles of friends
* View subjects
* Radio buttons to search by author, title, or subject

# Post project reflections

This fullstack app turned out to be much more difficult than I anticipated. My api was not equipped for me to go as in-depth on subjects/genres as I had hoped and the more features I introduced, the more I had to re-think my routing and model composition. I cemented my understanding of using HTTP verbs to manipulate data in models and learned a lot about styling with Bootstrap. I ended up with a project I am pleased with at this time and will be revisiting it a lot in the future to refine the code and add more features.
