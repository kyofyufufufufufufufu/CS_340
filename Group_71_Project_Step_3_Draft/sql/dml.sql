-- SELECT queries
-- Get all users
SELECT * FROM Users;

-- Get all books
SELECT * FROM Books;

-- Get all authors
SELECT * FROM Authors;

-- Get all genres
SELECT * FROM Genres;

-- Get a specific book by ID
-- Dynamic inputs: (:bookID)
SELECT * FROM Books WHERE bookID = :bookID;

-- Get user info by ID
-- Dynamic inputs: (:userID)
SELECT * FROM Users
WHERE userID = :customerID;

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

-- Get all books by an author
-- Dynamic inputs: (:authorID)  
SELECT Books.* FROM Books
JOIN AuthorsofBooks ON Books.bookID = AuthorsofBooks.bookID
WHERE AuthorsofBooks.authorID = :authorID;

-- Get all books of a genre
-- Dynamic inputs: (:genreID)

-- SELECT Books.* FROM Books
-- JOIN GenresofBooks ON Books.bookID = GenresofBooks.bookID
-- WHERE GenresofBooks.genreID = :genreID;

SELECT Books.bookID, Books.bookTitle, Genres.genreName FROM Books
JOIN GenresofBooks ON Books.bookID = GenresofBooks.bookIDs
JOIN Genres ON GenresofBooks.genreID = Genres.genreID
WHERE GenresofBooks.genreID = :genreID;

-- INSERT queries
-- Add a new book
-- Dynamic inputs: (:title, :author, :genre)
INSERT INTO Books (bookTitle, bookDescription, bookPublishDate)
VALUES (:title, :description, :publishdate);

-- Add a new user
-- Dynamic inputs: (:userName, :password, :email)
INSERT INTO Users (userName, password, email)
VALUES (:userName, :password, :email);

-- UPDATE queries
-- Update book details
-- Dynamic inputs: (:bookTitle, :bookDescription, :bookPublishDate, :bookID)
UPDATE Books
SET bookTitle = :bookTitle, bookDescription = :bookDescription, bookPublishDate = :bookPublishDate
WHERE bookID = :bookID;


-- Update user details
-- Dynamic inputs: (:name, :email, :userID)
UPDATE Users
SET userName = :userName, password = :password, email = :email
WHERE userID = :userID;

-- DELETE queries
-- Delete a book
-- Dynamic inputs: (:bookID)
DELETE FROM Books WHERE bookID = :bookID;

-- Delete a user
-- Dynamic inputs: (:userID)
DELETE FROM Users WHERE userID = :userID;
