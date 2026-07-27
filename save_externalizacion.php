<?php
require_once 'externalizaciones_db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

validarSesionExternalizacion();

$producto = externalizacionPostLimpio('producto_nombre');
$descripcion = externalizacionPostLimpio('descripcion');
$prioridad = externalizacionPostLimpio('prioridad') ?: 'media';

if (!$producto || !$descripcion) {
    echo json_encode(['success' => false, 'message' => 'Completa el producto/servicio y la descripción.']);
    exit;
}

if (!in_array($prioridad, ['baja', 'media', 'alta'], true)) {
    $prioridad = 'media';
}

$user_id = (int)$_SESSION['user_id'];
$cantidad = externalizacionNumeroONull('cantidad');
$unidad = externalizacionPostLimpio('unidad');
$presupuesto = externalizacionNumeroONull('presupuesto');
$fecha_requerida = externalizacionFechaONull('fecha_requerida');
$categoria_nivel_1 = externalizacionCategoriaONull('external_categoria_nivel_1');
$categoria_nivel_2 = externalizacionCategoriaONull('external_categoria_nivel_2');
$categoria_nivel_3 = externalizacionCategoriaONull('external_categoria_nivel_3');
$ubicacion_entrega = externalizacionPostLimpio('ubicacion_entrega');
$observaciones = externalizacionPostLimpio('observaciones');

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
        'issssssssssss',
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

    $id = $stmt->insert_id;
    $stmt->close();
    $conn->close();

    echo json_encode([
        'success' => true,
        'message' => 'Solicitud de externalización guardada en la base de datos.',
        'id' => $id
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
