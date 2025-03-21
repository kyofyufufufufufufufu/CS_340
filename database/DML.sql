-- Citation for DML.sql
-- Date: 02/11/25
-- Adapted from: Exploration - Database Application Design
-- Source URL: https://canvas.oregonstate.edu/courses/1987790/pages/exploration-database-application-design?module_item_id=25023009

-- Citation for DML.sql
-- Date: 02/11/25
-- Adapted from: Canvas - sample_data_manipulation_queries.sql
-- Source URL: https://canvas.oregonstate.edu/courses/1987790/files/108859857?wrap=1

-- Group 71: Krystal Lu, Annmarie Geiger
-- Project Title: Book Tracking Management System

--------------- Users ---------------
-- Read - Get all users
SELECT userID, userName, password, email FROM Users;

-- Create - Add a new user
-- Dynamic inputs: (:userName, :password, :email)
INSERT INTO Users (userName, password, email)
VALUES (:userName, :password, :email);

-- Update user details
-- Dynamic inputs: (:userName, :password, :email)
UPDATE Users
SET userName = :userName, password = :password, email = :email
WHERE userID = :userID;

-- Delete a user
-- Dynamic inputs: (:userID)
DELETE FROM Users WHERE userID = :userID;

--------------- Books ---------------

-- Read - Get all books
SELECT bookID, bookTitle, bookDescription, bookPublishDate FROM Books;

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
SELECT UserBooks.userBookID AS ID, Users.username AS User,
    Books.bookTitle AS Book, 
    UserBooks.userBookStatus AS Status,
    UserBooks.userBookRating AS Rating
FROM UserBooks
    INNER JOIN Users ON Users.userID = UserBooks.userID
    INNER JOIN Books ON Books.bookID = UserBooks.bookID;

-- Create - Add a book to a user's library.
-- Dynamic inputs: (:userID, :bookID, :status, :rating)
INSERT INTO UserBooks (userID, bookID, userBookStatus, userBookRating)
SELECT 
    Users.userID, 
    Books.bookID,
    :status, 
    :rating
FROM Users, Books 
WHERE Users.userID = :userID AND Books.bookID = :bookID;

-- Update UserBook entry
-- Dynamic inputs: (:userID, :bookID, :status, :rating
UPDATE UserBooks
SET userID = (SELECT userID FROM Users WHERE userID = UserBooks.userID), 
    bookID = (SELECT bookID FROM Books WHERE bookID = Books.bookID), 
    userBookStatus = :status, userBookRating = :rating
WHERE userBookID = :userBookID;

-- Delete an entry in UserBooks
-- Dynamic inputs: (:userBookID)
DELETE FROM UserBooks WHERE userBookID = :userBookID;

--------------- Authors ---------------
-- Read - Get all authors
SELECT authorID, authorName FROM Authors;

-- Create - Add a new Author
-- Dynamic inputs: (:authorName)
INSERT INTO Authors (authorName)
VALUES (:authorName);

-- Update - Edit an author entry
-- Dynamic inputs: (:authorName)
UPDATE Authors
SET authorName = :authorName
WHERE authorID = :authorID;

-- Delete - Delete an Author.
-- Dynamic inputs: (:authorID)
DELETE FROM Authors WHERE authorID = :authorID;

--------------- Genres ---------------
-- Read - Get all genres
SELECT genreID, genreName FROM Genres;

-- Create - Add a new Genre
-- Dynamic inputs: (:genreName)
INSERT INTO Genres (genreName)
VALUES (:genreName);

-- Update - Edit genre entry
-- Dynamic inputs: (:genreName)
UPDATE Genres
SET genreName = :genreName
WHERE genreID = :genreID;

-- Delete - Delete a genre.
-- Dynamic inputs: (:genreID)
DELETE FROM Genres WHERE genreID = :genreID;

---------------- AuthorsofBooks ---------------

-- Read - Get books from authors
SELECT AuthorsofBooks.authorBookID, 
    Authors.authorName AS authorFullname,
    Books.bookTitle
FROM AuthorsofBooks
    INNER JOIN Authors on Authors.authorID = AuthorsofBooks.authorID
    INNER JOIN Books on Books.bookID = AuthorsofBooks.bookID;

-- Create - Assign a book to an author.
-- Dynamic inputs: (:authorName, :bookTitle)
INSERT INTO AuthorsofBooks (authorID, bookID)
VALUES (
    (SELECT authorID FROM Authors WHERE authorName = :authorName),
    (SELECT bookID FROM Books WHERE bookTitle = :bookTitle)
);

-- Update - Edit authors of books entry.
-- Dynamic inputs: (:authorName, :bookTitle)
UPDATE AuthorsofBooks
SET authorID = (SELECT authorID FROM Authors WHERE authorName = :authorName),
    bookID =  (SELECT bookID FROM Books WHERE bookTitle = :bookTitle)
WHERE authorBookID = :authorBookID;

-- Delete authors of books entry.
-- Dynamic inputs: (:authorBookID)
DELETE FROM AuthorsofBooks WHERE authorBookID = :authorBookID;

--------------- GenresofBooks ---------------

-- Read- Get books of all genres
SELECT GenresofBooks.genreBookID, 
    Books.bookTitle AS bookName,
    Genres.genreName AS nameOfGenre
FROM GenresofBooks
    INNER JOIN Genres on Genres.genreID = GenresofBooks.genreID
    INNER JOIN Books on Books.bookID = GenresofBooks.bookID;

-- Create - Add a book to a genre.
-- Dynamic inputs: (:genreName)
INSERT INTO GenresofBooks (genreID, bookID)
VALUES (
    (SELECT genreID FROM Genres WHERE genreName = :genreName),
    (SELECT bookID FROM Books WHERE bookTitle = :bookTitle)
);

-- Update - Edit genre of book entry.
-- Dynamic inputs: (:genreName, :bookTitle)
UPDATE GenresofBooks
SET genreID = (SELECT genreID FROM Genres WHERE genreName = :genreName),
    bookID =  (SELECT bookID FROM Books WHERE bookTitle = :bookTitle)
WHERE genreBookID = :genreBookID;

-- Delete genre of book entry.
-- Dynamic inputs: (:genreBookID)
DELETE FROM GenresofBooks WHERE genreBookID = :genreBookID;




