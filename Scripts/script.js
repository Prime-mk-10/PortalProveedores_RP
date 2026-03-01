document.addEventListener('DOMContentLoaded', function() {
  // ========== CONTROL DE SESIÓN ==========
  const perfil = sessionStorage.getItem('tianguis_perfil');
  const usuario = sessionStorage.getItem('tianguis_usuario');

  if (!perfil) {
    window.location.href = 'login.html';
    return;
  }

  // ========== DATOS POR PERFIL ==========
  const perfilesData = {
    proveedor_publico: {
      tipo: 'Proveedor',
      nombre: 'CONSTRUCTORA ÁGUILA, S.A. DE C.V.',
      rfc: 'CAAG1234567A1',
      bienvenida: 'Bienvenido, proveedor del sector público',
      modulos: [
        { id: 'sourcing', nombre: 'Sourcing', descripcion: 'Gestión de admisión y evaluación', icono: 'fa-search' },
        { id: 'automatizacion', nombre: 'Automatización', descripcion: 'Procesos automatizados', icono: 'fa-robot' },
        { id: 'concierge', nombre: 'Concierge', descripcion: 'Atención personalizada', icono: 'fa-concierge-bell' },
        { id: 'legal', nombre: 'Legal', descripcion: 'Contratos y aspectos legales', icono: 'fa-gavel' },
        { id: 'financiamiento', nombre: 'Financiamiento', descripcion: 'Opciones de financiamiento', icono: 'fa-coins' },
        { id: 'business_intelligence', nombre: 'Business Intelligence', descripcion: 'Análisis de datos', icono: 'fa-chart-pie' },
        { id: 'capacitacion', nombre: 'Capacitación', descripcion: 'Cursos y formación', icono: 'fa-chalkboard-teacher' },
        { id: 'compliance', nombre: 'Compliance', descripcion: 'Cumplimiento normativo', icono: 'fa-shield-alt' },
        { id: 'marketplace', nombre: 'Market Place', descripcion: 'Tienda digital', icono: 'fa-store' },
        { id: 'bienestar', nombre: 'Bienestar y Protección', descripcion: 'Beneficios para empleados', icono: 'fa-heart' }
      ]
    },
    institucion_publica: {
      tipo: 'Institución',
      nombre: 'SECRETARÍA DE OBRAS PÚBLICAS',
      rfc: 'SOP1234567XX',
      bienvenida: 'Bienvenido, institución pública',
      modulos: [
        { id: 'sourcing', nombre: 'Sourcing', descripcion: 'Gestión de admisión y evaluación', icono: 'fa-search' },
        { id: 'automatizacion', nombre: 'Automatización', descripcion: 'Procesos automatizados', icono: 'fa-robot' },
        { id: 'concierge', nombre: 'Concierge', descripcion: 'Atención personalizada', icono: 'fa-concierge-bell' },
        { id: 'financiamiento', nombre: 'Financiamiento', descripcion: 'Opciones de financiamiento', icono: 'fa-coins' },
        { id: 'business_intelligence', nombre: 'Business Intelligence', descripcion: 'Análisis de datos', icono: 'fa-chart-pie' },
        { id: 'capacitacion', nombre: 'Capacitación', descripcion: 'Cursos y formación', icono: 'fa-chalkboard-teacher' },
        { id: 'compliance', nombre: 'Compliance', descripcion: 'Cumplimiento normativo', icono: 'fa-shield-alt' },
        { id: 'marketplace', nombre: 'Market Place', descripcion: 'Tienda digital', icono: 'fa-store' },
        { id: 'bienestar', nombre: 'Bienestar y Protección', descripcion: 'Beneficios para empleados', icono: 'fa-heart' }
      ]
    },
    proveedor_privado: {
      tipo: 'Proveedor Privado',
      nombre: 'DESARROLLOS URBANOS PRIVADOS, S.A. DE C.V.',
      rfc: 'DUP9876543YZ',
      bienvenida: 'Bienvenido, proveedor del sector privado',
      modulos: [
        { id: 'sourcing', nombre: 'Sourcing', descripcion: 'Gestión de admisión y evaluación', icono: 'fa-search' },
        { id: 'automatizacion', nombre: 'Automatización', descripcion: 'Procesos automatizados', icono: 'fa-robot' },
        { id: 'financiamiento', nombre: 'Financiamiento', descripcion: 'Opciones de financiamiento', icono: 'fa-coins' },
        { id: 'compliance', nombre: 'Compliance', descripcion: 'Cumplimiento normativo', icono: 'fa-shield-alt' },
        { id: 'capacitacion', nombre: 'Capacitación', descripcion: 'Cursos y formación', icono: 'fa-chalkboard-teacher' },
        { id: 'marketplace', nombre: 'Market Place', descripcion: 'Tienda digital', icono: 'fa-store' }
      ]
    }
  };

  // ========== ELEMENTOS DEL DOM ==========
  const navMenu = document.getElementById('navMenu');
  const welcomeH3 = document.querySelector('.welcome-text h3');
  const infoUsuario = document.getElementById('infoUsuario');
  const sessionInfoDiv = document.getElementById('sessionInfo');
  const contenidoModulo = document.getElementById('contenidoModulo');

  // Variable para llevar el módulo activo
  let moduloActivoId = null;

  // ========== CARGAR MÓDULOS EN EL MENÚ ==========
  function cargarMenuModulos(perfilUsuario) {
    const data = perfilesData[perfilUsuario];
    if (!data || !navMenu) return;

    navMenu.innerHTML = '';

    data.modulos.forEach(modulo => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#';
      // Clases mejoradas: en móvil fondo hover, en desktop padding reducido y hover con fondo suave
      a.className = 'block py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:px-3 md:py-1.5 md:hover:bg-blue-50 md:hover:text-[#0b3b5b] transition-colors duration-200';
      a.setAttribute('data-modulo', modulo.id);
      a.innerHTML = `<i class="fas ${modulo.icono} mr-1.5 text-sm"></i>${modulo.nombre}`;
      
      a.addEventListener('click', (e) => {
        e.preventDefault();
        // Quitar clase activa del anterior
        if (moduloActivoId) {
          const anterior = document.querySelector(`a[data-modulo="${moduloActivoId}"]`);
          if (anterior) {
            anterior.classList.remove('active-modulo');
          }
        }
        // Agregar clase activa al actual
        a.classList.add('active-modulo');
        moduloActivoId = modulo.id;
        mostrarContenidoModulo(modulo);
      });

      li.appendChild(a);
      navMenu.appendChild(li);
    });

    // Opcional: seleccionar el primer módulo por defecto
    if (data.modulos.length > 0) {
      const primerModulo = data.modulos[0];
      const primerEnlace = document.querySelector(`a[data-modulo="${primerModulo.id}"]`);
      if (primerEnlace) {
        primerEnlace.classList.add('active-modulo');
        moduloActivoId = primerModulo.id;
        mostrarContenidoModulo(primerModulo);
      }
    }
  }

  // ========== MOSTRAR CONTENIDO DEL MÓDULO SELECCIONADO ==========
  function mostrarContenidoModulo(modulo) {
    if (contenidoModulo) {
      contenidoModulo.innerHTML = `
        <h5 class="text-2xl font-bold text-[#0b3b5b] mb-4">
          <i class="fas ${modulo.icono} mr-2"></i>${modulo.nombre}
        </h5>
        <p class="text-gray-700">${modulo.descripcion}</p>
        <p class="text-gray-500 mt-4">Contenido en desarrollo. Aquí se mostrarán las funcionalidades del módulo.</p>
      `;
    }
  }

  // ========== ACTUALIZAR INTERFAZ DE SESIÓN ==========
  function actualizarInfoSesion() {
    if (sessionInfoDiv) {
      if (perfil && usuario) {
        let nombrePerfil = '';
        if (perfil === 'proveedor_publico') nombrePerfil = 'Proveedor Público';
        else if (perfil === 'institucion_publica') nombrePerfil = 'Institución Pública';
        else if (perfil === 'proveedor_privado') nombrePerfil = 'Proveedor Privado';
        else nombrePerfil = perfil;

        sessionInfoDiv.innerHTML = `
          <span class="text-xs md:text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
            <i class="fas fa-user-circle"></i> <span class="hidden sm:inline">${usuario}</span> <span class="text-[0.7rem] text-gray-500">(${nombrePerfil})</span>
          </span>
          <button id="logoutBtn" class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5">
            <i class="fas fa-sign-out-alt"></i> <span class="hidden sm:inline">Salir</span>
          </button>
        `;
        document.getElementById('logoutBtn').addEventListener('click', cerrarSesion);
      } else {
        sessionInfoDiv.innerHTML = `
          <a href="login.html" class="text-white bg-[#0b3b5b] hover:bg-[#0f4a73] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5">
            <i class="fas fa-sign-in-alt"></i> Acceder
          </a>
        `;
      }
    }
  }

  function cerrarSesion() {
    sessionStorage.removeItem('tianguis_perfil');
    sessionStorage.removeItem('tianguis_usuario');
    window.location.href = 'login.html';
  }

  // ========== INICIALIZACIÓN ==========
  function inicializar() {
    const data = perfilesData[perfil];
    if (data) {
      welcomeH3.textContent = data.bienvenida;
      infoUsuario.innerHTML = `<i class="fas fa-building"></i> ${data.tipo}: ${data.nombre} • RFC: ${data.rfc}`;
      cargarMenuModulos(perfil);
    }
    actualizarInfoSesion();
  }

  // Agregar estilos para módulo activo (se puede poner en CSS también)
  const style = document.createElement('style');
  style.innerHTML = `
    .active-modulo {
      background-color: #e9eff8 !important;
      color: #0b3b5b !important;
      font-weight: 500;
    }
    .md .active-modulo {
      background-color: #e9eff8 !important;
    }
  `;
  document.head.appendChild(style);

  inicializar();
});