-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2020 at 10:55 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `delilah_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `total` double UNSIGNED NOT NULL,
  `payment_method` varchar(20) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) NOT NULL DEFAULT 'nuevo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total`, `payment_method`, `timestamp`, `status`) VALUES
(1, 2, 350.6, 'tarjeta', '2020-03-31 19:16:28', 'nuevo'),
(2, 2, 500.5, 'efectivo', '2020-03-31 16:20:45', 'confirmado'),
(3, 6, 300, 'efectivo', '2020-03-31 04:05:18', 'nuevo'),
(4, 9, 460, 'tarjeta', '2020-03-31 03:00:00', 'nuevo'),
(5, 9, 460, 'tarjeta', '2020-03-31 18:20:05', 'nuevo'),
(6, 9, 460, 'tarjeta', '2020-03-31 18:26:09', 'nuevo'),
(7, 9, 460, 'tarjeta', '2020-03-31 15:35:55', 'nuevo'),
(8, 9, 460, 'tarjeta', '2020-03-31 15:37:26', 'nuevo'),
(9, 9, 561, 'tarjeta', '2020-03-31 15:43:42', 'nuevo'),
(10, 9, 561, 'tarjeta', '2020-03-31 15:45:32', 'nuevo'),
(11, 9, 561, 'tarjeta', '2020-03-31 15:54:57', 'nuevo'),
(12, 9, 561, 'tarjeta', '2020-03-31 15:56:11', 'nuevo'),
(13, 9, 561, 'tarjeta', '2020-03-31 16:04:34', 'nuevo'),
(14, 9, 561, 'tarjeta', '2020-03-31 16:06:43', 'nuevo'),
(15, 9, 561, 'tarjeta', '2020-03-31 16:07:43', 'nuevo'),
(16, 9, 671, 'efectivo', '2020-03-31 16:41:11', 'nuevo'),
(17, 9, 1023.1, 'efectivo', '2020-03-31 18:36:59', 'nuevo'),
(18, 9, 441, 'tarjeta', '2020-03-31 19:00:03', 'nuevo'),
(19, 9, 441, 'efectivo', '2020-03-31 19:00:24', 'nuevo');

-- --------------------------------------------------------

--
-- Table structure for table `order_products`
--

CREATE TABLE `order_products` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `price` double UNSIGNED NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order_products`
--

INSERT INTO `order_products` (`id`, `order_id`, `product_id`, `price`, `quantity`) VALUES
(1, 1, 1, 200, 3),
(2, 1, 2, 150, 4),
(3, 2, 1, 200, 2),
(4, 13, 1, 200.5, 2),
(5, 14, 1, 200.5, 2),
(6, 15, 1, 200.5, 2),
(7, 15, 14, 20, 8),
(8, 16, 1, 200.5, 2),
(9, 16, 14, 20, 8),
(10, 16, 13, 55, 2),
(11, 17, 1, 200.5, 2),
(12, 17, 14, 20, 8),
(13, 17, 15, 20, 1),
(14, 17, 11, 55, 1),
(15, 17, 6, 55, 4),
(16, 17, 13, 55.7, 3),
(17, 18, 1, 200.5, 2),
(18, 18, 14, 20, 2),
(19, 19, 1, 200.5, 2),
(20, 19, 14, 20, 2);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `keyword` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `price` double UNSIGNED NOT NULL,
  `photo_url` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `stock` int(11) UNSIGNED NOT NULL,
  `status` varchar(60) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `keyword`, `price`, `photo_url`, `stock`, `status`) VALUES
(1, 'Focaccia', 'focacc', 200.5, 'https://www.gimmesomeoven.com/wp-content/uploads/2017/03/Rosemary-Focaccia-Recipe-1.jpg', 12, 'active'),
(2, '44', 'vegipppe', 7737, 'http://nuevaurl45', 10, 'active'),
(6, 'prueba', 'prueb', 55, 'http111', 11, 'active'),
(7, 'prueba2', 'prueb2', 55, 'http1112', 0, 'active'),
(11, 'prueba3', 'prueb22', 55, 'http1112', 1, 'active'),
(12, 'pizza', 'margarita', 55, 'http1112', 25, 'inactive'),
(13, 'pizza napolitana', 'napo', 55.7, 'http1112', 25, 'active'),
(14, 'papa', 'pap', 20, 'http', 20, 'active'),
(15, 'papa2', 'pap2', 20, 'http', 39, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `address` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone_number` varchar(16) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `address`, `phone_number`, `password`, `admin`) VALUES
(1, 'Pablo Lopez', 'pabloLop', 'pablolopez@gmail.com', NULL, NULL, '3aade067651271a4bc664428236a72de', 1),
(2, 'Maria Gonzalez', 'marGon', 'mariagonzalez@gmail.com', 'Peru 5870', '34235246', '05ca84ed54a1be215a12832ce4ad454f', 0),
(3, 'carla gomez', 'car_goo', 'carlagomez@gmal.com', NULL, NULL, 'd596618d8e4c569c277096157bf8ecb9', 1),
(6, 'Federico Perez', 'fedPe', 'federicoperez@hotmail.com', 'Prudan 3429', '44664699', '123', 0),
(7, 'patricio mart', 'martinpat', 'martinPREUBA663ez@gmail.com', 'peru Beach 233', '32224', '072c80bbb0dda1377b2c212b2192483c', 0),
(9, 'Pablo prueba', 'papa2', 'pablo2@gmal.com', 'weefe', '243524646', '81dc9bdb52d04dc20036dbd8313ed055', 0),
(12, 'Pablo prueba', 'papa9n', 'pablo235ee@gmal.com', 'heteheh', '231624643', 'e10adc3949ba59abbe56e057f20f883e', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_products`
--
ALTER TABLE `order_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `keyword` (`keyword`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_name` (`username`,`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `order_products`
--
ALTER TABLE `order_products`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
