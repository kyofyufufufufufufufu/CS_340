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
    let query = `INSERT INTO Users (userName, password, email) VALUES (?, ?, ?)`;
    db.pool.query(query, [data.userName, data.password, data.email], (error, rows) => {
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


// Start the server
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running on http://classwork.engr.oregonstate.edu:${PORT}`);
});