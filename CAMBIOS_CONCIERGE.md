# Cambios realizados: ayuda para categorías Concierge

Se agregaron botones de ayuda en la sección donde el usuario selecciona las categorías Concierge del registro/perfil.

## Archivos modificados

- `Scripts/modules/campos_proveedor.js`
  - Agrega el bloque visual con el botón "Elegir opción de ayuda" para formularios dinámicos de proveedor.

- `views/perfil.html`
  - Agrega el mismo bloque visual para el formulario estático de Alta General.

- `Scripts/modules/proveedor.js`
  - Agrega la lógica de los botones:
    - "Buscar en Concierge": muestra una advertencia de riesgo y redirige a la vista `Concierge` si el usuario acepta.
    - "Asistencia por WhatsApp": muestra una advertencia de costo y abre WhatsApp si el usuario acepta.

## Configurar número de WhatsApp

En `Scripts/modules/proveedor.js`, cambia esta línea por el número real de asistencia, con lada del país, sin espacios ni signos:

```js
const WHATSAPP_CONCIERGE_NUMERO = '';
```

Ejemplo para México:

```js
const WHATSAPP_CONCIERGE_NUMERO = '5215551234567';
```

Si se deja vacío, WhatsApp abrirá con el mensaje sugerido para que el usuario elija el contacto manualmente.
