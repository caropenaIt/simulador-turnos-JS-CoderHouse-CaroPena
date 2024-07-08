//Tomando los id de los bloques HTML
const peluquerosContainer = document.querySelector('#peluqueros-container');
const formContainer = document.querySelector('#form-container');
const mensajeContainer = document.querySelector('#mensaje-container');
const tablaContainer = document.querySelector('#tabla-container');

//Creación de tarjetas
  peluqueros.forEach(peluquero => {
    const peluqueroCard = document.createElement('div');
    peluqueroCard.className = 'peluquero-card';
    peluqueroCard.innerHTML = `
      <img src="${peluquero.foto}" alt="${peluquero.nombre}">
      <h3>${peluquero.nombre}</h3>
      <p>${peluquero.especialidad}</p>
      <p>Disponible: ${peluquero.disponibilidad}</p>
      <p>${peluquero.descripcion}</p>
      <button data-id="${peluquero.id}">Seleccionar</button>
    `;
    peluquerosContainer.appendChild(peluqueroCard);
  });
//Eventos del botón Seleccionar
  peluquerosContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const peluqueroId = event.target.getAttribute('data-id');
      const peluquero = peluqueros.find(p => p.id == peluqueroId);
      showForm(peluquero);
      limpiarMensaje();
      document.getElementById('form-container').scrollIntoView({ behavior: 'smooth' });
    }
  });

//Creación del formulario
  function showForm(peluquero) {
    formContainer.innerHTML = `
      <h2>Confirmar Turno con ${peluquero.nombre}</h2>
      <form id="turno-form">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required>
        <label for="apellido">Apellido:</label>
        <input type="text" id="apellido" name="apellido" required>
        <label for="telefono">Teléfono:</label>
        <input type="tel" id="telefono" name="telefono" required>
        <label for="horario">Seleccionar Horario:</label>
        <select id="horario" name="horario">
          ${peluquero.horas.map(hora => `<option value="${hora}">${hora}</option>`).join('')}
        </select>
        <button type="submit">Confirmar Turno</button>
      </form>
    `;

    document.getElementById('turno-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const nombre = document.getElementById('nombre').value;
      const apellido = document.getElementById('apellido').value;
      const telefono = document.getElementById('telefono').value;
      const horario = document.getElementById('horario').value;
      guardarTurno(peluquero, nombre, apellido, telefono, horario);
      mensajeConfirmacion(peluquero, nombre, apellido, telefono, horario);
      turnosAgendados();
    });
  }
//guardado de turno
  function guardarTurno(peluquero, nombre, apellido, telefono, horario) {
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
    turnos.push(turno);
    localStorage.setItem('turnos', JSON.stringify(turnos));
  }
//Mensaje una vez guardado el turno
  function mensajeConfirmacion(peluquero, nombre, apellido, telefono, horario) {
    mensajeContainer.innerHTML = `
      <div class="confirmacion">
        <p>Muy bien ${nombre} ${apellido}, confirmaste turno con ${peluquero.nombre} el día ${peluquero.disponibilidad} a las ${horario}. En unos días te enviamos un mensaje al ${telefono} para recordarte el turno.</p>
      </div>
    `;
  }

  function limpiarMensaje() {
    mensajeContainer.innerHTML = '';
  }

  //Tabla de turnos registrados
  function turnosAgendados() {
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
              <td><button class="cancelar-btn" data-id="${turno.id}">Cancelar</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    tablaContainer.innerHTML = tablaTurnos;
  }

  //elimina el registro de turnos del localStorage
  tablaContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('cancelar-btn')) {
      const turnoId = event.target.getAttribute('data-id');
      cancelarTurno(turnoId);
    }
  });


  function cancelarTurno(turnoId) {
    let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
    turnos = turnos.filter(turno => turno.id != turnoId);
    localStorage.setItem('turnos', JSON.stringify(turnos));
    turnosAgendados();
    limpiarMensaje();
  }

  // Mostrar turnos agendados al cargar la página
  turnosAgendados();
;