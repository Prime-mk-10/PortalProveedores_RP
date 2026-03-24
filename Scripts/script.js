// Cargar datos del usuario al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    await cargarDatosUsuario();
});

async function cargarDatosUsuario() {
    try {
        const response = await fetch('get_user_data.php');
        const data = await response.json();
        
        if (data.success) {
            // Mostrar información del usuario
            const infoUsuario = document.getElementById('infoUsuario');
            const sessionInfo = document.getElementById('sessionInfo');
            
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
            
            sessionInfo.innerHTML = `
                <span class="text-sm text-gray-700">${data.email}</span>
                <a href="logout.php" class="text-red-600 hover:text-red-800 ml-2">
                    <i class="fas fa-sign-out-alt"></i> Salir
                </a>
            `;
            
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

function configurarMenu(rol) {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    let menuItems = [];
    
    // Configurar menú según el rol
    switch(rol) {
        case 'proveedor':
            menuItems = [
                { nombre: 'Mi Perfil', icono: 'fa-user', id: 'perfil' },
                { nombre: 'Registrar Solicitud', icono: 'fa-file-signature', id: 'solicitud' },
                { nombre: 'Mis Solicitudes', icono: 'fa-folder-open', id: 'mis_solicitudes' },
                { nombre: 'Documentos', icono: 'fa-file-alt', id: 'documentos' }
            ];
            break;
        case 'institucion_publica':
            menuItems = [
                { nombre: 'Dashboard', icono: 'fa-chart-line', id: 'dashboard' },
                { nombre: 'Revisar Solicitudes', icono: 'fa-clipboard-list', id: 'revisar' },
                { nombre: 'Contratos Activos', icono: 'fa-file-contract', id: 'contratos' },
                { nombre: 'Estadísticas', icono: 'fa-chart-bar', id: 'estadisticas' }
            ];
            break;
        case 'privado':
            menuItems = [
                { nombre: 'Mi Cuenta', icono: 'fa-user', id: 'cuenta' },
                { nombre: 'Consultar Licitaciones', icono: 'fa-search', id: 'consultar' },
                { nombre: 'Notificaciones', icono: 'fa-bell', id: 'notificaciones' }
            ];
            break;
        default:
            menuItems = [];
    }
    
    // Generar menú
    navMenu.innerHTML = menuItems.map(item => `
        <li>
            <a href="#" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#0b3b5b] md:p-0" data-modulo="${item.id}">
                <i class="fas ${item.icono} mr-2"></i> ${item.nombre}
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
    
    switch(modulo) {
        case 'perfil':
            contenido = `
                <h2 class="text-2xl font-bold text-[#0b3b5b] mb-4">Mi Perfil</h2>
                <p class="text-gray-600">Aquí puedes ver y editar la información de tu perfil.</p>
                <div class="mt-4 p-4 bg-gray-50 rounded">
                    <p><strong>Correo:</strong> ${sessionStorage.getItem('user_email') || 'Cargando...'}</p>
                    <p><strong>Rol:</strong> ${sessionStorage.getItem('user_rol') || 'Cargando...'}</p>
                </div>
            `;
            break;
        case 'solicitud':
            contenido = `
                <h2 class="text-2xl font-bold text-[#0b3b5b] mb-4">Registrar Solicitud</h2>
                <p class="text-gray-600">Formulario para registrar una nueva solicitud de contratación.</p>
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
        case 'mis_solicitudes':
            contenido = `
                <h2 class="text-2xl font-bold text-[#0b3b5b] mb-4">Mis Solicitudes</h2>
                <p class="text-gray-600">Listado de tus solicitudes de contratación.</p>
                <div class="mt-4">
                    <p class="text-gray-500">No hay solicitudes registradas.</p>
                </div>
            `;
            break;
        case 'dashboard':
            contenido = `
                <h2 class="text-2xl font-bold text-[#0b3b5b] mb-4">Dashboard</h2>
                <p class="text-gray-600">Panel de control con indicadores clave.</p>
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
        case 'revisar':
            contenido = `
                <h2 class="text-2xl font-bold text-[#0b3b5b] mb-4">Revisar Solicitudes</h2>
                <p class="text-gray-600">Listado de solicitudes pendientes de revisión.</p>
                <div class="mt-4">
                    <p class="text-gray-500">No hay solicitudes pendientes.</p>
                </div>
            `;
            break;
        default:
            contenido = `
                <p class="text-gray-600">Módulo en construcción. Próximamente más funcionalidades.</p>
            `;
    }
    
    contenidoDiv.innerHTML = contenido;
}