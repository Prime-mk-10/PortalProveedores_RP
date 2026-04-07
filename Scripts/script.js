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
            moduloDefault = 'perfil';
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
    if (modulo === 'perfil') {
        cargarFormularioProveedor();
    }
    // También puedes agregar lógica para otros módulos
}

// ============================================================
// FUNCIONES PARA EL FORMULARIO DE PROVEEDORES
// ============================================================

async function cargarFormularioProveedor() {
    const ofertanteDiv = document.getElementById('ofertante-section');
    const generalDiv = document.getElementById('general-section');

    if (!userData) return;

    if (userData.rol === 'Ofertante') {
        if (ofertanteDiv) ofertanteDiv.style.display = 'block';
        if (generalDiv) generalDiv.style.display = 'none';

        const tipoSelect = document.getElementById('tipoProveedor');
        const formCampos = document.getElementById('formCampos');
        const proveedorForm = document.getElementById('proveedorForm');

        if (!tipoSelect || !formCampos || !proveedorForm) return;

        // Cargar datos si ya existen para el tipo seleccionado
        async function cargarDatosPorTipo(tipo) {
            if (!tipo) {
                formCampos.innerHTML = '<p class="text-gray-500">Selecciona un tipo de proveedor</p>';
                return;
            }
            try {
                mostrarLoading(formCampos, true);
                const response = await fetch(`get_proveedor.php?tipo=${tipo}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                console.log('Datos recibidos:', result); // Para depuración
                if (result.success && result.data) {
                    mostrarFormularioConDatos(tipo, result.data);
                } else {
                    mostrarFormularioVacio(tipo);
                }
            } catch (error) {
                console.error('Error cargando datos:', error);
                mostrarMensaje('formMessage', 'Error al cargar los datos: ' + error.message, 'error');
                mostrarFormularioVacio(tipo);
            } finally {
                mostrarLoading(formCampos, false);
            }
        }

        function mostrarLoading(container, show) {
            if (show) {
                const loadingDiv = document.getElementById('loadingIndicator');
                if (!loadingDiv) {
                    const div = document.createElement('div');
                    div.id = 'loadingIndicator';
                    div.className = 'text-center py-4';
                    div.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando datos...';
                    container.innerHTML = '';
                    container.appendChild(div);
                }
            } else {
                const loadingDiv = document.getElementById('loadingIndicator');
                if (loadingDiv) loadingDiv.remove();
            }
        }

        function mostrarFormularioVacio(tipo) {
            if (tipo === 'fisica_empresarial') {
                formCampos.innerHTML = generarCamposFisica();
            } else if (tipo === 'moral') {
                formCampos.innerHTML = generarCamposMoral();
            }
            // Limpiar valores
            document.querySelectorAll('#proveedorForm input, #proveedorForm textarea, #proveedorForm select').forEach(field => {
                if (field.type !== 'submit' && field.type !== 'button') field.value = '';
            });
        }

        function mostrarFormularioConDatos(tipo, data) {
            if (tipo === 'fisica_empresarial') {
                formCampos.innerHTML = generarCamposFisica();
            } else if (tipo === 'moral') {
                formCampos.innerHTML = generarCamposMoral();
            }
            // Llenar campos con los datos recibidos
            for (const [key, value] of Object.entries(data)) {
                if (value === null || value === undefined) continue;
                const input = document.querySelector(`#proveedorForm [name="${key}"]`);
                if (input) input.value = value;
            }
        }

        tipoSelect.addEventListener('change', (e) => {
            cargarDatosPorTipo(e.target.value);
        });

        proveedorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const tipo = tipoSelect.value;
            if (!tipo) {
                mostrarMensaje('formMessage', 'Selecciona un tipo de proveedor', 'error');
                return;
            }
            
            // Mostrar loading
            const submitBtn = proveedorForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Guardando...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(proveedorForm);
                formData.append('tipo_proveedor', tipo);
                
                console.log('Enviando datos...'); // Para depuración
                const response = await fetch('save_proveedor.php', {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const textResponse = await response.text();
                console.log('Respuesta cruda:', textResponse); // Para depuración
                
                let result;
                try {
                    result = JSON.parse(textResponse);
                } catch (e) {
                    throw new Error('Respuesta no válida del servidor: ' + textResponse.substring(0, 100));
                }
                
               if (result.success) {
                    mostrarMensaje('formMessage', result.message, 'success');
                    // AÑADE ESTA LÍNEA PARA RECARGAR LA PÁGINA
                    setTimeout(() => { window.location.reload(); }, 1500); // Recarga después de 1.5 segundos para que el usuario vea el mensaje
                } else {
                    mostrarMensaje('formMessage', result.message, 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarMensaje('formMessage', 'Error de conexión: ' + error.message, 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });

        const cancelarBtn = document.getElementById('cancelarForm');
        if (cancelarBtn) {
            cancelarBtn.addEventListener('click', () => {
                tipoSelect.value = '';
                formCampos.innerHTML = '<p class="text-gray-500">Selecciona un tipo de proveedor</p>';
            });
        }

        // Si ya hay un tipo preseleccionado, cargar sus datos
        if (tipoSelect.value) {
            cargarDatosPorTipo(tipoSelect.value);
        }
    } else {
        // Para institución pública o privado, mostrar Alta General
        if (ofertanteDiv) ofertanteDiv.style.display = 'none';
        if (generalDiv) generalDiv.style.display = 'block';

        // Cargar datos existentes de tipo 'general' si los hay
        try {
            const response = await fetch('get_proveedor.php?tipo=general');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.success && result.data) {
                const data = result.data;
                for (const [key, value] of Object.entries(data)) {
                    if (value === null || value === undefined) continue;
                    const input = document.querySelector(`#generalForm [name="${key}"]`);
                    if (input) input.value = value;
                }
            }
        } catch (error) {
            console.error('Error cargando datos generales:', error);
        }

        const generalForm = document.getElementById('generalForm');
        if (generalForm) {
            generalForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Mostrar loading
                const submitBtn = generalForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Guardando...';
                submitBtn.disabled = true;
                
                try {
                    const formData = new FormData(generalForm);
                    formData.append('tipo_proveedor', 'general');
                    const response = await fetch('save_proveedor.php', {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const textResponse = await response.text();
                    console.log('Respuesta general:', textResponse);
                    
                    let result;
                    try {
                        result = JSON.parse(textResponse);
                    } catch (e) {
                        throw new Error('Respuesta no válida del servidor');
                    }
                    
                    if (result.success) {
                        mostrarMensaje('generalMessage', result.message, 'success');
                        setTimeout(() => { window.location.reload(); }, 1500);
                    } else {
                        mostrarMensaje('generalMessage', result.message, 'error');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    mostrarMensaje('generalMessage', 'Error de conexión: ' + error.message, 'error');
                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
        }
    }
}

// Funciones auxiliares para generar los campos según tipo
function generarCamposFisica() {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${campoBaseHTML()}
            <div class="md:col-span-2">
                <label class="block text-gray-700 font-medium mb-1">Actividades:</label>
                <textarea name="actividades" class="w-full border p-2 rounded" rows="3" placeholder="Describe las actividades empresariales..."></textarea>
            </div>
        </div>
    `;
}

function generarCamposMoral() {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${campoBaseHTML()}
            
            <!-- Datos del Acta Constitutiva -->
            <div class="md:col-span-2">
                <h3 class="font-bold text-[#0b3b5b] mt-2 mb-2 border-b pb-1">DATOS DEL ACTA CONSTITUTIVA</h3>
            </div>
            <div class="md:col-span-2">
                <label class="block text-gray-700 font-medium mb-1">Objeto Social:</label>
                <textarea name="objeto_social" class="w-full border p-2 rounded" rows="3" placeholder="Describe el objeto social..."></textarea>
            </div>
            <div><label class="block text-gray-700">Núm. Acta Constitutiva:</label><input type="text" name="num_acta_constitutiva" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Fecha Acta Constitutiva:</label><input type="date" name="fecha_acta_constitutiva" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Núm. Notario:</label><input type="text" name="num_notario_acta" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Nombre del Notario:</label><input type="text" name="nombre_notario_acta" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Ciudad donde se constituyó:</label><input type="text" name="ciudad_acta" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Folio Mercantil:</label><input type="text" name="folio_mercantil" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Fecha de Registro:</label><input type="date" name="fecha_registro_acta" class="w-full border p-2 rounded"></div>
            
            <!-- Poder Notarial (opcional) -->
            <div class="md:col-span-2">
                <h3 class="font-bold text-[#0b3b5b] mt-4 mb-2 border-b pb-1">PODER NOTARIAL (Solo si aplica)</h3>
            </div>
            <div><label class="block text-gray-700">Núm. de Poder Notarial:</label><input type="text" name="poder_notarial_num" class="w-full border p-2 rounded" placeholder="N/A si no aplica"></div>
            <div><label class="block text-gray-700">Fecha del Poder Notarial:</label><input type="date" name="poder_notarial_fecha" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Núm. del Notario:</label><input type="text" name="poder_notarial_notario_num" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Nombre del Notario:</label><input type="text" name="poder_notarial_notario_nombre" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Ciudad donde se registró:</label><input type="text" name="poder_notarial_ciudad" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Folio Mercantil:</label><input type="text" name="poder_notarial_folio" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Fecha de Registro:</label><input type="date" name="poder_notarial_fecha_registro" class="w-full border p-2 rounded"></div>
            <div class="md:col-span-2">
                <label class="block text-gray-700">Apoderados:</label>
                <textarea name="apoderados" class="w-full border p-2 rounded" rows="2" placeholder="Nombres de los apoderados..."></textarea>
            </div>
        </div>
    `;
}

function campoBaseHTML() {
    return `
        <!-- Datos Fiscales -->
        <div class="md:col-span-2">
            <h3 class="font-bold text-[#0b3b5b] mt-2 mb-2 border-b pb-1">DATOS FISCALES</h3>
        </div>
        <div><label class="block text-gray-700">RFC:</label><input type="text" name="rfc" class="w-full border p-2 rounded" required maxlength="13" placeholder="RFC (13 caracteres)"></div>
        <div><label class="block text-gray-700">Razón Social:</label><input type="text" name="razon_social" class="w-full border p-2 rounded" required></div>
        <div><label class="block text-gray-700">Régimen Fiscal:</label><input type="text" name="regimen_fiscal" class="w-full border p-2 rounded" required></div>
        
        <!-- Domicilio Fiscal -->
        <div class="md:col-span-2">
            <h3 class="font-bold text-[#0b3b5b] mt-2 mb-2 border-b pb-1">DOMICILIO FISCAL</h3>
        </div>
        <div><label class="block text-gray-700">Vialidad:</label><input type="text" name="nombre_vialidad" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Núm. Exterior:</label><input type="text" name="num_exterior" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Núm. Interior:</label><input type="text" name="num_interior" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Colonia o Fraccionamiento:</label><input type="text" name="colonia" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Localidad:</label><input type="text" name="localidad" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Código Postal:</label><input type="text" name="codigo_postal" class="w-full border p-2 rounded" maxlength="5"></div>
        <div><label class="block text-gray-700">Ciudad:</label><input type="text" name="ciudad" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Estado:</label><input type="text" name="estado" class="w-full border p-2 rounded"></div>
        
        <!-- Contacto -->
        <div class="md:col-span-2">
            <h3 class="font-bold text-[#0b3b5b] mt-2 mb-2 border-b pb-1">CONTACTO</h3>
        </div>
        <div><label class="block text-gray-700">Teléfono:</label><input type="text" name="telefono" class="w-full border p-2 rounded" placeholder="Ej: 5551234567"></div>
        <div><label class="block text-gray-700">Extensión:</label><input type="text" name="extension" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Fax:</label><input type="text" name="fax" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Extensión Fax:</label><input type="text" name="fax_extension" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Representante Legal:</label><input type="text" name="representante_legal" class="w-full border p-2 rounded"></div>
        <div class="md:col-span-2"><label class="block text-gray-700">Correo Electrónico:</label><input type="email" name="email" class="w-full border p-2 rounded" required></div>
        
        <!-- Datos Bancarios -->
        <div class="md:col-span-2">
            <h3 class="font-bold text-[#0b3b5b] mt-2 mb-2 border-b pb-1">DATOS BANCARIOS</h3>
        </div>
        <div><label class="block text-gray-700">Banco:</label><input type="text" name="banco" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Sucursal:</label><input type="text" name="sucursal_bancaria" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Número de Cuenta:</label><input type="text" name="cuenta_bancaria" class="w-full border p-2 rounded"></div>
        <div class="md:col-span-2"><label class="block text-gray-700">CLABE Interbancaria:</label><input type="text" name="clabe_interbancaria" class="w-full border p-2 rounded" maxlength="18"></div>
    `;
}

function mostrarMensaje(containerId, mensaje, tipo) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.textContent = mensaje;
    container.className = `mt-2 text-sm ${tipo === 'error' ? 'text-red-600' : 'text-green-600'}`;
    setTimeout(() => {
        container.textContent = '';
    }, 5000);
}