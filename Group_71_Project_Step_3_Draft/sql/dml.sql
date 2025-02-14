
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
SELECT userBookID, 
    (SELECT userID FROM Users WHERE userID = UserBooks.userID) AS userName, 
    (SELECT bookID FROM Books WHERE bookID = Books.bookID) AS bookName, 
    userBookStatus,
    userBookRating
FROM UserBooks;

-- Create - Add a book to a user's library.
-- Dynamic inputs: (:userID, :bookID, :rating, :status)
INSERT INTO UserBooks (userID, bookID, userBookRating, userBookStatus)
VALUES (
    (SELECT userID FROM Users WHERE userID = :userID),
    (SELECT bookID FROM Books WHERE bookID = :bookID),
    :rating, :status);

-- Update UserBook entry
-- Dynamic inputs: (:userID, :bookID, :rating, :status)
UPDATE UserBooks
SET userID = (SELECT userID FROM Users WHERE userID = UserBooks.userID), 
    bookID = (SELECT bookID FROM Books WHERE bookID = Books.bookID), 
    userBookRating = :rating, userBookStatus = :status
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

-- Read - Get books from authors.
SELECT authorBookID, 
    (SELECT authorName FROM Authors WHERE authorID = AuthorsofBooks.authorID) AS authorFullName,
    (SELECT bookTitle FROM Books WHERE bookID = AuthorsofBooks.bookID) AS bookName
FROM AuthorsofBooks;


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
SELECT genreBookID, 
    (SELECT genreName FROM Genres WHERE genreID = GenresofBooks.genreID) AS nameOfGenre,
    (SELECT bookTitle FROM Books WHERE bookID = GenresofBooks.bookID) AS bookName
FROM GenresofBooks;

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




