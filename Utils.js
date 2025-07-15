function limpiarFormulario(inputDescripcion, inputMonto, inputCategoria, inputFecha){
    inputDescripcion.value = '';
    inputMonto.value = '$0.00';
    inputCategoria.value = '';

    const fechaActual = calcularFechaActual();
    inputFecha.value = fechaActual;
}

function calcularFechaActual(){
    //Obtenemos la fecha del día de hoy en formato dd-mm-aa
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');

    // Formato correcto para <input type="date">
    const fechaFormateada = `${year}-${month}-${day}`;

    return fechaFormateada;
}

function convertirFechaDMA(fecha){
    const dia = fecha.slice(8,10);
    const mes = fecha.slice(5,7);
    const year = fecha.slice(0,4);
    const FechaDMA = `${dia}-${mes}-${year}`;
    return FechaDMA;
}

function mostrarPresupuesto(inputPresupuesto){
    let presupuestoActual = JSON.parse(localStorage.getItem('valorPresupuesto')) || 0;
    presupuestoActual = Number(presupuestoActual).toLocaleString('es-MX',{
        minimumFractionDigits:2,
        maximumFractionDigits:2
    });
    if(presupuestoActual !== 0 ){
        inputPresupuesto.value = `$${presupuestoActual}`;
    } else{
        inputPresupuesto.value = '$0.00';
    }
}

//muestra los números al estilo aplicación bancaria
function formatoNumero(campo){
    let value = campo.value.replace(/\D/g, ''); // quitar todo lo que no sea dígito
    if (value.length === 0) {
      campo.value = '$0.00';
      return;
    }

    // Aseguramos que siempre haya al menos 3 dígitos para los centavos
    while (value.length < 3) {
      value = '0' + value;
    }

    const integerPart = value.slice(0, -2);
    const decimalPart = value.slice(-2);

    //Convertirmos la cadena a número y le damos formato con comas y puntos
    let valor = `${parseInt(integerPart, 10)}.${decimalPart}`;
    valor = Number(valor).toLocaleString('es-MX', {
        minimumFractionDigits:2,
        maximumFractionDigits:2
    });

    //Mostramos el valor ingresado en el campo
    campo.value = `$${valor}`;
}

//Creamos las categorías del formulario
function crearCategorias (){
    const categorias = [
        { id: 'Hogar', nombre: 'Básicos / Hogar' },
        { id: 'Transporte', nombre: 'Transporte' },
        { id: 'Restaurantes', nombre: 'Restaurantes' },
        { id: 'Salud', nombre: 'Salud'},
        { id: 'Compras', nombre: 'Compras' },
        { id: 'Educación', nombre: 'Educación' },
        { id: 'Entretenimiento', nombre: 'Entretenimiento' },
        { id: 'Viajes', nombre: 'Viajes' },
        { id: 'Trabajo', nombre: 'Trabajo' },
        { id: 'Finanzas', nombre: 'Finanzas' },
        { id: 'Otro', nombre: 'Otro' }
    ]

    //Guardamos el arreglo en JSON
    localStorage.setItem("categorias", JSON.stringify(categorias));
}

//Asignamos las categorias de compra a un select
function mostrarCategorias(campo){

    //Borramos las categorías si ya se han cargado anteriormente
    campo.innerHTML = '';
    //Obtenemos el arreglo de categorias
    const arregloCategorias = JSON.parse(localStorage.getItem('categorias'));

    //Agregamos el placeholder al select de categoría
    const placeholder = document.createElement("option");
    placeholder.text = "Selecciona una categoría";
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    campo.appendChild(placeholder);
    
    //Recorremos el arreglo y agregamos cada elemento como una nueva opción del select
    arregloCategorias.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.nombre;
        campo.appendChild(option);
    });
}

//Obtenemos el número puro quitando todos los símbolos y comas
function normalizarMonto(monto){
    //Eliminamos el símbolo de moneda
    let montoNormalizado = monto.slice(1);
    //Eliminamos las comas del monto
    montoNormalizado = montoNormalizado.replace(/,/g, '');
    return montoNormalizado;
}

//Cambiamos el tema del sitio
function cargarTema(){
    //Obtenemos todos los botone con la clase .cambiarTema
    const botonesCambiarTema = document.querySelectorAll('.cambiarTema');

    // Obtiene el tema actual
    let temaActual = localStorage.getItem('tema') || '';
    //Carga el modo claro
    if (temaActual === 'claro'){
        document.body.classList.add('modo-claro');
        botonesCambiarTema.forEach(btn => {
            btn.innerHTML = '<i class="bi bi-moon"></i>';
            btn.classList.remove('botonCambiarTema');
        });
    } 
    //Carga el modo oscuro
    else{
        document.body.classList.remove('modo-claro');
        botonesCambiarTema.forEach(btn => {
            btn.innerHTML = '<i class="bi bi-sun"></i>';
            btn.classList.add('botonCambiarTema');
        }); 
    }
}

//Cargamos el tema actual
function cambiarTema(){
    //Obtenemos el boton de cambio de tema
    document.querySelectorAll('.cambiarTema').forEach(btn => {
        btn.addEventListener('click', () => {
            // Obtiene el tema actual
            let temaActual = localStorage.getItem('tema') || '';

            //Carga al modo oscuro
            if (temaActual === 'claro'){
                btn.innerHTML = '<i class="bi bi-sun"></i>'; 
                document.body.classList.remove('modo-claro');
                localStorage.setItem('tema','oscuro');
                btn.classList.add('botonCambiarTema');
            } 
            //Carga al modo claro
            else{
                btn.innerHTML = '<i class="bi bi-moon"></i>';
                document.body.classList.add('modo-claro');
                localStorage.setItem('tema','claro');
                btn.classList.remove('botonCambiarTema');       
            } 
        });
    });
    
    
       
}

export default {
    limpiarFormulario,
    calcularFechaActual,
    convertirFechaDMA,
    mostrarPresupuesto,
    formatoNumero,
    crearCategorias,
    mostrarCategorias,
    normalizarMonto,
    cargarTema,
    cambiarTema
};