<?php
require_once 'externalizaciones_db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

validarSesionExternalizacion();

try {
    $conn = getConnection();
    crearTablaExternalizacionesSiNoExiste($conn);

    $user_id = (int)$_SESSION['user_id'];
    $eliminarTodo = ($_POST['all'] ?? '') === '1';

    if ($eliminarTodo) {
        $stmt = $conn->prepare('DELETE FROM externalizaciones_productos WHERE user_id = ?');
        if (!$stmt) throw new Exception('Error preparando eliminación: ' . $conn->error);
        $stmt->bind_param('i', $user_id);
        $mensaje = 'Tus solicitudes de externalización fueron eliminadas.';
    } else {
        $id = (int)($_POST['id'] ?? 0);
        if ($id <= 0) {
            echo json_encode(['success' => false, 'message' => 'ID requerido']);
            exit;
        }

        $stmt = $conn->prepare('DELETE FROM externalizaciones_productos WHERE id = ? AND user_id = ?');
        if (!$stmt) throw new Exception('Error preparando eliminación: ' . $conn->error);
        $stmt->bind_param('ii', $id, $user_id);
        $mensaje = 'Solicitud eliminada de la base de datos.';
    }

    if (!$stmt->execute()) {
        throw new Exception('Error al eliminar: ' . $stmt->error);
    }

    $stmt->close();
    $conn->close();

    echo json_encode(['success' => true, 'message' => $mensaje]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
