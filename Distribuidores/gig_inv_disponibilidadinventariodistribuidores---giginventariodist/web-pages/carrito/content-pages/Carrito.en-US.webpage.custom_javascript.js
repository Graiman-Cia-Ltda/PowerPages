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

    cargarCarrito();

    let selectedOption1;
    let vendedor;
    let selectedOption2;
    let facturador;

    dropdown1.addEventListener("change", function () {
      selectedOption1 = dropdown1.options[dropdown1.selectedIndex];
      vendedor = selectedOption1.getAttribute("data-value");
      console.log(vendedor);
    });

    dropdown2.addEventListener("change", function () {
      selectedOption2 = dropdown2.options[dropdown2.selectedIndex];
      facturador = selectedOption2.getAttribute("data-value");
      console.log(facturador);
    });

    var botonConfirmar = document.getElementById('botonConfirmar');

    botonConfirmar.addEventListener("click", function () {
      var campoCliente=document.getElementById('input1').value
      let tipoPersona = "{{user.giginvci_tipopersona}}";
      console.log(tipoPersona);

      if (tipoPersona === "D") {
        campoCliente=document.getElementById('input5').value
      }
      else{
        campoCliente=document.getElementById('input1').value
      }
console.log("Campo cliente "+campoCliente);
      //campoCliente = document.getElementById('input1').value;
      var campoNotas = document.getElementById('input2').value;
      if (campoCliente != "") {
        if (vendedor != "-" || vendedor !== undefined) {
          if (facturador != "-" || facturador !== undefined) {
            confirmarCarrito(campoCliente, campoNotas, vendedor, facturador);
          } else {
            alert('Seleccione un facturador');
          }
        } else {
          alert('Seleccione un vendedor');
        }
      } else {
        alert('Ingrese un cliente');
      }


    });


  });


  function populateCampo(data, id) {
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


    while (combo.firstChild) {
      combo.removeChild(combo.firstChild);
    }

    const option = document.createElement("option");
    option.setAttribute("data-value", "-");
    option.textContent = "";

    combo.appendChild(option)

    data.forEach(item => {
      const option = document.createElement("option");
      option.setAttribute("data-value", item.correo);
      option.textContent = item.nombre;

      combo.appendChild(option)
    })

  }



  function populateTable(data) {
    const tableBody = document.querySelector("#responseTable tbody");
    const tableBodyTotal = document.querySelector("#totalTable tbody");
    var cont = 0;
    var suma = 0;

    // Loop through the data and create rows for the table
    data.forEach(item => {
      const row = document.createElement("tr");

      // Assuming the WS response has 'id' and 'name' properties
      const codigoCell = document.createElement("td");
      codigoCell.textContent = item.codigo;
      row.appendChild(codigoCell);

      const descripcionCell = document.createElement("td");
      descripcionCell.textContent = item.producto;
      row.appendChild(descripcionCell);

      const cantidadCell = document.createElement("td");
      cantidadCell.textContent = item.cantidad;
      row.appendChild(cantidadCell);

      const precioUCell = document.createElement("td");
      precioUCell.textContent = item.precioU.toLocaleString("en-US", { style: "currency", currency: "USD" });
      row.appendChild(precioUCell);

      const precioTCell = document.createElement("td");
      precioTCell.textContent = item.precioT.toLocaleString("en-US", { style: "currency", currency: "USD" });
      row.appendChild(precioTCell);

      // Add other cells for additional data if needed

      // Append the row to the table body
      tableBody.appendChild(row);
      cont++;
      suma += item.precioT;
    }
    );
    if (cont === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 5;
      cell.textContent = "No tiene productos en su carrito";
      row.appendChild(cell)
      tableBody.appendChild(row)
    } else {
      const row = document.createElement("tr");
      const etqTotal = document.createElement("td");
      etqTotal.textContent = "Total:";
      etqTotal.colSpan = 4;
      etqTotal.style.fontWeight = "bold";
      etqTotal.style.textAlign = "end";
      etqTotal.style.paddingRight = "8%";
      row.appendChild(etqTotal);
      const total = document.createElement("td");
      total.textContent = suma.toLocaleString("en-US", { style: "currency", currency: "USD" });
      total.style.width = "15%"
      row.appendChild(total);
      tableBodyTotal.appendChild(row);
      //hideSpinner();
    }
  }

  function cargarFactVend(ruc) {

    var esquema = '{"rucDist": "' + ruc + '"}';
    var url = "https://prod-28.brazilsouth.logic.azure.com:443/workflows/04a505cabeb142c1b31f0a9bceee9161/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qUuyKBfyVkOpLQeT5qiRE9ydDJhx0Y3Ob6rTa3q7CSU";
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
        // Asignar el valor a la variable data

        populateCombo(responseData.Facturadores, "dropdown1");
        populateCombo(responseData.Vendedores, "dropdown2");
      });
  }

  function cargarCupoCredito(ruc) {
    showSpinner();
    //var ruc = "{{user.giginvci_ruc}}";
    var esquema = '{"ruc": "' + ruc + '"}';
    var url = "https://prod-30.brazilsouth.logic.azure.com:443/workflows/8062c417044b43ca9cd670e1994e4e27/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=aR4_c6LeupACiqHDj-VQPRnSAzasJ3NeyGyOSyy6eAs";
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
        // Asignar el valor a la variable data
        var descripcionFinal;
        var input = document.getElementById("semaforo");
        populateCampo(responseData, "input3");

        if (typeof responseData.DetalleVencimiento === "undefined") {
          input.style.backgroundColor = "white";
          input.style.width = "76%";
          input.value = "Solicitar mayor información.";
        } else {
          for (var i = 0; i < responseData.DetalleVencimiento.length; i++) {
            var descripcion = responseData.DetalleVencimiento[i].Descripción;
            descripcionFinal = descripcion;
          }
          if (descripcionFinal === "VIGENTE") {
            input.style.backgroundColor = "#06E03C"; //Verde
          } else if (descripcionFinal === "16 - 30" || descripcionFinal === "31 - 60" || descripcionFinal === "61 - 90" || descripcionFinal === "Mayor a 90") {
            input.style.backgroundColor = "#F54015"; //Rojo
          } else if (descripcionFinal === "1 - 15") {
            input.style.backgroundColor = "#F9F626"; //Amarillo
          }
          else {
            input.style.backgroundColor = "white";
            input.style.width = "67%";
            input.value = "Solicitar mayor información sobre detalle de crédito.";
          }
        }
        hideSpinner();
      });

  }

  function obtenerDistribuidoresVend() {
    showSpinner();
    var correoVendedor = "{{user.emailaddress1}}";
    var esquema = '{"correoVendedor": "' + correoVendedor + '"}';
    var url = "https://prod-09.brazilsouth.logic.azure.com:443/workflows/468ec6a1c8354a52ae73676580a025de/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qczLXGkP14qVQ2sub4eQ3OapwenHALoIvp40xKm9CR4";
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
        console.log(responseData.length);
        console.log(responseData)
        

        for (var i = 0; i < responseData.length; i++) {
            console.log(responseData[i].rucDistribuidor);
          obtenerInfoDistribuidores(responseData[i].rucDist);
        }
        //hideSpinner();
      });

  }

  function obtenerDistribuidores() {
    showSpinner();
    var correoPromotor = "{{user.emailaddress1}}";
    var esquema = '{"correoPromotor": "' + correoPromotor + '"}';
    var url = "https://prod-25.brazilsouth.logic.azure.com:443/workflows/367154c992e04722a6062210f5f17f55/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=5JjP75NdMBPL4mMWfUdYN4l4CmsSza-HGZ5gKvyuOZY";
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
        console.log(responseData.length);

        for (var i = 0; i < responseData.length; i++) {
          obtenerInfoDistribuidores(responseData[i].rucDist);
        }
        //hideSpinner();
      });

  }

  

  function obtenerInfoDistribuidores(ruc) {
    showSpinner();
    //var correoPromotor = "{{user.emailaddress1}}";
    var esquema = '{"rucDist": "' + ruc + '"}';
    var url = "https://prod-27.brazilsouth.logic.azure.com:443/workflows/63b7dd02738e4474850ba7fe4aaff4b9/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7fG4VnkpdEP6fQhTsPQdB2kRgCvyZjXhIxbNyKYzPWU";
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
        console.log("infoooo: " + responseData.length);

        console.log("infoooo: " + responseData[0].nombreDist);

        const combo = document.getElementById("input1");

        responseData.forEach(item => {
          const option = document.createElement("option");
          option.setAttribute("data-value", item.nombreDist);
          option.textContent = item.nombreDist;

          combo.appendChild(option)
        })
        console.log("Hide 1");
        hideSpinner();
      });

  }

  function cargarCarrito() {
    showSpinner();
    var correoDist = "{{user.emailaddress1}}";
    var esquema =
      '{"correo": "' + correoDist + '"}';
    var url =
      "https://prod-23.brazilsouth.logic.azure.com:443/workflows/d9a51cdb3f154d839f8214da1a45724d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=62mPiYi34K3DneP3qM3k5TNh7QryrNf2WJWv3-PgKWI";

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


        let usuario = "{{user.fullname}}";
        let tipoPersona = "{{user.giginvci_tipopersona}}";
        //let promotorDe = "{{user.giginvci_promotorde}}";

        if (tipoPersona === "P") {
          const campoCupo = document.getElementById("input3");
          const labelCupo = document.querySelector(`label[for="input3"]`);
          const campoSemaforo = document.getElementById("semaforo");
          const labelSemaforo = document.querySelector(`label[for="nuevoInput"]`);

          campoCupo.style.display = 'none';
          labelCupo.style.display = 'none';

          campoSemaforo.style.display = 'none';
          labelSemaforo.style.display = 'none';

          obtenerDistribuidores();
          const comboBox = document.getElementById("input1");
          comboBox.addEventListener('change', function () {
            console.log(comboBox.value);
            if (comboBox.value !== '') {
              const elementoSeleccionado = comboBox.options[comboBox.selectedIndex];
              const valorSeleccionado = elementoSeleccionado.value;
              obtenerDistXNombre(valorSeleccionado)
              console.log("Hide 2");
              hideSpinner();
            }
            else {
              const comboBoxFact = document.getElementById("dropdown1");
              const comboBoxVend = document.getElementById("dropdown2");
              comboBoxFact.selectedIndex = -1;
              comboBoxVend.selectedIndex = -1;
              comboBoxFact.innerHTML = "";
              comboBoxVend.innerHTML = "";
            }
          });
        }
        else if (tipoPersona === "V") {
            const campoCupo = document.getElementById("input3");
            const labelCupo = document.querySelector(`label[for="input3"]`);
            const campoSemaforo = document.getElementById("semaforo");
            const labelSemaforo = document.querySelector(`label[for="nuevoInput"]`);
  
            campoCupo.style.display = 'none';
            labelCupo.style.display = 'none';
  
            campoSemaforo.style.display = 'none';
            labelSemaforo.style.display = 'none';
  
            obtenerDistribuidoresVend();
            const comboBox = document.getElementById("input1");
            comboBox.addEventListener('change', function () {
              console.log(comboBox.value);
              if (comboBox.value !== '') {
                const elementoSeleccionado = comboBox.options[comboBox.selectedIndex];
                const valorSeleccionado = elementoSeleccionado.value;
                obtenerDistXNombre(valorSeleccionado)
                console.log("Hide 2");
                hideSpinner();
              }
              else {
                const comboBoxFact = document.getElementById("dropdown1");
                const comboBoxVend = document.getElementById("dropdown2");
                comboBoxFact.selectedIndex = -1;
                comboBoxVend.selectedIndex = -1;
                comboBoxFact.innerHTML = "";
                comboBoxVend.innerHTML = "";
              }
            });
          }
        else {
          const campo2 = document.getElementById("input1");
          const label2 = document.querySelector(`label[for="input1"]`);

          campo2.style.display = 'none';
          label2.style.display = 'none';

          // Crear el input
          const input = document.createElement('input');
          input.setAttribute("id", "input5");
          input.type = 'text';
          input.value = usuario;
          input.style.display = 'block';
          input.style.marginBottom = '5px';
          input.style.textAlign = 'left';
          input.style.width = '100%';

          // Crear el label
          const label = document.createElement('label');
          label.style.display = 'block';
          label.style.marginBottom = '5px';
          label.style.textAlign = 'left';
          label.setAttribute("for", "input5");
          label.textContent = "Cliente:";

          contenedor.appendChild(label);
          contenedor.appendChild(input);
          showSpinner();
          var ruc = "{{user.giginvci_ruc}}";
          cargarCupoCredito(ruc);
          cargarFactVend(ruc);

        }

        populateTable(responseData);

      });
  }

  function confirmarCarrito(campoCliente, campoNotas, vendedor, facturador) {
    showSpinner();
    var correoDist = "{{user.emailaddress1}}";
    var esquema =
      '{"correo": "' + correoDist + '","facturador": "' + facturador + '","vendedor": "' + vendedor + '","cliente": "' + campoCliente + '","observaciones": "' + campoNotas + '"}';
    var url =
      "https://prod-11.brazilsouth.logic.azure.com:443/workflows/8298992a450649828a54beca1e2acd92/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=mtLZrUNYq1mYmJmgxzpoBBtRPeogFhq21mi4kZm67lI";

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
        data = responseData; // Asignar el valor a la variable data

        alert('Su pedido fue enviado con éxito.');
        setTimeout(function () {
          window.location.reload();
          window.location.href = '/';
        }, 1000);
      });
  }

  function obtenerDistXNombre(nombre) {
    showSpinner();
    //var correoDist = "{{user.emailaddress1}}";
    var esquema =
      '{"nombreDist": "' + nombre + '"}';
    var url =
      "https://prod-25.brazilsouth.logic.azure.com:443/workflows/cbf735a404c24fafaa2af6e16e3bd681/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=6msRbf-2oZz3JBYtXp4Y3KOG1MgzDxAavP1ynpZ-9Rs";

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
        var ruc = responseData[0].ruc;
        cargarFactVend(ruc);
        let tipoPersona = "{{user.giginvci_tipopersona}}";
        if (tipoPersona === "V" || tipoPersona === "F")
        {
            
            cargarCupoCredito(ruc);
        }

      });
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