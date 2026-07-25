<?php
require_once 'config/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

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

function postLimpio($key) {
    $valor = $_POST[$key] ?? null;
    if ($valor === null) return null;
    $valor = trim((string)$valor);
    return $valor === '' ? null : $valor;
}

function numeroONull($key) {
    $valor = postLimpio($key);
    if ($valor === null) return null;
    return is_numeric($valor) ? (float)$valor : null;
}

function enteroONull($key) {
    $valor = postLimpio($key);
    if ($valor === null) return null;
    return ctype_digit($valor) ? (int)$valor : null;
}

$producto = postLimpio('producto_nombre');
$descripcion = postLimpio('descripcion');
$prioridad = postLimpio('prioridad') ?: 'media';

if (!$producto || !$descripcion) {
    echo json_encode(['success' => false, 'message' => 'Completa el producto/servicio y la descripción.']);
    exit;
}

if (!in_array($prioridad, ['baja', 'media', 'alta'])) {
    $prioridad = 'media';
}

$user_id = (int)$_SESSION['user_id'];
$cantidad = numeroONull('cantidad');
$unidad = postLimpio('unidad');
$presupuesto = numeroONull('presupuesto');
$fecha_requerida = postLimpio('fecha_requerida');
$categoria_nivel_1 = enteroONull('external_categoria_nivel_1');
$categoria_nivel_2 = enteroONull('external_categoria_nivel_2');
$categoria_nivel_3 = enteroONull('external_categoria_nivel_3');
$ubicacion_entrega = postLimpio('ubicacion_entrega');
$observaciones = postLimpio('observaciones');

try {
    $conn = getConnection();
    crearTablaExternalizacionesSiNoExiste($conn);

    $sql = "INSERT INTO externalizaciones_productos
        (user_id, producto_nombre, descripcion, cantidad, unidad, presupuesto, fecha_requerida,
         categoria_nivel_1, categoria_nivel_2, categoria_nivel_3, ubicacion_entrega, prioridad, observaciones)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Error preparando la solicitud: ' . $conn->error);
    }

    $stmt->bind_param(
        'issdsdsiiisss',
        $user_id,
        $producto,
        $descripcion,
        $cantidad,
        $unidad,
        $presupuesto,
        $fecha_requerida,
        $categoria_nivel_1,
        $categoria_nivel_2,
        $categoria_nivel_3,
        $ubicacion_entrega,
        $prioridad,
        $observaciones
    );

    if (!$stmt->execute()) {
        throw new Exception('Error al guardar: ' . $stmt->error);
    }

    $stmt->close();
    $conn->close();

    echo json_encode(['success' => true, 'message' => 'Solicitud de externalización registrada correctamente.']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
