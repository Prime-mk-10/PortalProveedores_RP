// ============================================================
// Vista Sourcing: pestañas Perfil / Externalizar producto
// Externalizar producto guarda y consulta solicitudes en MySQL
// ============================================================
function inicializarSourcing() {
    inicializarTabsSourcing();
    inicializarFormularioExternalizacion();
}

function inicializarTabsSourcing() {
    const view = document.getElementById('sourcing-view');
    if (!view) return;

    const buttons = view.querySelectorAll('[data-sourcing-tab-button]');
    const panels = view.querySelectorAll('[data-sourcing-tab-panel]');

    function activarTab(tabId) {
        buttons.forEach(btn => {
            const isActive = btn.dataset.sourcingTabButton === tabId;
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            btn.classList.toggle('text-[#0b3b5b]', isActive);
            btn.classList.toggle('text-gray-600', !isActive);
            btn.classList.toggle('border-[#0b3b5b]', isActive);
            btn.classList.toggle('border-transparent', !isActive);
            btn.classList.toggle('bg-[#f8fbfd]', isActive);
        });

        panels.forEach(panel => {
            panel.classList.toggle('hidden', panel.dataset.sourcingTabPanel !== tabId);
        });

        if (tabId === 'externalizar') {
            cargarExternalizaciones();
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            activarTab(button.dataset.sourcingTabButton);
        });
    });

    const hash = window.location.hash.replace('#', '');
    activarTab(hash === 'externalizar-producto' ? 'externalizar' : 'perfil');
}

async function inicializarCategoriasExternalizacion() {
    const form = document.getElementById('externalizacionForm');
    if (!form) return;

    const nivel1 = form.querySelector('[name="external_categoria_nivel_1"]');
    const nivel2 = form.querySelector('[name="external_categoria_nivel_2"]');
    const nivel3 = form.querySelector('[name="external_categoria_nivel_3"]');

    if (!nivel1 || !nivel2 || !nivel3 || nivel1.dataset.inicializado === 'true') return;
    nivel1.dataset.inicializado = 'true';

    async function cargarNivel2(parentValue = nivel1.value) {
        llenarSelectCategorias(nivel2, [], '-- Selecciona --');
        llenarSelectCategorias(nivel3, [], '-- Selecciona --');
        nivel2.disabled = true;
        nivel3.disabled = true;

        if (!parentValue) return;
        const datos = await obtenerCategoriasConcierge('2', parentValue);
        llenarSelectCategorias(nivel2, datos, '-- Selecciona --');
        nivel2.disabled = false;
    }

    async function cargarNivel3(parentValue = nivel2.value) {
        llenarSelectCategorias(nivel3, [], '-- Selecciona --');
        nivel3.disabled = true;

        if (!parentValue) return;
        const datos = await obtenerCategoriasConcierge('3', parentValue);
        llenarSelectCategorias(nivel3, datos, '-- Selecciona --');
        nivel3.disabled = false;
    }

    nivel1.addEventListener('change', async () => {
        try {
            await cargarNivel2(nivel1.value);
        } catch (error) {
            console.error(error);
            mostrarMensaje('externalizacionMessage', 'No se pudieron cargar las categorías de segundo nivel', 'error');
        }
    });

    nivel2.addEventListener('change', async () => {
        try {
            await cargarNivel3(nivel2.value);
        } catch (error) {
            console.error(error);
            mostrarMensaje('externalizacionMessage', 'No se pudieron cargar las categorías de tercer nivel', 'error');
        }
    });

    try {
        const datosNivel1 = await obtenerCategoriasConcierge('1');
        llenarSelectCategorias(nivel1, datosNivel1, '-- Selecciona --');
    } catch (error) {
        console.error(error);
        mostrarMensaje('externalizacionMessage', 'No se pudieron cargar las categorías.', 'error');
    }
}

function inicializarFormularioExternalizacion() {
    const form = document.getElementById('externalizacionForm');
    if (!form || form.dataset.inicializado === 'true') return;

    form.dataset.inicializado = 'true';
    inicializarCategoriasExternalizacion();

    const recargarBtn = document.getElementById('btnRecargarExternalizaciones');
    if (recargarBtn) {
        recargarBtn.addEventListener('click', () => cargarExternalizaciones(true));
    }

    const limpiarBtn = document.getElementById('btnLimpiarExternalizaciones');
    if (limpiarBtn) {
        limpiarBtn.addEventListener('click', () => eliminarTodasExternalizaciones());
    }

    form.addEventListener('reset', () => {
        setTimeout(() => {
            const nivel2 = form.querySelector('[name="external_categoria_nivel_2"]');
            const nivel3 = form.querySelector('[name="external_categoria_nivel_3"]');
            llenarSelectCategorias(nivel2, [], '-- Selecciona --');
            llenarSelectCategorias(nivel3, [], '-- Selecciona --');
            if (nivel2) nivel2.disabled = true;
            if (nivel3) nivel3.disabled = true;
        }, 0);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Guardando...';
            submitBtn.disabled = true;
        }

        try {
            const formData = new FormData(form);
            const response = await fetch('save_externalizacion.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'No se pudo guardar la solicitud');
            }

            mostrarMensaje('externalizacionMessage', result.message || 'Solicitud guardada en la base de datos', 'success');
            form.reset();
            await cargarExternalizaciones();
        } catch (error) {
            console.error(error);
            mostrarMensaje('externalizacionMessage', 'Error al guardar: ' + error.message, 'error');
        } finally {
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    });

    cargarExternalizaciones();
}

async function cargarExternalizaciones(mostrarConfirmacion = false) {
    const contenedor = document.getElementById('externalizacionesListado');
    if (!contenedor) return;

    contenedor.innerHTML = '<p class="text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i>Cargando solicitudes...</p>';

    try {
        const response = await fetch('get_externalizaciones.php');
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'No se pudieron cargar las solicitudes');
        }

        renderExternalizaciones(result.data || []);
        if (mostrarConfirmacion) {
            mostrarMensaje('externalizacionMessage', 'Listado actualizado desde la base de datos', 'success');
        }
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = `<p class="text-red-600">Error al cargar solicitudes: ${escapeHtmlSourcing(error.message)}</p>`;
    }
}

function renderExternalizaciones(solicitudes) {
    const contenedor = document.getElementById('externalizacionesListado');
    if (!contenedor) return;

    if (!solicitudes.length) {
        contenedor.innerHTML = '<p class="text-gray-500">Todavía no hay solicitudes registradas en la base de datos.</p>';
        return;
    }

    const filas = solicitudes.map(item => {
        const categorias = [
            item.categoria_nivel_1_texto,
            item.categoria_nivel_2_texto,
            item.categoria_nivel_3_texto
        ].filter(Boolean).join(' / ') || '-';

        return `
            <tr class="border-b hover:bg-gray-50 align-top">
                <td class="px-3 py-2 font-medium text-[#0b3b5b]">${escapeHtmlSourcing(item.producto_nombre || '')}</td>
                <td class="px-3 py-2">${escapeHtmlSourcing(item.cantidad_resumen || '-')}</td>
                <td class="px-3 py-2 capitalize">${escapeHtmlSourcing(item.prioridad || '-')}</td>
                <td class="px-3 py-2">${escapeHtmlSourcing(categorias)}</td>
                <td class="px-3 py-2">${escapeHtmlSourcing(item.fecha_requerida || '-')}</td>
                <td class="px-3 py-2 capitalize">${escapeHtmlSourcing(item.estado || '-')}</td>
                <td class="px-3 py-2">${escapeHtmlSourcing(item.created_at || '-')}</td>
                <td class="px-3 py-2 text-right">
                    <button type="button" class="text-red-600 hover:underline" data-external-delete="${escapeHtmlSourcing(item.id)}">
                        Eliminar
                    </button>
                </td>
            </tr>
            <tr class="border-b bg-gray-50">
                <td class="px-3 py-2 text-gray-600" colspan="8">
                    <strong>Descripción:</strong> ${escapeHtmlSourcing(item.descripcion || '-')}
                    ${item.ubicacion_entrega ? `<br><strong>Entrega:</strong> ${escapeHtmlSourcing(item.ubicacion_entrega)}` : ''}
                    ${item.presupuesto ? `<br><strong>Presupuesto:</strong> $${escapeHtmlSourcing(item.presupuesto)}` : ''}
                    ${item.observaciones ? `<br><strong>Observaciones:</strong> ${escapeHtmlSourcing(item.observaciones)}` : ''}
                </td>
            </tr>
        `;
    }).join('');

    contenedor.innerHTML = `
        <table class="min-w-full border border-gray-200 rounded overflow-hidden">
            <thead class="bg-gray-100 text-gray-700">
                <tr>
                    <th class="px-3 py-2 text-left">Producto / servicio</th>
                    <th class="px-3 py-2 text-left">Cantidad</th>
                    <th class="px-3 py-2 text-left">Prioridad</th>
                    <th class="px-3 py-2 text-left">Categorías</th>
                    <th class="px-3 py-2 text-left">Fecha requerida</th>
                    <th class="px-3 py-2 text-left">Estado</th>
                    <th class="px-3 py-2 text-left">Registro</th>
                    <th class="px-3 py-2 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody>${filas}</tbody>
        </table>
    `;

    contenedor.querySelectorAll('[data-external-delete]').forEach(btn => {
        btn.addEventListener('click', () => eliminarExternalizacion(btn.dataset.externalDelete));
    });
}

async function eliminarExternalizacion(id) {
    const confirmar = window.confirm('¿Eliminar esta solicitud de la base de datos?');
    if (!confirmar) return;

    try {
        const formData = new FormData();
        formData.append('id', id);

        const response = await fetch('delete_externalizacion.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'No se pudo eliminar');
        }

        mostrarMensaje('externalizacionMessage', result.message || 'Solicitud eliminada', 'success');
        await cargarExternalizaciones();
    } catch (error) {
        console.error(error);
        mostrarMensaje('externalizacionMessage', 'Error al eliminar: ' + error.message, 'error');
    }
}

async function eliminarTodasExternalizaciones() {
    const confirmar = window.confirm('Esto eliminará todas tus solicitudes de externalización guardadas en la base de datos. ¿Deseas continuar?');
    if (!confirmar) return;

    try {
        const formData = new FormData();
        formData.append('all', '1');

        const response = await fetch('delete_externalizacion.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'No se pudieron eliminar las solicitudes');
        }

        mostrarMensaje('externalizacionMessage', result.message || 'Solicitudes eliminadas', 'success');
        await cargarExternalizaciones();
    } catch (error) {
        console.error(error);
        mostrarMensaje('externalizacionMessage', 'Error al borrar solicitudes: ' + error.message, 'error');
    }
}

function escapeHtmlSourcing(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
