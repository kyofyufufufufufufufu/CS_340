-- Group 71: Krystal Lu, Annmarie Geiger
-- Project Title: Book Tracking Management System

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Drop Existing Tables if They Exist
DROP TABLE IF EXISTS Users, Books, UserBooks, Authors, AuthorsofBooks, Genres, GenresofBooks;

-- Create Users Table
CREATE TABLE Users (
    userID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    userName VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Create Books Table
CREATE TABLE Books (
    bookID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    bookTitle VARCHAR(100) NOT NULL,
    bookDescription TEXT NOT NULL,
    bookPublishDate date NOT NULL
);

-- Create Authors Table
CREATE TABLE Authors (
    authorID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    authorName VARCHAR(100) NOT NULL
);

-- Create Genres Table
CREATE TABLE Genres (
    genreID INT UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    genreName VARCHAR(45) NOT NULL
);

-- Create UserBooks Table (intersection)
CREATE TABLE UserBooks (
    userBookID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    bookID INT NOT NULL,
    userBookStatus ENUM('wishlist', 'read', 'dropped') NOT NULL,
    userBookRating TINYINT(1) NULL,
    CONSTRAINT chkUserBookRating CHECK(userBookrating IS NULL OR userBookRating >=1 AND userBookRating <= 5),
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (bookID) REFERENCES Books(bookID) ON DELETE RESTRICT
);

-- Create AuthorsofBooks Table (intersection)
CREATE TABLE AuthorsofBooks (
    authorBookID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    authorID INT NOT NULL,
    bookID INT NOT NULL,
    FOREIGN KEY (authorID) REFERENCES Authors(authorID) ON DELETE RESTRICT,
    FOREIGN KEY (bookID) REFERENCES Books(bookID) ON DELETE RESTRICT
);

-- Create GenresofBooks Table (intersection)
CREATE TABLE GenresofBooks (
    genreBookID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    genreID INT NOT NULL,
    bookID INT NOT NULL,
    FOREIGN KEY (genreID) REFERENCES Genres(genreID) ON DELETE RESTRICT,
    FOREIGN KEY (bookID) REFERENCES Books(bookID) ON DELETE RESTRICT
);


-- Example Data for Users
INSERT INTO Users (userName, password, email) VALUES
('lights', '12345', 'lights2@gmail.com'),
('test1', '34256', 'tester@gmail.com'),
('booklover', '54321', 'books4life@gmail.com');

-- Example Data for Books
INSERT INTO Books (bookTitle, bookDescription, bookPublishDate) VALUES
('Leviathan Wakes','Humanity has colonized the solar system—Mars, the Moon, the Asteroid Belt and beyond—but the stars are still out of our reach. 
Jim Holden is XO of an ice miner making runs from the rings of Saturn to the mining stations of the Belt. 
When he and his crew stumble upon a derelict ship, the Scopuli, they find themselves in possession of a secret they never wanted. 
A secret that someone is willing to kill for—and kill on a scale unfathomable to Jim and his crew. 
War is brewing in the system unless he can find out who left the ship and why. 
Detective Miller is looking for a girl. One girl in a system of billions, but her parents have money and money talks. 
When the trail leads him to the Scopuli and rebel sympathizer Holden, he realizes that this girl may be the key to everything.
Holden and Miller must thread the needle between the Earth government, 
the Outer Planet revolutionaries, and secretive corporations—and the odds are against them. 
But out in the Belt, the rules are different, and one small ship can change the fate of the universe.','2011-06-02'),

('The God of the Woods','When a teenager vanishes from her Adirondack summer camp, two worlds collide. Early morning, August 1975: a camp counselor discovers an empty bunk. Its occupant,
Barbara Van Laar, has gone missing. Barbara isn''t just any thirteen-year-old: 
she''s the daughter of the family that owns the summer camp and employs most of the region''s residents. 
And this isn''t the first time a Van Laar child has disappeared. 
Barbara''s older brother similarly vanished fourteen years ago, never to be found.
As a panicked search begins, a thrilling drama unfolds. 
Chasing down the layered secrets of the Van Laar family and the blue-collar community working in its shadow, 
Moore’s multi-threaded story invites readers into a rich and gripping dynasty of secrets and second chances. 
It is Liz Moore’s most ambitious and wide-reaching novel yet.','2024-07-02'),

('A Game of Thrones','Long ago, in a time forgotten, a preternatural event threw the seasons out of balance. In a land where summers can last decades and winters a lifetime, trouble is brewing. 
The cold is returning, and in the frozen wastes to the north of Winterfell, 
sinister forces are massing beyond the kingdom’s protective Wall. To the south, 
the king’s powers are failing—his most trusted adviser dead under mysterious circumstances and his enemies emerging from the shadows of the throne. At the center of the conflict lie the Starks of Winterfell, a family as harsh and unyielding as the frozen land they were born to. Now Lord Eddard Stark is reluctantly summoned to serve as the king’s new Hand, an appointment that threatens to sunder not only his family but the kingdom itself.
Sweeping from a harsh land of cold to a summertime kingdom of epicurean plenty, 
A Game of Thrones tells a tale of lords and ladies, soldiers and sorcerers, 
assassins and bastards, who come together in a time of grim omens. 
Here an enigmatic band of warriors bear swords of no human metal; 
a tribe of fierce wildlings carry men off into madness; 
a cruel young dragon prince barters his sister to win back his throne; 
a child is lost in the twilight between life and death; 
and a determined woman undertakes a treacherous journey to protect all she holds dear. 
Amid plots and counter-plots, tragedy and betrayal, victory and terror, allies and enemies, 
the fate of the Starks hangs perilously in the balance, 
as each side endeavors to win that deadliest of conflicts: the game of thrones.','1996-08-06'),

('The House in the Cerulean Sea','A magical island. A dangerous task. A burning secret. Linus Baker leads a quiet, solitary life. At forty, he lives in a tiny house with a devious cat and his old records. 
As a Case Worker at the Department in Charge Of Magical Youth, 
he spends his days overseeing the well-being of children in government-sanctioned orphanages.
When Linus is unexpectedly summoned by Extremely Upper Management he''s given a curious and highly classified assignment: 
travel to Marsyas Island Orphanage, where six dangerous children reside: a gnome, a sprite, a wyvern, an unidentifiable green blob, a were-Pomeranian, and the Antichrist. Linus must set aside his fears and determine whether or not they''re likely to bring about the end of days.
But the children aren''t the only secret the island keeps. 
Their caretaker is the charming and enigmatic Arthur Parnassus, 
who will do anything to keep his wards safe. As Arthur and Linus grow closer, 
long-held secrets are exposed, and Linus must make a choice: destroy a home or watch the world burn.
An enchanting story, masterfully told, 
The House in the Cerulean Sea is about the profound experience of discovering an unlikely family in an unexpected place—and realizing that family is yours.','2020-03-16'),

('Caliban’s War', 'We are not alone. On Ganymede, breadbasket of the outer planets, a Martian marine watches as her platoon is slaughtered by a monstrous supersoldier. 
On Earth, a high-level politician struggles to prevent interplanetary war from reigniting. 
And on Venus, an alien protomolecule has overrun the planet, wreaking massive, 
mysterious changes and threatening to spread out into the solar system.
In the vast wilderness of space, James Holden and the crew of the Rocinante have been keeping the peace for the Outer Planets Alliance. When they agree to help a scientist search war-torn Ganymede for a missing child, 
the future of humanity rests on whether a single ship can prevent an alien invasion that may have already begun...','2021-06-07'); 

-- Example Data for Authors
INSERT INTO Authors (authorName) VALUES
('James S.A. Corey'),
('Liz Moore'),
('George R.R. Martin'),
('T.J. Klune');

-- Example Data for Genres
INSERT INTO Genres (genreName) VALUES
('Science Fiction'),
('Fantasy'),
('Mystery & Thriller');

-- Example Data for UserBooks
INSERT INTO UserBooks (userID, bookID, userBookStatus, userBookRating) VALUES
(1,1,'read', 5),
(2,2,'wishlist', NULL),
(3,2,'dropped', 1),
(2,3,'wishlist', NULL),
(1,5,'read', 3);

-- Example Data for AuthorsofBooks
INSERT INTO AuthorsofBooks (authorID, bookID) VALUES
(1,1),
(2,2),
(3,3),
(4,4),
(1,5);

-- Example Data for GenresofBooks
INSERT INTO GenresofBooks (genreID, bookID) VALUES
(1,1),
(3,2),
(2,3),
(2,4),
(1,5);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;