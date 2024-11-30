CREATE TABLE Episodes (
    EpisodeID SERIAL PRIMARY KEY,
    EpisodeName VARCHAR(255) NOT NULL,
    BroadcastDate DATE
);

CREATE TABLE Subjects (
    SubjectID SERIAL PRIMARY KEY,
    EpisodeID INT REFERENCES Episodes(EpisodeID),
    Subject VARCHAR(255) NOT NULL
);

CREATE TABLE Colors (
    ColorID SERIAL PRIMARY KEY,
    EpisodeID INT REFERENCES Episodes(EpisodeID),
    ColorName VARCHAR(255) NOT NULL,
    HexCode VARCHAR(7) -- Example: #FFFFFF
);

-- Sample data for Episodes
INSERT INTO Episodes (EpisodeName, BroadcastDate)
VALUES 
('A Walk in the Woods', '1983-01-11'),
('Mount McKinley', '1983-01-18');

-- Sample data for Subjects
INSERT INTO Subjects (EpisodeID, Subject)
VALUES
(1, 'Mountain'),
(1, 'Trees'),
(2, 'Mountain'),
(2, 'Lake');

-- Sample data for Colors
INSERT INTO Colors (EpisodeID, ColorName, HexCode)
VALUES
(1, 'Alizarin Crimson', '#4E1500'),
(1, 'Bright Red', '#DB0000'),
(2, 'Phthalo Blue', '#102E3C');
