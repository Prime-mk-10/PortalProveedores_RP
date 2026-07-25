# Cambios en búsqueda Concierge

Se ajustó la búsqueda de Concierge para que funcione aunque el usuario no seleccione categorías.

## Archivos modificados

- `search_concierge.php`
- `Scripts/modules/concierge.js`

## Problema corregido

El buscador enviaba categorías vacías como `0`, y el backend interpretaba ese `0` como una categoría real. Por eso la consulta agregaba filtros como:

```sql
p.categoria_nivel_1 = 0
```

Como no existen registros con esa categoría, no aparecían resultados aunque el proveedor tuviera palabras clave como `Software, Hardware, Computo`.

## Mejoras aplicadas

- Las categorías vacías ahora se envían como cadena vacía desde JavaScript.
- El backend también trata `0` como categoría vacía para evitar errores si llega desde otra vista.
- La búsqueda ahora separa términos por coma, punto y coma o salto de línea.
- Si se busca `Software, Hardware, Computo`, el sistema buscará coincidencias individuales por:
  - razón social
  - nombre comercial
  - descripción de actividad
  - palabras clave
  - correo
  - teléfono
  - nombre/código de categoría nivel 1
  - nombre/código de categoría nivel 2
  - nombre/código de categoría nivel 3
- Se eliminó un `console.log` de depuración.
- Se corrigió el campo de rol mostrado en la tabla.

## Ejemplo de uso esperado

Sin seleccionar categoría, escribir:

```text
Software, Hardware, Computo
```

Debe mostrar proveedores que tengan cualquiera de esas palabras en su perfil, descripción, palabras clave o categorías.
