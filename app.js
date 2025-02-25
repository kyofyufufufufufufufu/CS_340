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

app.get('/users', function(req, res)
    {  
        let query1 = "SELECT * FROM Users;";                    // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('users', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });           

app.post('/add-user-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Users (userName, password, email) VALUES ('${input-userName}', '${input-password}', '${input-email}')`;
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

app.get('/books', function(req, res)
    {  
        let query1 = "SELECT * FROM Books;";                    // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('books', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });

app.get('/authors', function(req, res)
{  
    let query1 = "SELECT * FROM Authors;";                    // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('authors', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});

app.get('/genres', function(req, res)
{  
    let query1 = "SELECT * FROM Genres;";                    // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('genres', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});

app.get('/userbooks', function(req, res)
{  
    let query1 = "SELECT * FROM UserBooks;";                    // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('userbooks', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
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

app.get('/bookgenres', function(req, res)
{  
    let query1 = "SELECT * FROM GenresofBooks;";                    // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('bookgenres', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});


// Start the server
app.listen(PORT, function (err) {
    if (err) throw err;
    console.log(`Server running on http://classwork.engr.oregonstate.edu:${PORT}`);
});
