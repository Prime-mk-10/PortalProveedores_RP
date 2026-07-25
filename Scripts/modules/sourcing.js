// ============================================================
// Vista Sourcing: pestañas Perfil / Externalizar producto
// Externalizar producto funciona como vista interactiva local
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
        mostrarMensaje('externalizacionMessage', 'No se pudieron cargar las categorías, pero puedes guardar la solicitud localmente.', 'error');
    }
}

function inicializarFormularioExternalizacion() {
    const form = document.getElementById('externalizacionForm');
    if (!form || form.dataset.inicializado === 'true') return;

    form.dataset.inicializado = 'true';
    inicializarCategoriasExternalizacion();

    const recargarBtn = document.getElementById('btnRecargarExternalizaciones');
    if (recargarBtn) {
        recargarBtn.addEventListener('click', () => cargarExternalizaciones());
    }

    const limpiarBtn = document.getElementById('btnLimpiarExternalizaciones');
    if (limpiarBtn) {
        limpiarBtn.addEventListener('click', () => {
            const confirmar = window.confirm('Esto borrará las solicitudes guardadas únicamente en este navegador. ¿Deseas continuar?');
            if (!confirmar) return;
            guardarExternalizacionesEnNavegador([]);
            cargarExternalizaciones();
            mostrarMensaje('externalizacionMessage', 'Solicitudes locales eliminadas correctamente', 'success');
        });
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

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Guardando...';
            submitBtn.disabled = true;
        }

        try {
            const solicitud = construirSolicitudExternalizacion(form);
            const solicitudes = obtenerExternalizacionesDelNavegador();
            solicitudes.unshift(solicitud);
            guardarExternalizacionesEnNavegador(solicitudes);

            mostrarMensaje('externalizacionMessage', 'Solicitud guardada en este navegador', 'success');
            form.reset();
            cargarExternalizaciones();
        } catch (error) {
            console.error(error);
            mostrarMensaje('externalizacionMessage', 'No se pudo guardar la solicitud local: ' + error.message, 'error');
        } finally {
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    });

    cargarExternalizaciones();
}

function construirSolicitudExternalizacion(form) {
    const formData = new FormData(form);
    const producto = (formData.get('producto_nombre') || '').toString().trim();
    const descripcion = (formData.get('descripcion') || '').toString().trim();

    if (!producto) throw new Error('captura el producto o servicio');
    if (!descripcion) throw new Error('captura la descripción o especificaciones');

    const cantidad = (formData.get('cantidad') || '').toString().trim();
    const unidad = (formData.get('unidad') || '').toString().trim();
    const presupuesto = (formData.get('presupuesto') || '').toString().trim();

    return {
        id: generarIdExternalizacion(),
        producto_nombre: producto,
        prioridad: (formData.get('prioridad') || 'media').toString(),
        descripcion,
        cantidad,
        unidad,
        cantidad_resumen: construirCantidadResumen(cantidad, unidad),
        presupuesto,
        fecha_requerida: (formData.get('fecha_requerida') || '').toString(),
        categoria_nivel_1: (formData.get('external_categoria_nivel_1') || '').toString(),
        categoria_nivel_2: (formData.get('external_categoria_nivel_2') || '').toString(),
        categoria_nivel_3: (formData.get('external_categoria_nivel_3') || '').toString(),
        categoria_nivel_1_texto: obtenerTextoSelect(form, 'external_categoria_nivel_1'),
        categoria_nivel_2_texto: obtenerTextoSelect(form, 'external_categoria_nivel_2'),
        categoria_nivel_3_texto: obtenerTextoSelect(form, 'external_categoria_nivel_3'),
        ubicacion_entrega: (formData.get('ubicacion_entrega') || '').toString().trim(),
        observaciones: (formData.get('observaciones') || '').toString().trim(),
        estado: 'Guardada localmente',
        created_at: new Date().toLocaleString('es-MX')
    };
}

function obtenerTextoSelect(form, name) {
    const select = form.querySelector(`[name="${name}"]`);
    if (!select || !select.value || !select.selectedOptions.length) return '';
    return select.selectedOptions[0].textContent.trim();
}

function construirCantidadResumen(cantidad, unidad) {
    if (cantidad && unidad) return `${cantidad} ${unidad}`;
    if (cantidad) return cantidad;
    if (unidad) return unidad;
    return '-';
}

function obtenerClaveExternalizaciones() {
    const usuario = userData && (userData.email || userData.id || userData.user_id)
        ? String(userData.email || userData.id || userData.user_id).trim()
        : 'anonimo';
    return `sourcing_externalizaciones_productos_${usuario}`;
}

function obtenerExternalizacionesDelNavegador() {
    try {
        const datos = localStorage.getItem(obtenerClaveExternalizaciones());
        const solicitudes = datos ? JSON.parse(datos) : [];
        return Array.isArray(solicitudes) ? solicitudes : [];
    } catch (error) {
        console.error('No se pudo leer localStorage:', error);
        return [];
    }
}

function guardarExternalizacionesEnNavegador(solicitudes) {
    try {
        localStorage.setItem(obtenerClaveExternalizaciones(), JSON.stringify(solicitudes));
    } catch (error) {
        throw new Error('el navegador no permitió guardar la información');
    }
}

function generarIdExternalizacion() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function eliminarExternalizacionLocal(id) {
    const solicitudes = obtenerExternalizacionesDelNavegador();
    const nuevasSolicitudes = solicitudes.filter(item => item.id !== id);
    guardarExternalizacionesEnNavegador(nuevasSolicitudes);
    cargarExternalizaciones();
    mostrarMensaje('externalizacionMessage', 'Solicitud eliminada del navegador', 'success');
}

function cargarExternalizaciones() {
    const contenedor = document.getElementById('externalizacionesListado');
    if (!contenedor) return;

    const solicitudes = obtenerExternalizacionesDelNavegador();
    if (solicitudes.length === 0) {
        contenedor.innerHTML = '<p class="text-gray-500">Todavía no hay solicitudes guardadas en este navegador.</p>';
        return;
    }

    const filas = solicitudes.map(item => {
        const categorias = [item.categoria_nivel_1_texto, item.categoria_nivel_2_texto, item.categoria_nivel_3_texto]
            .filter(Boolean)
            .join(' / ') || '-';

        return `
            <tr class="border-b hover:bg-gray-50 align-top">
                <td class="px-3 py-2 font-medium text-[#0b3b5b]">${escapeHtmlSourcing(item.producto_nombre || '')}</td>
                <td class="px-3 py-2">${escapeHtmlSourcing(item.cantidad_resumen || '-')}</td>
                <td class="px-3 py-2 capitalize">${escapeHtmlSourcing(item.prioridad || '-')}</td>
                <td class="px-3 py-2">${escapeHtmlSourcing(categorias)}</td>
                <td class="px-3 py-2">${escapeHtmlSourcing(item.fecha_requerida || '-')}</td>
                <td class="px-3 py-2">${escapeHtmlSourcing(item.created_at || '-')}</td>
                <td class="px-3 py-2 text-right">
                    <button type="button" class="text-red-600 hover:underline" data-external-delete="${escapeHtmlSourcing(item.id)}">
                        Eliminar
                    </button>
                </td>
            </tr>
            <tr class="border-b bg-gray-50">
                <td class="px-3 py-2 text-gray-600" colspan="7">
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
                    <th class="px-3 py-2 text-left">Guardado</th>
                    <th class="px-3 py-2 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody>${filas}</tbody>
        </table>
    `;

    contenedor.querySelectorAll('[data-external-delete]').forEach(btn => {
        btn.addEventListener('click', () => {
            const confirmar = window.confirm('¿Eliminar esta solicitud guardada en el navegador?');
            if (!confirmar) return;
            eliminarExternalizacionLocal(btn.dataset.externalDelete);
        });
    });
}

function escapeHtmlSourcing(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
