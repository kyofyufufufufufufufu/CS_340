//  Citation for app.js
//  Date: 02/10/25
//  Adapted from: NodeJS CS340 Starter Code
//  Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// Create an Express app
const express = require('express');                 // We are using the express library for the web server
const app     = express(); 
// Middleware for JSON and URL encoded form data
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT = 8763;

// Database
const db      = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     
const { equal } = require('assert');
app.engine('.hbs', engine({extname: ".hbs"}));  
app.set('view engine', '.hbs');   

// Register custom Handlebars helpers
//02/09/2025
//Based on: express-handlebars by Tony Brix (Github)
//Source URL: https://github.com/express-handlebars/express-handlebars
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

app.get('/search-user', function(req, res)
{
    let query1;
    
    if (req.query.userName === undefined)
    {
        query1 = "SELECT * FROM Users;";
    }

    else
    {
        query1 = `SELECT * FROM Users WHERE userName LIKE "${req.query.userName}%"`
    }

    db.pool.query(query1, function(error, rows, fields) {

        let user = rows;

        return res.render('users', {data: user});

    })

});

app.get('/users', function(req, res) {  
        let query1 = "SELECT * FROM Users;";                    // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('users', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
});           

app.post('/add-user-ajax', function(req, res) {
    let data = req.body;

    // Insert new row
    let query1 = `INSERT INTO Users (userName, password, email) VALUES (?, ?, ?)`;
    db.pool.query(query1, [data.userName, data.password, data.email], function(error) {
        if (error) {
            console.error(error);
            return res.sendStatus(400);
        } else {
            // Then select all users
            let query2 = `SELECT * FROM Users;`;
            db.pool.query(query2, function(error, rows) {
                if (error) {
                    console.error(error);
                    return res.sendStatus(400);
                } else {
                    // Return the entire list with success: true
                    res.json({ success: true, users: rows });
                }
            });
        }
    });
});

app.post('/edit-user-ajax', function(req, res) {
    const { userID, userName, email, password } = req.body;
    console.log('Editing User:', req.body);

    let query;
    let values;

    if (password) { // If user entered a new password
        query = "UPDATE Users SET userName = ?, password = ?, email = ? WHERE userID = ?";
        values = [userName, password, email, userID];
    } else { // If password is blank, do not update it
        query = "UPDATE Users SET userName = ?, email = ? WHERE userID = ?";
        values = [userName, email, userID];
    }

    db.pool.query(query, values, function(error, results) {
        if (error) {
            console.log(error);
            return res.json({ success: false });
        }
        res.json({ success: results.affectedRows > 0 });
    });
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
    let query1 = "SELECT * FROM Books;";  // Define our query

    db.pool.query(query1, function(error, rows, fields){  // Execute the query
        if (error) {
            console.error(error);
            res.status(500).send("Database query error");
            return;
        }

        // Convert the publish date format for each book
        rows.forEach(book => {
            if (book.bookPublishDate) {
                let date = new Date(book.bookPublishDate);
                book.bookPublishDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
            }
        });

        res.render('books', { data: rows });  // Render the page with formatted dates
    });
});

app.get('/search-book', function(req, res)
{
    let query1;
    
    if (req.query.bookTitle === undefined)
    {
        query1 = "SELECT * FROM Books;";
    }

    else
    {
        query1 = `SELECT * FROM Books WHERE bookTitle LIKE "${req.query.bookTitle}%"`
    }

    db.pool.query(query1, function(error, rows, fields) {

        let book = rows;

        return res.render('books', {data: book});

    })

});

// CREATE books
app.post('/add-book-ajax', (req, res) => {
    let data = req.body;
    let query = `INSERT INTO Books (bookTitle, bookDescription, bookPublishDate) VALUES (?, ?, ?)`;

    db.pool.query(query, [data.bookTitle, data.bookDescription, data.bookPublishDate], (error, rows) => {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }
        db.pool.query("SELECT * FROM Books;", (error, rows) => {
            if (error) return res.sendStatus(400);
            res.json({ success: true, books: rows });
        });
    });
});

//UPDATE/EDIT Books
app.post('/edit-book-ajax', (req, res) => {
    const { bookID, bookTitle, bookDescription, bookPublishDate } = req.body;
    
    // For errors... since it wanted to act up
    console.log('Received bookID:', bookID); // Log bookID
    console.log('Received bookTitle:', bookTitle); // Log bookTitle
    console.log('Received bookDescription:', bookDescription); // Log bookDescription
    console.log('Received bookPublishDate:', bookPublishDate); // Log bookPublishDate

    const sql = "UPDATE Books SET bookTitle = ?, bookDescription = ?, bookPublishDate = ? WHERE bookID = ?";
    db.pool.query(sql, [bookTitle, bookDescription, bookPublishDate, bookID], (error, results) => {
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

app.delete('/delete-book-ajax/', function(req,res,next) {
    let data = req.body;
    let bookID = parseInt(data.bookID);
    let deleteBook = `DELETE FROM Books WHERE bookID = ?`;
    
    // Run the 1st query
    db.pool.query(deleteBook, [bookID], function(error, rows, fields) {
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

app.get('/authors', function(req, res) {  
    let query1 = "SELECT * FROM Authors;";                    // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('authors', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});

app.get('/search-author', function(req, res)
{
    let query1;
    
    if (req.query.authorName === undefined)
    {
        query1 = "SELECT * FROM Authors;";
    }

    else
    {
        query1 = `SELECT * FROM Authors WHERE authorName LIKE "${req.query.authorName}%"`
    }

    db.pool.query(query1, function(error, rows, fields) {

        let author = rows;

        return res.render('authors', {data: author});

    })

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


app.delete('/delete-author-ajax/', function(req,res,next) {
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

app.get('/genres', function(req, res) {  
    let query1 = "SELECT * FROM Genres;";                    // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('genres', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});

// ADD Genre
app.post('/add-genre-ajax', function(req, res) {
    let data = req.body;
    let query = "INSERT INTO Genres (genreName) VALUES (?)";

    db.pool.query(query, [data.genreName], function(error, results) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }

        db.pool.query("SELECT * FROM Genres;", function(error, rows) {
            if (error) return res.sendStatus(400);
            res.json({ success: true, genres: rows });
        });
    });
});

app.get('/search-genre', function(req, res)
{
    let query1;
    
    if (req.query.genreName === undefined)
    {
        query1 = "SELECT * FROM Genres;";
    }

    else
    {
        query1 = `SELECT * FROM Genres WHERE genreName LIKE "${req.query.genreName}%"`
    }

    db.pool.query(query1, function(error, rows, fields) {

        let genre = rows;

        return res.render('genres', {data: genre});

    })

});

// EDIT Genre
app.post('/edit-genre-ajax', function(req, res) {
    const { genreID, genreName } = req.body;
    console.log('Editing Genre:', req.body);

    let query = "UPDATE Genres SET genreName = ? WHERE genreID = ?";
    db.pool.query(query, [genreName, genreID], function(error, results) {
        if (error) {
            console.log(error);
            return res.json({ success: false });
        }

        // Return updated list of genres
        db.pool.query("SELECT * FROM Genres;", function(error, rows) {
            if (error) return res.sendStatus(400);
            res.json({ success: results.affectedRows > 0, genres: rows });
        });
    });
});

app.delete('/delete-genre-ajax/', function(req,res,next) {
    let data = req.body;
    let genreID = parseInt(data.genreID);
    let deleteGenre = `DELETE FROM Genres WHERE genreID = ?`;
    
    // Run the 1st query
    db.pool.query(deleteGenre, [genreID], function(error, rows, fields){
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

app.get('/userbooks', function(req, res) {  
    let query = `
        SELECT UserBooks.userBookID, 
               Users.userID, Users.userName, 
               Books.bookID, Books.bookTitle, 
               UserBooks.userBookStatus, 
               UserBooks.userBookRating
        FROM UserBooks
        JOIN Users ON UserBooks.userID = Users.userID
        LEFT JOIN Books ON UserBooks.bookID = Books.bookID;
    `;


    db.pool.query(query, function (error, userbooks) {
        if (error) {
            console.error("Error executing query:", error);
            return res.status(500).send("Database error");
        }

        // Fetch users and books separately for dropdowns
        let queryUsers = "SELECT * FROM Users;";
        let queryBooks = "SELECT * FROM Books;";

        db.pool.query(queryUsers, function (error, users) {
            if (error) return res.status(500).send("Database error");

            db.pool.query(queryBooks, function (error, books) {
                if (error) return res.status(500).send("Database error");

                // Render the page with userbook data and dropdown options
                res.render('userbooks', { userbooks, users, books });
            });
        });
    });
});

// CREATE UserBook
app.post('/add-userbook-ajax', function(req, res) {
    const { userID, bookID, userBookStatus, userBookRating } = req.body;

    // Convert empty rating to null
    const rating = userBookRating === "" ? null : userBookRating;

    const query = "INSERT INTO UserBooks (userID, bookID, userBookStatus, userBookRating) VALUES (?, ?, ?, ?)";

    db.pool.query(query, [userID, bookID, userBookStatus, rating], function(error, results) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }

        // Fetch updated userbooks
        const getUserBooksQuery = "SELECT * FROM UserBooks";
        db.pool.query(getUserBooksQuery, function(error, rows) {
            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            res.json({ success: true, userbooks: rows });
        });
    });
});


// EDIT/UPDATE UserBook
app.post('/edit-userbook-ajax', function(req, res) {
    const { userBookID, userID, bookID, userBookStatus, userBookRating } = req.body;

    const query = "UPDATE UserBooks SET userID = ?, bookID = ?, userBookStatus = ?, userBookRating = ? WHERE userBookID = ?";

    db.pool.query(query, [userID, bookID, userBookStatus, userBookRating, userBookID], function(error, results) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }

        // Fetch updated userbooks
        const getUserBooksQuery = "SELECT * FROM UserBooks";
        db.pool.query(getUserBooksQuery, function(error, rows) {
            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            res.json({ success: true, userbooks: rows });
        });
    });
});


app.delete('/delete-userbook-ajax/', function(req,res,next) {
    let data = req.body;
    let userBookID = parseInt(data.userBookID);
    let deleteUserBook = `DELETE FROM UserBooks WHERE userBookID = ?`;
    
    // Run the 1st query
    db.pool.query(deleteUserBook, [userBookID], function(error, rows, fields){
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

app.get('/authorbooks', function(req, res) {  
    let query = `
        SELECT AuthorsofBooks.authorBookID, 
               Authors.authorID, Authors.authorName, 
               Books.bookID, Books.bookTitle
        FROM AuthorsofBooks
        JOIN Authors ON AuthorsofBooks.authorID = Authors.authorID
        JOIN Books ON AuthorsofBooks.bookID = Books.bookID;
    `;

    db.pool.query(query, function (error, authorbooks) {
        if (error) {
            console.error("Error executing query:", error);
            return res.status(500).send("Database error");
        }

        // Fetch authors and books for dropdowns
        let queryAuthors = "SELECT * FROM Authors;";
        let queryBooks = "SELECT * FROM Books;";

        db.pool.query(queryAuthors, function (error, authors) {
            if (error) return res.status(500).send("Database error");

            db.pool.query(queryBooks, function (error, books) {
                if (error) return res.status(500).send("Database error");

                // Render
                res.render('authorbooks', { authorbooks, authors, books });
            });
        });
    });
});

app.post('/add-author-book-ajax', function(req, res) {
    let data = req.body;

    // Check validation
    if (!data.authorID || !data.bookID) {
        console.log("Missing authorID or bookID");
        return res.status(400).send("Missing required fields.");
    }

    let query1 = "INSERT INTO AuthorsofBooks (authorID, bookID) VALUES (?, ?)";
    db.pool.query(query1, [data.authorID, data.bookID], function(error, results) {
        if (error) {
            console.log("SQL Error:", error);
            return res.status(400).send("Database Error");
        }

        let query2 = `
            SELECT AuthorsofBooks.authorBookID, 
                   Authors.authorID, Authors.authorName, 
                   Books.bookID, Books.bookTitle
            FROM AuthorsofBooks
            JOIN Authors ON AuthorsofBooks.authorID = Authors.authorID
            JOIN Books ON AuthorsofBooks.bookID = Books.bookID;
        `;

        db.pool.query(query2, function(error, rows) {
            if (error) {
                console.log("SQL Error:", error);
                return res.status(400).send("Database Error");
            }

            res.json({ success: true, authorbooks: rows });
        });
    });
});


// EDIT/UPDATE authorBooks
app.post('/edit-author-book-ajax', function(req, res) {
    let data = req.body;

    if (!data.authorBookID || !data.authorID || !data.bookID) {
        console.log("Error: Missing required fields.");
        return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    let query = `UPDATE AuthorsofBooks SET authorID = ?, bookID = ? WHERE authorBookID = ?`;

    db.pool.query(query, [data.authorID, data.bookID, data.authorBookID], function(error, results) {
        if (error) {
            console.log("SQL Update Error:", error);
            return res.status(500).json({ success: false, error: "Database update failed." });
        }

        console.log(`Updated authorBookID ${data.authorBookID} → Author: ${data.authorID}, Book: ${data.bookID}`);
        res.json({ success: true });
    });
});



app.delete('/delete-author-book-ajax', function(req,res,next) {
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
    let query1 = `
        SELECT GenresofBooks.genreBookID, 
               Genres.genreName, 
               Books.bookTitle, 
               Genres.genreID, 
               Books.bookID
        FROM GenresofBooks
        JOIN Genres ON GenresofBooks.genreID = Genres.genreID
        JOIN Books ON GenresofBooks.bookID = Books.bookID
    `;

    let query2 = "SELECT * FROM Genres;";
    let query3 = "SELECT * FROM Books;";

    db.pool.query(query1, function(error, rows, fields) {  
        if (error) {
            console.error("Error executing query1:", error);
            return res.status(500).send("Database error");
        }

        let bookgenres = rows;

        db.pool.query(query2, function(error, rows, fields) {
            if (error) return res.status(500).send("Database error");

            let genres = rows;

            db.pool.query(query3, function(error, rows, fields) {
                if (error) return res.status(500).send("Database error");

                let books = rows;

                return res.render('bookgenres', {
                    bookgenres: bookgenres,
                    genres: genres,
                    books: books
                });
            });
        });
    });
});

// CREATE Book-Genre Relationship
app.post('/add-bookgenre-ajax', function (req, res) {
    let { bookID, genreID } = req.body;
    
    let query = `INSERT INTO GenresofBooks (bookID, genreID) VALUES (?, ?)`;
    db.pool.query(query, [bookID, genreID], function (error, results) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }

        db.pool.query("SELECT * FROM GenresofBooks;", function (error, rows) {
            if (error) return res.sendStatus(400);
            res.json({ success: true, bookgenres: rows });
        });
    });
});

// EDIT/UPDATE bookGenres
app.post('/edit-bookgenre-ajax', function (req, res) {
    let { genreBookID, bookID, genreID } = req.body;
    
    let query = "UPDATE GenresofBooks SET bookID = ?, genreID = ? WHERE genreBookID = ?";
    db.pool.query(query, [bookID, genreID, genreBookID], function (error, results) {
        if (error) {
            console.log(error);
            return res.json({ success: false });
        }
        res.json({ success: results.affectedRows > 0 });
    });
});

app.delete('/delete-bookgenre-ajax/', function(req,res,next) {
    let data = req.body;
    let genreBookID = parseInt(data.genreBookID);
    let deleteBookGenre = `DELETE FROM GenresofBooks WHERE genreBookID = ?`;
    
    // Run the 1st query
    db.pool.query(deleteBookGenre, [genreBookID], function(error, rows, fields) {
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


// Start the server
app.listen(PORT, function (err) {
    if (err) throw err;
    console.log(`Server running on http://classwork.engr.oregonstate.edu:${PORT}`);
});