document.addEventListener('DOMContentLoaded', function() {
  // ========== CONTROL DE SESIÓN ==========
  const perfil = sessionStorage.getItem('tianguis_perfil');
  const usuario = sessionStorage.getItem('tianguis_usuario');

  // Si no hay sesión, redirigir al login
  if (!perfil) {
    window.location.href = 'login.html';
    return;
  }

  // ========== DATOS POR PERFIL ==========
  const perfilesData = {
    publico: {
      proveedor: {
        nombre: 'SECRETARÍA DE OBRAS PÚBLICAS',
        rfc: 'SOP1234567XX'
      },
      bienvenida: 'Bienvenido, usuario público',
      estados: {
        registro: 'complete',
        clasificacion: 'complete',
        compliance: 'complete'
      },
      score: 98,
      perfilTexto: 'APTO',
      perfilClase: 'apto'
    },
    privado: {
      proveedor: {
        nombre: 'DESARROLLOS URBANOS PRIVADOS, S.A. DE C.V.',
        rfc: 'DUP9876543YZ'
      },
      bienvenida: 'Bienvenido, usuario privado',
      estados: {
        registro: 'complete',
        clasificacion: 'pending',
        compliance: 'complete'
      },
      score: 84,
      perfilTexto: 'NO APTO',
      perfilClase: 'no-apto'
    }
  };

  // ========== ELEMENTOS DEL DOM ==========
  const statusRegistro = document.getElementById('statusRegistro');
  const statusClasificacion = document.getElementById('statusClasificacion');
  const statusCompliance = document.getElementById('statusCompliance');
  const evaluacionScore = document.getElementById('evaluacionScore');
  const perfilResultado = document.getElementById('perfilResultado');
  const btnActualizar = document.getElementById('evaluarBtn');
  const proveedorTag = document.querySelector('.proveedor-tag');
  const welcomeText = document.querySelector('.welcome-text h3');
  const sessionInfoDiv = document.getElementById('sessionInfo');

  // ========== FUNCIÓN PARA APLICAR ESTADOS INICIALES SEGÚN PERFIL ==========
  function aplicarPerfil(perfilUsuario) {
    const data = perfilesData[perfilUsuario];
    if (!data) return;

    // Actualizar proveedor
    proveedorTag.innerHTML = `<i class="fas fa-building" style="margin-right: 10px;"></i> Proveedor: ${data.proveedor.nombre} • RFC: ${data.proveedor.rfc}`;

    // Actualizar bienvenida
    welcomeText.textContent = data.bienvenida;

    // Actualizar estados de las tarjetas
    actualizarEstadoTarjeta(statusRegistro, data.estados.registro, 'Registro');
    actualizarEstadoTarjeta(statusClasificacion, data.estados.clasificacion, 'Clasificación');
    actualizarEstadoTarjeta(statusCompliance, data.estados.compliance, 'Compliance');

    // Actualizar score
    evaluacionScore.textContent = data.score + ' puntos';

    // Actualizar perfil
    perfilResultado.textContent = data.perfilTexto;
    perfilResultado.className = `profile-result ${data.perfilClase}`;
  }

  // Función auxiliar para actualizar el contenido y atributo de una tarjeta de estado
  function actualizarEstadoTarjeta(elemento, estado, tipo) {
    elemento.setAttribute('data-status', estado);
    if (estado === 'complete') {
      if (tipo === 'Compliance') {
        elemento.innerHTML = '<i class="fas fa-check-circle"></i> Validado';
      } else {
        elemento.innerHTML = '<i class="fas fa-check-circle"></i> Completo';
      }
    } else {
      elemento.innerHTML = '<i class="fas fa-clock"></i> Pendiente';
    }
  }

  // ========== ACTUALIZAR INTERFAZ DE SESIÓN ==========
  function actualizarInfoSesion() {
    if (sessionInfoDiv) {
      if (perfil && usuario) {
        sessionInfoDiv.innerHTML = `
          <span class="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
            <i class="fas fa-user-circle"></i> ${usuario} (${perfil})
          </span>
          <button id="logoutBtn" class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2">
            <i class="fas fa-sign-out-alt"></i> Cerrar sesión
          </button>
        `;
        document.getElementById('logoutBtn').addEventListener('click', cerrarSesion);
      } else {
        sessionInfoDiv.innerHTML = `
          <a href="login.html" class="text-white bg-[#0b3b5b] hover:bg-[#0f4a73] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
            <i class="fas fa-sign-in-alt"></i> Acceder
          </a>
        `;
      }
    }
  }

  // ========== CERRAR SESIÓN ==========
  function cerrarSesion() {
    sessionStorage.removeItem('tianguis_perfil');
    sessionStorage.removeItem('tianguis_usuario');
    window.location.href = 'login.html';
  }

  // ========== FUNCIÓN PARA ACTUALIZAR EVALUACIÓN (ALEATORIA) ==========
  function actualizarEvaluacion() {
    const estadosPosibles = ['complete', 'pending'];
    
    const nuevoRegistro = estadosPosibles[Math.floor(Math.random() * 2)];
    const nuevoClasif = estadosPosibles[Math.floor(Math.random() * 2)];
    const nuevoCompliance = estadosPosibles[Math.floor(Math.random() * 2)];

    actualizarEstadoTarjeta(statusRegistro, nuevoRegistro, 'Registro');
    actualizarEstadoTarjeta(statusClasificacion, nuevoClasif, 'Clasificación');
    actualizarEstadoTarjeta(statusCompliance, nuevoCompliance, 'Compliance');

    let completados = 0;
    if (nuevoRegistro === 'complete') completados++;
    if (nuevoClasif === 'complete') completados++;
    if (nuevoCompliance === 'complete') completados++;

    let nuevoScore = 60 + (completados * 12);
    if (completados === 3) nuevoScore = 98;
    evaluacionScore.textContent = nuevoScore + ' puntos';

    if (nuevoRegistro === 'complete' && nuevoClasif === 'complete' && nuevoCompliance === 'complete') {
      perfilResultado.textContent = 'APTO';
      perfilResultado.className = 'profile-result apto';
    } else {
      perfilResultado.textContent = 'NO APTO';
      perfilResultado.className = 'profile-result no-apto';
    }
  }

  // ========== EJECUCIÓN INICIAL ==========
  // Aplicar datos del perfil
  aplicarPerfil(perfil);

  // Actualizar la barra de sesión
  actualizarInfoSesion();

  // Asociar evento al botón actualizar
  if (btnActualizar) {
    btnActualizar.addEventListener('click', actualizarEvaluacion);
  }

  // Opcional: interacción ligera en tarjetas
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
      const titulo = this.querySelector('h5')?.innerText || 'tarjeta';
      console.log(`Vista rápida: ${titulo} (simulación)`);
    });
  });
});