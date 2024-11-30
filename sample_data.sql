INSERT INTO Episodes (EpisodeName, BroadcastDate)
VALUES 
('A Walk in the Woods', '1983-01-11'),
('Mount McKinley', '1983-01-18'),
('Meadow Lake', '1983-01-25');

INSERT INTO Subjects (EpisodeID, Subject)
VALUES
(1, 'Mountain'),
(1, 'Trees'),
(2, 'Mountain'),
(2, 'Lake'),
(3, 'Lake'),
(3, 'Meadow');

INSERT INTO Colors (EpisodeID, ColorName, HexCode)
VALUES
(1, 'Alizarin Crimson', '#4E1500'),
(1, 'Bright Red', '#DB0000'),
(2, 'Phthalo Blue', '#102E3C'),
(3, 'Cadmium Yellow', '#FFF600');
