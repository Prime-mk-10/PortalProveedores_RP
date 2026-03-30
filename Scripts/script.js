// Cargar datos del usuario al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    await cargarDatosUsuario();
});

async function cargarDatosUsuario() {
    try {
        const response = await fetch('get_user_data.php');
        const data = await response.json();
        
        if (data.success) {
            // Mostrar información del usuario en la etiqueta existente
            const infoUsuario = document.getElementById('infoUsuario');
            
            let rolTexto = '';
            switch(data.rol) {
                case 'proveedor':
                    rolTexto = 'Proveedor';
                    break;
                case 'institucion_publica':
                    rolTexto = 'Institución Pública';
                    break;
                case 'privado':
                    rolTexto = 'Usuario Privado';
                    break;
                default:
                    rolTexto = data.rol;
            }
            
            infoUsuario.innerHTML = `
                <i class="fas fa-user-circle"></i> 
                <strong>${rolTexto}</strong> · ${data.email}
                <span class="ml-2 text-sm bg-blue-100 px-2 py-1 rounded">
                    ${data.tipo_contratacion === 'publica' ? 'Contratación Pública' : 'Contratación Privada'}
                </span>
            `;
            
            // Actualizar dropdown de usuario
            const dropdownUserName = document.getElementById('dropdownUserName');
            const dropdownUserEmail = document.getElementById('dropdownUserEmail');
            if (dropdownUserName) dropdownUserName.textContent = data.nombre || data.email.split('@')[0];
            if (dropdownUserEmail) dropdownUserEmail.textContent = data.email;
            
            // Configurar logout
            const logoutLink = document.getElementById('logoutLink');
            if (logoutLink) {
                logoutLink.href = 'logout.php';
            }
            
            // Configurar menú según el rol (ahora en la sidebar)
            configurarMenu(data.rol);
        } else {
            // No autenticado, redirigir al login
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error:', error);
        window.location.href = 'login.html';
    }
}

function configurarMenu(rol) {
    const sidebarMenu = document.getElementById('sidebarMenu');
    if (!sidebarMenu) return;
    
    let menuItems = [];
    
    // Configurar menú según el rol (mismo contenido que antes)
    switch(rol) {
        case 'proveedor':
            menuItems = [
                { nombre: 'Mi Perfil', icono: 'fa-user', id: 'perfil' },
                { nombre: 'Registrar Solicitud', icono: 'fa-file-signature', id: 'solicitud' },
                { nombre: 'Mis Solicitudes', icono: 'fa-folder-open', id: 'mis_solicitudes' },
                { nombre: 'Documentos', icono: 'fa-file-alt', id: 'documentos' },
                { nombre: 'Sourcing', icono: 'fa-search', id: 'sourcing' },
                { nombre: 'Automatización', icono: 'fa-robot', id: 'automatizacion' },
                { nombre: 'Concierge', icono: 'fa-concierge-bell', id: 'concierge' },
                { nombre: 'Legal', icono: 'fa-gavel', id: 'legal' },
                { nombre: 'Financiamiento', icono: 'fa-coins', id: 'financiamiento' },
                { nombre: 'Business Intelligence', icono: 'fa-chart-pie', id: 'business_intelligence' },
                { nombre: 'Capacitación', icono: 'fa-chalkboard-teacher', id: 'capacitacion' },
                { nombre: 'Compliance', icono: 'fa-shield-alt', id: 'compliance' },
                { nombre: 'Market Place', icono: 'fa-store', id: 'marketplace' },
                { nombre: 'Bienestar y Protección', icono: 'fa-heart', id: 'bienestar' }
            ];
            break;
        case 'institucion_publica':
            menuItems = [
                { nombre: 'Dashboard', icono: 'fa-chart-line', id: 'dashboard' },
                { nombre: 'Revisar Solicitudes', icono: 'fa-clipboard-list', id: 'revisar' },
                { nombre: 'Contratos Activos', icono: 'fa-file-contract', id: 'contratos' },
                { nombre: 'Estadísticas', icono: 'fa-chart-bar', id: 'estadisticas' },
                { nombre: 'Sourcing', icono: 'fa-search', id: 'sourcing' },
                { nombre: 'Automatización', icono: 'fa-robot', id: 'automatizacion' },
                { nombre: 'Concierge', icono: 'fa-concierge-bell', id: 'concierge' },
                { nombre: 'Financiamiento', icono: 'fa-coins', id: 'financiamiento' },
                { nombre: 'Business Intelligence', icono: 'fa-chart-pie', id: 'business_intelligence' },
                { nombre: 'Capacitación', icono: 'fa-chalkboard-teacher', id: 'capacitacion' },
                { nombre: 'Compliance', icono: 'fa-shield-alt', id: 'compliance' },
                { nombre: 'Market Place', icono: 'fa-store', id: 'marketplace' },
                { nombre: 'Bienestar y Protección', icono: 'fa-heart', id: 'bienestar' }
            ];
            break;
        case 'privado':
            menuItems = [
                { nombre: 'Mi Cuenta', icono: 'fa-user', id: 'cuenta' },
                { nombre: 'Consultar Licitaciones', icono: 'fa-search', id: 'consultar' },
                { nombre: 'Notificaciones', icono: 'fa-bell', id: 'notificaciones' },
                { nombre: 'Sourcing', icono: 'fa-search', id: 'sourcing' },
                { nombre: 'Automatización', icono: 'fa-robot', id: 'automatizacion' },
                { nombre: 'Financiamiento', icono: 'fa-coins', id: 'financiamiento' },
                { nombre: 'Compliance', icono: 'fa-shield-alt', id: 'compliance' },
                { nombre: 'Capacitación', icono: 'fa-chalkboard-teacher', id: 'capacitacion' },
                { nombre: 'Market Place', icono: 'fa-store', id: 'marketplace' }
            ];
            break;
        default:
            menuItems = [];
    }
    
    // Generar menú en la sidebar (con íconos de Font Awesome)
    sidebarMenu.innerHTML = menuItems.map(item => `
        <li>
            <a href="#" class="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group" data-modulo="${item.id}">
                <i class="fas ${item.icono} w-5 h-5 transition duration-75 group-hover:text-fg-brand"></i>
                <span class="ms-3">${item.nombre}</span>
            </a>
        </li>
    `).join('');
    
    // Agregar event listeners a los items del menú
    document.querySelectorAll('[data-modulo]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modulo = link.getAttribute('data-modulo');
            cargarModulo(modulo);
        });
    });
}


function cargarModulo(modulo) {
    const contenidoDiv = document.getElementById('contenidoModulo');
    if (!contenidoDiv) return;
    
    let contenido = '';
    
    // Diccionario con descripciones de los módulos (sin cambios)
    const modulosInfo = {
        perfil: { titulo: 'Mi Perfil', descripcion: 'Aquí puedes ver y editar la información de tu perfil.' },
        solicitud: { titulo: 'Registrar Solicitud', descripcion: 'Formulario para registrar una nueva solicitud de contratación.' },
        mis_solicitudes: { titulo: 'Mis Solicitudes', descripcion: 'Listado de tus solicitudes de contratación.' },
        documentos: { titulo: 'Documentos', descripcion: 'Gestión de documentos y archivos.' },
        dashboard: { titulo: 'Dashboard', descripcion: 'Panel de control con indicadores clave.' },
        revisar: { titulo: 'Revisar Solicitudes', descripcion: 'Listado de solicitudes pendientes de revisión.' },
        contratos: { titulo: 'Contratos Activos', descripcion: 'Gestión de contratos activos.' },
        estadisticas: { titulo: 'Estadísticas', descripcion: 'Estadísticas y reportes del sistema.' },
        cuenta: { titulo: 'Mi Cuenta', descripcion: 'Información de tu cuenta de usuario.' },
        consultar: { titulo: 'Consultar Licitaciones', descripcion: 'Búsqueda y consulta de licitaciones disponibles.' },
        notificaciones: { titulo: 'Notificaciones', descripcion: 'Centro de notificaciones y alertas.' },
        sourcing: { titulo: 'Sourcing', descripcion: 'Gestión de admisión y evaluación de proveedores.' },
        automatizacion: { titulo: 'Automatización', descripcion: 'Procesos automatizados para optimizar la gestión.' },
        concierge: { titulo: 'Concierge', descripcion: 'Atención personalizada para usuarios y clientes.' },
        legal: { titulo: 'Legal', descripcion: 'Gestión de contratos y aspectos legales.' },
        financiamiento: { titulo: 'Financiamiento', descripcion: 'Opciones de financiamiento y análisis crediticio.' },
        business_intelligence: { titulo: 'Business Intelligence', descripcion: 'Análisis de datos y reportes inteligentes.' },
        capacitacion: { titulo: 'Capacitación', descripcion: 'Cursos, formación y desarrollo profesional.' },
        compliance: { titulo: 'Compliance', descripcion: 'Cumplimiento normativo y gestión de riesgos.' },
        marketplace: { titulo: 'Market Place', descripcion: 'Tienda digital para productos y servicios.' },
        bienestar: { titulo: 'Bienestar y Protección', descripcion: 'Beneficios y programas de bienestar para empleados.' }
    };
    
    const info = modulosInfo[modulo] || { titulo: 'Módulo', descripcion: 'Módulo en construcción. Próximamente más funcionalidades.' };
    
    // Contenido base
    contenido = `
        <h2 class="text-2xl font-bold text-[#0b3b5b] mb-4">${info.titulo}</h2>
        <p class="text-gray-600">${info.descripcion}</p>
    `;
    
    // Contenido específico para algunos módulos (sin cambios)
    switch(modulo) {
        case 'perfil':
            contenido += `
                <div class="mt-4 p-4 bg-gray-50 rounded">
                    <p><strong>Correo:</strong> ${sessionStorage.getItem('user_email') || 'Cargando...'}</p>
                    <p><strong>Rol:</strong> ${sessionStorage.getItem('user_rol') || 'Cargando...'}</p>
                </div>
            `;
            break;
        case 'solicitud':
            contenido += `
                <form class="mt-4">
                    <div class="mb-4">
                        <label class="block text-gray-700 mb-2">Título de la solicitud</label>
                        <input type="text" class="w-full p-2 border rounded" placeholder="Ej: Adquisición de equipo médico">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 mb-2">Descripción</label>
                        <textarea class="w-full p-2 border rounded" rows="4"></textarea>
                    </div>
                    <button class="bg-[#0b3b5b] text-white px-4 py-2 rounded hover:bg-[#0f4a73]">
                        Enviar Solicitud
                    </button>
                </form>
            `;
            break;
        case 'dashboard':
            contenido += `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div class="bg-blue-50 p-4 rounded">
                        <h3 class="font-bold">Solicitudes Pendientes</h3>
                        <p class="text-2xl">12</p>
                    </div>
                    <div class="bg-green-50 p-4 rounded">
                        <h3 class="font-bold">Contratos Activos</h3>
                        <p class="text-2xl">8</p>
                    </div>
                    <div class="bg-yellow-50 p-4 rounded">
                        <h3 class="font-bold">Proveedores Registrados</h3>
                        <p class="text-2xl">45</p>
                    </div>
                </div>
            `;
            break;
        case 'mis_solicitudes':
            contenido += `
                <div class="mt-4">
                    <p class="text-gray-500">No hay solicitudes registradas.</p>
                </div>
            `;
            break;
        case 'revisar':
            contenido += `
                <div class="mt-4">
                    <p class="text-gray-500">No hay solicitudes pendientes.</p>
                </div>
            `;
            break;
        default:
            contenido += `
                <div class="mt-4 p-4 bg-gray-50 rounded">
                    <div class="flex items-center justify-center p-8">
                        <i class="fas ${getIconoPorModulo(modulo)} text-4xl text-[#0b3b5b] mr-4"></i>
                        <div>
                            <h3 class="font-bold text-lg">${modulosInfo[modulo]?.titulo || modulo}</h3>
                            <p class="text-gray-600 mt-2">Funcionalidad en desarrollo. Próximamente disponible.</p>
                        </div>
                    </div>
                </div>
            `;
    }
    
    contenidoDiv.innerHTML = contenido;
}

function getIconoPorModulo(modulo) {
    const iconos = {
        sourcing: 'fa-search',
        automatizacion: 'fa-robot',
        concierge: 'fa-concierge-bell',
        legal: 'fa-gavel',
        financiamiento: 'fa-coins',
        business_intelligence: 'fa-chart-pie',
        capacitacion: 'fa-chalkboard-teacher',
        compliance: 'fa-shield-alt',
        marketplace: 'fa-store',
        bienestar: 'fa-heart'
    };
    return iconos[modulo] || 'fa-cog';
}