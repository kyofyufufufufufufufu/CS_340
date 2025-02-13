
--------------- Users ---------------
-- Read - Get all users
SELECT * FROM Users;

-- Read - Get user info by ID
-- Dynamic inputs: (:userID)
SELECT * FROM Users
WHERE userID = :customerID;

-- Create - Add a new user
-- Dynamic inputs: (:userName, :password, :email)
INSERT INTO Users (userName, password, email)
VALUES (:userName, :password, :email);

-- Update user details
-- Dynamic inputs: (:name, :email, :userID)
UPDATE Users
SET userName = :userName, password = :password, email = :email
WHERE userID = :userID;

-- Delete a user
-- Dynamic inputs: (:userID)
DELETE FROM Users WHERE userID = :userID;

--------------- Books ---------------

-- Read - Get all books
SELECT * FROM Books;

-- Read - Get a specific book by ID
-- Dynamic inputs: (:bookID)
SELECT * FROM Books WHERE bookID = :bookID;

-- Create - Add a new book
-- Dynamic inputs: (:title, :author, :genre)
INSERT INTO Books (bookTitle, bookDescription, bookPublishDate)
VALUES (:title, :description, :publishdate);

-- Update book details
-- Dynamic inputs: (:bookTitle, :bookDescription, :bookPublishDate, :bookID)
UPDATE Books
SET bookTitle = :bookTitle, bookDescription = :bookDescription, bookPublishDate = :bookPublishDate
WHERE bookID = :bookID;

-- Delete a book
-- Dynamic inputs: (:bookID)
DELETE FROM Books WHERE bookID = :bookID;


--------------- UserBooks ---------------

-- Read - Get all books from all users
SELECT * FROM UserBooks;

-- Get a specific user's book info by UserBooks ID
-- Dynamic inputs: (:UserBookID)
SELECT UserBooks.*, Users.userName, Users.email FROM UserBooks
JOIN Users ON UserBooks.userID = Users.userID
WHERE UserBooks.userBookID = :UserBookID;

-- Get all books in a user library
-- Dynamic inputs: (:userBookID)
SELECT Books.*, UserBooks.userBookStatus, UserBooks.userBookRating FROM UserBooks
JOIN Books ON UserBooks.bookID = Books.bookID
WHERE UserBooks.userBookID = :UserBookID;


--------------- Authors ---------------
-- Read - Get all authors
SELECT * FROM Authors;

-- Create - Add a new Author
-- Dynamic inputs: (authorName)
INSERT INTO Authors (authorName)
VALUES (:authorName);

-- Delete - Delete an Author.
DELETE FROM Authors WHERE authorID = :authorID;

--------------- Genres ---------------
-- Get all genres
SELECT * FROM Genres;


INSERT INTO Genres (genreName)
VALUES (:genreName);


DELETE FROM Genres WHERE genreID = :genreID;


--------------- GenresofBooks ---------------
SELECT * FROM GenresofBooks;

-- Get all books of a genre
-- Dynamic inputs: (:genreID)

-- SELECT Books.* FROM Books
-- JOIN GenresofBooks ON Books.bookID = GenresofBooks.bookID
-- WHERE GenresofBooks.genreID = :genreID;

SELECT Books.bookID, Books.bookTitle, Genres.genreName FROM Books
JOIN GenresofBooks ON Books.bookID = GenresofBooks.bookID
JOIN Genres ON GenresofBooks.genreID = Genres.genreID
WHERE GenresofBooks.genreID = :genreID;


---------------- AuthorsofBooks ---------------

SELECT * FROM AuthorsofBooks;

-- Read - Get all books by an author
-- Dynamic inputs: (:authorID)  
SELECT Books.* FROM Books
JOIN AuthorsofBooks ON Books.bookID = AuthorsofBooks.bookID
WHERE AuthorsofBooks.authorID = :authorID;


