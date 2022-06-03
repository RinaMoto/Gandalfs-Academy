/* update_house.js written by Christopher Ball and Rina Easterday, ONID ballchr and easterdr
for Oregon State University CS 340 Spring Term 2022
last modified: 06/02/2022
CITATION: update_house adapted from CS 340 nodejs-starter-app provided by Prof Curry
found here: https://github.com/osu-cs340-ecampus/nodejs-starter-app. Mostly used step 8: Dynamically Updating Data
but all other steps used as well.
*/

// Get the objects we need to modify
let updateHouseForm = document.getElementById('update-house-form-ajax');

// Modify the objects we need
updateHouseForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

     // Get form fields we need to get data from
     let houseToChange = document.getElementById("mySelectHouse");
     let inputHouseName = document.getElementById("input-house-name-update");
 
     // Get the values from the form fields
     let houseToChangeValue = houseToChange.value;
     let inputHouseNameValue = inputHouseName.value;
 
     if (inputHouseName === "") {
         return;
     }
     // Put our data we want to send in a javascript object
     let data = {
         id: houseToChangeValue,
         houseName: inputHouseNameValue
     }
 
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-house-form-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, houseToChangeValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, houseID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("houses-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == houseID) {

            // Get the location of the row where we found the matching book ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            
            // Get td of title value
            let tdHouseName = updateRowIndex.getElementsByTagName("td")[1];

            if (parsedData[0].houseName !== "") {
              // Reassign book title to our value we updated to
              tdHouseName.innerHTML = parsedData[0].houseName;
            }
         
       }
    }
    document.location.reload(true);
}