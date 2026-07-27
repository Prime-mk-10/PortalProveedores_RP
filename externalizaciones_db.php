<?php
require_once 'config/db.php';

function crearTablaExternalizacionesSiNoExiste(mysqli $conn) {
    // Asegura que la conexión y la tabla trabajen con la misma intercalación
    // para evitar errores como: Illegal mix of collations.
    $conn->query("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");

    $sql = "CREATE TABLE IF NOT EXISTS externalizaciones_productos (
        id INT(11) NOT NULL AUTO_INCREMENT,
        user_id INT(11) NOT NULL,
        producto_nombre VARCHAR(255) NOT NULL,
        descripcion TEXT NOT NULL,
        cantidad DECIMAL(12,2) DEFAULT NULL,
        unidad VARCHAR(50) DEFAULT NULL,
        presupuesto DECIMAL(12,2) DEFAULT NULL,
        fecha_requerida DATE DEFAULT NULL,
        categoria_nivel_1 CHAR(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        categoria_nivel_2 CHAR(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        categoria_nivel_3 CHAR(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        ubicacion_entrega VARCHAR(255) DEFAULT NULL,
        prioridad ENUM('baja','media','alta') NOT NULL DEFAULT 'media',
        observaciones TEXT DEFAULT NULL,
        estado ENUM('pendiente','en_revision','externalizado','cancelado') NOT NULL DEFAULT 'pendiente',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_externalizaciones_user (user_id),
        KEY idx_externalizaciones_estado (estado),
        KEY idx_externalizaciones_cat_n1 (categoria_nivel_1),
        KEY idx_externalizaciones_cat_n2 (categoria_nivel_2),
        KEY idx_externalizaciones_cat_n3 (categoria_nivel_3),
        CONSTRAINT fk_externalizaciones_usuario FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    if (!$conn->query($sql)) {
        throw new Exception('No se pudo preparar la tabla de externalizaciones: ' . $conn->error);
    }

    asegurarCollationExternalizaciones($conn);
}

function asegurarCollationExternalizaciones(mysqli $conn) {
    $baseDatos = $conn->real_escape_string(DB_NAME);

    $sql = "SELECT COLUMN_NAME, COLLATION_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = '{$baseDatos}'
              AND TABLE_NAME = 'externalizaciones_productos'
              AND COLUMN_NAME IN ('categoria_nivel_1', 'categoria_nivel_2', 'categoria_nivel_3')";

    $resultado = $conn->query($sql);
    if (!$resultado) {
        throw new Exception('Error revisando collation de externalizaciones: ' . $conn->error);
    }

    $requiereAjuste = false;
    while ($fila = $resultado->fetch_assoc()) {
        if ($fila['COLLATION_NAME'] !== 'utf8mb4_unicode_ci') {
            $requiereAjuste = true;
            break;
        }
    }
    $resultado->free();

    if ($requiereAjuste) {
        $alter = "ALTER TABLE externalizaciones_productos
            DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            MODIFY categoria_nivel_1 CHAR(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
            MODIFY categoria_nivel_2 CHAR(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
            MODIFY categoria_nivel_3 CHAR(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL";

        if (!$conn->query($alter)) {
            throw new Exception('Error ajustando collation de externalizaciones: ' . $conn->error);
        }
    }
}

function externalizacionPostLimpio($key) {
    $valor = $_POST[$key] ?? null;
    if ($valor === null) return null;
    $valor = trim((string)$valor);
    return $valor === '' ? null : $valor;
}

function externalizacionNumeroONull($key) {
    $valor = externalizacionPostLimpio($key);
    if ($valor === null) return null;
    $valor = str_replace(',', '.', $valor);
    return is_numeric($valor) ? $valor : null;
}

function externalizacionCategoriaONull($key) {
    $valor = externalizacionPostLimpio($key);
    if ($valor === null) return null;
    return preg_match('/^[0-9]{5}$/', $valor) ? $valor : null;
}

function externalizacionFechaONull($key) {
    $valor = externalizacionPostLimpio($key);
    if ($valor === null) return null;
    return preg_match('/^\d{4}-\d{2}-\d{2}$/', $valor) ? $valor : null;
}

function validarSesionExternalizacion() {
    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        echo json_encode(['success' => false, 'message' => 'No autenticado']);
        exit;
    }
}
?>
