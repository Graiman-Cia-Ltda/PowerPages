  var band = false;

  document.addEventListener("DOMContentLoaded", function() {
    crearBoton();
    // Aquí coloca el código que deseas ejecutar después de que se haya cargado el DOM
    console.log("El DOM ha cargado por completo");

    //window.addEventListener("load", function () {

      band = true;
      //******** cuando da click en el ícono de lupa  *************************
      console.log("Antes de click");
      var botonFiltro = document.querySelector(".btn-hg");
      alert(botonFiltro);
      /*botonFiltro.addEventListener("click", function () {
        console.log("Entró click");
        crearBoton();
      });*/
  
      /*var campoBusqueda = document.getElementsByClassName("query form-control")[0];
      campoBusqueda.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
          // Aquí puedes poner el código que deseas ejecutar cuando se presiona Enter
          crearBoton();
        }
      });*/
  
  
      //******** cuando da click en el ícono de lupa  *************************
      //******** cuando carga la página ***************************************
      if (band) {
        alert('Bandera: '+band)
        crearBoton();
      }
  
      // 5000 milisegundos = 5 segundos
    //});
  });

  //******** cuando carga la página ***************************************
  function crearBoton() {
    setTimeout(function () {
      //console.log("Han pasado 5 segundos");
      //let lecturaBoton = document.getElementById('btnPrueba');
      let table = document.querySelector("table tbody");
      let rows = table.rows;
      for (let i = 0; i <= rows.length - 1; i++) {
        let cols = rows[i].cells;
        var lastCol = rows[i].insertCell(-1);
        let button = document.createElement('button');
        let td = document.createElement("td");
        rows[i].setAttribute('id', rows[i].cells[0].innerText);
        button.style.width = '60px'; // Establecer el ancho del botón
        button.style.height = '40px';
        button.style.backgroundColor = 'rgba(255,255,255,0)';
        button.style.border = '0px';
        //imagen lupa
        let img = document.createElement('img');
        img.src = '/search-interface-symbol.png';
        img.alt = 'Buscar';
        img.style.width = '20px'; // Establecer el ancho de la imagen
        img.style.height = '20px'; // Establecer la altura de la imagen
        //icono buscar
        let span = document.createElement('span');
        button.appendChild(img);
        button.appendChild(span);
        button.setAttribute('id', 'btn' + rows[i].cells[0].innerText);
        var fila = rows[i].cells[0].innerText;
        var descProd = rows[i].cells[1].innerText;
        var precioDis = rows[i].cells[2].innerText;
        button.setAttribute('onclick', `ejecucionFlujo('${fila}', '${descProd}', '${precioDis}')`);
        lastCol.appendChild(button);

      }

      var ulLista = document.getElementsByClassName("pagination")[0];
      ulLista.addEventListener("click", function () {
        if (event.target.tagName === "A" || event.target.tagName === "LI") {
          // Aquí puedes poner el código que deseas ejecutar cuando se hace clic en un elemento li
          crearBoton();
        }
      });
    }, 900);
  }
  // Declarar las variables fuera del alcance de la función ejecucionFlujo
  var cantidadUsuario;
  var data;

  function errorImg(img) {

    // Si la imagen no se carga correctamente, establecer imagen alternativa
    img.src = "/no-image.png";
    img.height = "100";
    img.width = "100";
    img.style.borderRadius = "0px";
    img.style.boxShadow = "0px 0px 0px rgba(0, 0, 0, 0)";

  }

  function ejecucionFlujo(codigoProducto, descProducto, precioDis) {
    showSpinner();
    var correoDist = "{{user.cre17_codigodistribuidor}}";
    var esquema =
      '{"distribuidor": "' + correoDist + '","item": "' + codigoProducto + '", "descripcion": "' + descProducto + '"}';
    var url =
      "https://prod-24.brazilsouth.logic.azure.com:443/workflows/3c2ce445dd4343969230a2eaf457537f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=n25O6Dp1DOBEhC00EEsktcnnRI1GHy_qcdSJnF3FO3E";


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
        hideSpinner();
        data = responseData; // Asignar el valor a la variable data

        console.log(data);

        var modalBody = document.getElementById("modalBody");
        //imagen
        //imagenItem = '<img src="https://www.graiman.com/sites/default/files/styles/156x156/public/productos-texturas/'+codigoProducto+'.png" alt="Sin imagen" id="imagenItem" class="imagenItem">';

        modalBody.innerHTML = formatData(data, precioDis, codigoProducto);

        //imagen
        /* var img = document.getElementById("imagenItem");
        img.onerror = errorImg(img); */

        //input
        cantidadUsuario = document.createElement("input");
        cantidadUsuario.setAttribute("type", "number");
        cantidadUsuario.setAttribute(
          "placeholder",
          "Ingrese la cantidad solicitada"
        );
        cantidadUsuario.setAttribute('id', 'cantidad');
        cantidadUsuario.style.width = "300px";
        modalBody.appendChild(cantidadUsuario);
        var modalElement = document.getElementById("myModal");
        modalElement.style.display = "block";
        modalElement.classList.add("show");
        modalElement.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");


        var botonCerrar = document.getElementById("botonCerrar");
        botonCerrar.addEventListener("click", function () {
          closeModal();
        });

        var botonInformacion = document.getElementById("btn-info");
        botonInformacion.setAttribute('onclick', `masInfo("${descProducto.split(" ")[0]}")`);

        var botonAgregarCarrito = document.getElementById("btn-carrito");
        botonAgregarCarrito.setAttribute('onclick', `comparar()`);

      })
      .catch(function (error) {
        console.log(error);
      });

    // Función para cerrar la ventana modal
    function closeModal() {

      var modalBody = document.getElementById("modalBody");
      var modalElement = document.getElementById("myModal");

      cantidadUsuario.value = "";
      modalBody.innerHTML = "";
      modalElement.style.display = "none";
      modalElement.classList.remove("show");
      modalElement.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    }

    //Función para comparar los valores de la cantidad y lo que digita el usuario
    // function compareValues() {
    // var inputValue = cantidadUsuario.value;
    //var columnName = "disponibilidad";
    //return inputValue <= data[columnName];
    //}
  }

  function masInfo(nombre) {
    window.open("https://www.graiman.com/familia/" + nombre, "_blank");
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

  function closeModalExt() {
    var modalBody = document.getElementById("modalBody");
    var modalElement = document.getElementById("myModal");
    cantidadUsuario.value = "";
    modalBody.innerHTML = "";
    modalElement.style.display = "none";
    modalElement.classList.remove("show");
    modalElement.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function comparar() {
    var cantidadIng = document.getElementById('cantidad').value;
    var disponible = document.getElementById('3').textContent;
    // alert('cantidadIngresada: '+Number(cantidadIng)+'\ndisponible: '+Number(disponible));
    //var expresionRegular = /^\d+(\.\d{1,2})?$/; // Expresión regular para números con hasta 2 decimales
    //cantidadUsuario.setAttribute('pattern', expresionRegular.source);
    // alert('Ingreso funcion comparar');
    //alert(cantidadIng + '\nDisponible   ' + disponible);
    if (Number(cantidadIng) <= Number(disponible)) {
      guardarCarrito();
      closeModalExt();
    } else {
      alert("Ingrese una cantidad válida");
    }
  }


  // Función para formatear los datos antes de mostrarlos
  function formatData(data, precioDis, codigoProducto) {

    var formattedData = "";
    var etiquetaSaldo = "";

    // Ejemplo: convertir los datos en una lista con viñetas
    formattedData += '<div class="image-container"><img src="https://www.graiman.com/sites/default/files/styles/156x156/public/productos-texturas/' + codigoProducto.slice(0, -1) + 'E.png" alt="Sin imagen" id="imagenItem" class="imagenItem"></div>';
    var i = 1;
    for (var key in data) {
      if (key != "saldo") {
        if (data.hasOwnProperty(key)) {
          formattedData += "<div><strong>" + capitalizeString(key) + ":</strong> <span id=" + i + ">" + data[key] + "</span>" + "\n";
          i++;
        }
      } else {
        if (data[key] === "SI") {
          etiquetaSaldo = "* Precio especial por ser saldo de producto"
        }
      }

    }
    formattedData += "<div><span id=" + i + " style='font-size: 9px;'>" + etiquetaSaldo + "</span>" + "\n";
    formattedData += "<br></div>";

    // Ejemplo: convertir los datos en una tabla
    // formattedData += "<table>";
    // for (var key in data) {
    //   if (data.hasOwnProperty(key)) {
    //     formattedData += "<tr><td><strong>" + key + "</strong></td><td>" + data[key] + "</td></tr>";
    //   }
    // }
    // formattedData += "</table>";

    return formattedData;
  }

  function capitalizeString(str) {
    var words = str.split('_'); // Split the input string into words using underscores
    var titleCaseWords = words.map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1); // Capitalize the first letter of each word
    });
    var titleCaseString = titleCaseWords.join(' '); // Join the words back together with spaces
    return titleCaseString;
  }

  function guardarCarrito() {

    //alert("Flujo carrito");
    var cantidadIng = document.getElementById('cantidad').value;
    console.log(cantidadIng);
    var disponible = document.getElementById('3').textContent;
    var codigoProducto = document.getElementById('1').textContent;
    var nombreProducto = document.getElementById('2').textContent;
    var precioDis = document.getElementById('4').textContent;
    var correoDist = "{{user.emailaddress1}}";
    console.log('Disponible ' + disponible);
    console.log('codigoProducto ' + codigoProducto);
    console.log('nombreProducto ' + nombreProducto);
    console.log('correoDist ' + correoDist);
    var esquema =
      '{"correoUser": "' + correoDist + '","codProducto": "' + codigoProducto + '","descProducto": "' + nombreProducto + '","cantSolicitada": ' + cantidadIng + ',"disponibilidad": ' + disponible + ',"precio": ' + precioDis + '}';
    var url = "https://prod-05.brazilsouth.logic.azure.com:443/workflows/67701d5250894272b5a19ba6300e79be/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=bz3loB6y_vP9q1US6CQ7fumD-amFUH7AM11uRoYSmZM";
    if (cantidadIng === "") {
      alert("Ingrese una cantidad");
    }
    else {
      showSpinner();
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
          hideSpinner();
          console.log(data);
          alert("Item añadido al carrito")
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }