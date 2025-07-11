import Utils from './Utils.js'; // ruta relativa al archivo

export class Gasto {
    constructor(descripcion, monto, categoria, fecha){
        this.descripcion = descripcion;
        this.monto = monto;
        this.categoria = categoria;
        this.fecha = fecha;
    }

    agregar(){
        // Obtiene los gastos existentes en localStorage (o un arreglo vacío si no existen)
        let gastosGuardados = JSON.parse(localStorage.getItem('gastos')) || [];

        // Agrega el nuevo gasto (this) al arreglo
        gastosGuardados.push(this);

        // Actualiza localStorage con el arreglo modificado
        localStorage.setItem('gastos', JSON.stringify(gastosGuardados));
    }



    static actualizar(){
        //Obtenemos del DOM el div que muestra la tabla de gastos
        const contenedorGastos = document.getElementById("contenedorGastos");
        //Obtenemos del DOM la ventana modal de editar
        const modalActualizar = document.getElementById("modalEditar");
        //Obtenemos del DOM el botón para actualizar los datos del gasto
        const botonActualizar = document.getElementById("actualizarGasto");
        //Añadimos un event listener al botón para guardar el presupuesto
        botonActualizar.addEventListener('click', (event)=>{

            // Obtiene los gastos existentes en localStorage (o un arreglo vacío si no existen)
            let gastosGuardados = JSON.parse(localStorage.getItem('gastos')) || [];

            //Obtenemos del dom los elementos del formulario
            const inputDescripcionModal = document.getElementById('inputDescripcionModal');
            const inputMontoModal = document.getElementById('inputMontoModal');
            const inputCategoriaModal = document.getElementById('categoria-gasto-modal');
            const inputFechaModal = document.getElementById('fecha-gasto-modal');

            //Revisamos que los campos del formulario no estén vacíos 
            if(inputDescripcionModal.value == '' ){
                inputDescripcionModal.classList.add('borde-rojo');
            }
            if(inputMontoModal.value == '$0.00' ){
                inputMontoModal.classList.add('borde-rojo');
            }
            if(inputCategoriaModal.value == '' ){
                inputCategoriaModal.classList.add('borde-rojo');
            }

            //Si el formulario fue llenado correctamente
            if(inputDescripcionModal.value !== '' && inputMontoModal.value !='$0.00' && inputCategoriaModal.value != ""){
                //Quitamos los bordes rojos si están activados
                inputDescripcionModal.classList.remove('borde-rojo');
                inputMontoModal.classList.remove('borde-rojo');
                inputCategoriaModal.classList.remove('borde-rojo');

                //Normalizamos el monto
                const montoModal = Utils.normalizarMonto(inputMontoModal.value);

                //Obtenemos el index del botón Actualizar
                const index = parseInt(event.currentTarget.dataset.index);

                //Actualizamos el gasto el gasto
                gastosGuardados[index] = {
                    descripcion: inputDescripcionModal.value.trim(),
                    monto: montoModal,
                    categoria: inputCategoriaModal.value,
                    fecha:  inputFechaModal.value
                }

                // Guardamos de nuevo en localStorage
                localStorage.setItem('gastos', JSON.stringify(gastosGuardados));

                //Cerramos la ventana modal
                modalActualizar.style.display = 'none';

                //Recalculamos el presupuesto
                this.calcularPresupuestoConsumido();

                //Recargamos la tabla 
                this.mostrar(contenedorGastos);
            }

        });
    }

    static modalActualizar(){
        document.querySelectorAll('.btnEditar').forEach(boton => {
            boton.addEventListener('click', (event) => {
                const modalActualizar = document.getElementById("modalEditar");
                //Abrimos la modal
                modalActualizar.style.display = 'flex';

                // Obtiene los gastos existentes en localStorage (o un arreglo vacío si no existen)
                let gastosGuardados = JSON.parse(localStorage.getItem('gastos')) || [];

                //Obtenemos el index del gasto actual desde el data set
                const index = parseInt(event.currentTarget.dataset.index);

                const gasto = {...gastosGuardados[index]}; // Hacemos una copia del gasto

                //Obtenemos del dom los elementos del formulario
                const inputDescripcionModal = document.getElementById('inputDescripcionModal');
                const inputMontoModal = document.getElementById('inputMontoModal');
                const inputCategoriaModal = document.getElementById('categoria-gasto-modal');
                const inputFechaModal = document.getElementById('fecha-gasto-modal');
                const botonActualizar = document.getElementById('actualizarGasto');

                //Asignamos el botón el index al dataset index del botón de guardar
                botonActualizar.dataset.index = index;
                
                //Asignamos los datos del gasto actual al formulario de la modal
                inputDescripcionModal.value = gasto.descripcion;
                inputMontoModal.value = gasto.monto;
                Utils.formatoNumero(inputMontoModal);     
                inputFechaModal.value = gasto.fecha;

                //Aplicamos el formato de texto bancario cada que el usuario realice una nueva acción
                  inputMontoModal.addEventListener('input', ()=>{
                    Utils.formatoNumero(inputMontoModal);
                  });
                
                //Mostramos todas las categorias de compra en el select
                Utils.mostrarCategorias(inputCategoriaModal);

                //Mostramos la categoría seleccionada
                inputCategoriaModal.value = gasto.categoria;
            });
        });
    }

    static eliminar(){
        document.querySelectorAll('.btnEliminar').forEach(boton => {
            boton.addEventListener('click', (event) => {
                // Obtiene los gastos existentes en localStorage (o un arreglo vacío si no existen)
                let gastosGuardados = JSON.parse(localStorage.getItem('gastos')) || [];
                const index = parseInt(event.currentTarget.dataset.index);
                console.log(index); // valor dinámico según el botón presionado
                gastosGuardados.splice(index,1); //Eliminamos el gasto del arreglo
                localStorage.setItem('gastos', JSON.stringify(gastosGuardados));//Guardamos el nuevo arreglo en local storage
                //Utils.mostrarPresupuesto();//actualizamos el consumo de prespuesto
                this.recargarTodo();
            });
        });
            
    }

    static mostrar(contenedor){
        // Obtiene los gastos existentes en localStorage (o un arreglo vacío si no existen)
        const gastosGuardados = JSON.parse(localStorage.getItem('gastos')) || [];

        if (gastosGuardados.length === 0) {
            // Limpiamos el contenedor para evitar duplicados
            contenedor.innerHTML = '';
            contenedor.textContent = "No hay gastos registrados";
        } else{
            // Limpiamos el contenedor para evitar duplicados
            contenedor.innerHTML = '';

            let tabla = `
                <h1>Gastos</h1>

                <div class="wrapperTablaGastos>

                    <table class="tablaGastos">
                        <tr>
                            <th>Concepto</th>
                            <th>Monto</th>
                            <th>Categoria</th>
                            <th>Fecha</th>
                            <th>Editar</th>
                        </tr>
                
            `;

            let contenidoFilas = '';

            //Obtenemos el arreglo de categorias
            const arregloCategorias = JSON.parse(localStorage.getItem('categorias'));

            // Recorremos el arreglo y agregamos cada elemento a la tabla
            gastosGuardados.forEach((gasto, index) => {

                const fechaDMA = Utils.convertirFechaDMA(gasto.fecha);

                const gastoFormateado = Number(gasto.monto).toLocaleString('es-MX' , {
                    minimumFractionDigits:2,
                    maximumFractionDigits:2
                });

                //Obtenemos el nombre de la categoría 
                const categoriaNombre = arregloCategorias.find(cat => cat.id === gasto.categoria)?.nombre || gasto.categoria;

                const fila = `
                    <tr>
                        <td>${gasto.descripcion}</td>
                        <td>$${gastoFormateado}</td>
                        <td>${categoriaNombre}</td>
                        <td>${fechaDMA}</td>
                        <td>
                            <button class="btnEditar" data-index="${index}">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btnEliminar" data-index="${index}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                contenidoFilas = contenidoFilas + fila;
            });

            // Cerramos la tabla
            tabla += contenidoFilas + '</table> </div>';
            
            // Asignamos todo el contenido al contenedor
            contenedor.innerHTML = tabla;

            //A cada botón de asignamos el event listener de eliminar
            this.eliminar();

            //A cada botón de editar le asignamos la función para mostrar la modal
            this.modalActualizar();
        }
        
    }

    static recargarTodo() {
        const contenedor = document.getElementById("contenedorGastos");
        this.mostrar(contenedor);
        this.calcularPresupuestoConsumido();
    }

    static calcularPresupuestoConsumido(){
        //Obtenemos los elementos del DOM
        const etiquetaPresupuesto = document.getElementById("lblPresupuesto");
        const barraProgresoPresupuesto  = document.getElementById("barra-progreso");
        const alertaLimite  = document.getElementById("alerta-limite");
        const contenedorPresupuestoConsumido = document.getElementById("presupuesto-consumido");
        const alertaSinPresupuesto = document.getElementById("alerta-sin-presupuesto");
        const etiquetaGastoTotal = document.getElementById("lblGastoTotal");
        
        //Verificamos si ya hay un presupuesto almacenado
        let presupuesto = JSON.parse(localStorage.getItem('valorPresupuesto')) || 0;
        presupuesto = parseFloat(presupuesto);
        
        const presupuestoFormateado = presupuesto.toLocaleString('es-MX',{
            minimumFractionDigits:2,
            maximumFractionDigits:2
        });

        console.log('Este es el presupuesto: ' + presupuesto);
        //Si no hay algún presupuesto guardado
        if(presupuesto === 0){
            //Ocultamos barra y mostramos alerta
            contenedorPresupuestoConsumido.style.display = "none";
            alertaSinPresupuesto.style.display = "block";
            etiquetaGastoTotal.style.display = "none";

            etiquetaPresupuesto.textContent = '$0.00';
            Gasto.actualizarBarraPresupuesto(0, barraProgresoPresupuesto, alertaLimite);
            console.log('No hay presupuesto');
        } 
        //Si hay un presupuesto guardado
        else {

            //Mostramos la sección de presupuesto y ocultamos alerta
            contenedorPresupuestoConsumido.style.display = "flex";
            alertaSinPresupuesto.style.display = "none";
            etiquetaGastoTotal.style.display = "block";

            console.log('Hay presupuesto'); 
            etiquetaPresupuesto.textContent = `$${presupuestoFormateado}`;
            // Obtiene los gastos existentes en localStorage (o un arreglo vacío si no existen) y guarda el monto total gastado
            let gastoActual = 0;
            const gastosGuardados = JSON.parse(localStorage.getItem('gastos')) || [];
            console.log(gastosGuardados);
            gastosGuardados.forEach((gasto) => {
                gastoActual = gastoActual + parseFloat(gasto.monto);
            });       

            const gastoActualFormateado = gastoActual.toLocaleString('es-MX',{
                minimumFractionDigits:2,
                maximumFractionDigits:2
            });
            //Mostramos el gasto actual total hasta el momento
            etiquetaGastoTotal.textContent = `Gasto total: $${gastoActualFormateado}`;
            //Mostramos el valor actuar
            const aux = 100 / gastoActual;
            //Revisamos si gasto actual es mayor a 0 para evitar una división entre 0
            let porcentajeConsumido = 0;
            if (gastoActual > 0){
                porcentajeConsumido = (gastoActual * 100) / presupuesto;
            }
            Gasto.actualizarBarraPresupuesto(porcentajeConsumido, barraProgresoPresupuesto, alertaLimite);
        }
    }

    static actualizarBarraPresupuesto(porcentaje, barraProgresoPresupuesto, alertaLimite){
        console.log(`Este es el porcentaje ${porcentaje}`)
        barraProgresoPresupuesto.style.width = `${porcentaje}%`;
        //Escogemos el color y mostramos un mensaje dependiendo del porcentaje de presupuesto consumido
        if (porcentaje >= 100){
            alertaLimite.style.display = 'block';
            barraProgresoPresupuesto.style.backgroundColor = "#E14D4D";
        } else if (porcentaje >=80 && porcentaje <100){
            alertaLimite.style.display = "none";
            barraProgresoPresupuesto.style.backgroundColor = "#E4C94F";
        } else if(porcentaje < 80){
            alertaLimite.style.display = "none";
            barraProgresoPresupuesto.style.backgroundColor = "#94C973";

        }
    }
}