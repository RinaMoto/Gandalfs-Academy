// Get the objects we need to modify
let addSpellForm = document.getElementById('add-spell-ajax');

// Modify the objects we need
addSpellForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSpellName = document.getElementById("input-spell-name");
    let inputDescription = document.getElementById("input-description");
    let inputRequireWand = document.getElementById("mySelectRequireWand");
    let inputSpellType = document.getElementById("mySelectSpellType");

    // Get the values from the form fields
    let spellNameValue = inputSpellName.value;
    let descriptionValue = inputDescription.value;
    let requireWandValue = inputRequireWand.value;
    let spellTypeValue = inputSpellType.value;

    // Put our data we want to send in a javascript object
    let data = {
        spellName: spellNameValue,
        description: descriptionValue,
        requireWand: requireWandValue,
        spellType: spellTypeValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-spell-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputSpellName.value = '';
            inputDescription.value = '';
            inputRequireWand.value = '';
            inputSpellType.value = '';

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
    let currentTable = document.getElementById("spells-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let spellNameCell = document.createElement("TD");
    let spellDescriptionCell = document.createElement("TD");
    let requireWandCell = document.createElement("TD");
    let spellTypeCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.spell_id;
    spellNameCell.innerText = newRow.spellName;
    spellDescriptionCell.innerText = newRow.description;
    requireWandCell.innerText = newRow.requireWand;
    spellTypeCell.innerText = newRow.sepllType;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteSpell(this);
    };


    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(spellNameCell);
    row.appendChild(spellDescriptionCell);
    row.appendChild(requireWandCell);
    row.appendChild(spellTypeCell);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.spell_id);

    // Add the row to the table
    currentTable.appendChild(row);
    
    document.location.reload(true);
}