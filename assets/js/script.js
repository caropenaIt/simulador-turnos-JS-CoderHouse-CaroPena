//Funciones y otras funcionalidades alrededor del guardado de turnos

const guardarTurno = (peluquero, nombre, apellido, telefono, horario) => {
  const turno = {
    id: Date.now(),
    peluquero: peluquero.nombre,
    nombre: nombre,
    apellido: apellido,
    telefono: telefono,
    dia: peluquero.disponibilidad,
    horario: horario
  };
  let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

  // Filtrar turnos duplicados
  const turnoExistente = turnos.some(t => t.nombre === nombre && t.apellido === apellido && t.telefono === telefono && t.peluquero === peluquero.nombre && t.horario === horario);
  if (!turnoExistente) {
    turnos.push(turno);
    localStorage.setItem('turnos', JSON.stringify(turnos));
  } else {
    Swal.fire({
      title: `Ya tienes un turno agendado`,
      text: `A nombre de ${nombre} ${apellido} en el horario de ${horario} con ${peluquero.nombre}. Por favor, modificá el turno`,
      imageUrl: "./assets/images/warning.jpg",
      imageWidth: 200,
      imageHeight: 200,
      width: 300,
      imageAlt: "alert",
      background: "rgb(98, 128, 230)",
      color: "whitesmoke",
      width: 250,
      confirmButtonText: 'Ok',
      customClass: {
        confirmButton: 'custom-button',
      }
    });
  }
};

const actualizarTurno = (id, peluquero, nombre, apellido, telefono, horario) => {
  let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
  turnos = turnos.map(turno => turno.id === id ? { ...turno, peluquero: peluquero.nombre, nombre, apellido, telefono, dia: peluquero.disponibilidad, horario } : turno);
  localStorage.setItem('turnos', JSON.stringify(turnos));
};

const mensajeConfirmacion = (peluquero, nombre, apellido, telefono, horario) => {
  const mensajeContainer = document.querySelector('#mensaje-container');
  mensajeContainer.innerHTML = `
    <div class="confirmacion">
      <p>Muy bien ${nombre} ${apellido}, confirmaste turno con ${peluquero.nombre} el día ${peluquero.disponibilidad} a las ${horario}. En unos días te enviaremos un mensaje al ${telefono} para recordarte el turno.</p>
    </div>
  `;
};

const turnosAgendados = () => {
  const tablaContainer = document.querySelector('#tabla-container');
  const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
  if (turnos.length === 0) {
    tablaContainer.innerHTML = '<p>No hay turnos agendados.</p>';
    return;
  }

  const tablaTurnos = `
    <table>
      <thead>
        <tr>
          <th>Peluquero</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Teléfono</th>
          <th>Día</th>
          <th>Horario</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${turnos.map(turno => `
          <tr data-id="${turno.id}">
            <td>${turno.peluquero}</td>
            <td>${turno.nombre}</td>
            <td>${turno.apellido}</td>
            <td>${turno.telefono}</td>
            <td>${turno.dia}</td>
            <td>${turno.horario}</td>
            <td>
              <button class="editar-btn" data-id="${turno.id}">Editar</button>
              <button class="cancelar-btn" data-id="${turno.id}">Cancelar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  tablaContainer.innerHTML = tablaTurnos;
};


const cancelarTurno = (turnoId) => {
  let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
  turnos = turnos.filter(turno => turno.id != turnoId);
  localStorage.setItem('turnos', JSON.stringify(turnos));
  turnosAgendados();
  limpiarMensaje();
};

document.querySelector('#tabla-container').addEventListener('click', (event) => {
  const turnoId = event.target.getAttribute('data-id');
  if (event.target.classList.contains('cancelar-btn')) {
    cancelarTurno(turnoId);
  } else if (event.target.classList.contains('editar-btn')) {
    let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
    const turno = turnos.find(t => t.id == turnoId);
    fetchPeluqueros().then(peluqueros => {
      const peluquero = peluqueros.find(p => p.nombre == turno.peluquero);
      showForm(peluquero, turno);
      limpiarMensaje();
    });
  }
});

turnosAgendados();