// Get the objects we need to modify
let addProfessorForm = document.getElementById('add-professor-form-ajax');

// Modify the objects we need
addProfessorForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputF_Name = document.getElementById("input-f_name");
    let inputL_Name = document.getElementById("input-l_name");
    let inputAge = document.getElementById("input-age");
    let inputHouse = document.getElementById("input-house");

    // Get the values from the form fields
    let f_nameValue = inputF_Name.value;
    let l_nameValue = inputL_Name.value;
    let ageValue = inputAge.value;
    let houseValue = inputHouse.value;

    // Put our data we want to send in a javascript object
    let data = {
        f_name: f_nameValue,
        l_name: l_nameValue,
        age: ageValue,
        house_id: houseValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-professor-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputF_Name.value = '';
            inputL_Name.value = '';
            inputAge.value = '';
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
// Professors
addRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("professor-table");

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
    let house_idCell = document.createElement("TD");
  
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.professor_id;
    f_nameCell.innerText = newRow.f_name;
    l_nameCell.innerText = newRow.l_name;
    ageCell.innerText = newRow.age;
    house_idCell.innerText = newRow.house_id;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteProfessor(this);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(f_nameCell);
    row.appendChild(l_nameCell);
    row.appendChild(ageCell);
    row.appendChild(house_idCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.professor_id);

    // Add the row to the table
    currentTable.appendChild(row);
    
   
    document.location.reload(true);
}