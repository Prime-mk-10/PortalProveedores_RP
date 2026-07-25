-- Tabla para registrar solicitudes de externalización desde la vista Sourcing
-- Puede ejecutarse en la base de datos portal_gestion si se desea crear la tabla manualmente.

CREATE TABLE IF NOT EXISTS `externalizaciones_productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `producto_nombre` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `cantidad` decimal(12,2) DEFAULT NULL,
  `unidad` varchar(50) DEFAULT NULL,
  `presupuesto` decimal(12,2) DEFAULT NULL,
  `fecha_requerida` date DEFAULT NULL,
  `categoria_nivel_1` int(11) DEFAULT NULL,
  `categoria_nivel_2` int(11) DEFAULT NULL,
  `categoria_nivel_3` int(11) DEFAULT NULL,
  `ubicacion_entrega` varchar(255) DEFAULT NULL,
  `prioridad` enum('baja','media','alta') NOT NULL DEFAULT 'media',
  `observaciones` text DEFAULT NULL,
  `estado` enum('pendiente','en_revision','externalizado','cancelado') NOT NULL DEFAULT 'pendiente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_externalizaciones_user` (`user_id`),
  KEY `idx_externalizaciones_estado` (`estado`),
  KEY `idx_externalizaciones_cat_n1` (`categoria_nivel_1`),
  KEY `idx_externalizaciones_cat_n2` (`categoria_nivel_2`),
  KEY `idx_externalizaciones_cat_n3` (`categoria_nivel_3`),
  CONSTRAINT `fk_externalizaciones_usuario` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
