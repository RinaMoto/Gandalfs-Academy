/* add_class.js written by Christopher Ball and Rina Easterday, ONID ballchr and easterdr
for Oregon State University CS 340 Spring Term 2022
last modified: 06/02/2022
CITATION: add_class adapted from CS 340 nodejs-starter-app provided by Prof Curry
found here: https://github.com/osu-cs340-ecampus/nodejs-starter-app. Mostly used step 4: Dynamically Displaying Data
but all other steps used as well.
*/

// Get the objects we need to modify
let addClassForm = document.getElementById('add-class-form-ajax');

// Modify the objects we need
addClassForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputClass_Name = document.getElementById("input-class_name");
    let inputDescription = document.getElementById("input-description");
    let inputSchedule_ID = document.getElementById("input-schedule_id");
    let inputStart_Time = document.getElementById("input-start_time");
    let inputEnd_Time = document.getElementById("input-end_time")
    let inputClass_Size = document.getElementById("input-class_size");
    let inputProfessor_ID= document.getElementById("mySelect-professor_id");
    let inputBook_ID = document.getElementById("mySelect-book_id");
    let inputCost = document.getElementById("input-cost");
    let inputClass_Year = document.getElementById("input-class_year");

    // Get the values from the form fields
    let class_nameValue = inputClass_Name.value;
    let descriptionValue = inputDescription.value;
    let schedule_idValue = inputSchedule_ID.value;
    let start_timeValue = inputStart_Time.value;
    let end_timeValue = inputEnd_Time.value;
    let class_sizeValue = inputClass_Size.value;
    let professor_idValue = inputProfessor_ID.value;
    let book_idValue = inputBook_ID.value;
    let costValue = inputCost.value;
    let class_yearValue = inputClass_Year.value;

    // Put our data we want to send in a javascript object
    let data = {
        class_name: class_nameValue,
        description: descriptionValue,
        schedule_id: schedule_idValue,
        start_time: start_timeValue,
        end_time: end_timeValue,
        class_size: class_sizeValue,
        professor_id: professor_idValue,
        book_id: book_idValue,
        cost: costValue,
        class_year: class_yearValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-class-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputClass_Name.value = '';
            inputDescription.value = '';
            inputSchedule_ID.value = '';
            inputStart_Time.value = '';
            inputEnd_Time.value = '';
            inputClass_Size.value = '';
            inputProfessor_ID.value = '';
            inputBook_ID.value = '';
            inputCost.value = '';
            inputClass_Year.value = '';
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
    let currentTable = document.getElementById("class-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and all the cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let class_nameCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");
    let schedule_idCell = document.createElement("TD");
    let start_timeCell = document.createElement("TD");
    let end_timeCell = document.createElement("TD");
    let class_sizeCell = document.createElement("TD");
    let professor_idCell = document.createElement("TD");
    let book_idCell = document.createElement("TD");
    let costCell = document.createElement("TD");
    let class_yearCell = document.createElement("TD");
  
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.class_id;
    class_nameCell.innerText = newRow.class_name;
    descriptionCell.innerText = newRow.description;
    schedule_idCell.innerText = newRow.schedule_id;
    start_timeCell.innerText = newRow.start_time;
    end_timeCell.innerText = newRow.end_time;
    class_sizeCell.innerText = newRow.class_size;
    professor_idCell.innerText = newRow.professor_id;
    book_idCell.innerText = newRow.book_id;
    costCell.innerText = newRow.cost;
    class_yearCell.innerText = newRow.class_year;

    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteClass(this);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(class_nameCell);
    row.appendChild(descriptionCell);
    row.appendChild(schedule_idCell);
    row.appendChild(start_timeCell);
    row.appendChild(end_timeCell);
    row.appendChild(class_sizeCell);
    row.appendChild(professor_idCell);
    row.appendChild(book_idCell);
    row.appendChild(costCell);
    row.appendChild(class_yearCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.class_id);

    // Add the row to the table
    currentTable.appendChild(row);
    
    // Find drop down menu, create a new option, fill data in the option
    // then append option to drop down menu so newly created rows via ajax will be found in it
    let selectProfessorMenu = document.getElementById("mySelect-professor_id");
    let ProfessorOption = document.createElement("option");
    ProfessorOption.text = newRow.professor_name;
    ProfessorOption.value = newRow.professor_id;
    selectProfessorMenu.add(ProfessorOption);
    document.location.reload(true);

    let selectBookMenu = document.getElementById("mySelect-book_id");
    let bookOption = document.createElement("option");
    bookOption.text = newRow.book_name;
    bookOption.value = newRow.book_id;
    selectBookMenu.add(bookOption);
    document.location.reload(true);
}