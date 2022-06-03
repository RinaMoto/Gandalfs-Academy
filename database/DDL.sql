SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;
CREATE OR REPLACE TABLE Class_Schedules (
    schedule_id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    meets_monday tinyint DEFAULT 0 NOT NULL,
    meets_tuesday tinyint DEFAULT 0 NOT NULL, 
    meets_wednesday tinyint DEFAULT 0 NOT NULL,
    meets_thursday tinyint DEFAULT 0 NOT NULL,
    meets_friday tinyint DEFAULT 0 NOT NULL,
    UNIQUE(schedule_id)
);

CREATE OR REPLACE TABLE Books (
    book_id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(50),
    cost DECIMAL(15, 2),
    UNIQUE(title)
);

CREATE OR REPLACE TABLE Houses (
    house_id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    house_name VARCHAR(25) NOT NULL,
    UNIQUE(house_name)
);

CREATE OR REPLACE TABLE Spells (
    spell_id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    spell_name VARCHAR(25) NOT NULL,
    description VARCHAR(255) NOT NULL,
    require_wand tinyint DEFAULT 0 NOT NULL,
    spell_type VARCHAR(30),
    UNIQUE(spell_name)
);

DROP TABLE IF EXISTS Professors;
CREATE TABLE Professors
(
    professor_id int NOT NULL UNIQUE AUTO_INCREMENT,
    f_name varchar(25) NOT NULL,
    l_name varchar(25) NOT NULL,
    age tinyint NOT NULL,
    house_id int,
    PRIMARY KEY (professor_id),
    FOREIGN KEY (house_id)
    REFERENCES Houses(house_id) ON DELETE CASCADE,
    UNIQUE(f_name, l_name)
);

DROP TABLE IF EXISTS Students;
CREATE TABLE Students
(
    student_id int NOT NULL UNIQUE AUTO_INCREMENT,
    f_name varchar(25) NOT NULL,
    l_name varchar(25) NOT NULL,
    age tinyint NOT NULL,
    year tinyint NOT NULL,
    is_full_time tinyint(1) NOT NULL DEFAULT 0,
    house_id int NOT NULL,
    PRIMARY KEY (student_id),
    FOREIGN KEY (house_id)
    REFERENCES Houses(house_id)
    ON DELETE CASCADE,
    UNIQUE(f_name, l_name)
);

DROP TABLE IF EXISTS Classes;
CREATE TABLE Classes
(
    class_id int NOT NULL UNIQUE AUTO_INCREMENT,
    class_name varchar(50) NOT NULL UNIQUE,
    description varchar(255) NOT NULL,
    schedule_id int NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    class_size tinyint,
    professor_id int NOT NULL,
    book_id int,
    cost decimal(15,2),
    class_year tinyint,
    PRIMARY KEY (class_id),
    FOREIGN KEY (schedule_id)
    REFERENCES Class_Schedules(schedule_id)
    ON DELETE CASCADE,
    FOREIGN KEY (professor_id)
    REFERENCES Professors(professor_id)
    ON DELETE CASCADE,
    FOREIGN KEY (book_id)
    REFERENCES Books(book_id)
    ON DELETE CASCADE
);

DROP TABLE IF EXISTS Students_Has_Classes;
CREATE TABLE Students_Has_Classes
(
    id int NOT NULL UNIQUE AUTO_INCREMENT,
    class_id int NOT NULL,
    student_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (class_id)
    REFERENCES Classes(class_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id)
    REFERENCES Students(student_id) ON DELETE CASCADE,
    UNIQUE(student_id, class_id)
);


CREATE OR REPLACE TABLE Students_Has_Books (
    id int NOT NULL UNIQUE AUTO_INCREMENT,
    student_id int NOT NULL,
    book_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (student_id)
    REFERENCES Students(student_id)
    ON DELETE CASCADE,
    FOREIGN KEY (book_id)
    REFERENCES Books(book_id)
    ON DELETE CASCADE,
    UNIQUE(id)
);

CREATE OR REPLACE TABLE Books_Has_Spells (
    id int NOT NULL UNIQUE AUTO_INCREMENT,
    book_id int NOT NULL, 
    spell_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (book_id)
    REFERENCES Books(book_id)
    ON DELETE CASCADE,
    FOREIGN KEY (spell_id)
    REFERENCES Spells(spell_id)
    ON DELETE CASCADE,
    UNIQUE(id)
);

INSERT INTO Class_Schedules(meets_monday, meets_tuesday, meets_wednesday, meets_thursday, meets_friday)
VALUES (1, 0, 1, 0, 1),
(0, 1, 0, 1, 0),
(1, 1, 1, 1, 1);


INSERT INTO Books(title, cost)
VALUES (
    'Dragonwrath book of dark magic', 
    40.00
),
(
    'Flux book of potions', 
    45.00
),
(
    'Ancient book of Runes', 
    52.00
),
(
    'Grimoire spell casting guide', 
    80.00
),
(
    'Dummies guide to wand spells', 
    48.00
);

INSERT INTO Houses(house_name)
VALUES ('House of Eldritch'),
('House of Starfall'),
('House of Brimstone'),
('House of Gilded'),
('House of Folio');



INSERT INTO Spells(spell_name, description, require_wand, spell_type)
VALUES (
    'Palladian', 
    'casts a spell on someone to say only the truth for 10 minutes', 
    0, 
    'Enchantment'
),
(
    'Compendium', 
    'the person who casts the spell can be any animal of their choosing for 24 hours', 
    1,
    'Transfiguration'
),
(
    'Vade Mecum',
    'takes the life of a person to prolong the life of the person who casts the spell',
    1,
    'Dark magic'
),
(
    'Albaster',
    'stops the flow of time for everyone but yourself for a brief period of time',
    0,
    'Time spells'
),
(
    'Luminous',
    'casts a spell on someone to take a course of action they would otherwise find ridiculous',
    1,
    'Enchantment'
);



INSERT INTO Professors
(
    f_name,
    l_name,
    age,
    house_id
)
VALUES
(
    "Lambdrey",
    "Fortenhiemer",
    24,
    (SELECT house_id FROM Houses WHERE house_name = "House of Eldritch")
),
(
    "Quilver",
    "Bellamy",
    46,
    (SELECT house_id FROM Houses WHERE house_name = "House of Starfall")
),
(
    "Havel",
    "Trellis",
    58,
    (SELECT house_id FROM Houses WHERE house_name = "House of Brimstone")
),
(
    "Exus",
    "Muldrake",
    30,
    (SELECT house_id FROM Houses WHERE house_name = "House of Gilded")
),
(
    "Boliver",
    "Swordsworth",
    35,
    (SELECT house_id FROM Houses WHERE house_name = "House of Gilded")
);

INSERT INTO Students
(
    f_name,
    l_name,
    age,
    year,
    is_full_time,
    house_id
)
VALUES
(
    "Clark",
    "Mollow",
    13,
    2,
    1,
    (SELECT house_id FROM Houses WHERE house_name = "House of Eldritch")
),
(
    "Miranda",
    "Feldon",
    16,
    4,
    1,
    (SELECT house_id FROM Houses WHERE house_name = "House of Starfall")
),
(
    "Emily",
    "Elwin",
    22,
    8,
    1,
    (SELECT house_id FROM Houses WHERE house_name = "House of Brimstone")
),
(
    "Gavin",
    "Holstrum",
    14,
    3,
    1,
    (SELECT house_id FROM Houses WHERE house_name = "House of Gilded")
),
(
    "Marcus",
    "West",
    18,
    6,
    0,
    (SELECT house_id FROM Houses WHERE house_name = "House of Folio")
);


INSERT INTO Classes
(
    class_name,
    description,
    schedule_id,
    start_time,
    end_time,
    class_size,
    professor_id,
    book_id,
    cost,
    class_year
)
VALUES
(
	"Introduction to Ritual Casting",
	"Learn the basics of Ritual Magic! The strongest spells are built from careful preparation.",
	(SELECT schedule_id FROM Class_Schedules WHERE meets_monday = 1 AND meets_tuesday = 0 AND meets_wednesday = 1 AND meets_thursday = 0 AND meets_friday = 1),
	"10:30:00",
	"12:30:00",
	12,
	(SELECT professor_id FROM Professors WHERE f_name = "Lambdrey" AND l_name = "Fortenhiemer"),
	(SELECT book_id FROM Books WHERE title = "Dragonwrath book of dark magic"),
	254.32,
	2
),
(
    "Human Transmutation",
    "Transform yourself and others! Careful casting and rigorous ethics are required to master this unique sorcery.",
    (SELECT schedule_id FROM Class_Schedules WHERE meets_monday = 0 AND meets_tuesday = 1 AND meets_wednesday = 0 AND meets_thursday = 1 AND meets_friday = 0),
    "14:00:00",
    "19:00:00",
    4,
    (SELECT professor_id FROM Professors WHERE f_name = "Quilver" AND l_name = "Bellamy"),
    (SELECT book_id FROM Books WHERE title = "Flux book of potions"),
    1200.00,
    6
),
(
    "Ethics of Mind Magic",
    "Learn about the limits of ethical mind manipulation, and what can and will go wrong when magic is pushed too far",
    (SELECT schedule_id FROM Class_Schedules WHERE meets_monday = 1 AND meets_tuesday = 0 AND meets_wednesday = 1 AND meets_thursday = 0 AND meets_friday = 1),
    "08:00:00",
    "9:30:00",
    30,
    (SELECT professor_id FROM Professors WHERE f_name = "Havel" AND l_name = "Trellis"),
    (SELECT book_id FROM Books WHERE title = "Ancient book of Runes"),
    300.00,
    4
),
(
    "Wand Movement 101",
    "An introduction to using a wand to focus your spellcasting!",
    (SELECT schedule_id FROM Class_Schedules WHERE meets_monday = 1 AND meets_tuesday = 1 AND meets_wednesday = 1 AND meets_thursday = 1 AND meets_friday = 1),
    "15:00:00",
    "16:00:00",
    35,
    (SELECT professor_id FROM Professors WHERE f_name = "Exus" AND l_name = "Muldrake"),
    (SELECT book_id FROM Books WHERE title = "Dummies guide to wand spells"),
    100.00,
    1
),
(
    "Medical Potions",
    "Treatment and prevention of all manner of magical malady, through the lens of potion brewing.",
    (SELECT schedule_id FROM Class_Schedules WHERE meets_monday = 1 AND meets_tuesday = 1 AND meets_wednesday = 1 AND meets_thursday = 1 AND meets_friday = 1),
    "07:00:00",
    "10:00:00",
    20,
    (SELECT professor_id FROM Professors WHERE f_name = "Boliver" AND l_name = "Swordsworth"),
    (SELECT book_id FROM Books WHERE title = "Hospital Potion Brewing"),
    300.00,
    3
);

INSERT INTO Students_Has_Classes
(
    class_id,
    student_id
)
VALUES
(
    (SELECT class_id FROM Classes WHERE class_name = "Ethics of Mind Magic"),
    (SELECT student_id FROM Students WHERE f_name = "Miranda" AND l_name = "Feldon")
),
(
    (SELECT class_id FROM Classes WHERE class_name = "Wand Movement 101"),
    (SELECT student_id FROM Students WHERE f_name = "Clark" AND l_name = "Mollow")
),
(
    (SELECT class_id FROM Classes WHERE class_name = "Medical Potions"),
    (SELECT student_id FROM Students WHERE f_name = "Gavin" AND l_name = "Holstrum")
),
(
    (SELECT class_id FROM Classes WHERE class_name = "Human Transmutation"),
    (SELECT student_id FROM Students WHERE f_name = "Marcus" AND l_name = "West")
),
(
    (SELECT class_id FROM Classes WHERE class_name = "Human Transmutation"),
    (SELECT student_id FROM Students WHERE f_name = "Emily" AND l_name = "Elwin")
);

INSERT INTO Students_Has_Books(student_id, book_id)
VALUES (
    (SELECT student_id FROM Students WHERE f_name = "Miranda" AND l_name = "Feldon"),
    (SELECT book_id FROM Books WHERE title = 'Dragonwrath book of dark magic')
),
(
    (SELECT student_id FROM Students WHERE f_name = "Clark" AND l_name = "Mollow"),
    (SELECT book_id FROM Books WHERE title = 'Flux book of potions')
),
(
    (SELECT student_id FROM Students WHERE f_name = "Gavin" AND l_name = "Holstrum"),
    (SELECT book_id FROM Books WHERE title = 'Ancient book of Runes')
),
(
    (SELECT student_id FROM Students WHERE f_name = "Marcus" AND l_name = "West"),
    (SELECT book_id FROM Books WHERE title = 'Grimoire spell casting guide')
),
(
    (SELECT student_id FROM Students WHERE f_name = "Emily" AND l_name = "Elwin"),
    (SELECT book_id FROM Books WHERE title = 'Dummies guide to wand spells')
);


INSERT INTO Books_Has_Spells(book_id, spell_id)
VALUES (
    (SELECT book_id FROM Books WHERE title = 'Dragonwrath book of dark magic'),
    (SELECT spell_id FROM Spells WHERE spell_name = 'Palladian')
),
(
    (SELECT book_id FROM Books WHERE title = 'Flux book of potions'),
    (SELECT spell_id FROM Spells WHERE spell_name = 'Compendium')
),
(
    (SELECT book_id FROM Books WHERE title = 'Ancient book of Runes'),
    (SELECT spell_id FROM Spells WHERE spell_name = 'Vade Mecum')
),
(
    (SELECT book_id FROM Books WHERE title = 'Grimoire spell casting guide'),
    (SELECT spell_id FROM Spells WHERE spell_name = 'Albaster')
),
(
    (SELECT book_id FROM Books WHERE title = 'Dummies guide to wand spells'),
    (SELECT spell_id FROM Spells WHERE spell_name = 'Luminous')
);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;