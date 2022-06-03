/* update_book.js written by Christopher Ball and Rina Easterday, ONID ballchr and easterdr
for Oregon State University CS 340 Spring Term 2022
last modified: 06/02/2022
CITATION: update_book adapted from CS 340 nodejs-starter-app provided by Prof Curry
found here: https://github.com/osu-cs340-ecampus/nodejs-starter-app. Mostly used step 8: Dynamically Updating Data
but all other steps used as well.
*/

// Get the objects we need to modify
let updateBookForm = document.getElementById('update-book-form-ajax');

updateBookForm.addEventListener("submit", function (e) {
   
    e.preventDefault();

     // Get form fields we need to get data from
     let inputId = document.getElementById("mySelect");
     let inputTitle = document.getElementById("input-title-update");
     let inputCost = document.getElementById("input-cost-update");
 
     // Get the values from the form fields
     let inputIdValue = inputId.value;
     let titleValue = inputTitle.value;
     let costValue = inputCost.value;
 
     if (isNaN(costValue) && (titleValue === "")) {
         return;
     }
     // Put our data we want to send in a javascript object
     let data = {
         bookID: inputIdValue,
         title: titleValue,
         cost: costValue,
     }
 
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-book-form-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, inputIdValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, bookID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("books-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == bookID) {

            // Get the location of the row where we found the matching book ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            
            // Get td of title value
            let tdTitle = updateRowIndex.getElementsByTagName("td")[1];

            if (parsedData[0].title !== "") {
              // Reassign book title to our value we updated to
              tdTitle.innerHTML = parsedData[0].title;
            }
         
             // Get td of cost value
            let tdCost = updateRowIndex.getElementsByTagName("td")[2];
          

            if (!isNaN(parsedData[0].cost)) {
              // Reassign book title to our value we updated to
              tdCost.innerHTML = parsedData[0].cost;
            }
         
       }
    }
    document.location.reload(true);
}