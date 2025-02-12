const express = require('express');
const exphbs = require('express-handlebars');

const PORT = process.env.PORT || 6371;

/* Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // or your database username
    password: 'yourpassword', // your database password
    database: 'book_tracking_system' // replace with your actual database name
});

Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});
*/

// Create an Express app
const app = express();

// Register custom helper for equality comparison
const hbs = exphbs.create({});
hbs.handlebars.registerHelper('isEqual', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});

hbs.handlebars.registerHelper('isNotEqual', function (a, b, options) {
    return a !== b ? options.fn(this) : options.inverse(this);
});

// Configure express-handlebars
app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.static('public'));

// Pages array similar to your original
const pages = [
    { title: 'Home', url: '/' },
    { title: 'Users', url: '/users', columns: ['userName', 'email'] },
    { title: 'Books', url: '/books', columns: ['bookTitle', 'bookDescription'] },
    { title: 'Authors', url: '/authors', columns: ['authorName'] },
    { title: 'Genres', url: '/genres', columns: ['genreName'] }
];

// Route to Home
app.get('/', (req, res) => {
    res.render('home', { title: 'Home', pages });
});

// Route to Users page
app.get('/users', (req, res) => {
    db.query('SELECT * FROM Users', (err, users) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error fetching users.');
        }
        res.render('users', { title: 'Users', users, pages });
    });
});

// Route to Books page
app.get('/books', (req, res) => {
    db.query('SELECT * FROM Books', (err, books) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error fetching books.');
        }
        res.render('books', { title: 'Books', books, pages });
    });
});

// Route to Authors page
app.get('/authors', (req, res) => {
    db.query('SELECT * FROM Authors', (err, authors) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error fetching authors.');
        }
        res.render('authors', { title: 'Authors', authors, pages });
    });
});

// Route to Genres page
app.get('/genres', (req, res) => {
    db.query('SELECT * FROM Genres', (err, genres) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error fetching genres.');
        }
        res.render('genres', { title: 'Genres', genres, pages });
    });
});

// Start the server
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running on port ${PORT}`);
});