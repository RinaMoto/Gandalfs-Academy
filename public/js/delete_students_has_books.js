// code for deletePerson using regular javascript/xhttp
function deleteStudentsHasBooks(studentsHasBooksID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: studentsHasBooksID
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-students-has-books-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(studentsHasBooksID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(studentsHasBooksID){

    let table = document.getElementById("students-has-books-table");
    console.log(table);
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == studentsHasBooksID) {
            table.deleteRow(i);
            break;
       }
    }
    document.location.reload(true);
}