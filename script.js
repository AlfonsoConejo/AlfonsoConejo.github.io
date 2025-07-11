import { Gasto } from './Gasto.js'; // ruta relativa al archivo
import Utils from './Utils.js'; // ruta relativa al archivo

// Ejecutamos en cuanto cargue el sitio web
document.addEventListener("DOMContentLoaded", function () {


  //Calculamos el porcentaje usado del presupuesto
  Gasto.calcularPresupuestoConsumido();

  //Creamos un arreglo de categorías
  Utils.crearCategorias();

  //Obtenemos el select de categoría del DOM
  const selectCategoria = document.getElementById("categoria-gasto");

  //Cargamos las categorias al select
  Utils.mostrarCategorias(selectCategoria);

  //Mostramos todos los gastos al cargar la página
  const contenedorGastos = document.getElementById("contenedorGastos");
  Gasto.mostrar(contenedorGastos);

  //Mostramos en la etiqueta el gasto total del usuario
  const lblGastoTotal = document.getElementById('lblGastoTotal');
  
  
  

  const botonGuardarPresupuesto = document.getElementById("guardarPresupuesto");
  //const inputPresupuesto = document.getElementById("inputPresupuesto");
  
  
  
  //Cargamos el tema a mostrar
  Utils.cargarTema();
  

  //Mostramos la fecha actual
  let fechaActual = Utils.calcularFechaActual();
  const fechaGastoPicker = document.getElementById("fecha-gasto");
  fechaGastoPicker.value = fechaActual; // El datepicker la entiende y la muestra


  //Event listener para cambiar entre modo claro y modo oscuro
  const botonTema = document.getElementById('cambiarTema');
  botonTema.addEventListener('click', Utils.cambiarTema);

  //Tomamos los datos que fueron ingresados al formulario de gastos
  
  //Obtenemos los componentes del formulario para guardar los gastos
  const botonGuargarGasto = document.getElementById("guardarGasto");
  const inputDescripcion = document.getElementById("inputDescripcion");
  const inputMonto = document.getElementById("inputMonto");
  const inputCategoria = document.getElementById("categoria-gasto");
  const inputFecha = document.getElementById("fecha-gasto");

  //Le damos formato estilo bancario al monto
  inputMonto.addEventListener('input', ()=>{
    Utils.formatoNumero(inputMonto);
  });
  
  //Función para guardar gasto
  function guardarGasto(){
    const gastoDescripcion= inputDescripcion.value;
    let gastoMonto= inputMonto.value;

    //Normalizamos el valor de la moneda
    gastoMonto = Utils.normalizarMonto(gastoMonto);
    
    const gastoCategoria = inputCategoria.value ;
    const gastoFecha= inputFecha.value;
    
    let nuevoGasto = new Gasto(gastoDescripcion, gastoMonto, gastoCategoria, gastoFecha);
    nuevoGasto.agregar();

    Gasto.mostrar(contenedorGastos);
    Gasto.calcularPresupuestoConsumido();
    Utils.limpiarFormulario(inputDescripcion, inputMonto, inputCategoria, inputFecha);
  }


  //Validamos el formulario de Nuevo Gasto
  botonGuargarGasto.addEventListener('click', ()=>{
    console.log('Este es el valor de la categoría: ' + inputCategoria.value);
    if(inputDescripcion.value === ''){
      inputDescripcion.classList.add('borde-rojo');
    } 
    
    if (inputMonto.value === "$0.00"){
      inputMonto.classList.add('borde-rojo');
    }
    
    if(inputCategoria.value === ""){
      inputCategoria.classList.add('borde-rojo');
    } 

    if(inputDescripcion.value !== '' && inputMonto.value !='$0.00' && inputCategoria.value != ""){
      //Quitamos los bordes rojos si están activados
      inputDescripcion.classList.remove('borde-rojo');
      inputMonto.classList.remove('borde-rojo');
      inputCategoria.classList.remove('borde-rojo');

      //Guardamos el gasto
      guardarGasto();
    }
  });



  //Obtenemos del DOM los valores para manipular la ventana modal del presupuesto
  const abrirModalPresupuesto = document.getElementById('abrirModalPresupuesto');
  const modalPresupuesto = document.getElementById('modalPresupuesto');
  const cerrarModalPresupuesto = document.getElementById('cerrarModalPrespuesto');
  const inputPresupuesto = document.getElementById('presupuestoInput');

  // Abrir modal
  abrirModalPresupuesto.addEventListener('click', () => {
    //Quitamos el borde rojo si está activo
    inputPresupuesto.classList.remove('borde-rojo');
    //Mostramos el presupuesto
    Utils.mostrarPresupuesto(inputPresupuesto);
    //Abrimos la modal
    modalPresupuesto.style.display = 'flex';
  });

  // Cerrar modal al hacer clic en el botón de cerrar
  cerrarModalPresupuesto.addEventListener('click', () => {
    modalPresupuesto.style.display = 'none';
  });

  // Valor inicial del inputPresupuesto
  Utils.mostrarPresupuesto(inputPresupuesto);

  //Event Listener cada vez que se añada un nuevo caracter
  inputPresupuesto.addEventListener('input', () => {
    Utils.formatoNumero(inputPresupuesto);
  });
  
  botonGuardarPresupuesto.addEventListener("click", guardarPresupuesto);

  //Acción de guardar un nuevo presupuesto
  function guardarPresupuesto() {
    //Si el usuario no ha ingresado ningún valor
    if (inputPresupuesto.value=== '$0.00'){
      //Coloreamos el borde del campo de color rojo
      inputPresupuesto.classList.add('borde-rojo');
    } else{
      if (modalPresupuesto.style.display === 'flex') {
        modalPresupuesto.style.display = 'none';
      }

      //Obtenemos el número puro quitando todos los símbolos y comas
      let presupuesto = inputPresupuesto.value;
      presupuesto = Utils.normalizarMonto(presupuesto);

      //Guardamos el nuevo presupuesto en localStorage
      localStorage.setItem('valorPresupuesto', presupuesto);
      Gasto.calcularPresupuestoConsumido();
    }
    
  }


  //Obtenemos del DOM los valores para manipular la ventana modal del presupuesto
  const btnBorrarTodo = document.getElementById("borrarTodo");
  const modalRestablecer = document.getElementById('modalRestablecer');
  const cerrarModalRestablecer = document.getElementById('cerrarModalRestablecer');
  const botonRestablecer = document.getElementById('eliminarDatos');

  // Abrir modal de Restablecimiento
  btnBorrarTodo.addEventListener('click', () => {    
    console.log('Hiciste clic al botón');
    //Abrimos la modal
    modalRestablecer.style.display = 'flex';
  });

  //Cerramos la ventana modal de Restablecer
  cerrarModalRestablecer.addEventListener('click', ()=>{
    modalRestablecer.style.display = 'none';
  });

  //Obtenemos el botón de restablecer información
  botonRestablecer.addEventListener("click", borrarDatos);

  function borrarDatos(){
    localStorage.clear();
    console.log("Datos borrados exitosamente");
    Gasto.calcularPresupuestoConsumido();
    Gasto.mostrar(contenedorGastos);
    //Cerramos la ventana modal
    modalRestablecer.style.display = 'none';

    //En caso de que haya input en rojo los mostramos normales
    inputDescripcion.classList.remove('borde-rojo');
    inputCategoria.classList.remove('borde-rojo');
    inputMonto.classList.remove('borde-rojo');
  }

  //Obtenemos la modal de editar
  const modalEditar = document.getElementById("modalEditar");
  const cerrarModalEditar = document.getElementById("cerrarModalEditar");

  // Cerrar modal de editar al hacer clic en el botón de cerrar
  cerrarModalEditar.addEventListener('click', () => {
    modalEditar.style.display = 'none';
  });

  // Cerrar modal al hacer clic fuera del contenido del modal
  window.addEventListener('click', (e) => {
    if (e.target === modalPresupuesto) {
      modalPresupuesto.style.display = 'none';
    }

    if (e.target === modalRestablecer){
      modalRestablecer.style.display = 'none';
    }

    if (e.target === modalEditar){
      modalEditar.style.display = 'none';
    }
  });

  //Cerrar la modal al presionar la tecla ESC
  window.addEventListener('keydown', (e) => {
  if (modalPresupuesto.style.display === 'flex' && e.key === 'Escape') {
    modalPresupuesto.style.display = 'none';
  }

  if (modalRestablecer.style.display === 'flex' && e.key === 'Escape'){
    modalRestablecer.style.display = 'none';
  }

  if (modalEditar.style.display === 'flex' && e.key === 'Escape'){
    modalEditar.style.display = 'none';
  }
  });

  //Asignamos event listener al botón de guardar de la ventana modal de edición de gasto 
  Gasto.actualizar();

  });