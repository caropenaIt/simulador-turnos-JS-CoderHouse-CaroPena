//Funciones y fórmulas

//Función modo oscuro

function modoClaroOscuro(){
  let modoClaro = 1;
  let modoOscuro = 2;
  let modosPrompt = prompt("Elija un modo de ver el sitio web (1 para claro- 2 para oscuro)");
  if(modosPrompt == modoClaro){
  alert("Modo claro activo");
  console.log("Modo claro activo");
}else if(modosPrompt == modoOscuro){
  alert("Modo oscuro activo");
  console.log("Modo oscuro activo");
}else{
  alert("opción inválida, intente otra vez");
  return modoClaroOscuro();
}}

//Simulador
//Arrays de objetos de peluqueros y dias y horas
const peluqueros= [
  {nombre:"Juan", especialidad: "barberia", disponibilidad:"martes"},
  {nombre:"Maria", especialidad: "corte", disponibilidad:"miercoles"},
  {nombre:"Rocio", especialidad: "colorista", disponibilidad:"jueves"},
  {nombre:"Mario", especialidad: "corte", disponibilidad:"viernes"},
]

const horas = [
  {dia:"martes", hora1:"12:00 hs", hora2:"15:00 hs"},
  {dia:"miercoles", hora1:"13:00 hs", hora2:"16:00 hs"},
  {dia:"jueves", hora1:"12:30 hs", hora2:"17:00 hs"},
  {dia:"viernes", hora1:"15:30 hs", hora2:"17:30 hs"},
]

//Simulador propiamente dicho

function mostrarPeluqueros() {
  let mensaje = "Selecciona un peluquero:\n";
  for (let i = 0; i < peluqueros.length; i++) {
    mensaje += (i + 1) + ". " + peluqueros[i].nombre + " (" + peluqueros[i].especialidad + ") - Disponible el " + peluqueros[i].disponibilidad + "\n";
  }
  let seleccion = prompt(mensaje);
  if (seleccion === null) {
    return null;
  }
  seleccion = parseInt(seleccion) - 1;
  if (seleccion >= 0 && seleccion < peluqueros.length) {
    return peluqueros[seleccion];
  } else {
    alert("Selección inválida. Por favor, intenta nuevamente.");
    return mostrarPeluqueros();
  }
}

function mostrarHorasDisponibles(dia) {
  let horasDisponibles = horas.find(h => h.dia === dia);
  if (horasDisponibles) {
    let mensaje = "Selecciona una hora para el " + dia + ":\n1. " + horasDisponibles.hora1 + "\n2. " + horasDisponibles.hora2;
    let seleccion = prompt(mensaje);
    if (seleccion === null) {
    
      return null
    }
    seleccion = parseInt(seleccion);
    if (seleccion === 1 || seleccion === 2) {
      if (seleccion === 1) {
        return horasDisponibles.hora1;
      } else {
        return horasDisponibles.hora2;
      }
    } else {
      alert("Selección inválida. Por favor, intenta nuevamente.");
      return mostrarHorasDisponibles(dia);
    }
  } else {
    alert("No hay horas disponibles para este día.");
    return null;
  }
}

function agendarTurno() {
  let peluqueroSeleccionado = mostrarPeluqueros();
  if (peluqueroSeleccionado === null) {
    alert("Operación cancelada.");
    console.log("Se canceló el proceso");
    return;
  }

  let horaSeleccionada = mostrarHorasDisponibles(peluqueroSeleccionado.disponibilidad);
  if (horaSeleccionada === null) {
    alert("Operación cancelada.");
    console.log("Se canceló el proceso");
    return;
  }

  alert("Turno agendado con " + peluqueroSeleccionado.nombre + " (" + peluqueroSeleccionado.especialidad + ") el " + peluqueroSeleccionado.disponibilidad + " a las " + horaSeleccionada + ".");
  console.log("Turno agendado con " + peluqueroSeleccionado.nombre + " (" + peluqueroSeleccionado.especialidad + ") el " + peluqueroSeleccionado.disponibilidad + " a las " + horaSeleccionada + ".");
}



