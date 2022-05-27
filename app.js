// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
PORT = 1099;

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector')

// app.js - SETUP section
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public')); 

/*
    ROUTES
*/
app.get('/', function(req, res)
    {
          res.render('index');
    });

app.get('/Houses', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.name === undefined)
    {
        query1 = "SELECT * FROM Houses ORDER BY Houses.house_id ASC;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Houses WHERE house_name LIKE "${req.query.name}%"`
    }
      
    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the Houses
        let houses = rows;
  
            return res.render('houses', {data: houses});
        })
    });

app.get('/Books', function(req, res)
    {
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.title === undefined)
    {
        query1 = "SELECT * FROM Books;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Books WHERE title LIKE "${req.query.title}%"`
    }
      
    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the books
        let books = rows;
  
            return res.render('books', {data: books});
        })
    });


app.get('/Students', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.f_name === undefined)
    {
        query1 = "SELECT Students.student_id, Students.f_name, Students.l_name, Students.age, Students.year, Students.is_full_time, Students.house_id AS house FROM Students;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT Students.student_id, Students.f_name, Students.l_name, Students.age, Students.year, Students.is_full_time, Students.house_id AS house FROM Students WHERE f_name LIKE "${req.query.f_name}%"`;
    }

    // Query 2 is the same in both cases
    let query2 = "SELECT Houses.house_id, Houses.house_name FROM Houses;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let students = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the houses
            let houses = rows;

            // Construct an object for reference in the table
            // Array.map is awesome for doing something with each
            // element of an array.
            let housemap = {}
            houses.map(house => {
                let house_id = parseInt(house.house_id, 10);

                housemap[house_id] = house["house_name"];
            })

            // Overwrite the house ID with the name of the house in the houses object
            students = students.map(student => {
                return Object.assign(student, {house: housemap[student.house]})
            })

            return res.render('students', {data: students, houses: houses});
        })
    })
});

app.get('/Class_Schedules', function(req, res)
    {
        let query1 = "SELECT * FROM Class_Schedules;";
        db.pool.query(query1, function(error, rows, fields){
            let schedules = rows;
            res.render('class_schedules', {data: schedules});
        })
    });

app.get('/Spells', function(req, res)
    {
        let query1 = "SELECT * FROM Spells;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('spells', {data: rows});
        })
    });


app.get('/Classes', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.class_name === undefined)
    {
        query1 = "SELECT Classes.class_id, Classes.class_name as className, Classes.description, Classes.schedule_id, Classes.start_time as startTime, Classes.end_time as endTime, Classes.class_size as classSize, Classes.professor_id as professor, Classes.book_id as book, Classes.cost, Classes.class_year as classYear FROM Classes;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT Classes.class_id, Classes.class_name as className, Classes.description, Classes.schedule_id, Classes.start_time as startTime, Classes.end_time as endTime, Classes.class_size as classSize, Classes.professor_id as professor, Classes.book_id as book, Classes.cost, Classes.class_year as classYear FROM Classes WHERE Classes.class_name LIKE "${req.query.class_name}%"`;
    }

    // Query 2 is the same in both cases
    let query2 = "SELECT Professors.professor_id, CONCAT(Professors.f_name, ' ', Professors.l_name) as professor FROM Professors;";

    //Query 3 is the same in both cases
    let query4 = "SELECT Books.book_id, Books.title FROM Books";

    let query3 = "SELECT * FROM Class_Schedules"

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the classes
        let classes = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the houses
            let professors = rows;

            db.pool.query(query3, (error, rows, fields) => {

                let schedules = rows;
                
                //run the third query
                db.pool.query(query4, (error, rows, fields) => {

                    //save the books
                    let books = rows;

                    // Construct an object for reference in the table
                    // Array.map is awesome for doing something with each
                    // element of an array.
                    let professormap = {}
                    professors.map(professor => {
                        let professor_id = parseInt(professor.professor_id, 10);

                        professormap[professor_id] = professor["professor"];
                    })

                    //do the same for the other FK:
                    let bookmap = {}
                    books.map(book => {
                        let book_id = parseInt(book.book_id, 10);

                        bookmap[book_id] = book["title"];
                    })

                    // Overwrite the house ID with the name of the house in the houses object
                    classes = classes.map(classes => {
                        return Object.assign(classes, {professor: professormap[classes.professor]}, {book: bookmap[classes.book]})
                    })

                    return res.render('classes', {data: classes, schedules: schedules, professors: professors, books: books});
                })
            })
        })
    })
});

app.get('/Students_Has_Books', function(req, res)
{
// Declare Query 1
    let query1 = "SELECT id, CONCAT(Students.f_name, ' ', Students.l_name) AS student, Books.title as book FROM Students_Has_Books INNER JOIN Students ON Students_Has_Books.student_id = Students.student_id INNER JOIN Books ON Students_Has_Books.book_id = Books.book_id;";
    let query2 = "SELECT student_id, f_name, l_name FROM Students;"
    let query3 = "SELECT book_id, title FROM Books;"
    db.pool.query(query1, function(error, rows, fields){
        // Save the books
        let students_has_books = rows;
        db.pool.query(query2, function(error, rows, fields){
            // Save the books
            let students = rows;
            
            db.pool.query(query3, function(error, rows, fields){
                // Save the books
                let books = rows;
                
                    return res.render('students_has_books', {data: students_has_books, students: students, books: books});
                })
            })
        })
});


app.get('/Professors', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.f_name === undefined)
    {
        query1 = "SELECT Professors.professor_id, Professors.f_name AS firstName, Professors.l_name AS lastName, Professors.age, Professors.house_id AS house FROM Professors;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT Professors.professor_id, Professors.f_name AS firstName, Professors.l_name AS lastName, Professors.age, Professors.house_id AS house FROM Professors WHERE Professors.f_name LIKE "${req.query.f_name}%"`;
    }

    // Query 2 is the same in both cases
    let query2 = "SELECT Houses.house_id, Houses.house_name FROM Houses;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let professors = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the houses
            let houses = rows;

            // Construct an object for reference in the table
            // Array.map is awesome for doing something with each
            // element of an array.
            let housemap = {}
            houses.map(house => {
                let house_id = parseInt(house.house_id, 10);

                housemap[house_id] = house["house_name"];
            })

            // Overwrite the house ID with the name of the house in the houses object
            professors = professors.map(professor => {
                return Object.assign(professor, {house: housemap[professor.house]})
            })

            return res.render('professors', {data: professors, houses: houses});
        })
    })
});

// add routes
app.post('/add-book-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let book = data.title;
    if (book === "")
    {
        book = 'NULL'
    }

    let cost = parseInt(data.cost);
    if (isNaN(cost))
    {
        cost = 'NULL'
    }
    // Create the query and run it on the database
    query1 = `INSERT INTO Books (title, cost)
      VALUES('${data.title}', '${data.cost}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Books
            query2 = `SELECT Books.book_id, Books.title, Books.cost FROM Books;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-house-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let house = data.houseName;
    if (house === "")
    {
        house = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Houses (house_name)
      VALUES('${data.houseName}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Books
            query2 = `SELECT house_id, house_name FROM Houses;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


app.post('/add-class-schedule-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let monday = data.monday;
    let tuesday = data.tuesday;
    let wednesday = data.wednesday;
    let thursday = data.thursday;
    let friday = data.friday;

    if (monday === "")
    {
        monday = 'NULL';
    }
    else if (tuesday === "") {
        tuesday = 'NULL';
    }
    else if (wednesday === "") {
        wednesday = 'NULL';
    }
    else if (thursday === "") {
        thursday = 'NULL';
    }
    else if (friday === "") {
        friday = 'NULL';
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Class_Schedules (meets_monday, meets_tuesday, meets_wednesday, meets_thursday, meets_friday)
      VALUES('${data.monday}', '${data.tuesday}', '${data.wednesday}', '${data.thursday}', '${data.friday}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Books
            query2 = `SELECT schedule_id, meets_monday, meets_tuesday, meets_wednesday, meets_thursday, meets_friday FROM Class_Schedules;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-spell-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let spellName = data.spellName;
    let description = data.description;
    let requireWand = data.requireWand;
    let spellType = data.spellType;

    // Create the query and run it on the database
    query1 = `INSERT INTO Spells (spell_name, description, require_wand, spell_type)
      VALUES('${data.spellName}', '${data.description}', '${data.requireWand}', '${data.spellType}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Books
            query2 = `SELECT spell_id, description, require_wand, spell_type FROM Spells;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-students-has-books-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let student = data.student;
    let book = data.book;

    // Create the query and run it on the database
    query1 = `INSERT INTO Students_Has_Books (student_id, book_id)
      VALUES('${data.student}', '${data.book}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Books
            query2 = `SELECT id, CONCAT(Students.f_name, ' ', Students.l_name) AS student, Books.title as book FROM Students_Has_Books
            INNER JOIN Students ON Students_Has_Books.student_id = Students.student_id INNER JOIN Books ON Students_Has_Books.book_id = Books.book_id;         
            `;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


app.post('/add-class-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let schedule = parseInt(data.schedule_id);
    if (isNaN(schedule))
    {
        schedule = 'NULL'
    }

    let book = parseInt(data.book_id);
    if (isNaN(book))
    {
        book = 'NULL'
    }
    // Create the query and run it on the database
    query1 = `INSERT INTO Classes (class_name, description, schedule_id, start_time, end_time, class_size, professor_id, book_id, cost, class_year)
      VALUES('${data.class_name}', '${data.description}', ${data.schedule_id}, '${data.start_time}', '${data.end_time}', ${data.class_size}, ${data.professor_id}, ${data.book_id}, ${data.cost}, ${data.class_year})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Students
            query2 = `SELECT Classes.class_id, Classes.class_name as className, Classes.description, Classes.schedule_id, Classes.start_time as startTime, Classes.end_time as endTime, Classes.class_size as classSize, Classes.professor_id as professor, Classes.book_id as book, Classes.cost, Classes.class_year as classYear FROM Classes;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


app.post('/add-student-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let house = parseInt(data.house_id);
    if (isNaN(house))
    {
        house = 'NULL'
    }

    let age = parseInt(data.age);
    if (isNaN(age))
    {
        age = 'NULL'
    }
    // Create the query and run it on the database
    query1 = `INSERT INTO Students (f_name, l_name, age, year, is_full_time, house_id)
      VALUES('${data.f_name}', '${data.l_name}', ${data.age}, ${data.year}, ${data.is_full_time}, ${data.house_id})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Students
            query2 = `SELECT Students.student_id, Students.f_name, Students.l_name, Students.age, Students.year, 
            Students.is_full_time, Students.house_id FROM Students INNER JOIN
            Houses ON Students.house_id = Houses.house_id;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


app.post('/add-professor-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let house = parseInt(data.house_id);
    if (isNaN(house))
    {
        house = 'NULL'
    }

    let age = parseInt(data.age);
    if (isNaN(age))
    {
        age = 'NULL'
    }
    // Create the query and run it on the database
    query1 = `INSERT INTO Professors (f_name, l_name, age, house_id)
      VALUES('${data.f_name}', '${data.l_name}', ${data.age}, ${data.house_id})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Professors
            query2 = `SELECT Professors.professor_id, Professors.f_name, Professors.l_name, Professors.age, Professors.house_id FROM Professors LEFT JOIN
            Houses ON Professors.house_id = Houses.house_id;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-class-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let schedule = parseInt(data.schedule_id);
    if (isNaN(schedule))
    {
        schedule = 'NULL'
    }

    let book = parseInt(data.book_id);
    if (isNaN(cost))
    {
        book = 'NULL'
    }
    // Create the query and run it on the database
    query1 = `INSERT INTO Students_Has_Classes (class_id, student_id)
      VALUES('${data.class_id}', '${data.student_id}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Students
            query2 = `SELECT Students_Has_Classes.id, Students_Has_Classes.class_id, Students_Has_Classes.student_id FROM Student_Has_Classes LEFT JOIN
            Classes ON Students_Has_Classes.class_id = Classes.class_id LEFT JOIN Students ON Students_Has_Classes.student_id = Students.student_id;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// update routes

app.put('/update-book-form-ajax', function(req, res, next){
  let data = req.body;

//   let bookID = parseInt(data.selectTitle);
//   let title = data.title;
//   let cost = parseInt(data.cost);

    let bookID = parseInt(data.bookID);
    let title = data.title;
    let cost = parseFloat(data.cost)
    let queryUpdateBook = `UPDATE Books SET title = '${title}', cost = ${cost} WHERE Books.book_id = ${bookID}`;
  
    let selectBook = `SELECT * FROM Books WHERE book_id = ?`

        // Run the 1st query
        db.pool.query(queryUpdateBook, function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectBook, [bookID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

app.put('/update-house-form-ajax', function(req, res, next){
    let data = req.body;
  
  //   let bookID = parseInt(data.selectTitle);
  //   let title = data.title;
  //   let cost = parseInt(data.cost);
  
      let houseId = parseInt(data.id);
      let houseName = data.houseName;
      let queryUpdateHouse = `UPDATE Houses SET house_name = '${houseName}' WHERE Houses.house_id = ${houseId}`;
    
      let selectHouse = `SELECT * FROM Houses WHERE house_id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateHouse, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectHouse, [houseId], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

// delete routes
app.delete('/delete-book-ajax/', function(req,res,next){
    let data = req.body;
    let bookID = parseInt(data.id);
    let deleteBooks= `DELETE FROM Books WHERE book_id = ?`;
              // Run the query
              db.pool.query(deleteBooks, [bookID], function(error, rows, fields) {
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  );

app.delete('/delete-house-ajax/', function(req,res,next){
let data = req.body;
let houseID = parseInt(data.id);
let deleteBooks= `DELETE FROM Houses WHERE house_id = ?`;
            // Run the query
            db.pool.query(deleteBooks, [houseID], function(error, rows, fields) {
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
);

app.delete('/delete-schedule-ajax/', function(req,res,next){
let data = req.body;
let scheduleID = parseInt(data.id);
let deleteSchedule = `DELETE FROM Class_Schedules WHERE schedule_id = ?`;
            // Run the query
            db.pool.query(deleteSchedule, [scheduleID], function(error, rows, fields) {
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
);

app.delete('/delete-spell-ajax/', function(req,res,next){
    let data = req.body;
    let spellID = parseInt(data.id);
    let deleteSpells= `DELETE FROM Spells WHERE spell_id = ?`;
              // Run the query
              db.pool.query(deleteSpells, [spellID], function(error, rows, fields) {
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  );

  app.delete('/delete-students-has-books-ajax/', function(req,res,next){
    let data = req.body;
    let studentHasBooksID = parseInt(data.id);
    let deleteStudentsHasBooks= `DELETE FROM Students_Has_Books WHERE id = ?`;
              // Run the query
              db.pool.query(deleteStudentsHasBooks, [studentHasBooksID], function(error, rows, fields) {
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  );

app.delete('/delete-class-ajax/', function(req,res,next){
let data = req.body;
let classID = parseInt(data.id);
let deleteClasses= `DELETE FROM Classes WHERE class_id = ?`;
            // Run the query
            db.pool.query(deleteClasses, [classID], function(error, rows, fields) {
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
);

app.delete('/delete-student-ajax', function(req,res,next){
    let data = req.body;
    let studentID = parseInt(data.id);
    let deleteStudents= `DELETE FROM Students WHERE student_id = ?`;
              // Run the query
              db.pool.query(deleteStudents, [studentID], function(error, rows, fields) {
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  );


app.delete('/delete-professor-ajax/', function(req,res,next){
    let data = req.body;
    let professorID = parseInt(data.id);
    let deleteProfessors= `DELETE FROM Professors WHERE professor_id = ?`;
              // Run the query
              db.pool.query(deleteProfessors, [professorID], function(error, rows, fields) {
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  );

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});