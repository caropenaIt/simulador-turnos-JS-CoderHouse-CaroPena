//Tomando los id de los bloques HTML

const peluquerosContainer = document.querySelector('#peluqueros-container');
const formContainer = document.querySelector('#form-container');
const mensajeContainer = document.querySelector('#mensaje-container');
const tablaContainer = document.querySelector('#tabla-container');

//Fecth de peluqueros + creación dinámica de tarjetas y formulario para inscribir turnos

  const fetchPeluqueros = async () => {
    try {
      const response = await fetch('./assets/json/peluqueros.json');
      if (!response.ok) {
        throw new Error('Error al cargar el archivo JSON');
      }
      const peluqueros = await response.json();
      return peluqueros;
    } catch (error) {
      Swal.fire({
        title: '¡Error!',
        text: 'No se encuentran disponibles los peluqueros. intente más tarde.',
        icon: 'error',
        background: "rgb(98, 128, 230)",
        color: "whitesmoke",
        width: 250,
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'custom-button',
        },
      });
    }
  };

  const cargarPeluqueros = async () => {
    const peluqueros = await fetchPeluqueros();
    if (peluqueros) {
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
  
      peluquerosContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
          const peluqueroId = event.target.getAttribute('data-id');
          const peluquero = peluqueros.find(p => p.id == peluqueroId);
          showForm(peluquero);
          limpiarMensaje();
          document.getElementById('form-container').scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  };
  
  const limpiarMensaje = () => {
    mensajeContainer.innerHTML = '';
  };
  
  cargarPeluqueros();


  const showForm = (peluquero, turno) => {
    formContainer.innerHTML = `
      <h2>${turno ? 'Editar' : 'Confirmar'} Turno con ${peluquero.nombre}</h2>
      <form id="turno-form">
        <p>*Campos obligatorios</p>
        <label for="nombre">Nombre*:</label>
          <input type="text" id="nombre" name="nombre" value="${turno ? turno.nombre : ''}" required>
        <label for="apellido">Apellido*:</label>
          <input type="text" id="apellido" name="apellido" value="${turno ? turno.apellido : ''}" required>
        <label for="telefono">Teléfono*:</label>
          <input type="number" id="telefono" name="telefono" value="${turno ? turno.telefono : ''}" required>
        <label for="horario">Seleccionar Horario:</label>
          <select id="horario" name="horario">
            ${peluquero.horas.map(hora => `<option value="${hora}" ${turno && turno.horario === hora ? 'selected' : ''}>${hora}</option>`).join('')}
          </select>
        <button type="submit">${turno ? 'Actualizar Turno' : 'Confirmar Turno'}</button>
      </form>
    `;
  
    document.getElementById('turno-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const nombre = document.getElementById('nombre').value;
      const apellido = document.getElementById('apellido').value;
      const telefono = document.getElementById('telefono').value;
      const horario = document.getElementById('horario').value;
      if (turno) {
        actualizarTurno(turno.id, peluquero, nombre, apellido, telefono, horario);
      } else {
        guardarTurno(peluquero, nombre, apellido, telefono, horario);
      }
      mensajeConfirmacion(peluquero, nombre, apellido, telefono, horario);
      turnosAgendados();
    });
  };