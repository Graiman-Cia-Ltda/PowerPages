function limpiaCache() {
    // Use the following methods to clear the cache:
    // For modern browsers
    console.log("limpia cache");
    if (!location.hash) {
      location.hash = "#reloading";
      location.reload(true);
    } else {
      location.hash = "#reloaded";
    }
  }

  // Evento que verifica si ya cargó toda la página
  document.addEventListener('DOMContentLoaded', function () {
    cargarPedidos();
  });


  /*function populateCampo(data, id) {
    const campo = document.getElementById(id);

    var USDollar = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    var credito = parseFloat(data.CupoCredito);
    campo.value = USDollar.format(credito);
  }

  function populateCombo(data, id) {
    const combo = document.getElementById(id);

    data.forEach(item => {
      const option = document.createElement("option");
      option.setAttribute("data-value", item.correo);
      option.textContent = item.nombre;

      combo.appendChild(option)
    })

  }*/

  function populateTable(data) {
    const tableBody = document.querySelector("#responseTable tbody");
    const tableBodyTotal = document.querySelector("#totalTablePedidos tbody");
    var cont = 0;
    var suma = 0;

    // Loop through the data and create rows for the table
    data.forEach(item => {
      const row = document.createElement("tr");

      const idPed = document.createElement("td");
      idPed.textContent = item.id;
      row.appendChild(idPed);

      const distribuidor = document.createElement("td");
      distribuidor.textContent = item.distribuidor;
      row.appendChild(distribuidor);

      const cliente = document.createElement("td");
      cliente.textContent = item.cliente;
      row.appendChild(cliente);
      const fecha = document.createElement("td");
      const fechaString = item.fecha;
      const fechaDate = new Date(fechaString);
      const dia = fechaDate.getDate();
      const mes = fechaDate.getMonth() + 1;
      const año = fechaDate.getFullYear();
      const horas = fechaDate.getHours();
      const minutos = fechaDate.getMinutes();
      const minutosFormateados = minutos < 10 ? `0${minutos}` : minutos;
      const fechaHoraFormateada = `${dia}/${mes}/${año} ${horas}:${minutosFormateados}`;

      fecha.textContent = fechaHoraFormateada;
      row.appendChild(fecha);

      const estado = document.createElement("td");
      estado.textContent = item.estado;
      row.appendChild(estado);

      const idPedido = item.id;
      console.log("Id de pedido: " + idPedido);

      const id = document.createElement("button");
      id.textContent = 'Ver detalle';
      id.setAttribute('id', cont);
      id.setAttribute('class', 'btn btn-primary')
      id.style.width = '200px'; // Establecer el ancho del botón
      id.style.height = '23px';
      id.style.fontSize = '12px';
      id.style.lineHeight = ' normal'; /* Restaura la altura de línea normal para centrar verticalmente */
      id.style.display = 'inline-block';
      id.style.textAlign = 'center';
      id.setAttribute('onclick', `redirigirConParametros('${cont}','${idPedido}')`);
      row.appendChild(id);

      // Add other cells for additional data if needed

      // Append the row to the table body
      tableBody.appendChild(row);
      cont++;
      suma += item.precioT;
      console.log(cont);
      console.log(suma);
    }
    );
    if (cont === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 5;
      cell.textContent = "No ha realizado pedidos";
      row.appendChild(cell)
      tableBody.appendChild(row)
    } else {
      const row = document.createElement("tr");
      const etqTotal = document.createElement("td");
      etqTotal.textContent = "Cantidad total de pedidos:";
      etqTotal.colSpan = 4;
      etqTotal.style.fontWeight = "bold";
      etqTotal.style.textAlign = "end";
      etqTotal.style.paddingRight = "8%";
      row.appendChild(etqTotal);
      const total = document.createElement("td");
      total.textContent = cont;
      total.style.width = "15%"
      row.appendChild(total);
      tableBodyTotal.appendChild(row);
    }
  }

  function populateTableDetalle(data) {
    const tableBody = document.querySelector("#responseTableDetalle tbody");
    const tableBodyTotal = document.querySelector("#totalTableDetallePedidos tbody");
    var cont = 0;
    var suma = 0;

    // Loop through the data and create rows for the table
    /* data.forEach(item => {
       const row = document.createElement("tr");

       // Assuming the WS response has 'id' and 'name' properties
       const codigo = document.createElement("td");
       codigo.textContent = item.codigo;
       row.appendChild(codigo);

       const descripcion = document.createElement("td");
       descripcion.textContent = item.descripcion;
       row.appendChild(descripcion);

       const cantidadSolicitada = document.createElement("td");
       cantidadSolicitada.textContent = item.estado;
       row.appendChild(cantidadSolicitada);

       tableBody.appendChild(row);
       cont++;
       suma += item.precioT;
       console.log(cont);
       console.log(suma);
     }
     );*/
    if (cont === 0) {
      const row = document.createElement("tr");
      console.log('Creo el row');
      const cell = document.createElement("td");
      console.log('Creo la cell');
      cell.colSpan = 5;
      cell.textContent = "No existe información";
      row.appendChild(cell);
      tableBody.appendChild(row);
    } else {
      console.log('Entro en el else');
      const row = document.createElement("tr");
      const total = document.createElement("td");
      total.textContent = cont;
      total.style.width = "15%"
      row.appendChild(total);
      tableBodyTotal.appendChild(row);
    }
  }

  function cargarPedidos() {
    showSpinner();
    var correoDist = "{{user.emailaddress1}}";
    var esquema =
      '{"correo": "' + correoDist + '","idPedido": "0"}';
    var url =
      "https://prod-09.brazilsouth.logic.azure.com:443/workflows/f29fad0f72b54962927bed7f0027061c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=uB9GVTmMFM3fCEmU7REQSVUOew20O-M8Y0eqk3JVJsE";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: esquema,
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
        populateTable(responseData);
        hideSpinner();
      });
  }
  function redirigirConParametros(cont, idPedido) {
    showSpinner();
    // Construye la URL con los parámetros
    const url = `https://giginventariodist.powerappsportals.com/Detalle-Pedido?cont=${cont}&idPedido=${idPedido}`;
    // Redirige a la nueva página
    window.location.href = url;
  }

  function closeModal() {
    var modalBody = document.getElementById("modalBody");
    var modalElement = document.getElementById("myModal");

    modalBody.innerHTML = "";
    modalElement.innerHTML = "";
    modalElement.style.display = "none";
    modalElement.classList.remove("show");
    modalElement.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

  }

  function showSpinner() {
    // Get the spinner element by ID
    var spinner = document.getElementById('spinner');
    var overlay = document.getElementById('overlay');
    // Show the spinner by changing its display property
    spinner.style.display = 'block';
    overlay.style.display = 'block';
  }

  function hideSpinner() {
    var spinner = document.getElementById('spinner');
    spinner.style.display = 'none';
    var overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
  }