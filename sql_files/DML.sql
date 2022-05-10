
-- Professors
-- To display all information about professors in table:
SELECT Professors.professor_id, f_name, l_name, age, Houses.house_name AS house from Professors INNER JOIN Houses ON Professors.house_id = Houses.house_id;

-- To get house_id and name for insert dropdown menu
SELECT house_id, house_name FROM Houses;

-- To create a new Professor
INSERT INTO Professors (f_name, l_name, age, house_id)
  VALUES(:f_name_input, :l_name_input, :age_input, :house_id_from_dropdown_input);

-- Classes

-- To get all information about classes to display in table:
SELECT Classes.class_id, class_name, description, schedule_id, start_time, end_time, class_size, CONCAT(Professors.f_name, ' ', Professors.l_name) AS professor, Books.tilte AS book, cost, class_year FROM Classes INNER JOIN Professors ON Classes.professor_id = Professors.professor_id INNER JOIN Books on Classes.book_id = Books.book_id;

-- To get schedule_id and schedule from Schedules for dropdown in creation form:
SELECT schedule_id, meets_monday, meets_tuesday, meets_wednesday, meets_thursday, meets_friday FROM Schedules;

-- To get professor_id, f_name, l_name from Professors for dropdown in creation form
SELECT professor_id, f_name, l_name FROM Professors;

-- To get book_id, title from Books for dropdown in creation form:
SELECT book_id, title FROM BOOKS;

-- To create a new Class
INSERT INTO Classes (class_name, description, schedule_id, start_time, end_time, class_size, professor_id, book_id, cost, class_year) 
  VALUES (:class_name_input, :description_input, :schedule_id_from_dropdown_input, :start_time_input, :end_time_input, :class_size_input, :professor_id_from_dropdown_input, :book_id_from_dropdown_input, :cost_input, :class_year_input);

-- Students

-- To get all information about students to display in table:
SELECT student_id, f_name, l_name, age, year, is_full_time, Houses.house_name AS house FROM Students INNER JOIN Houses ON Students.house_id = House.house_id;

-- To get house_id, house_name from Houses for dropdown in creation form:
SELECT house_id, house_name FROM Houses;

-- To create a new student:
INSERT INTO Students (f_name, l_name, age, year, is_full_time, house_id)
  VALUES (:f_name_input, :l_name_input, :age_input, :year_input, :is_full_time_from_dropdown_input, :house_id_from_dropdown_input);

--Students_Has_Classes

--To get all information from Students_Has_Classes to display in table:
SELECT id, CONCAT(Students.f_name, ' ', Students.l_name) AS student, Classes.class_name AS class FROM Students_Has_Classes INNER JOIN Students ON Students_Has_Classes.student_id = Students.student_id INNER JOIN Classes ON Students_Has_Classes.class_id = Classes.class_id;

-- To get class_id, class_name from Classes for dropdown in creation form:
SELECT class_id, class_name FROM Classes;

-- To get student_id, f_name, l_name from Students for dropdown in creation form:
SELECT student_id, f_name, l_name FROM Students;

-- To associate a student with a class
INSERT INTO Students_Has_Classes (class_id, student_id)
  VALUES (:class_id_from_dropdown_input, :student_id_from_dropdown_input);

--Books
-- Get all book_id, title of the books, and their costs 
-- to populate the table in the Books page
SELECT book_id, title, cost FROM Books;

-- To create a new book
INSERT INTO Books (title, cost)
  VALUES(:title_input, :cost_input);

-- get all book_id to populate the update drowpdown menu
SELECT book_id FROM Books;

-- delete a book 
DELETE FROM Book WHERE id = :book_id_selected_from_book_page;

--Houses
-- Get all house_id and their house_name to populate the table in the Houses page
SELECT house_id, house_name FROM Houses;

-- To create a new house
INSERT INTO Houses (house_name)
  VALUES(:house_name_input);

--Spells
-- Get all spell_id, spell_name, description, require_wand, and spell_type to populate the table in the Spells page
SELECT * FROM Spells;

-- To create a new spell
INSERT INTO Spells (spell_name, description, require_wand, spell_type)
  VALUES (:spell_name_input, :description_input, :require_wand_input, :spell_type_input)

--Class Schedules 
-- Get all schedule_id, meets_monday, meets_tuesday, meets_wednesday, meets_thursday, meets_friday
SELECT schedule_id, meets_monday AS Monday, meets_tuesday AS Tuesday, meets_wednesday as Wednesday, meets_thrusday as Thursday, meets_friday as Friday FROM Class_Schedules;

--Students_Has_Books
-- get all id, student_id and book_id for the Students_Has_Books page
SELECT id, CONCAT(Students.f_name, ' ', Students.l_name) AS student, book_id as book FROM Students_Has_Books
INNER JOIN Students ON Students_Has_Books.student_id = Students.student_id;

-- Books_Has_Spells
-- get all id, book_id, and spell_id for the Books_Has_Spells
SELECT id, book_id, spell_id FROM Books_Has_Spells