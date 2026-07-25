<?php
require_once 'config/db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit;
}

function crearTablaExternalizacionesSiNoExiste(mysqli $conn) {
    $sql = "CREATE TABLE IF NOT EXISTS externalizaciones_productos (
        id INT(11) NOT NULL AUTO_INCREMENT,
        user_id INT(11) NOT NULL,
        producto_nombre VARCHAR(255) NOT NULL,
        descripcion TEXT NOT NULL,
        cantidad DECIMAL(12,2) DEFAULT NULL,
        unidad VARCHAR(50) DEFAULT NULL,
        presupuesto DECIMAL(12,2) DEFAULT NULL,
        fecha_requerida DATE DEFAULT NULL,
        categoria_nivel_1 INT(11) DEFAULT NULL,
        categoria_nivel_2 INT(11) DEFAULT NULL,
        categoria_nivel_3 INT(11) DEFAULT NULL,
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

    if (!$conn->query($sql)) {
        throw new Exception('No se pudo preparar la tabla de externalizaciones: ' . $conn->error);
    }
}

try {
    $conn = getConnection();
    crearTablaExternalizacionesSiNoExiste($conn);

    $user_id = (int)$_SESSION['user_id'];
    $sql = "SELECT id, producto_nombre, descripcion, cantidad, unidad, presupuesto, fecha_requerida,
                   categoria_nivel_1, categoria_nivel_2, categoria_nivel_3, ubicacion_entrega,
                   prioridad, observaciones, estado, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS created_at
            FROM externalizaciones_productos
            WHERE user_id = ?
            ORDER BY id DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $cantidad = $row['cantidad'];
        $unidad = $row['unidad'];
        $row['cantidad_resumen'] = ($cantidad !== null && $cantidad !== '')
            ? rtrim(rtrim(number_format((float)$cantidad, 2, '.', ''), '0'), '.') . ($unidad ? ' ' . $unidad : '')
            : '-';
        $data[] = $row;
    }

    $stmt->close();
    $conn->close();

    echo json_encode(['success' => true, 'data' => $data]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
