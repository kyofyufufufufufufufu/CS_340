// Adapted from CS340 Nodejs Starter code: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js

// Create an Express app
const express = require('express');
const app = express();

// Middleware for JSON and URL encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const PORT = 7773;

// Database
const db = require('./database/db-connector');

const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars');
app.engine('.hbs', engine({ extname: ".hbs" }));
app.set('view engine', '.hbs');

// Register custom Handlebars helpers
const hbs = exphbs.create({});
hbs.handlebars.registerHelper('isEqual', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});

hbs.handlebars.registerHelper('isNotEqual', function (a, b, options) {
    return a !== b ? options.fn(this) : options.inverse(this);
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/users', (req, res) => {
    let query = "SELECT * FROM Users;";
    db.pool.query(query, (error, rows) => {
        if (error) return res.sendStatus(500);
        res.render('users', { data: rows });
    });
});

app.post('/add-user-ajax', (req, res) => {
    let data = req.body;
<<<<<<< HEAD
    let query = `INSERT INTO Users (userName, password, email) VALUES (?, ?, ?)`;
    db.pool.query(query, [data.userName, data.password, data.email], (error, rows) => {
=======

    // Create the query and run it on the database
    query1 = `INSERT INTO Users (userName, password, email) VALUES ('${data.userName}', '${data.password}', '${data.email}')`;
    db.pool.query(query1, function(error, rows, fields) {

        // Check to see if there was an error
>>>>>>> origin/krystalBranch
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }
        db.pool.query("SELECT * FROM Users;", (error, rows) => {
            if (error) return res.sendStatus(400);
            res.send(rows);
        });
    });
});

<<<<<<< HEAD
app.get('/books', (req, res) => {
    db.pool.query("SELECT * FROM Books;", (error, rows) => {
        if (error) return res.sendStatus(500);
        res.render('books', { data: rows });
    });
});

app.get('/authors', (req, res) => {
    db.pool.query("SELECT * FROM Authors;", (error, rows) => {
        if (error) return res.sendStatus(500);
        res.render('authors', { data: rows });
    });
=======

app.delete('/delete-author-ajax/', function(req,res,next){
    let data = req.body;
    let authorID = parseInt(data.authorID);
    let deleteAuthor = `DELETE FROM Authors WHERE authorID = ?`;
    
    // Run the 1st query
    db.pool.query(deleteAuthor, [authorID], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
        else {
        res.sendStatus(204);
        }
        
    })
});

app.get('/genres', function(req, res)
{  
    let query1 = "SELECT * FROM Genres;";                    // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('genres', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});

app.get('/userbooks', function(req, res) {  


    let query1 = "SELECT * FROM UserBooks;";     

    let query2 = "SELECT * FROM Users;";
    
    let query3 = "SELECT * FROM Books;";

    db.pool.query(query1, function (error, rows, fields) {

        let userbooks = rows;

        db.pool.query(query2, function (error, rows, fields) {

            let users = rows;
            let usermap = {}

            users.map(user => {
                let id = parseInt(user.userID, 10);
                usermap[id] = user["userName"]
            })

            userbooks = userbooks.map(userbook => {
                return Object.assign(userbook, {userID: usermap[userbook.userID]})
            })

            db.pool.query(query3, function (error, rows, fields) {

                if (error) {
                    console.error("Error executing query1:", error);
                    return res.status(500).send("Database error: Duplicate ID chosen");
                }

                let books = rows;
                let bookmap = {}

                books.map(book => {
                    let id = parseInt(book.bookID, 10);
                    bookmap[id] = book["bookTitle"];
                })

                userbooks = userbooks.map(userbook => {
                    return Object.assign(userbook, {bookID: bookmap[userbook.bookID]})
                })

                return res.render('userbooks', {userbooks: userbooks, users: users, books: books});

            });

        });

    });

>>>>>>> origin/krystalBranch
});

app.post('/add-author-ajax', (req, res) => {
    let data = req.body;
    let query = `INSERT INTO Authors (authorName) VALUES (?)`;
    db.pool.query(query, [data.authorName], (error, rows) => {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }
        // Send back the updated list of authors
        db.pool.query("SELECT * FROM Authors;", (error, rows) => {
            if (error) return res.sendStatus(400);
            res.json({ success: true, authors: rows });
        });
    });
});

//UPDATE/EDIT Authors
app.post('/edit-author-ajax', (req, res) => {
    const { authorID, authorName } = req.body;
    
    console.log('Received authorID:', authorID); // Log authorID
    console.log('Received authorName:', authorName); // Log authorName

    const sql = "UPDATE Authors SET authorName = ? WHERE authorID = ?";
    db.pool.query(sql, [authorName, authorID], (error, results) => {
        if (error) {
            console.error(error);
            return res.json({ success: false });
        }

        if (results.affectedRows > 0) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false });
        }
    });
<<<<<<< HEAD
=======

});

app.post('/add-author-book-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO AuthorsofBooks (authorID, bookID) VALUES ('${data.authorID}', '${data.bookID}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM AuthorsofBooks;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});



app.delete('/delete-author-book-ajax/', function(req,res,next){
    let data = req.body;
    let authorBookID = parseInt(data.authorBookID);
    let deleteAuthorBooks = `DELETE FROM AuthorsofBooks WHERE authorBookID = ?`;
    
    // Run the 1st query
    db.pool.query(deleteAuthorBooks, [authorBookID], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
        else {
        res.sendStatus(204);
        }
        
    })
});

app.get('/bookgenres', function(req, res) {  

    let query1 = "SELECT * FROM GenresofBooks;";

    let query2 = "SELECT * FROM Genres;";

    let query3 = "SELECT * FROM Books;";

    db.pool.query(query1, function(error, rows, fields) {  

        let bookgenres = rows;

        db.pool.query(query2, function (error, rows, fields) {

            let genres = rows;
            let genremap = {}

            genres.map(genre => {
                let id = parseInt(genre.genreID, 10);
                genremap[id] = genre["genreName"]
            })

            bookgenres = bookgenres.map(bookgenre => {
                return Object.assign(bookgenre, {genreID: genremap[bookgenre.genreID]})
            })

            db.pool.query(query3, function (error, rows, fields) {

                if (error) {
                    console.error("Error executing query1:", error);
                    return res.status(500).send("Database error: Duplicate ID chosen");
                }

                let books = rows;
                let bookmap = {}

                books.map(book => {
                    let id = parseInt(book.bookID, 10);
                    bookmap[id] = book["bookTitle"];
                })

                bookgenres = bookgenres.map(bookgenre => {
                    return Object.assign(bookgenre, {bookID: bookmap[bookgenre.bookID]})
                })

                return res.render('bookgenres', {bookgenres: bookgenres, genres: genres, books: books});

            });

        });

    });

>>>>>>> origin/krystalBranch
});


// Start the server
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running on http://classwork.engr.oregonstate.edu:${PORT}`);
});