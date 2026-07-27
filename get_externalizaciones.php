<?php
require_once 'externalizaciones_db.php';

header('Content-Type: application/json; charset=utf-8');

validarSesionExternalizacion();

try {
    $conn = getConnection();
    crearTablaExternalizacionesSiNoExiste($conn);

    $user_id = (int)$_SESSION['user_id'];
    $sql = "SELECT ep.id, ep.producto_nombre, ep.descripcion, ep.cantidad, ep.unidad, ep.presupuesto,
                   ep.fecha_requerida, ep.categoria_nivel_1, ep.categoria_nivel_2, ep.categoria_nivel_3,
                   ep.ubicacion_entrega, ep.prioridad, ep.observaciones, ep.estado,
                   DATE_FORMAT(ep.created_at, '%Y-%m-%d %H:%i') AS created_at,
                   CASE WHEN c1.codigo IS NOT NULL THEN CONCAT(c1.codigo, ' - ', c1.nombre) ELSE NULL END AS categoria_nivel_1_texto,
                   CASE WHEN c2.codigo IS NOT NULL THEN CONCAT(c2.codigo, ' - ', c2.nombre) ELSE NULL END AS categoria_nivel_2_texto,
                   CASE WHEN c3.codigo IS NOT NULL THEN CONCAT(c3.codigo, ' - ', c3.nombre) ELSE NULL END AS categoria_nivel_3_texto
            FROM externalizaciones_productos ep
            LEFT JOIN categorias_nivel_1 c1 ON c1.codigo COLLATE utf8mb4_unicode_ci = ep.categoria_nivel_1 COLLATE utf8mb4_unicode_ci
            LEFT JOIN categorias_nivel_2 c2 ON c2.codigo COLLATE utf8mb4_unicode_ci = ep.categoria_nivel_2 COLLATE utf8mb4_unicode_ci
            LEFT JOIN categorias_nivel_3 c3 ON c3.codigo COLLATE utf8mb4_unicode_ci = ep.categoria_nivel_3 COLLATE utf8mb4_unicode_ci
            WHERE ep.user_id = ?
            ORDER BY ep.id DESC";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Error preparando consulta: ' . $conn->error);
    }

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
