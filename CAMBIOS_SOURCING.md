# Cambios en Sourcing

## Objetivo
Separar el apartado de **Sourcing** en dos pestañas y dejar **Externalizar producto** como una vista interactiva sin crear tablas ni guardar datos en la base de datos.

## Pestañas agregadas

1. **Perfil**
   - Conserva el formulario original del perfil/proveedor.

2. **Externalizar producto**
   - Permite capturar productos o servicios a externalizar.
   - Guarda las solicitudes únicamente en el navegador mediante `localStorage`.
   - Muestra las solicitudes guardadas en una tabla interactiva.
   - Permite eliminar solicitudes individuales.
   - Permite borrar todas las solicitudes locales.

## Archivos modificados

- `views/sourcing.html`
- `Scripts/modules/sourcing.js`
- `Scripts/core/navigation.js`
- `Scripts/core/router.js`
- `Index.html`

## Importante

Ya no se usan estos archivos para Externalizar producto:

- `save_externalizacion.php`
- `get_externalizaciones.php`
- `sql/externalizaciones_productos.sql`
- `SQLDATABASE/externalizaciones_productos.sql`

La información de Externalizar producto queda guardada solo en el navegador donde se captura. Si se borra la caché/datos del navegador, también se perderán las solicitudes guardadas localmente.
