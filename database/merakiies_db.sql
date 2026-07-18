-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-07-2026 a las 15:33:54
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `merakiies_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `session_id` varchar(100) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Clásicas'),
(2, 'Ediciones Especiales'),
(3, 'Rellenas Premium'),
(4, 'Frutal & Fresca'),
(5, 'Bienestar & Balance'),
(6, 'Acompañantes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `name`, `category_id`, `description`, `price`, `image_url`) VALUES
(1, 'Galleta Choco-Chips', 1, 'El clásico que nunca falla. Una masa doradita, horneada a la perfección, con bordes crujientes, un centro suave y abundantes chispas de chocolate derretidas en cada bocado.', 2.50, '/media/galleta_choco_chips.png'),
(2, 'Galleta Dandy', 1, 'Divertida y llena de color. Nuestra masa tradicional repleta de crujientes grageas de chocolate con leche que le dan un toque extra de textura y alegría.', 2.50, '/media/galleta_dandy.png'),
(3, 'Galleta Festival', 1, 'Una verdadera fiesta en cada mordisco. Suave galleta de vainilla cubierta y horneada con una explosión de chispas de colores arcoíris.', 2.50, '/media/galleta_festival.png'),
(4, 'Galleta Doble Chocolate', 1, 'Intensa y decadente. Elaborada con una rica base de cacao oscuro y trozos generosos de chocolate puro. Diseñada para los verdaderos amantes del cacao.', 2.75, '/media/galleta_doble_chocolate.png'),
(5, 'Galleta Red Velvet', 2, 'Suave y aterciopelada galleta de color rojo intenso con un ligero toque a cacao, mezclada y coronada con chispas de chocolate blanco cremoso.', 3.00, '/media/galleta_red_velvet.png'),
(6, 'Galleta Macadamia Blanca', 2, 'Una combinación elegante y equilibrada. Masa avainillada artesanal con trozos crujientes de nuez de macadamia tostada y chispas de chocolate blanco.', 3.00, '/media/galleta_macadamia_blanca.png'),
(7, 'Galleta Corazón de Avellana', 2, 'Nuestra masa clásica con un centro sorpresa: un relleno fundido y generoso de crema de avellanas y cacao (tipo Nutella) que se derrama lentamente al partirla.', 3.50, 'https://images.pexels.com/photos/1359344/pexels-photo-1359344.jpeg'),
(8, 'Galleta Avena y Pasas (Toque Rústico)', 2, 'Para quienes buscan un bocado reconfortante. Llena de textura gracias a la avena integral, un toque de canela y pasas dulces e hidratadas.', 2.50, 'https://images.pexels.com/photos/89690/pexels-photo-89690.jpeg'),
(9, 'Galleta Red Velvet Real', 3, 'Masa aterciopelada de color rojo intenso con un sutil toque de cacao, rellena con un corazón cremoso de auténtico chocolate blanco y queso crema fundido.', 4.00, 'https://images.pexels.com/photos/20558713/pexels-photo-20558713.jpeg'),
(10, 'Galleta Lava de Nutella', 3, 'Base clásica con chispas de chocolate negro, rellena con un núcleo abundante de crema de avellanas que se desborda al morderla.', 4.00, 'https://images.pexels.com/photos/28857440/pexels-photo-28857440.jpeg'),
(11, 'Galleta Lotus Biscoff', 3, 'Masa especiada con canela, rellena de una suave crema de galleta Lotus y coronada con trozos crujientes de la misma galleta belga.', 4.50, 'https://images.pexels.com/photos/35672897/pexels-photo-35672897.jpeg'),
(12, 'Galleta Pistacho Dulce', 3, 'Galleta de vainilla suave, rellena con una densa y rica pasta artesanal de pistacho tostado, decorada con una pizca de sal marina para balancear sabores.', 4.50, 'https://images.pexels.com/photos/15590648/pexels-photo-15590648.jpeg'),
(13, 'Galleta Limón & Amapola', 4, 'Una opción ligera y cítrica. Masa suave con ralladura fresca de limón caribeño, un toque de glaseado translúcido y semillas de amapola para un sutil toque crujiente.', 3.00, 'https://images.pexels.com/photos/7633890/pexels-photo-7633890.jpeg'),
(14, 'Galleta de Manzana y Canela', 4, 'Base rústica de avena con trozos de manzana caramelizada al horno y un aroma intenso a canela. Sabe a un pie de manzana hecho galleta.', 3.00, 'https://images.pexels.com/photos/89690/pexels-photo-89690.jpeg'),
(15, 'Galleta Choco-Frambuesa', 4, 'Masa de cacao oscuro intenso con un centro de mermelada artesanal de frambuesa ácida, logrando el equilibrio perfecto entre dulce y frutal.', 3.50, 'https://images.pexels.com/photos/20558713/pexels-photo-20558713.jpeg'),
(16, 'Galleta Keto Choco-Almendra', 5, 'Elaborada con harina de almendras, endulzada con eritritol y repleta de chispas de chocolate sin azúcar. Libre de culpa, baja en carbohidratos.', 4.00, 'https://images.pexels.com/photos/35672897/pexels-photo-35672897.jpeg'),
(17, 'Galleta Vegana de Avena y Plátano', 5, 'Sin productos de origen animal. Endulzada naturalmente con puré de plátano maduro, avena en hojuelas, nueces trituradas y chispas de chocolate oscuro apto para veganos.', 3.50, 'https://images.pexels.com/photos/28857440/pexels-photo-28857440.jpeg'),
(18, 'Chocolate Fundido Tradicional', 6, 'El clásico fudge espeso de alta calidad.', 1.50, 'https://images.pexels.com/photos/15590648/pexels-photo-15590648.jpeg'),
(19, 'Arequipe Artesanal', 6, 'Dulce de leche denso y cremoso para untar.', 1.50, 'https://images.pexels.com/photos/1359344/pexels-photo-1359344.jpeg'),
(20, 'Crema de Chocolate Blanco', 6, 'Fluida, dulce y con un toque avainillado.', 1.50, 'https://images.pexels.com/photos/20558713/pexels-photo-20558713.jpeg'),
(21, 'Leche Fría Tradicional', 6, 'El maridaje perfecto para una galleta recién horneada.', 1.00, 'https://images.pexels.com/photos/7633890/pexels-photo-7633890.jpeg'),
(22, 'Café Latte Frío', 6, 'Elaborado con granos seleccionados, ideal para el bocado de la tarde.', 2.00, 'https://images.pexels.com/photos/28857440/pexels-photo-28857440.jpeg');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Filtros para la tabla `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
