/* add_book.js written by Christopher Ball and Rina Easterday, ONID ballchr and easterdr
for Oregon State University CS 340 Spring Term 2022
last modified: 06/02/2022
CITATION: add_book adapted from CS 340 nodejs-starter-app provided by Prof Curry
found here: https://github.com/osu-cs340-ecampus/nodejs-starter-app. Mostly used step 8: Dynamically Updating Data
but all other steps used as well.
*/

// code for deletePerson using regular javascript/xhttp
function deleteBook(bookID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: bookID
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(bookID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(bookID){

    let table = document.getElementById("books-table");
    console.log(table);
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == bookID) {
            table.deleteRow(i);
            deleteDropDownMenu(bookID);
            break;
       }
    }
    document.location.reload(true);
}


function deleteDropDownMenu(bookID){
  let selectMenu = document.getElementById("mySelect");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(bookID)){
      selectMenu[i].remove();
      break;
    } 

  }
}