// Create an Express app
const express = require('express');
const app = express();
// Middleware for JSON and URL encoded form data
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static('public'))
const PORT = process.env.PORT || 5671;

const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars');
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// Database
const db = require('./database/db-connector')

//Render Homepage
// app.get("/", (req, res) => {
//     res.render("index");
//   });

// Page data
const pages = [
    { title: 'Home', url: '/' },
    { title: 'Users', url: '/users' },
    { title: 'Books', url: '/books' },
    { title: 'Authors', url: '/authors' },
    { title: 'Genres', url: '/genres' },
    { title: 'UserBooks', url: '/userbooks' },
    { title: 'AuthorBooks', url: '/authorbooks' },
    { title: 'BookGenres', url: '/bookgenres' }
];

const users = [
    { userID: 1, userName: "lights", password: "12345", email: "lights2@gmail.com"},
    { userID: 2, userName: "test1", password: "34256", email: "tester@email.com"},
    { userID: 3, userName: "booklover", password: "54321", email: "books4life@gmail.com"}
];

const books = [
    { bookID: 1, bookTitle: "Leviathan Wakes" },
    { bookID: 2, bookTitle: "The God of the Woods" },
    { bookID: 3, bookTitle: "A Game of Thrones" },
    { bookID: 4, bookTitle: "The House in the Cerulean Sea" },
    { bookID: 5, bookTitle: "Caliban’s War" }
];

const authors = [
    { authorID: 1, authorName: "James S.A. Corey" },
    { authorID: 2, authorName: "Liz Moore" },
    { authorID: 3, authorName: "George R.R. Martin" },
    { authorID: 4, authorName: "T.J. Klune" }
];

const genres = [
    { genreID: 1, genreName: "Science Fiction" },
    { genreID: 2, genreName: "Fantasy" },
    { genreID: 3, genreName: "Mystery & Thriller" }
];

const userbooks = [
    { userBookID: 1, userName: "lights", bookTitle: "Leviathan Wakes", userBookStatus: "read", userBookRating: 5 },
    { userBookID: 2, userName: "test1", bookTitle: "The God of the Woods", userBookStatus: "wishlist", userBookRating: null },
    { userBookID: 3, userName: "booklover", bookTitle: "The God of the Woods", userBookStatus: "dropped", userBookRating: 1 },
    { userBookID: 4, userName: "test1", bookTitle: "A Game of Thrones", userBookStatus: "wishlist", userBookRating: null },
    { userBookID: 5, userName: "lights", bookTitle: "Caliban’s War", userBookStatus: "read", userBookRating: 3 }
];

const authorbooks = [
    { authorBookID: 1, authorName: "James S.A. Corey", bookTitle: "Leviathan Wakes" },
    { authorBookID: 2, authorName: "Liz Moore", bookTitle: "The God of the Woods" },
    { authorBookID: 3, authorName: "George R.R. Martin", bookTitle: "A Game of Thrones" },
    { authorBookID: 4, authorName: "T.J. Klune", bookTitle: "The House in the Cerulean Sea" },
    { authorBookID: 5, authorName: "James S.A. Corey", bookTitle: "Caliban’s War" }
];

const bookgenres = [
    { genreBookID: 1, bookTitle: "Leviathan Wakes", genreName: "Science Fiction" },
    { genreBookID: 2, bookTitle: "The God of the Woods", genreName: "Mystery & Thriller" },
    { genreBookID: 3, bookTitle: "A Game of Thrones", genreName: "Fantasy" },
    { genreBookID: 4, bookTitle: "The House in the Cerulean Sea", genreName: "Fantasy" },
    { genreBookID: 5, bookTitle: "Caliban’s War", genreName: "Science Fiction" }
];

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
app.get(['/'], (req, res) => {
    res.render('home', { pages });
});

app.get(['/users'], (req, res) => {
    res.render('users', { users, pages });
});

app.get(['/books'], (req, res) => {
    res.render('books', { books, pages });
});

app.get(['/authors'], (req, res) => {
    res.render('authors', { authors, pages });
});

app.get(['/genres'], (req, res) => {
    res.render('genres', { genres, pages });
});

app.get(['/userbooks'], (req, res) => {
    res.render('userbooks', { users, books, userbooks, pages });
});

app.get(['/authorbooks'], (req, res) => {
    console.log('Navigating to authorbooks route');
    res.render('authorbooks', { authors, books, authorbooks, pages });
});

app.get(['/bookgenres'], (req, res) => {
    res.render('bookgenres', { books, genres, bookgenres, pages });
});

app.get('/test', (req, res) => {
    res.send('Test route is working');
});

// Start the server
app.listen(PORT, function (err) {
    if (err) throw err;
    console.log(`Server running on http://classwork.engr.oregonstate.edu:${PORT}/index.html`);
});
