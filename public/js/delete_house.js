// code for deletePerson using regular javascript/xhttp
function deleteHouse(houseID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: houseID
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-house-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(houseID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(houseID){

    let table = document.getElementById("houses-table");
    console.log(table);
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == houseID) {
            table.deleteRow(i);
            deleteDropDownMenu(houseID);
            break;
       }
    }
    document.location.reload(true);
}


function deleteDropDownMenu(houseID){
  let selectMenu = document.getElementById("mySelectHouse");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(houseID)){
      selectMenu[i].remove();
      break;
    } 

  }
}