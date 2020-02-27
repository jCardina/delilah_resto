-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 26, 2020 at 02:31 PM
-- Server version: 8.0.13-4
-- PHP Version: 7.2.24-0ubuntu0.18.04.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vDFXpfDUqH`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` text COLLATE utf8_unicode_ci NOT NULL,
  `keyword` text COLLATE utf8_unicode_ci NOT NULL,
  `price` int(10) UNSIGNED NOT NULL,
  `photoUrl` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `keyword`, `price`, `photoUrl`) VALUES
(1, 'Focaccia', 'focacc', 200, 'https://www.gimmesomeoven.com/wp-content/uploads/2017/03/Rosemary-Focaccia-Recipe-1.jpg'),
(2, 'Veggie Burger', 'veggBur', 150, 'https://storage.googleapis.com/gen-atmedia/3/2019/05/a94cfde51967df5caf0f1641f53a5470df4421c1.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` text COLLATE utf8_unicode_ci NOT NULL,
  `userName` text COLLATE utf8_unicode_ci NOT NULL,
  `email` text COLLATE utf8_unicode_ci NOT NULL,
  `address` text COLLATE utf8_unicode_ci NOT NULL,
  `phoneNumber` int(10) UNSIGNED NOT NULL,
  `password` text COLLATE utf8_unicode_ci NOT NULL,
  `admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `userName`, `email`, `address`, `phoneNumber`, `password`, `admin`) VALUES
(1, 'Pablo Lopez', 'pabloLop', 'pablolopez@gmail.com', 'Doblas 243', 232532624, 'passW', 1),
(2, 'Maria Gonzalez', 'marGon', 'mariagonzalez@gmail.com', 'Peru 5870', 34235246, 'passWoo', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
