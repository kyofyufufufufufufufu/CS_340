// Adapted from CS340 Nodejs Starter code: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js

// Create an Express app
const express = require('express');                 // We are using the express library for the web server
const app     = express(); 
// Middleware for JSON and URL encoded form data
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT = 8764;

// Database
const db      = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     
app.engine('.hbs', engine({extname: ".hbs"}));  
app.set('view engine', '.hbs');   

// Register custom Handlebars helpers
const hbs = exphbs.create({});
hbs.handlebars.registerHelper('isEqual', function (a, b, options) {
    if (!options || !options.fn) return ''; 
    return a === b ? options.fn(this) : options.inverse(this);
});

hbs.handlebars.registerHelper('isNotEqual', function (a, b, options) {
    if (!options || !options.fn) return ''; 
    return a !== b ? options.fn(this) : options.inverse(this);
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/users', function(req, res) {  
        let query1 = "SELECT * FROM Users;";                    // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('users', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });           

app.post('/add-user-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Users (userName, password, email) VALUES ('${data.userName}', '${data.password}', '${data.email}')`;
    db.pool.query(query1, function(error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on Users
            query2 = `SELECT * FROM Users;`;
            db.pool.query(query2, function(error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-user-ajax/', function(req,res,next) {
    let data = req.body;
    let userID = parseInt(data.userID);
    let deleteUser = `DELETE FROM Users WHERE userID = ?`;
    
    // Run the 1st query
    db.pool.query(deleteUser, [userID], function(error, rows, fields){
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

app.get('/books', function(req, res) {  
        let query1 = "SELECT * FROM Books;";                    // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('books', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });

app.delete('/delete-book-ajax/', function(req,res,next) {
    let data = req.body;
    let bookID = parseInt(data.bookID);
    let deleteBook = `DELETE FROM Books WHERE bookID = ?`;
    
    // Run the 1st query
    db.pool.query(deleteBook, [bookID], function(error, rows, fields){
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

app.get('/authors', function(req, res)
{  
    let query1 = "SELECT * FROM Authors;";                    // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('authors', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
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
});


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

});

app.get('/authorbooks', function(req, res) {  


    let query1 = "SELECT * FROM AuthorsofBooks;";     

    let query2 = "SELECT * FROM Authors;";
    
    let query3 = "SELECT * FROM Books;";

    db.pool.query(query1, function (error, rows, fields) {

        let authorbooks = rows;

        db.pool.query(query2, function (error, rows, fields) {

            let authors = rows;
            let authormap = {}

            authors.map(author => {
                let id = parseInt(author.authorID, 10);
                authormap[id] = author["authorName"]
            })

            authorbooks = authorbooks.map(authorbook => {
                return Object.assign(authorbook, {authorID: authormap[authorbook.authorID]})
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

                authorbooks = authorbooks.map(authorbook => {
                    return Object.assign(authorbook, {bookID: bookmap[authorbook.bookID]})
                })

                return res.render('authorbooks', {authorbooks: authorbooks, authors: authors, books: books});

            });

        });

    });

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



app.delete('/delete-author-book-ajax', function(req,res,next){
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

});


// Start the server
app.listen(PORT, function (err) {
    if (err) throw err;
    console.log(`Server running on http://classwork.engr.oregonstate.edu:${PORT}`);
});