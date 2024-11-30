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
