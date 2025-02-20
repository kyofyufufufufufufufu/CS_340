const express = require('express');
const exphbs = require('express-handlebars');

const PORT = process.env.PORT || 5671;

// Create an Express app
const app = express();

// Middleware for static files (Move this after app initialization)
app.use(express.static('public'));

// Page data
const pages = [
	{
		title: 'Home',
		url: '/'
	},
	{
		title: 'Users',
		url: '/users'
	},
	{
		title: 'UserBooks',
		url: '/userbooks'
	},
	{
		title: 'Books',
		url: '/books'
	},
    {
		title: 'Authors',
		url: '/authors'
	},
	{
		title: 'BookGenres',
		url: '/bookgenres'
	},
	{
		title: 'Genres',
		url: '/genres'
	}
];

const books = [
    { bookID: 1, bookTitle: "Leviathan Wakes" },
    { bookID: 2, bookTitle: "The God of the Woods" },
    { bookID: 3, bookTitle: "A Game of Thrones" },
    { bookID: 4, bookTitle: "The House in the Cerulean Sea" },
    { bookID: 5, bookTitle: "Caliban’s War" }
];

const genres = [
    { genreID: 1, genreName: "Science Fiction" },
    { genreID: 2, genreName: "Fantasy" },
    { genreID: 3, genreName: "Mystery & Thriller" }
];

const authors = [
    { authorID: 1, authorName: "James S.A. Corey" },
    { authorID: 2, authorName: "Liz Moore" },
    { authorID: 3, authorName: "George R.R. Martin" },
    { authorID: 4, authorName: "T.J. Klune" }
];

const users = [
    { userID: 1, userName: "lights" },
    { userID: 2, userName: "test1" },
    { userID: 3, userName: "booklover" }
];

const userbooks = [
    { userBookID: 1, userName: "lights", bookTitle: "Leviathan Wakes", userBookStatus: "read", userBookRating: 5 },
    { userBookID: 2, userName: "test1", bookTitle: "The God of the Woods", userBookStatus: "wishlist", userBookRating: null },
    { userBookID: 3, userName: "booklover", bookTitle: "The God of the Woods", userBookStatus: "dropped", userBookRating: 1 },
    { userBookID: 4, userName: "test1", bookTitle: "A Game of Thrones", userBookStatus: "wishlist", userBookRating: null },
    { userBookID: 5, userName: "lights", bookTitle: "Caliban’s War", userBookStatus: "read", userBookRating: 3 }
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

// Configure Handlebars
app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home', { pages });
});

app.get(['/bookgenres'], (req, res) => {
    res.render('bookgenres', { books, genres, bookgenres, pages });
});

app.get(['/userbooks'], (req, res) => {
    res.render('userbooks', { users, books, userbooks, pages });
});

app.get(['/authors'], (req, res) => {
    res.render('authors', { authors, pages });
});

app.get(['/genres'], (req, res) => {
    res.render('genres', { genres, pages });
});

app.get(['/users'], (req, res) => {
    res.render('users', { users, pages });
});

app.get(['/books'], (req, res) => {
    res.render('books', { books, pages });
});

// Start Server
app.listen(PORT, function (err) {
	if(err) throw err;
    console.log(`Server running on http://classwork.engr.oregonstate.edu:${PORT}/index.html`);
});
