// Get the objects we need to modify
let addStudentsHasBooksForm = document.getElementById('add-students-has-books');

// Modify the objects we need
addStudentsHasBooksForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputStudent = document.getElementById("mySelectStudent");
    let inputBook = document.getElementById("mySelectBook");

    // Get the values from the form fields
    let studentValue = inputStudent.value;
    let bookValue = inputBook.value;

    // Put our data we want to send in a javascript object
    let data = {
        student: studentValue,
        book: bookValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-students-has-books-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputHouseName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("students-has-books-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let studentCell = document.createElement("TD");
    let bookCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    studentCell.innerText = newRow.student;
    bookCell.innerText = newRow.book;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteStudentsHasBooks(this);
    };




    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(studentCell);
    row.appendChild(bookCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);
    
    // Find drop down menu, create a new option, fill data in the option
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectStudentMenu = document.getElementById("mySelectStudent");
    let studentOption = document.createElement("option");
    studentOption.text = newRow.student;
    studentOption.value = newRow.id;
    selectStudentMenu.add(studentOption);

    let selectBookMenu = document.getElementById("mySelectBook");
    let bookOption = document.createElement("option");
    bookOption.text = newRow.book;
    bookOption.value = newRow.id;
    selectBookMenu.add(bookOption);

    document.location.reload(true);
}