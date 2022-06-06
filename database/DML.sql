
-- Professors
-- To display all information about professors in table:
SELECT Professors.professor_id, Professors.f_name AS first_name, Professors.l_name AS last_name, Professors.age, Professors.house_id AS house FROM Professors;

-- To get house_id and name for insert dropdown menu
SELECT Houses.house_id, Houses.house_name FROM Houses;

-- To create a new Professor
INSERT INTO Professors (f_name, l_name, age, house_id)
  VALUES(:f_name_input, :l_name_input, :age_input, :house_id_from_dropdown_input);

-- To delete a professor
DELETE FROM Professors WHERE professor_id = ?;

-- Classes
-- To get all information about classes to display in table:
SELECT Classes.class_id, Classes.class_name as class_name, Classes.description, Classes.schedule_id, Classes.start_time as start_time, Classes.end_time as end_time, Classes.class_size as class_size, Classes.professor_id as professor, Classes.book_id as book, Classes.cost, Classes.class_year as class_year FROM Classes;

-- To get partial search results
SELECT Classes.class_id, Classes.class_name as class_name, Classes.description, Classes.schedule_id, Classes.start_time as start_time, Classes.end_time as end_time, Classes.class_size as class_size, Classes.professor_id as professor, Classes.book_id as book, Classes.cost, Classes.class_year as class_year FROM Classes WHERE Classes.class_name LIKE :req.query.class_name;

-- To get schedule_id and schedule from Schedules for dropdown in creation form:
SELECT * FROM Class_Schedules;

-- To get professor_id, f_name, l_name from Professors for dropdown in creation form
SELECT Professors.professor_id, CONCAT(Professors.f_name, ' ', Professors.l_name) as professor FROM Professors;

-- To get book_id, title from Books for dropdown in creation form:
SELECT Books.book_id, Books.title FROM BOOKS;

-- To create a new Class
INSERT INTO Classes (class_name, description, schedule_id, start_time, end_time, class_size, professor_id, book_id, cost, class_year) 
  VALUES (:class_name_input, :description_input, :schedule_id_from_dropdown_input, :start_time_input, :end_time_input, :class_size_input, :professor_id_from_dropdown_input, :book_id_from_dropdown_input, :cost_input, :class_year_input);

-- To delete a class
DELETE FROM Classes WHERE class_id = ?;

-- Students

-- To get all information about students to display in table:
SELECT Students.student_id, Students.f_name AS first_name, Students.l_name as last_name, Students.age, Students.year, Students.is_full_time, Students.house_id AS house FROM Students;

-- To get partial search results
SELECT Students.student_id, Students.f_name AS first_name, Students.l_name as last_name, Students.age, Students.year, Students.is_full_time, Students.house_id AS house FROM Students WHERE f_name LIKE :req.query.f_name;

-- To get house_id, house_name from Houses for dropdown in creation and search form:
SELECT Houses.house_id, Houses.house_name FROM Houses;

-- To create a new student:
INSERT INTO Students (f_name, l_name, age, year, is_full_time, house_id)
  VALUES (:f_name_input, :l_name_input, :age_input, :year_input, :is_full_time_from_dropdown_input, :house_id_from_dropdown_input);

-- To delete a student
DELETE FROM Students WHERE student_id = ?;


--Students_Has_Classes

--To get all information from Students_Has_Classes to display in table:
SELECT Students_Has_Classes.id, Students_Has_Classes.student_id as student, Students_Has_Classes.class_id as class FROM Students_Has_Classes GROUP BY Students_Has_Classes.id;

-- To get class_id, class_name from Classes for dropdown in creation form:
SELECT Classes.class_id, Classes.class_name FROM Classes;

-- To get student_id, f_name, l_name from Students for dropdown in creation form:
SELECT Students.student_id, Students.f_name, Students.l_name FROM Students;

-- To associate a student with a class
INSERT INTO Students_Has_Classes (class_id, student_id)
  VALUES (:class_id_from_dropdown_input, :student_id_from_dropdown_input);

--Books
-- Get all book_id, title of the books, and their costs 
-- to populate the table in the Books page
SELECT * FROM Books;

--to get partial search 
SELECT * FROM Books WHERE title LIKE :req.query.title;

-- To create a new book
INSERT INTO Books (title, cost)
  VALUES(:title_input, :cost_input);

-- get all book_id to populate the update drowpdown menu
SELECT Books.book_id, Books.title FROM Books

-- delete a book 
DELETE FROM Book WHERE id = :book_id_selected_from_book_page;

--update a book
UPDATE Book
SET title = :title_update_input, cost = :cost_update_input
WHERE book_id = :book_id_from_dropdown_update;

--Houses
-- Get all house_id and their house_name to populate the table in the Houses page
SELECT * FROM Houses ORDER BY Houses.house_id;

-- to get partial search results
SELECT * FROM Houses WHERE house_name LIKE ;req.query.name;

-- To create a new house
INSERT INTO Houses (house_name)
  VALUES(:house_name_input);

-- To delete a house
DELETE FROM Houses WHERE house_id = ?;

--Spells
-- Get all spell_id, spell_name, description, require_wand, and spell_type to populate the table in the Spells page
SELECT * FROM Spells;

-- To create a new spell
INSERT INTO Spells (spell_name, description, require_wand, spell_type)
  VALUES (:spell_name_input, :description_input, :require_wand_input, :spell_type_input)

-- To delete a spell
ELETE FROM Spells WHERE spell_id = ?;

--Class Schedules 
-- Get all schedule_id, meets_monday, meets_tuesday, meets_wednesday, meets_thursday, meets_friday
SELECT * FROM Class_Schedules;

-- to insert a class schedule
INSERT INTO Class_Schedules (meets_monday, meets_tuesday, meets_wednesday, meets_thursday, meets_friday)
      VALUES(:monday_input, :tuesday_input, :wednesday_input, :thursday_input, :friday_input);

-- to delete a schedule
DELETE FROM Class_Schedules WHERE schedule_id = ?;

--Students_Has_Books
-- get all id, student_id and book_id for the Students_Has_Books page
SELECT id, CONCAT(Students.f_name, ' ', Students.l_name) AS student, Books.title as book FROM Students_Has_Books
INNER JOIN Students ON Students_Has_Books.student_id = Students.student_id INNER JOIN Books ON Students_Has_Books.book_id = Books.book_id;         

--to get the information about students for the creation dropdown menu:
SELECT student_id, f_name, l_name FROM Students;

--to get the information about books for the creation dropdown menu:
SELECT book_id, title FROM Books;

--give a student a book:
INSERT INTO Students_Has_Books (student_id, book_id)
VALUES (:student_id_from_dropdown_input, book_id_from_dropdown_input);

-- To delete students_has_books
DELETE FROM Students_Has_Books WHERE id = ?;

-- Books_Has_Spells
-- get all id, book_id, and spell_id for the Books_Has_Spells
SELECT Books_Has_Spells.id, Books_Has_Spells.book_id as book, Books_Has_Spells.spell_id as spell FROM Books_Has_Spells GROUP BY Books_Has_Spells.id;

--to get the information about books for the creation dropdown menu:
SELECT Books.book_id, Books.title as book FROM Books;

--to get the information about spells for the creation dropdown menu:
SELECT Spells.spell_id, Spells.spell_name as spell FROM Spells

--to add a spell to a book:
INSERT INTO Books_Has_Spells (book_id, spell_id)
VALUES (:book_id_from_dropdown_input, :spell_id_from_dropdown_input);

--to delete a books_Has_spells
DELETE FROM Books_Has_Spells WHERE id = ?;