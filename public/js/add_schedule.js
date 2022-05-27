// Get the objects we need to modify
let addScheduleForm = document.getElementById('add-class-schedule-ajax');

// Modify the objects we need
addScheduleForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputMonday = document.getElementById("mySelectMonday");
    let inputTuesday = document.getElementById("mySelectTuesday");
    let inputWednesday = document.getElementById("mySelectWednesday");
    let inputThursday = document.getElementById("mySelectThursday");
    let inputFriday = document.getElementById("mySelectFriday");

    // Get the values from the form fields
    let mondayValue = inputMonday.value;
    let tuesdayValue = inputTuesday.value;
    let wednesdayValue = inputWednesday.value;
    let thursdayValue = inputThursday.value;
    let fridayValue = inputFriday.value;

    if (isNaN(mondayValue) || isNaN(tuesdayValue) || isNaN(wednesdayValue) || isNaN(thursdayValue) || isNaN(fridayValue)) {
        return;
    }
    // Put our data we want to send in a javascript object
    let data = {
        monday: mondayValue,
        tuesday: tuesdayValue,
        wednesday: wednesdayValue,
        thursday: thursdayValue,
        friday: fridayValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-class-schedule-ajax", true);
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
    let currentTable = document.getElementById("schedule-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let mondayCell = document.createElement("TD");
    let tuesdayCell = document.createElement("TD");
    let wednesdayCell = document.createElement("TD");
    let thursdayCell = document.createElement("TD");
    let fridayCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.schedule_id;
    mondayCell.innerText = newRow.meets_monday;
    tuesdayCell.innerText = newRow.meets_tuesday;
    wednesdayCell.innerText = newRow.meets_wednesday;
    thursdayCell.innerText = newRow.meets_thursday;
    fridayCell.innerText = newRow.meets_friday;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteSchedule(this);
    };




    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(mondayCell);
    row.appendChild(tuesdayCell);
    row.appendChild(wednesdayCell);
    row.appendChild(thursdayCell);
    row.appendChild(fridayCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.schedule_id);

    // Add the row to the table
    currentTable.appendChild(row);
    
    // Find drop down menu, create a new option, fill data in the option
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    
    document.location.reload(true);
}