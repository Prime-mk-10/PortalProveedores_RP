# Cambios en Sourcing

Se actualizó el apartado **Sourcing** para manejar dos pestañas:

1. **Perfil**
2. **Externalizar producto**

## Externalizar producto

La vista de externalización ahora guarda las solicitudes en la base de datos MySQL, dentro de la tabla:

```sql
externalizaciones_productos
```

La información queda asociada al usuario autenticado mediante `user_id`, tomado de `$_SESSION['user_id']`.

## Archivos modificados/agregados

- `views/sourcing.html`
- `Scripts/modules/sourcing.js`
- `externalizaciones_db.php`
- `save_externalizacion.php`
- `get_externalizaciones.php`
- `delete_externalizacion.php`
- `sql/externalizaciones_productos.sql`
- `SQLDATABASE/externalizaciones_productos.sql`

## Funcionamiento

- Al guardar el formulario, se envía por `fetch` a `save_externalizacion.php`.
- El listado se carga desde `get_externalizaciones.php`.
- Las solicitudes se pueden eliminar con `delete_externalizacion.php`.
- Los PHP crean automáticamente la tabla con `CREATE TABLE IF NOT EXISTS` si aún no existe.

## SQL manual

Si prefieres crear la tabla desde phpMyAdmin, ejecuta:

```text
sql/externalizaciones_productos.sql
```

o la copia equivalente:

```text
SQLDATABASE/externalizaciones_productos.sql
```


## Corrección de intercalación / collation

Se corrigió el error:

`Illegal mix of collations (utf8mb4_unicode_ci,IMPLICIT) and (utf8mb4_general_ci,IMPLICIT) for operation '='`

La tabla `externalizaciones_productos` ahora usa `utf8mb4_unicode_ci` en sus campos de categoría y el listado fuerza la misma intercalación al relacionar con `categorias_nivel_1`, `categorias_nivel_2` y `categorias_nivel_3`.

Si la tabla ya existía antes de esta corrección, puedes ejecutar el `ALTER TABLE` incluido al final de `sql/externalizaciones_productos.sql` o dejar que el helper PHP intente ajustar automáticamente esos campos.
