-- ============================================================
-- Merakiies E-Commerce Database — Esquema Normalizado (3FN)
-- Versión: 2.0
-- Fecha: 2026-07-18
-- ============================================================
-- Este script es idempotente: usa IF NOT EXISTS para tablas
-- y se ejecuta automáticamente desde server.js al iniciar.
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- ============================================================
-- 1. CATEGORIES — Categorías de productos
-- ============================================================

CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `slug` VARCHAR(60) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image_url` VARCHAR(255) DEFAULT NULL,
  `display_order` INT(11) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `display_order`, `is_active`) VALUES
(1, 'Galletas Clásicas', 'galletas-clasicas', 'El clásico que nunca falla. Nuestras galletas más queridas y tradicionales.', 1, 1),
(2, 'Ediciones Especiales', 'ediciones-especiales', 'Sabores únicos para paladares aventureros.', 2, 1),
(3, 'Línea Premium & Rellenas', 'linea-premium-rellenas', 'Galletas rellenas estilo New York Bakery con ingredientes de primera.', 3, 1),
(4, 'Frutal & Fresca', 'frutal-fresca', 'Opciones ligeras y cítricas con ingredientes frescos y de temporada.', 4, 1),
(5, 'Bienestar & Balance', 'bienestar-balance', 'Opciones saludables: keto, veganas y sin azúcar añadida.', 5, 1),
(6, 'Extras & Dips', 'extras-dips', 'Acompañantes ideales: dips de chocolate, arequipe y bebidas.', 6, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ============================================================
-- 2. PRODUCTS — Catálogo de productos
-- ============================================================

CREATE TABLE IF NOT EXISTS `products` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL,
  `category_id` INT(11) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `image_url` VARCHAR(255) DEFAULT NULL,
  `stock` INT(11) DEFAULT 100,
  `is_active` TINYINT(1) DEFAULT 1,
  `badge` VARCHAR(30) DEFAULT NULL,
  `sales_count` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_products_slug` (`slug`),
  KEY `idx_products_category` (`category_id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `products` (`id`, `name`, `slug`, `category_id`, `description`, `price`, `image_url`, `stock`, `badge`) VALUES
-- Galletas Clásicas (category_id = 1)
(1, 'Galleta Choco-Chips', 'galleta-choco-chips', 1, 'El clásico que nunca falla. Una masa doradita, horneada a la perfección, con bordes crujientes, un centro suave y abundantes chispas de chocolate derretidas en cada bocado.', 2.50, '/media/galleta_choco_chips.png', 100, 'Más Vendido'),
(2, 'Galleta Dandy', 'galleta-dandy', 1, 'Divertida y llena de color. Nuestra masa tradicional repleta de crujientes grageas de chocolate con leche que le dan un toque extra de textura y alegría.', 2.50, '/media/galleta_dandy.png', 100, NULL),
(3, 'Galleta Festival', 'galleta-festival', 1, 'Una verdadera fiesta en cada mordisco. Suave galleta de vainilla cubierta y horneada con una explosión de chispas de colores arcoíris.', 2.50, '/media/galleta_festival.png', 100, NULL),
(4, 'Galleta Doble Chocolate', 'galleta-doble-chocolate', 1, 'Intensa y decadente. Elaborada con una rica base de cacao oscuro y trozos generosos de chocolate puro. Diseñada para los verdaderos amantes del cacao.', 2.75, '/media/galleta_doble_chocolate.png', 100, NULL),

-- Ediciones Especiales (category_id = 2)
(5, 'Galleta Red Velvet', 'galleta-red-velvet', 2, 'Suave y aterciopelada galleta de color rojo intenso con un ligero toque a cacao, mezclada y coronada con chispas de chocolate blanco cremoso.', 3.00, '/media/galleta_red_velvet.png', 80, 'Nuevo'),
(6, 'Galleta Macadamia Blanca', 'galleta-macadamia-blanca', 2, 'Una combinación elegante y equilibrada. Masa avainillada artesanal con trozos crujientes de nuez de macadamia tostada y chispas de chocolate blanco.', 3.00, '/media/galleta_macadamia_blanca.png', 80, NULL),
(7, 'Galleta Corazón de Avellana', 'galleta-corazon-avellana', 2, 'Nuestra masa clásica con un centro sorpresa: un relleno fundido y generoso de crema de avellanas y cacao (tipo Nutella) que se derrama lentamente al partirla.', 3.50, '/media/galleta_corazon_avellana.png', 80, NULL),
(8, 'Galleta Avena y Pasas (Toque Rústico)', 'galleta-avena-pasas', 2, 'Para quienes buscan un bocado reconfortante. Llena de textura gracias a la avena integral, un toque de canela y pasas dulces e hidratadas.', 2.50, 'https://images.pexels.com/photos/89690/pexels-photo-89690.jpeg', 80, NULL),

-- Línea Premium & Rellenas (category_id = 3)
(9, 'Galleta Red Velvet Real', 'galleta-red-velvet-real', 3, 'Masa aterciopelada de color rojo intenso con un sutil toque de cacao, rellena con un corazón cremoso de auténtico chocolate blanco y queso crema fundido.', 4.00, 'https://images.pexels.com/photos/20558713/pexels-photo-20558713.jpeg', 60, 'Premium'),
(10, 'Galleta Lava de Nutella', 'galleta-lava-nutella', 3, 'Base clásica con chispas de chocolate negro, rellena con un núcleo abundante de crema de avellanas que se desborda al morderla.', 4.00, 'https://images.pexels.com/photos/28857440/pexels-photo-28857440.jpeg', 60, NULL),
(11, 'Galleta Lotus Biscoff', 'galleta-lotus-biscoff', 3, 'Masa especiada con canela, rellena de una suave crema de galleta Lotus y coronada con trozos crujientes de la misma galleta belga.', 4.50, 'https://images.pexels.com/photos/35672897/pexels-photo-35672897.jpeg', 60, NULL),
(12, 'Galleta Pistacho Dulce', 'galleta-pistacho-dulce', 3, 'Galleta de vainilla suave, rellena con una densa y rica pasta artesanal de pistacho tostado, decorada con una pizca de sal marina para balancear sabores.', 4.50, 'https://images.pexels.com/photos/15590648/pexels-photo-15590648.jpeg', 60, NULL),

-- Frutal & Fresca (category_id = 4)
(13, 'Galleta Limón & Amapola', 'galleta-limon-amapola', 4, 'Una opción ligera y cítrica. Masa suave con ralladura fresca de limón caribeño, un toque de glaseado translúcido y semillas de amapola para un sutil toque crujiente.', 3.00, 'https://images.pexels.com/photos/7633890/pexels-photo-7633890.jpeg', 70, NULL),
(14, 'Galleta de Manzana y Canela', 'galleta-manzana-canela', 4, 'Base rústica de avena con trozos de manzana caramelizada al horno y un aroma intenso a canela. Sabe a un pie de manzana hecho galleta.', 3.00, 'https://images.pexels.com/photos/89690/pexels-photo-89690.jpeg', 70, NULL),
(15, 'Galleta Choco-Frambuesa', 'galleta-choco-frambuesa', 4, 'Masa de cacao oscuro intenso con un centro de mermelada artesanal de frambuesa ácida, logrando el equilibrio perfecto entre dulce y frutal.', 3.50, 'https://images.pexels.com/photos/20558713/pexels-photo-20558713.jpeg', 70, NULL),

-- Bienestar & Balance (category_id = 5)
(16, 'Galleta Keto Choco-Almendra', 'galleta-keto-choco-almendra', 5, 'Elaborada con harina de almendras, endulzada con eritritol y repleta de chispas de chocolate sin azúcar. Libre de culpa, baja en carbohidratos.', 4.00, 'https://images.pexels.com/photos/35672897/pexels-photo-35672897.jpeg', 50, NULL),
(17, 'Galleta Vegana de Avena y Plátano', 'galleta-vegana-avena-platano', 5, 'Sin productos de origen animal. Endulzada naturalmente con puré de plátano maduro, avena en hojuelas, nueces trituradas y chispas de chocolate oscuro apto para veganos.', 3.50, 'https://images.pexels.com/photos/28857440/pexels-photo-28857440.jpeg', 50, NULL),

-- Extras & Dips (category_id = 6)
(18, 'Chocolate Fundido Tradicional', 'chocolate-fundido-tradicional', 6, 'El clásico fudge espeso de alta calidad.', 1.50, 'https://images.pexels.com/photos/15590648/pexels-photo-15590648.jpeg', 200, NULL),
(19, 'Arequipe Artesanal', 'arequipe-artesanal', 6, 'Dulce de leche denso y cremoso para untar.', 1.50, '/media/arequipe_artesanal.png', 200, NULL),
(20, 'Crema de Chocolate Blanco', 'crema-chocolate-blanco', 6, 'Fluida, dulce y con un toque avainillado.', 1.50, 'https://images.pexels.com/photos/20558713/pexels-photo-20558713.jpeg', 200, NULL),
(21, 'Leche Fría Tradicional', 'leche-fria-tradicional', 6, 'El maridaje perfecto para una galleta recién horneada.', 1.00, 'https://images.pexels.com/photos/7633890/pexels-photo-7633890.jpeg', 200, NULL),
(22, 'Café Latte Frío', 'cafe-latte-frio', 6, 'Elaborado con granos seleccionados, ideal para el bocado de la tarde.', 2.00, 'https://images.pexels.com/photos/28857440/pexels-photo-28857440.jpeg', 200, NULL)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ============================================================
-- 3. USERS — Usuarios registrados
-- ============================================================

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `cedula` VARCHAR(20) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `card_type` ENUM('credit', 'debit') DEFAULT NULL,
  `card_last_four` VARCHAR(4) DEFAULT NULL,
  `card_holder` VARCHAR(100) DEFAULT NULL,
  `card_expiry` VARCHAR(5) DEFAULT NULL,
  `role` ENUM('customer', 'admin') DEFAULT 'customer',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Cuentas de prueba por defecto
-- NOTA: Los hashes reales se generan automáticamente en server.js al primer arranque
INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password_hash`, `phone`, `cedula`, `address`, `card_type`, `card_last_four`, `card_holder`, `card_expiry`, `role`) VALUES
(1, 'Admin', 'Prueba', 'admin@gmail.com', '$2a$10$placeholder_hash_change_in_production', '+57 300 000 0001', NULL, NULL, NULL, NULL, NULL, NULL, 'admin'),
(2, 'Cliente', 'Prueba', 'cliente@gmail.com', '$2a$10$placeholder_hash_change_in_production', '+57 300 000 0002', '1234567890', 'Calle Ficticia 123, Caracas', 'debit', '4242', 'Cliente Prueba', '12/28', 'customer')
ON DUPLICATE KEY UPDATE `first_name` = VALUES(`first_name`);

-- ============================================================
-- 4. ADDRESSES — Direcciones de entrega de usuarios
-- ============================================================

CREATE TABLE IF NOT EXISTS `addresses` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `label` VARCHAR(30) DEFAULT 'Casa',
  `address_line` TEXT NOT NULL,
  `city` VARCHAR(60) NOT NULL,
  `state` VARCHAR(60) DEFAULT NULL,
  `zip_code` VARCHAR(10) DEFAULT NULL,
  `is_default` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_addresses_user` (`user_id`),
  CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================
-- 5. CART_ITEMS — Carrito de compras (reemplaza la tabla 'cart')
-- Soporta tanto user_id (usuarios registrados) como
-- session_id (invitados/guest checkout) para compatibilidad.
-- ============================================================

CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) DEFAULT NULL,
  `session_id` VARCHAR(100) DEFAULT NULL,
  `product_id` INT(11) NOT NULL,
  `quantity` INT(11) DEFAULT 1,
  `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cart_user_product` (`user_id`, `product_id`),
  UNIQUE KEY `uq_cart_session_product` (`session_id`, `product_id`),
  KEY `idx_cart_product` (`product_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_cart_owner` CHECK (`user_id` IS NOT NULL OR `session_id` IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================
-- 6. ORDERS — Pedidos / Órdenes de compra
-- ============================================================

CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `address_id` INT(11) DEFAULT NULL,
  `order_number` VARCHAR(20) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `delivery_fee` DECIMAL(10,2) DEFAULT 0.00,
  `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_orders_number` (`order_number`),
  KEY `idx_orders_user` (`user_id`),
  KEY `idx_orders_status` (`status`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_address` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================
-- 7. ORDER_ITEMS — Detalle de productos por orden
--    unit_price es un snapshot del precio al momento de compra
-- ============================================================

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) NOT NULL,
  `product_id` INT(11) NOT NULL,
  `quantity` INT(11) NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order` (`order_id`),
  KEY `idx_order_items_product` (`product_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================
-- 8. PAYMENTS — Registro de pagos / Pasarela de pago
-- ============================================================

CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) NOT NULL,
  `method` ENUM('card', 'transfer', 'cash', 'paypal', 'mercadopago', 'nequi') DEFAULT 'cash',
  `transaction_id` VARCHAR(100) DEFAULT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  `gateway_response` TEXT DEFAULT NULL,
  `paid_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_payments_order` (`order_id`),
  KEY `idx_payments_status` (`status`),
  CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================
-- 9. CONTACT_MESSAGES — Formulario de contacto
--    Mapea los campos de contacto.html:
--    full_name  → "Nombre Completo"
--    email      → "Correo Electrónico"
--    phone      → "Teléfono / WhatsApp"
--    message    → "Tu Mensaje"
-- ============================================================

CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contact_read` (`is_read`),
  KEY `idx_contact_date` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================
-- 10. DELIVERY_CONFIG — Configuración del repartidor / delivery
-- ============================================================

CREATE TABLE IF NOT EXISTS `delivery_config` (
  `id` INT(11) NOT NULL DEFAULT 1,
  `whatsapp_number` VARCHAR(20) NOT NULL DEFAULT '+58 000 000 0000',
  `delivery_person_name` VARCHAR(100) DEFAULT 'Delivery Merakiies',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `delivery_config` (`id`, `whatsapp_number`, `delivery_person_name`) VALUES
(1, '+58 412 000 0000', 'Repartidor Merakiies')
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
