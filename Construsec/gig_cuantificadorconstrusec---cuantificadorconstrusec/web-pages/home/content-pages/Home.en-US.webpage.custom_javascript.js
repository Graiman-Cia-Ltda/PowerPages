document.addEventListener("DOMContentLoaded", function () {
    cargarProductos()
});

function populateCombo(data, id) {
    const combo = document.getElementById(id);

    data.forEach(item => {
        const option = document.createElement("option");
        option.setAttribute("data-value", item.idProd);
        option.textContent = item.nombreProd;

        combo.appendChild(option)
    })

}

function populateTable(data, area, idProd) {
    console.log("populatetable");
    const tableBody = document.querySelector("#tblAccesorios tbody");
    var cont = 0;
    var suma = 0;
    tableBody.textContent = "";
    // Loop through the data and create rows for the table
    data.forEach(item => {
        const row = document.createElement("tr");

        // Assuming the WS response has 'id' and 'name' properties
        const nombreCell = document.createElement("td");
        nombreCell.textContent = item.nombre;

        const cantidadCell = document.createElement("td");
        switch (parseInt(item.idAcc)) {
            case 1:
                cantidadCell.textContent = Math.ceil(area * item.constante);
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break;
            case 2:
                cantidadCell.textContent = Math.ceil(area * item.constante);
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break;
            case 3:
                if (parseInt(idProd) != 4){
                    cantidadCell.textContent = Math.ceil((area * item.constante) / 50) * 50
                } else {
                    cantidadCell.textContent = Math.ceil((area * item.constante2) / 50) * 50
                }
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break;
            case 4:
                if (parseInt(idProd) != 4){
                    cantidadCell.textContent = Math.ceil((area * item.constante) / 50) * 50
                } else {
                    cantidadCell.textContent = Math.ceil((area * item.constante2) / 50) * 50
                }
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break;
            case 5:
                cantidadCell.textContent = Math.ceil(area * item.constante);
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break;
            case 6:
                cantidadCell.textContent = Math.ceil(area * item.constante);
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break;
            case 7:
                cantidadCell.textContent = Math.ceil(area * item.constante);
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break;
            case 8:
                cantidadCell.textContent = Math.ceil(area * item.constante);
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break;
            case 9:
                cantidadCell.textContent = Math.round(Math.ceil(area * item.constante) * 1.25);
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break;
            case 10:
                cantidadCell.textContent = Math.ceil(area * item.constante);
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break;
            case 11:
                cantidadCell.textContent = Math.ceil(area * item.constante);
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break;
            /* case 12:
                cantidadCell.textContent = Math.ceil((area * item.constante) / 100) * 100;
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break;
            case 13:
                cantidadCell.textContent = Math.ceil((area * item.constante) / 100) * 100;
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break; */
            case 14:
                if(parseInt(idProd) === 1){
                    cantidadCell.textContent = Math.ceil(area * item.constante);
                } else {
                    cantidadCell.textContent = Math.ceil(area * item.constante2);
                }
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break;
            /* case 15:
                if(parseInt(idProd) === 1){
                    cantidadCell.textContent = Math.ceil(area * item.constante);
                } else {
                    cantidadCell.textContent = Math.ceil(area * item.constante2);
                }
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break;
            case 16:
                if(parseInt(idProd) === 1){
                    cantidadCell.textContent = Math.ceil(area * item.constante);
                } else {
                    cantidadCell.textContent = Math.ceil(area * item.constante2);
                }
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break;
            case 17:
                if(parseInt(idProd) === 1){
                    cantidadCell.textContent = Math.round(area * item.constante);
                } else {
                    cantidadCell.textContent = Math.round(area * item.constante2);
                }
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break;
            case 18:
                if(parseInt(idProd) === 1){
                    cantidadCell.textContent = Math.ceil(area * item.constante);
                } else {
                    cantidadCell.textContent = Math.ceil(area * item.constante2);
                }
                row.appendChild(nombreCell);
                row.appendChild(cantidadCell);
                break; */
            default:
                //cantidadCell.textContent = "-";
                break;
        }

        // Append the row to the table body
        tableBody.appendChild(row);
        cont++;
    }
    );
    if (cont === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 2;
        cell.textContent = "No hay accesorios";
        row.appendChild(cell)
        tableBody.appendChild(row)
    } else {

    }
}

function cargarProductos() {
    showSpinner();
    var url = "https://prod-20.brazilsouth.logic.azure.com:443/workflows/e2b277ce8876460f9c2f892f97a7212c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=VTc7cycRveKXcXz3CUAgeMV7O7fvY3swdY4xOOCMuwA";
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        }
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(
                    "Error en la solicitud. Estado: " + response.status
                );
                hideSpinner();
            }
        })
        .then(function (responseData) {
            // Asignar el valor a la variable data
            populateCombo(responseData, "cmbProducto");
            hideSpinner();
        });
}

function cargarAccesorios(idProd, area) {
    showSpinner();
    var esquema = '{"idProd": "' + idProd + '"}';
    var url = "https://prod-24.brazilsouth.logic.azure.com:443/workflows/49c4fe7d09034bd284c517d0a5fa698c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Ic53LBoYl6NbxTlW_HwLd2TEdxW4TJfXx2WPRXKOtzM";
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: esquema
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(
                    "Error en la solicitud. Estado: " + response.status
                );
                hideSpinner()
            }
        })
        .then(function (responseData) {
            console.log("consultaaccesorios");
            populateTable(responseData, area, idProd);
            hideSpinner();
        });
}

function calcular() {
    var area = document.getElementById("txtArea").value;
    const select = document.getElementById("cmbProducto");
    const opcionSeleccionada = select.options[select.selectedIndex];
    var idProd = opcionSeleccionada.dataset.value;
    if(area === "" || idProd === "0"){
        alert("Debe escoger un producto e ingresar un valor en campo del area");
    } else {
        cargarAccesorios(idProd, area);
    }
    
}

function showSpinner() {
    // Get the spinner element by ID
    var spinner = document.getElementById('spinner');
    var overlay = document.getElementById('overlay');
    // Show the spinner by changing its display property
    spinner.style.display = 'block';
    overlay.style.display = 'block';
    console.log("showspinner");
}

function hideSpinner() {
    var spinner = document.getElementById('spinner');
    spinner.style.display = 'none';
    var overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
    console.log("hidespinner");
}