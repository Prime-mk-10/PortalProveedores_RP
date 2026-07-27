# Cambios visuales del Portal de Proveedores

Se aplicó una mejora visual general al portal sin modificar la lógica de negocio ni la conexión a base de datos que ya funcionaba.

## Cambios principales

- Nuevo estilo general tipo portal empresarial para proveedores.
- Fondo con degradados suaves y textura visual ligera.
- Barra superior más limpia, con estado de sesión activa.
- Sidebar oscuro institucional con módulos destacados y estado activo.
- Tarjetas modernas con sombras, bordes redondeados y microinteracciones.
- Formularios con campos más amplios, bordes suaves y enfoque visual.
- Tablas con encabezados más claros y mejor lectura.
- Pestañas de Sourcing con diseño más profesional.
- Dashboard rediseñado con tarjetas de indicadores y acceso rápido.
- Concierge rediseñado con sección hero, filtros y bloque de resultados.
- Solicitud rediseñada con el mismo estilo visual del portal.

## Archivos modificados

- `CSS/style.css`
- `Index.html`
- `partials/nav.html`
- `views/dashboard.html`
- `views/concierge.html`
- `views/perfil.html`
- `views/sourcing.html`
- `views/solicitud.html`
- `Scripts/core/navigation.js`
- `Scripts/core/router.js`

## Respaldo

Se dejó una copia del CSS anterior en:

- `CSS/style_original_antes_visual.css`

## Nota

La mejora es visual. No se cambiaron los PHP de guardado, consulta o eliminación de externalizaciones, por lo que la funcionalidad de base de datos se mantiene igual que en la versión corregida con collation.


## Ajuste de contraste en encabezados

Se corrigió el contraste de los títulos dentro de los banners principales (`.portal-hero`). El problema ocurría porque los estilos generales de `#main-content-container h1/h2` tenían mayor especificidad y sobreescribían el color blanco del hero. Ahora los títulos, subtítulos y etiquetas superiores del banner usan reglas más específicas para mantenerse legibles.
