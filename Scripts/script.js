// Variable global para almacenar datos del usuario
let userData = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar la navegación parcial
    await cargarNav();
    // 2. Cargar datos del usuario y configurar menú
    await cargarDatosUsuario();
    // 3. Cargar un módulo por defecto (según rol)
    cargarModuloPorDefecto();
});

async function cargarNav() {
    try {
        const response = await fetch('partials/nav.html');
        const html = await response.text();
        document.getElementById('nav-placeholder').innerHTML = html;
    } catch (error) {
        console.error('Error cargando la navegación:', error);
    }
}

async function cargarDatosUsuario() {
    try {
        const response = await fetch('get_user_data.php');
        const data = await response.json();
        
        if (data.success) {
            userData = data;
            // Actualizar dropdown de usuario (elementos en nav.html)
            const dropdownUserName = document.getElementById('dropdownUserName');
            const dropdownUserEmail = document.getElementById('dropdownUserEmail');
            if (dropdownUserName) dropdownUserName.textContent = data.nombre || data.email.split('@')[0];
            if (dropdownUserEmail) dropdownUserEmail.textContent = data.email;
            
            // Configurar logout
            const logoutLink = document.getElementById('logoutLink');
            if (logoutLink) logoutLink.href = 'logout.php';
            
            // Actualizar información del usuario en el sidebar
            actualizarInfoUsuario();
            
            // Configurar menú según el rol
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

function actualizarInfoUsuario() {
    const infoUsuario = document.getElementById('infoUsuario');
    if (!infoUsuario || !userData) return;
    
    let rolTexto = '';
    switch(userData.rol) {
        case 'Ofertante': rolTexto = 'Ofertante'; break;
        case 'institucion_publica': rolTexto = 'Institución Pública'; break;
        case 'privado': rolTexto = 'Usuario Privado'; break;
        default: rolTexto = userData.rol;
    }
    
    infoUsuario.innerHTML = `
        <i class="fas fa-user-circle"></i> 
        <strong>${rolTexto}</strong> · ${userData.email}
        <span class="ml-2 text-sm bg-blue-100 px-2 py-1 rounded">
            ${userData.tipo_contratacion === 'publica' ? 'Contratación Pública' : 'Contratación Privada'}
        </span>
    `;
}

function configurarMenu(rol) {
    const sidebarMenu = document.getElementById('sidebarMenu');
    if (!sidebarMenu) return;
    
    let menuItems = [];
    
    switch(rol) {
        case 'Ofertante':
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
                { nombre: 'Mi Perfil', icono: 'fa-user', id: 'perfil' },
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
                { nombre: 'Mi Perfil', icono: 'fa-user', id: 'perfil' },
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

function cargarModuloPorDefecto() {
    if (!userData) return;
    // Elegir un módulo por defecto según el rol
    let moduloDefault = '';
    switch(userData.rol) {
        case 'Ofertante':
            moduloDefault = 'perfil';
            break;
        case 'institucion_publica':
            moduloDefault = 'dashboard';
            break;
        case 'privado':
            moduloDefault = 'cuenta';
            break;
        default:
            moduloDefault = 'sourcing';
    }
    cargarModulo(moduloDefault);
}

async function cargarModulo(modulo) {
    const mainContainer = document.getElementById('main-content-container');
    if (!mainContainer) return;
    
    try {
        // Intentar cargar el archivo de vista correspondiente
        const response = await fetch(`views/${modulo}.html`);
        if (!response.ok) throw new Error('Vista no encontrada');
        const html = await response.text();
        mainContainer.innerHTML = html;
        
        // Después de insertar la vista, ejecutar lógica específica si es necesario
        afterModuleLoad(modulo);
    } catch (error) {
        // Fallback: mostrar un mensaje genérico
        mainContainer.innerHTML = `
            <div class="p-6 bg-white rounded-lg shadow">
                <h2 class="text-2xl font-bold text-[#0b3b5b] mb-4">${modulo}</h2>
                <p class="text-gray-600">Módulo en construcción. Próximamente más funcionalidades.</p>
            </div>
        `;
        console.warn('No se encontró vista para:', modulo);
    }
}

function afterModuleLoad(modulo) {
    // Actualizar datos dinámicos en la vista si es necesario
    if (modulo === 'perfil' && userData) {
        const emailSpan = document.getElementById('perfil-email');
        const rolSpan = document.getElementById('perfil-rol');
        if (emailSpan) emailSpan.textContent = userData.email;
        if (rolSpan) rolSpan.textContent = userData.rol;
    }
    // También puedes agregar lógica para otros módulos
}