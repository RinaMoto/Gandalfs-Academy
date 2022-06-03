/* add_student.js written by Christopher Ball and Rina Easterday, ONID ballchr and easterdr
for Oregon State University CS 340 Spring Term 2022
last modified: 06/02/2022
CITATION: add_student adapted from CS 340 nodejs-starter-app provided by Prof Curry
found here: https://github.com/osu-cs340-ecampus/nodejs-starter-app. Mostly used step 4: Dynamically Displaying Data
but all other steps used as well.
*/

let addStudentForm = document.getElementById('add-student-form-ajax');
// Modify the objects we need
addStudentForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFname = document.getElementById("input-f_name");
    let inputLname = document.getElementById("input-l_name");
    let inputAge = document.getElementById("input-age");
    let inputYear = document.getElementById("input-year");
    let inputIs_Full_Time = document.getElementById("input-is_full_time")
    let inputHouse = document.getElementById("input-house");

    // Get the values from the form fields
    let f_nameValue = inputFname.value;
    let l_nameValue = inputLname.value;
    let ageValue = inputAge.value;
    let yearValue = inputYear.value;
    let is_full_timeValue = inputIs_Full_Time.value;
    let houseValue = inputHouse.value;

    // Put our data we want to send in a javascript object
    let data = {
        f_name: f_nameValue,
        l_name: l_nameValue,
        age: ageValue,
        year: yearValue,
        is_full_time: is_full_timeValue,
        house_id: houseValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-student-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFname.value = '';
            inputLname.value = '';
            inputAge.value = '';
            inputYear.value = '';
            inputIs_Full_Time = '';
            inputHouse.value = '';
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
    let currentTable = document.getElementById("student-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let f_nameCell = document.createElement("TD");
    let l_nameCell = document.createElement("TD");
    let ageCell = document.createElement("TD");
    let yearCell = document.createElement("TD");
    let is_full_timeCell = document.createElement("TD");
    let house_idCell = document.createElement("TD");
  
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.professor_id;
    f_nameCell.innerText = newRow.f_name;
    l_nameCell.innerText = newRow.l_name;
    ageCell.innerText = newRow.age;
    yearCell.innerText = newRow.year;
    is_full_timeCell.innerText = newRow.is_full_time;
    house_idCell.innerText = newRow.house_id;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteStudent(this);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(f_nameCell);
    row.appendChild(l_nameCell);
    row.appendChild(ageCell);
    row.appendChild(yearCell);
    row.appendChild(is_full_timeCell);
    row.appendChild(house_idCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.student_id);

    // Add the row to the table
    currentTable.appendChild(row);
    
    // Find drop down menu, create a new option, fill data in the option
    // then append option to drop down menu so newly created rows via ajax will be found in it
   
    
    document.location.reload(true);
}