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

app.get('/Professors', function(req, res)
    {
        let query1 = "SELECT * FROM Professors;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('professors', {data: rows});
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
        let query1 = "SELECT * FROM Students;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('students', {data: rows});
        })
    });

app.get('/Class_Schedules', function(req, res)
    {
        let query1 = "SELECT * FROM Class_Schedules;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('class_schedules', {data: rows});
        })
    });

app.get('/Spells', function(req, res)
    {
        let query1 = "SELECT * FROM Spells;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('spells', {data: rows});
        })
    });


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

app.put('/update-book-form-ajax', function(req, res, next){
  let data = req.body;

//   let bookID = parseInt(data.selectTitle);
//   let title = data.title;
//   let cost = parseInt(data.cost);

    let bookID = parseInt(data.selectTitle);
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

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});