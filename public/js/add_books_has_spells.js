/* add_books_has_spells.js written by Christopher Ball and Rina Easterday, ONID ballchr and easterdr
for Oregon State University CS 340 Spring Term 2022
last modified: 06/02/2022
CITATION: add_books_has_spells adapted from CS 340 nodejs-starter-app provided by Prof Curry
found here: https://github.com/osu-cs340-ecampus/nodejs-starter-app. Mostly used step 4: Dynamically Displaying Data
but all other steps used as well.
*/

// Get the objects we need to modify
let add_Books_Has_Spells_Form = document.getElementById('add-books-has-spells-ajax');

// Modify the objects we need
add_Books_Has_Spells_Form.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBooks = document.getElementById("mySelectBooks");
    let inputSpells = document.getElementById("mySelectSpells");

    // Get the values from the form fields
    let booksValue = inputBooks.value;
    let spellsValue = inputSpells.value;

    // Put our data we want to send in a javascript object
    let data = {
        book: booksValue,
        spell: spellsValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-books-has-spells-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputBooks.value = '';
            inputSpells.value = '';
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
    let currentTable = document.getElementById("books-has-spells-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let booksCell = document.createElement("TD");
    let spellsCell = document.createElement("TD");


    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    booksCell.innerText = newRow.book;
    spellsCell.innerText = newRow.spell;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteBooksHasSpells(this);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(booksCell);
    row.appendChild(spellsCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);
    
    // Find drop down menu, create a new option, fill data in the option
    // then append option to drop down menu so newly created rows via ajax will be found in it
    let selectBooksMenu = document.getElementById("mySelectBooks");
    let booksOption = document.createElement("option");
    booksOption.text = newRow.book;
    booksOption.value = newRow.id;
    selectBooksMenu.add(booksOption);

    let selectSpellsMenu = document.getElementById("mySelectSpells");
    let spellsOption = document.createElement("option");
    spellsOption.text = newRow.spell;
    spellsOption.value = newRow.id;
    selectSpellsMenu.add(spellsOption);

    document.location.reload(true);
}