/* add_students_has_classes.js written by Christopher Ball and Rina Easterday, ONID ballchr and easterdr
for Oregon State University CS 340 Spring Term 2022
last modified: 06/02/2022
CITATION: add_students_has_classes adapted from CS 340 nodejs-starter-app provided by Prof Curry
found here: https://github.com/osu-cs340-ecampus/nodejs-starter-app. Mostly used step 4: Dynamically Displaying Data
but all other steps used as well.
*/

// Get the objects we need to modify
let add_Students_Has_Classes_Form = document.getElementById('add-students-has-classes-ajax');

// Modify the objects we need
add_Students_Has_Classes_Form.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputStudent = document.getElementById("input-selectStudent");
    let inputClass = document.getElementById("input-selectClass");

    // Get the values from the form fields
    let classValue = inputClass.value;
    let studentValue = inputStudent.value;

    // Put our data we want to send in a javascript object
    let data = {
        class: classValue,
        student: studentValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-students_has_classes-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputStudent.value = '';
            inputClass.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Creates a single row from an Object representing a single record from 
// Students
addRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("students-has-classes-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let classCell = document.createElement("TD");
    let studentCell = document.createElement("TD");


    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    studentCell.innerText = newRow.student;
    classCell.innerText = newRow.class;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteStudentsHasClasses(this);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(classCell);
    row.appendChild(studentCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);
    
    // Find drop down menu, create a new option, fill data in the option
    // then append option to drop down menu so newly created rows via ajax will be found in it
    let selectStudentMenu = document.getElementById("mySelectStudent");
    let studentOption = document.createElement("option");
    studentOption.text = newRow.student;
    studentOption.value = newRow.id;
    selectStudentMenu.add(studentOption);

    let selectClassMenu = document.getElementById("mySelectClass");
    let classOption = document.createElement("option");
    classOption.text = newRow.class;
    classOption.value = newRow.id;
    selectStudentMenu.add(classOption);

    document.location.reload(true);
}