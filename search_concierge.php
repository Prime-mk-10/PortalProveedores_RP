<?php
require_once 'config/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit;
}

$q = trim($_GET['q'] ?? '');
$nivel1 = normalizarFiltroCategoria($_GET['nivel1'] ?? '');
$nivel2 = normalizarFiltroCategoria($_GET['nivel2'] ?? '');
$nivel3 = normalizarFiltroCategoria($_GET['nivel3'] ?? '');

$where = [];
$params = [];
$types = '';

function normalizarFiltroCategoria($valor) {
    $valor = trim((string) $valor);
    return ($valor === '' || $valor === '0') ? '' : $valor;
}

function agregarFiltroCategoria(&$where, &$params, &$types, $campo, $valor) {
    if ($valor === '') return;

    $where[] = "$campo = ?";
    $params[] = intval($valor);
    $types .= 'i';
}

function obtenerTerminosBusqueda($q) {
    $q = trim($q);
    if ($q === '') return [];

    // Permite buscar por listas como: Software, Hardware, Computo
    $partes = preg_split('/[,;\r\n\t]+/', $q);
    $terminos = [];

    foreach ($partes as $parte) {
        $parte = trim(preg_replace('/\s+/', ' ', $parte));
        if ($parte !== '' && strlen($parte) >= 2) {
            $terminos[strtolower($parte)] = $parte;
        }
    }

    if (empty($terminos)) {
        $terminos[strtolower($q)] = $q;
    }

    return array_values($terminos);
}

agregarFiltroCategoria($where, $params, $types, 'p.categoria_nivel_1', $nivel1);
agregarFiltroCategoria($where, $params, $types, 'p.categoria_nivel_2', $nivel2);
agregarFiltroCategoria($where, $params, $types, 'p.categoria_nivel_3', $nivel3);

$terminosBusqueda = obtenerTerminosBusqueda($q);

if (!empty($terminosBusqueda)) {
    $bloquesBusqueda = [];

    foreach ($terminosBusqueda as $termino) {
        $like = '%' . $termino . '%';

        $bloquesBusqueda[] = "(
            p.razon_social LIKE ?
            OR p.nombre_comercial LIKE ?
            OR p.descripcion_actividad LIKE ?
            OR p.palabras_clave LIKE ?
            OR u.email LIKE ?
            OR u.telefono LIKE ?
            OR c1.nombre LIKE ?
            OR c2.nombre LIKE ?
            OR c3.nombre LIKE ?
            OR c1.codigo LIKE ?
            OR c2.codigo LIKE ?
            OR c3.codigo LIKE ?
        )";

        for ($i = 0; $i < 12; $i++) {
            $params[] = $like;
            $types .= 's';
        }
    }

    // Con OR basta que coincida una palabra de la lista para mostrar el proveedor.
    $where[] = '(' . implode(' OR ', $bloquesBusqueda) . ')';

    $where[] = "(
        COALESCE(p.descripcion_actividad, '') <> ''
        OR COALESCE(p.palabras_clave, '') <> ''
        OR p.categoria_nivel_1 IS NOT NULL
        OR p.categoria_nivel_2 IS NOT NULL
        OR p.categoria_nivel_3 IS NOT NULL
    )";
}

if (empty($where)) {
    echo json_encode([
        'success' => true,
        'data' => [],
        'message' => 'Ingresa una búsqueda o selecciona una categoría.'
    ]);
    exit;
}

$conn = getConnection();

$sql = "
SELECT
    p.id,
    p.razon_social,
    p.nombre_comercial,
    p.descripcion_actividad,
    p.palabras_clave,
    p.tipo_proveedor,

    u.email AS email,
    u.email AS correo,
    u.telefono AS telefono,

    r.nombre AS rol,

    c1.codigo AS nivel1_codigo,
    c1.nombre AS nivel1_nombre,
    c2.codigo AS nivel2_codigo,
    c2.nombre AS nivel2_nombre,
    c3.codigo AS nivel3_codigo,
    c3.nombre AS nivel3_nombre,

    CONCAT_WS(' / ',
        CONCAT(c1.codigo, ' - ', c1.nombre),
        CONCAT(c2.codigo, ' - ', c2.nombre),
        CONCAT(c3.codigo, ' - ', c3.nombre)
    ) AS categoria_texto

FROM proveedores p
INNER JOIN usuarios u ON p.user_id = u.id
INNER JOIN roles r ON u.rol_id = r.id
LEFT JOIN categorias_nivel_1 c1 ON p.categoria_nivel_1 = c1.codigo
LEFT JOIN categorias_nivel_2 c2 ON p.categoria_nivel_2 = c2.codigo
LEFT JOIN categorias_nivel_3 c3 ON p.categoria_nivel_3 = c3.codigo
WHERE " . implode(' AND ', $where) . "
ORDER BY 
    CASE 
        WHEN p.categoria_nivel_3 IS NOT NULL THEN 1
        WHEN COALESCE(p.descripcion_actividad, '') <> '' THEN 2
        WHEN COALESCE(p.palabras_clave, '') <> '' THEN 3
        ELSE 4
    END,
    p.razon_social ASC
LIMIT 100
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Error preparando consulta: ' . $conn->error
    ]);
    $conn->close();
    exit;
}

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    'success' => true,
    'data' => $data,
    'count' => count($data)
]);

$stmt->close();
$conn->close();
?>