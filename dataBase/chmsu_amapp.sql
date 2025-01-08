-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 07, 2025 at 11:16 AM
-- Server version: 10.11.10-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u406204961_chmsu_amapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_event`
--

CREATE TABLE `tbl_event` (
  `event_id` int(11) NOT NULL,
  `event_name` varchar(30) NOT NULL,
  `event_start` datetime NOT NULL,
  `event_end` datetime NOT NULL,
  `details` varchar(200) NOT NULL,
  `event_image` varchar(50) NOT NULL,
  `status` enum('0','1','','') NOT NULL DEFAULT '1' COMMENT '0=disable,1=active	',
  `date_created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_event`
--

INSERT INTO `tbl_event` (`event_id`, `event_name`, `event_start`, `event_end`, `details`, `event_image`, `status`, `date_created`) VALUES
(1, 'Intramurals', '2024-12-19 19:04:00', '2025-01-17 19:04:00', '\r\nIntramurals are a dynamic event promoting sportsmanship, teamwork, and school spirit through various sports and recreational activities. It fosters unity and camaraderie among participants, offering', 'event_676376a231aed9.57160937.png', '1', '2024-11-28 19:05:31'),
(2, 'Intercampus', '2024-12-09 23:17:00', '2024-12-13 23:17:00', 'Intercampus activities foster collaboration and friendly competition among multiple campuses, promoting unity, teamwork, and mutual respect. They feature diverse events such as sports, academic contes', 'event_674889f7670980.23142139.jpg', '0', '2024-11-28 23:19:19'),
(25, 'Fun Run', '2025-01-13 11:53:00', '2025-01-14 11:53:00', 'The run is on', 'event_677b53dec21cd3.41171397.jpg', '1', '2025-01-06 03:54:06');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_kiosk`
--

CREATE TABLE `tbl_kiosk` (
  `kiosk_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `kiosk_name` varchar(30) NOT NULL,
  `status` enum('available','unavailable','pending','disable') NOT NULL DEFAULT 'available',
  `kiosk_description` varchar(500) NOT NULL,
  `kiosk_image` varchar(100) NOT NULL,
  `position_x` decimal(8,2) NOT NULL,
  `position_y` decimal(8,2) NOT NULL,
  `transform` varchar(255) NOT NULL,
  `date_created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_kiosk`
--

INSERT INTO `tbl_kiosk` (`kiosk_id`, `event_id`, `kiosk_name`, `status`, `kiosk_description`, `kiosk_image`, `position_x`, `position_y`, `transform`, `date_created`) VALUES
(1, 1, 'kiosk 1', 'pending', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk1.jpg', 2.95, -0.05, '', '2024-11-28 19:05:31'),
(2, 1, 'kiosk 2', 'pending', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk2.jpg', 2.95, -0.25, '', '2024-11-28 19:05:31'),
(3, 1, 'kiosk 3', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk3.jpg', 2.95, -0.45, '', '2024-11-28 19:05:31'),
(4, 1, 'kiosk 4', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk4.jpg', 1.72, -0.45, '', '2024-11-28 19:05:31'),
(5, 1, 'kiosk 5', 'pending', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk5.jpg', 1.92, -0.45, '', '2024-11-28 19:05:31'),
(6, 1, 'kiosk 6', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk6.jpg', 2.12, -0.45, '', '2024-11-28 19:05:31'),
(7, 1, 'kiosk 7', 'unavailable', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk7.jpg', 2.50, -0.45, '', '2024-11-28 19:05:31'),
(8, 1, 'kiosk 8', 'unavailable', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk8.jpg', 2.72, -0.45, '', '2024-11-28 19:05:31'),
(9, 1, 'kiosk 9', 'pending', 'Affordable Price: Rent a kiosk for only ₱250.\r\nConvenient Space: Perfect for showcasing products or services.\r\nEvent-Ready: Strategically located for maximum visibility during events.\r\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\r\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk9.jpg', 0.32, -0.99, '', '2024-11-28 19:05:31'),
(10, 1, 'kiosk 10', 'unavailable', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk10.jpg', 0.30, 0.05, '', '2024-11-28 19:05:31'),
(11, 1, 'kiosk 11', 'unavailable', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk11.jpg', 0.30, -0.15, '', '2024-11-28 19:05:31'),
(12, 1, 'kiosk 12', 'unavailable', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk12.jpg', 0.30, -0.35, '', '2024-11-28 19:05:31'),
(13, 1, 'kiosk 13', 'unavailable', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk13.jpg', 0.30, -0.55, '', '2024-11-28 19:05:31'),
(14, 1, 'kiosk 14', 'unavailable', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk14.jpg', 0.30, -0.75, '', '2024-11-28 19:05:31'),
(15, 1, 'kiosk 15', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk15.jpg', 3.40, -0.28, '', '2024-11-28 19:05:31'),
(16, 1, 'kiosk 16', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk16.jpg', 3.40, -0.48, '', '2024-11-28 19:05:31'),
(17, 1, 'kiosk 17', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk17.jpg', 3.40, -0.68, '', '2024-11-28 19:05:31'),
(18, 1, 'kiosk 18', 'pending', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk18.jpg', 3.40, -0.88, '', '2024-11-28 19:05:31'),
(19, 2, 'kiosk 1', 'available', '', 'kiosk1.jpg', 2.95, -0.05, '', '2024-11-28 23:19:19'),
(20, 2, 'kiosk 2', 'available', '', 'kiosk2.jpg', 2.95, -0.25, '', '2024-11-28 23:19:19'),
(21, 2, 'kiosk 3', 'available', '', 'kiosk3.jpg', 2.95, -0.45, '', '2024-11-28 23:19:19'),
(22, 2, 'kiosk 4', 'available', '', 'kiosk4.jpg', 1.72, -0.45, '', '2024-11-28 23:19:19'),
(23, 2, 'kiosk 5', 'available', '', 'kiosk5.jpg', 1.92, -0.45, '', '2024-11-28 23:19:19'),
(24, 2, 'kiosk 6', 'available', '', 'kiosk6.jpg', 2.12, -0.45, '', '2024-11-28 23:19:19'),
(25, 2, 'kiosk 7', 'available', '', 'kiosk7.jpg', 2.50, -0.45, '', '2024-11-28 23:19:19'),
(26, 2, 'kiosk 8', 'available', '', 'kiosk8.jpg', 2.72, -0.45, '', '2024-11-28 23:19:19'),
(27, 2, 'kiosk 9', 'available', '', 'kiosk9.jpg', 0.30, 0.25, '', '2024-11-28 23:19:19'),
(28, 2, 'kiosk 10', 'available', '', 'kiosk10.jpg', 0.30, 0.05, '', '2024-11-28 23:19:19'),
(29, 2, 'kiosk 11', 'available', '', 'kiosk11.jpg', 0.30, -0.15, '', '2024-11-28 23:19:19'),
(30, 2, 'kiosk 12', 'available', '', 'kiosk12.jpg', 0.30, -0.35, '', '2024-11-28 23:19:19'),
(31, 2, 'kiosk 13', 'available', '', 'kiosk13.jpg', 0.30, -0.55, '', '2024-11-28 23:19:19'),
(32, 2, 'kiosk 14', 'available', '', 'kiosk14.jpg', 0.30, -0.75, '', '2024-11-28 23:19:19'),
(33, 2, 'kiosk 15', 'available', '', 'kiosk15.jpg', 3.40, -0.28, '', '2024-11-28 23:19:19'),
(34, 2, 'kiosk 16', 'available', '', 'kiosk16.jpg', 3.40, -0.48, '', '2024-11-28 23:19:19'),
(35, 2, 'kiosk 17', 'available', '', 'kiosk17.jpg', 3.40, -0.68, '', '2024-11-28 23:19:19'),
(36, 2, 'kiosk 18', 'available', '', 'kiosk18.jpg', 3.40, -0.88, '', '2024-11-28 23:19:19'),
(433, 25, 'kiosk 1', 'available', '• Equipped with a water supply and a trash bin\r\n• Perfect for water refill stations or hydration points for students\r\n• Trash bin helps maintain cleanliness in school areas\r\n• Price: ₱250', 'kiosk1.jpg', 2.95, -0.05, '', '2025-01-06 03:54:06'),
(434, 25, 'kiosk 2', 'available', '• Equipped with a water supply and a trash bin\r\n• Perfect for water refill stations or hydration points for students\r\n• Trash bin helps maintain cleanliness in school areas\r\n• Price: ₱250', 'kiosk2.jpg', 2.95, -0.25, '', '2025-01-06 03:54:06'),
(435, 25, 'kiosk 3', 'available', '• Equipped with a water supply and a trash bin\r\n• Perfect for water refill stations or hydration points for students\r\n• Trash bin helps maintain cleanliness in school areas\r\n• Price: ₱250', 'kiosk3.jpg', 2.95, -0.45, '', '2025-01-06 03:54:06'),
(436, 25, 'kiosk 4', 'available', '', 'kiosk4.jpg', 1.72, -0.45, '', '2025-01-06 03:54:06'),
(437, 25, 'kiosk 5', 'available', '', 'kiosk5.jpg', 1.92, -0.45, '', '2025-01-06 03:54:06'),
(438, 25, 'kiosk 6', 'available', '', 'kiosk6.jpg', 2.12, -0.45, '', '2025-01-06 03:54:06'),
(439, 25, 'kiosk 7', 'available', '• Equipped with a water supply and a trash bin\r\n• Perfect for water refill stations or hydration points for students\r\n• Trash bin helps maintain cleanliness in school areas\r\n• Price: ₱250', 'kiosk7.jpg', 2.50, -0.45, '', '2025-01-06 03:54:06'),
(440, 25, 'kiosk 8', 'available', '• Equipped with a water supply and a trash bin\r\n• Perfect for water refill stations or hydration points for students\r\n• Trash bin helps maintain cleanliness in school areas\r\n• Price: ₱250', 'kiosk8.jpg', 2.72, -0.45, '', '2025-01-06 03:54:06'),
(441, 25, 'kiosk 9', 'pending', '• Equipped with both a reliable electricity supply and a direct water connection\r\n• Ensures continuous operation for both electronic and water-based needs\r\n• Price: ₱250', 'kiosk9.jpg', 0.30, 0.25, '', '2025-01-06 03:54:06'),
(442, 25, 'kiosk 10', 'available', '• Equipped with a water supply and a trash bin\r\n• Trash bin helps maintain cleanliness in school areas\r\n• Price: ₱250', 'kiosk10.jpg', 0.30, 0.05, '', '2025-01-06 03:54:06'),
(443, 25, 'kiosk 11', 'available', '• Equipped with a water supply and a trash bin\r\n• Trash bin helps maintain cleanliness in school areas\r\n• Price: ₱250', 'kiosk11.jpg', 0.30, -0.15, '', '2025-01-06 03:54:06'),
(444, 25, 'kiosk 12', 'available', '• Equipped with a water supply and a trash bin\r\n• Trash bin helps maintain cleanliness in school areas\r\n• Price: ₱250', 'kiosk12.jpg', 0.30, -0.35, '', '2025-01-06 03:54:06'),
(445, 25, 'kiosk 13', 'available', '• Equipped with a water supply and a trash bin\r\n• Trash bin helps maintain cleanliness in school areas\r\n• Price: ₱250', 'kiosk13.jpg', 0.30, -0.55, '', '2025-01-06 03:54:06'),
(446, 25, 'kiosk 14', 'available', '• Equipped with a water supply and a trash bin\r\n• Trash bin helps maintain cleanliness in school areas\r\n• Price: ₱250', 'kiosk14.jpg', 0.30, -0.75, '', '2025-01-06 03:54:06'),
(447, 25, 'kiosk 15', 'available', '• Equipped with both a reliable electricity supply and a direct water connection\r\n• Ensures continuous operation for both electronic and water-based needs\r\n• Price: ₱250', 'kiosk15.jpg', 3.40, -0.28, '', '2025-01-06 03:54:06'),
(448, 25, 'kiosk 16', 'available', '• Equipped with both a reliable electricity supply and a direct water connection\r\n• Ensures continuous operation for both electronic and water-based needs\r\n• Price: ₱250', 'kiosk16.jpg', 3.40, -0.48, '', '2025-01-06 03:54:06'),
(449, 25, 'kiosk 17', 'available', '• Equipped with both a reliable electricity supply and a direct water connection\r\n• Ensures continuous operation for both electronic and water-based needs\r\n• Price: ₱250', 'kiosk17.jpg', 3.40, -0.68, '', '2025-01-06 03:54:06'),
(450, 25, 'kiosk 18', 'available', '• Equipped with both a reliable electricity supply and a direct water connection\r\n• Ensures continuous operation for both electronic and water-based needs\r\n• Price: ₱250', 'kiosk18.jpg', 3.40, -0.88, '', '2025-01-06 03:54:06');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_notifications`
--

CREATE TABLE `tbl_notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('unread','read') DEFAULT 'unread',
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_notifications`
--

INSERT INTO `tbl_notifications` (`notification_id`, `user_id`, `message`, `status`, `date_created`) VALUES
(1, 56, 'Your transaction is still pending', 'read', '2024-11-28 02:47:13'),
(6, 61, 'Your transaction is still pending', 'unread', '2024-11-28 04:49:16'),
(7, 56, 'Your transaction has been paid', 'read', '2024-11-28 11:55:02'),
(8, 62, 'Your account is created', 'unread', '2024-11-28 05:17:10'),
(9, 62, 'Your transaction has been approved', 'unread', '2024-11-28 12:22:27'),
(10, 63, 'Your account is pending', 'unread', '2024-11-28 05:37:40'),
(11, 63, 'Your account has already been updated to approved', 'unread', '2024-11-28 05:38:47'),
(12, 56, 'Your transaction has been paid', 'read', '2024-11-29 00:52:53'),
(13, 56, 'Your transaction has been finished', 'unread', '2024-11-29 00:53:15'),
(14, 56, 'Your transaction has been approved', 'unread', '2024-11-29 03:24:16'),
(15, 56, 'Your transaction has been paid', 'unread', '2024-11-29 03:24:20'),
(16, 56, 'Your transaction has been finished', 'unread', '2024-11-29 03:35:37'),
(17, 56, 'Your transaction has been paid', 'unread', '2024-11-29 04:09:04'),
(498, 72, 'Your account is pending', 'read', '2024-12-16 02:08:03'),
(499, 57, 'User created account, please review the application of Aldrin Basanta', 'unread', '2024-12-16 02:08:03'),
(500, 59, 'User created account, please review the application of Aldrin Basanta', 'unread', '2024-12-16 02:08:03'),
(501, 60, 'User created account, please review the application of Aldrin Basanta', 'unread', '2024-12-16 02:08:03'),
(502, 72, 'Your account has already been updated to approved', 'unread', '2024-12-16 02:08:16'),
(503, 57, 'User aldrin submitted an application for kiosk 12', 'unread', '2024-12-16 02:10:16'),
(504, 59, 'User aldrin submitted an application for kiosk 12', 'unread', '2024-12-16 02:10:16'),
(505, 60, 'User aldrin submitted an application for kiosk 12', 'unread', '2024-12-16 02:10:16'),
(506, 66, 'Your transaction has been Approved, your schedule of appointment is on January 24, 2025, You have only 3 days to comply, failure to comply might cancel the reservation', 'unread', '2024-12-16 02:16:39'),
(507, 57, 'User kmv submitted an application for kiosk 11', 'unread', '2024-12-16 03:36:30'),
(508, 59, 'User kmv submitted an application for kiosk 11', 'unread', '2024-12-16 03:36:30'),
(509, 60, 'User kmv submitted an application for kiosk 11', 'unread', '2024-12-16 03:36:30'),
(510, 66, 'Your transaction has been Approved, your schedule of appointment is on January 24, 2025', 'unread', '2024-12-16 03:38:23'),
(511, 66, 'Your transaction has been Approved, your schedule of appointment is on January 24, 2025', 'unread', '2024-12-16 03:38:24'),
(512, 57, 'User aldrin submitted an application for kiosk 14', 'unread', '2024-12-16 11:28:21'),
(513, 59, 'User aldrin submitted an application for kiosk 14', 'unread', '2024-12-16 11:28:21'),
(514, 60, 'User aldrin submitted an application for kiosk 14', 'unread', '2024-12-16 11:28:21'),
(515, 72, 'Your transaction has been Approved, your schedule of appointment is on January 24, 2025', 'unread', '2024-12-16 11:35:49'),
(516, 56, 'Your transaction has been pending', 'unread', '2024-12-16 12:11:20'),
(517, 57, 'User albert21 submitted an application for kiosk 2', 'unread', '2024-12-16 12:14:25'),
(518, 59, 'User albert21 submitted an application for kiosk 2', 'unread', '2024-12-16 12:14:25'),
(519, 60, 'User albert21 submitted an application for kiosk 2', 'unread', '2024-12-16 12:14:25'),
(520, 56, 'Your transaction has been finished', 'unread', '2024-12-16 19:28:02'),
(521, 56, 'Your transaction has been Approved, your schedule of appointment is on January 24, 2025', 'unread', '2024-12-16 19:28:38'),
(522, 56, 'Your transaction has been Approved, your schedule of appointment is on January 24, 2025', 'unread', '2024-12-16 19:28:38'),
(523, 56, 'Your transaction has been paid', 'unread', '2024-12-16 19:28:54'),
(524, 62, 'Your transaction has been Approved, your schedule of appointment is on January 24, 2025You have only 3 days to comply, failure to comply might cancel the reservation', 'unread', '2024-12-17 02:33:44'),
(525, 57, 'User kmv submitted an application for kiosk 13', 'unread', '2024-12-17 02:37:14'),
(526, 59, 'User kmv submitted an application for kiosk 13', 'unread', '2024-12-17 02:37:14'),
(527, 60, 'User kmv submitted an application for kiosk 13', 'unread', '2024-12-17 02:37:14'),
(528, 66, 'Your transaction has been Approved, your schedule of appointment is on January 24, 2025You have only 3 days to comply, failure to comply might cancel the reservation', 'unread', '2024-12-17 02:38:05'),
(529, 57, 'User kmv submitted an application for kiosk 9', 'unread', '2024-12-17 02:39:10'),
(530, 59, 'User kmv submitted an application for kiosk 9', 'unread', '2024-12-17 02:39:10'),
(531, 60, 'User kmv submitted an application for kiosk 9', 'unread', '2024-12-17 02:39:10'),
(532, 66, 'Your transaction has been pending', 'unread', '2024-12-17 03:08:53'),
(533, 66, 'Your transaction has been pending', 'unread', '2024-12-17 03:10:06'),
(534, 57, 'User kmv submitted an application for kiosk 5', 'unread', '2024-12-17 03:21:17'),
(535, 59, 'User kmv submitted an application for kiosk 5', 'unread', '2024-12-17 03:21:17'),
(536, 60, 'User kmv submitted an application for kiosk 5', 'unread', '2024-12-17 03:21:17'),
(537, 73, 'Your account is pending', 'unread', '2024-12-20 04:25:22'),
(538, 57, 'User created account, please review the application of John Juan De la Cruz', 'unread', '2024-12-20 04:25:22'),
(539, 59, 'User created account, please review the application of John Juan De la Cruz', 'unread', '2024-12-20 04:25:22'),
(540, 60, 'User created account, please review the application of John Juan De la Cruz', 'unread', '2024-12-20 04:25:22'),
(541, 73, 'Your account has already been updated to approved', 'unread', '2024-12-20 04:26:40'),
(542, 71, 'Your account has already been updated to approved', 'unread', '2024-12-20 04:27:30'),
(543, 57, 'User kmv submitted an application for kiosk 1', 'unread', '2024-12-21 13:22:55'),
(544, 59, 'User kmv submitted an application for kiosk 1', 'unread', '2024-12-21 13:22:55'),
(545, 60, 'User kmv submitted an application for kiosk 1', 'unread', '2024-12-21 13:22:55'),
(546, 55, 'New event Fun Run created', 'unread', '2025-01-06 03:54:06'),
(547, 56, 'New event Fun Run created', 'unread', '2025-01-06 03:54:06'),
(548, 61, 'New event Fun Run created', 'unread', '2025-01-06 03:54:06'),
(549, 62, 'New event Fun Run created', 'unread', '2025-01-06 03:54:06'),
(550, 63, 'New event Fun Run created', 'unread', '2025-01-06 03:54:06'),
(551, 64, 'New event Fun Run created', 'unread', '2025-01-06 03:54:06'),
(552, 65, 'New event Fun Run created', 'unread', '2025-01-06 03:54:06'),
(553, 66, 'New event Fun Run created', 'unread', '2025-01-06 03:54:06'),
(554, 69, 'New event Fun Run created', 'unread', '2025-01-06 03:54:06'),
(555, 70, 'New event Fun Run created', 'unread', '2025-01-06 03:54:06'),
(556, 71, 'New event Fun Run created', 'unread', '2025-01-06 03:54:06'),
(557, 72, 'New event Fun Run created', 'unread', '2025-01-06 03:54:06'),
(558, 73, 'New event Fun Run created', 'unread', '2025-01-06 03:54:06'),
(561, 57, 'User aldrin submitted an application for kiosk 18', 'unread', '2025-01-06 09:25:29'),
(562, 59, 'User aldrin submitted an application for kiosk 18', 'unread', '2025-01-06 09:25:29'),
(563, 60, 'User aldrin submitted an application for kiosk 18', 'unread', '2025-01-06 09:25:29'),
(564, 57, 'User kmv submitted an application for kiosk 9', 'unread', '2025-01-07 04:00:05'),
(565, 59, 'User kmv submitted an application for kiosk 9', 'unread', '2025-01-07 04:00:05'),
(566, 60, 'User kmv submitted an application for kiosk 9', 'unread', '2025-01-07 04:00:05');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_transactions`
--

CREATE TABLE `tbl_transactions` (
  `form_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `kiosk_id` int(11) NOT NULL,
  `date_req` datetime NOT NULL,
  `rent_date` varchar(900) NOT NULL,
  `purpose` varchar(60) NOT NULL,
  `status` enum('pending','approved','denied','finished','paid') NOT NULL DEFAULT 'pending',
  `requirements` varchar(900) NOT NULL,
  `receipt_number` varchar(50) NOT NULL,
  `file_name` varchar(50) NOT NULL,
  `mayors_permit` varchar(50) DEFAULT NULL,
  `business_permit` varchar(50) DEFAULT NULL,
  `sanitary_permit` varchar(50) DEFAULT NULL,
  `date_created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_transactions`
--

INSERT INTO `tbl_transactions` (`form_id`, `user_id`, `event_id`, `kiosk_id`, `date_req`, `rent_date`, `purpose`, `status`, `requirements`, `receipt_number`, `file_name`, `mayors_permit`, `business_permit`, `sanitary_permit`, `date_created`) VALUES
(1, 56, 1, 9, '2025-01-24 00:00:00', '', 'To gather essential information from applicants for kiosk re', 'pending', 'Table, and Chairs, Canopy', '098765ao', '67485510eec72_Document1.pdf', '', '', '', '2024-11-28 19:33:37'),
(2, 61, 1, 11, '2024-11-30 00:00:00', '', 'asdasdsa', 'denied', 'Table, and Chairs, Canopy', '', '674859123077b_Basanta.pdf', '', '', '', '2024-11-28 19:50:42'),
(3, 62, 1, 10, '0000-00-00 00:00:00', '', 'TO SHOW CASE MY PRODUCTS', 'paid', 'Table, and Chairs, Canopy', '456456456', 'letter.pdf', '', '', '', '2024-11-28 20:21:39'),
(4, 62, 1, 12, '0000-00-00 00:00:00', '', 'TO SHOW CASE MY PRODUCTS', 'paid', 'Table, and Chairs, Canopy', '25484874p', '6748629a328e0_letterofintent.pdf', '', '', '', '2024-11-28 20:31:22'),
(5, 62, 1, 8, '2025-01-24 00:00:00', '', 'asdsad', 'approved', 'Table, and Chairs, Canopy', 'klsklsks', '6748636d62332_letter of intent.pdf', '', '', '', '2024-11-28 20:34:53'),
(6, 56, 1, 6, '2024-11-30 00:00:00', '', 'I want to geasdasdasdasdast a kioks to sell my products', 'approved', '', '', '67493370526af_letter of intent.pdf', '', '', '', '2024-11-29 11:22:24'),
(7, 56, 1, 6, '2024-11-30 00:00:00', '', 'I want to get a kioks to sell my products', 'approved', '', '123456890', '6749337053c34_letter of intent.pdf', '', '', '', '2024-11-29 11:22:24'),
(39, 66, 1, 18, '2024-08-09 00:00:00', '', 'I want to get a kioks to sell my products', 'paid', 'Table, and Chairs, Canopy', 'asdasdasd', '6749337053c34_letter of intent.pdf', '', '', '', '2024-11-29 11:22:24'),
(40, 66, 1, 7, '2025-01-24 00:00:00', 'December 19 2024,December 20 2024,December 21 2024', 'selling', 'pending', 'Tables, and Chairs,Canopy,', 'asdada', 'application675ed0a1ac6bd6.20848368.pdf', '', '', '', '2024-12-15 12:50:41'),
(41, 72, 1, 12, '2025-01-24 00:00:00', 'December 25 2024,December 26 2024,December 27 2024', 'to sell', 'approved', 'Tables, and Chairs,Canopy,Partitions,', '', 'application675f8c082569a8.67050420.pdf', '', '', '', '2024-12-16 02:10:16'),
(42, 66, 1, 11, '2025-01-24 00:00:00', 'December 20 2024,December 27 2024', 'to sell items', 'approved', 'Pegboards, Hooks, or Stands,', '', 'application675fa03e3a5a86.97757186.pdf', '', '', '', '2024-12-16 03:36:30'),
(43, 72, 1, 14, '2025-01-24 00:00:00', 'December 25 2024,December 26 2024', 'To connect ', 'approved', 'Tables, and Chairs,Canopy,', '', 'application67600ed58ffe54.26593860.pdf', 'application67600ed59025a5.78832904.jpg', 'application67600ed5904fc7.67744712.jpg', 'application67600ed5908202.43492949.jpg', '2024-12-16 11:28:21'),
(44, 56, 1, 2, '2025-01-24 00:00:00', 'December 20 2024,December 21 2024,December 22 2024', 'i want to sell my asdasdasdadadadadproducts', 'paid', 'Tables, and Chairs,Canopy,', '', 'application676019a11b7277.97587659.pdf', '', '', '', '2024-12-16 12:14:25'),
(45, 66, 1, 13, '2025-01-24 00:00:00', 'December 21 2024,December 20 2024', 'adasdasd', 'paid', '', '123123123', 'application6760e3da392be5.58296393.pdf', '', '', '', '2024-12-17 02:37:14'),
(46, 66, 1, 9, '2025-01-24 00:00:00', 'December 20 2024,December 27 2024', 'asdsdas', 'paid', 'Canopy,', 'asdasdasd', 'application6760e44e6a8a64.78091221.pdf', '', '', '', '2024-12-17 02:39:10'),
(47, 66, 1, 5, '0000-00-00 00:00:00', 'December 20 2024', 'asdasd', 'pending', '', '', 'application6760ee2d8fff19.48619323.pdf', '', '', '', '2024-12-17 03:21:17'),
(48, 66, 1, 1, '0000-00-00 00:00:00', 'December 19 2024', 'Sell', 'pending', 'Tables, and Chairs,', '', 'application6766c12f62a604.86216554.pdf', '', '', '', '2024-12-21 13:22:55'),
(49, 72, 1, 18, '0000-00-00 00:00:00', 'January 1 2025,January 2 2025,January 3 2025,January 4 2025', 'TO SHOW CASE MY PRODUCTS', 'pending', 'Partitions,Canopy,', '', 'application677ba1896a2409.85023884.pdf', '', '', '', '2025-01-06 09:25:29'),
(50, 66, 25, 441, '0000-00-00 00:00:00', 'January 13 2025,January 14 2025', 'to sell', 'pending', 'Pegboards, Hooks, or Stands,Partitions,', '', 'application677ca6c57f14d5.56859298.pdf', '', '', '', '2025-01-07 04:00:05');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `user_info_id` int(11) NOT NULL,
  `First_name` varchar(60) NOT NULL,
  `Last_name` varchar(50) NOT NULL,
  `Contact#` text NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Company_name` varchar(100) NOT NULL,
  `Username` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `User_type` set('admin','user','IGP','EX-Director') NOT NULL DEFAULT 'user',
  `status` enum('0','1','2','') NOT NULL DEFAULT '0' COMMENT '0=pending,1=approved,2=denied	',
  `profile_image` varchar(50) NOT NULL,
  `date_registered` datetime NOT NULL,
  `tokenId` text NOT NULL,
  `access_permissions_events` tinyint(1) NOT NULL,
  `access_permissions_transactions` tinyint(1) NOT NULL,
  `access_permissions_reports` tinyint(1) NOT NULL,
  `access_permissions_user_settings` tinyint(1) NOT NULL,
  `access_permissions_access_control` tinyint(1) NOT NULL,
  `access_permissions_history` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`user_info_id`, `First_name`, `Last_name`, `Contact#`, `Email`, `Company_name`, `Username`, `Password`, `User_type`, `status`, `profile_image`, `date_registered`, `tokenId`, `access_permissions_events`, `access_permissions_transactions`, `access_permissions_reports`, `access_permissions_user_settings`, `access_permissions_access_control`, `access_permissions_history`) VALUES
(55, 'Bless', 'Lomeran', '09062748174', 'blesslomeran.e@gmail.com', 'PIZZAHOTTIE', 'bless', '$2y$10$K5FuMnZotOD7Qc/H0nGTWO4IO9agii3nhbjRnOFFKYgTDw7QM0wYK', 'user', '1', '', '2024-11-28 15:45:39', '512c8609-aecf-4dd2-8fb2-a6f0c3cfffe8', 0, 0, 0, 0, 0, 0),
(56, 'Albert', 'Palma', '09062748174', 'albertabadpalma@gmail.com', 'Owo kainan', 'albert21', '$2y$10$xb8bv2Qq8Gvx0/VdBCUqjueZItfBRxsGXv0CWuv9JcddWNChWEH7y', 'user', '1', '', '2024-11-28 17:47:13', '72ae8ca2-0de4-4f41-a7b5-80b878cbd467', 1, 0, 0, 0, 0, 0),
(57, 'Mark', 'Sumagaysay', '2147483647', 'chmsua910@gmail.com', 'Chmsu-A IGP', 'Chmsu-A IGP', '$2y$10$UfpBS2mfr83GbVdUO4ezGeZw7nW1ki.lWlzXiHCOevAW0Tuk9DQLa', 'IGP', '1', '', '2024-11-28 18:01:57', '97113041-ec50-4dbe-80f2-752389ca14b0', 1, 1, 1, 1, 0, 0),
(59, 'Edwin', 'Bugna', '2147483647', 'chmsua910@gmail.com', 'CHMSU-A Executive Director', 'Ex-Director', '$2y$10$e568jnzylju2I5pqLQgO7.tBmtqvsSl0TWGxLybY8SGwVcTBXkqxy', 'EX-Director', '1', '', '2024-11-28 18:45:25', 'e364f6ce-771c-45fb-a468-71379030d040', 1, 1, 1, 0, 0, 0),
(60, 'Admin', 'Admin', '2147483647', 'chmsua910@gmail.com', 'CHMSU-A Admin', 'Admin', '$2y$10$a0MlzbGrhufAzJBCGPpQ0.cgKw63C4G8a/9USMv32ghqap8rHWC2G', 'admin', '1', '', '2024-11-28 18:50:08', 'd619f9b6-f9c4-42e3-8aa3-86e7e1763afd', 1, 1, 1, 1, 1, 1),
(61, 'asdsad', 'asdasd', '09056685366', 'asdasd@gmail.com', 'asdasd23', 'asdasd23', '$2y$10$rbRD0Hw9zK4pgBkOPP19sOyzqul1xVwUJcLCEQOuwBLFRLG90PXi6', 'user', '1', '', '2024-11-28 19:49:16', '13b5bf90-41b4-4c77-8b97-1bd0b5f88a9e', 0, 0, 0, 0, 0, 0),
(62, 'Ajin', 'Joseph', '09095410778', 'josephairajean@gmail.com', 'POTATO CORNER', 'Ajin', '$2y$10$QgtDMgSVHGv1qWxCFv6Hme64LdToQmWNKHdyhZ24xAqtzIxVVSpdC', 'user', '1', '', '2024-11-28 20:17:10', '5eaf9525-2bf3-4aa9-a0c3-9e3a693597c9', 0, 0, 0, 0, 0, 0),
(63, 'Ash', 'Jyven', '09098575663', 'ashjyven@gmail.com', 'TAKO-TAKO', 'Ash', '$2y$10$fmySja5uNleHcWrQ7azk2uSZvKV1pVuPmDSHOHyGq3tOTYPmSjoPS', 'user', '1', '', '2024-11-28 20:37:40', 'fff13556-96be-4d48-bafd-f7c4c526156e', 0, 0, 0, 0, 0, 0),
(64, 'Teya', 'Jaena', '09095410777', 'aprilmahusayjeana@gmail.com', 'Waffle', 'teya', '$2y$10$9LLVLOLObdggGVuGyUdp4ODZHqx7mNqCjErKZHMWd68TSYKOPuEim', 'user', '1', '', '2024-11-29 12:46:11', '8f43c2b0-3125-4676-813c-0e0a580e73a7', 0, 0, 0, 0, 0, 0),
(65, 'master', 'shomai', '09073551685', 'w25128882@gmail.com', 'shomaai', 'master', '$2y$10$ZJ7lYtAsTvQzLx6vbS/DJOjoPj4CXNfWf6lP8yj/asAmn8MlcW16u', 'user', '1', '', '2024-11-29 18:54:05', '49b6d8ab-c71e-4464-aed7-33a24f7beda1', 0, 0, 0, 0, 0, 0),
(66, 'karl', 'villaverde', '09703339263', 'kmv@gmail.com', 'admin', 'kmv', '$2y$10$kQ1SNbMW0bLSL2yLpJDZ4Ox8DU7WA42s58VuWXwqlOfb6nXoX618m', 'user', '1', '', '2024-12-02 05:06:41', '5f30b335-29b4-4571-860b-32df661d0dd4', 0, 0, 0, 0, 0, 0),
(69, 'test1', 'test1', '09056685366', 'test1@ga.com', 'test1', 'test1', '$2y$10$AC8k4VSqgCcH5Wi2P8F0.eNm5uM5ubu6KsioR6Fqe.9L7nGphocdO', 'user', '0', '', '2024-12-10 07:29:49', '237423dc-cf1c-4ba8-815d-cf39797f6bae', 0, 0, 0, 0, 0, 0),
(70, 'test1', 'test1', '09031164277', 'test1@gma.com', 'test1', 'test12', '$2y$10$Njl2AspBwlswxmBa/ypeROBrTDIeNuKkdKTMUwouGQ5zk4I/15xMK', 'user', '0', '', '2024-12-10 07:33:46', '8a954aa6-ca23-4826-9fb0-72210b80ca9a', 0, 0, 0, 0, 0, 0),
(71, 'Aira', 'Joseph ', '09095410778', 'aprilmahusayjaena@gmail.com', 'Potato', 'teyang', '$2y$10$tqDCr3f7HIB8oWjIuKt0Memw96BvxO9xAJUqDeaga.nNG4YMxyOV2', 'user', '1', '', '2024-12-15 12:59:59', '758407b5-14ef-4163-86c7-43b599e10803', 0, 0, 0, 0, 0, 0),
(72, 'Aldrin', 'Basanta', '09271549081', 'aldrinbasanta04@gmail.com', 'TAKOTAKO', 'aldrin', '$2y$10$Vps3teQDLpqFLOOreaZ76uszREVUQV6LHYN2uXrwX4XR1MlGaZs9a', 'user', '1', '', '2024-12-16 02:08:03', 'd380add5-5129-4d59-bfef-bcef722d852a', 0, 0, 0, 0, 0, 0),
(73, 'John Juan', 'De la Cruz', '09070457589', 'xallenkomine@gmail.com', 'JJD Bakeshop', 'jeyjey', '$2y$10$9640mr/mRvPut3Xl8Cwz1eCrYC6S0p9OubXxg5GvDar9BCBdukAta', 'user', '1', '', '2024-12-20 04:25:22', 'ca4fc86b-1a20-4ff8-bdca-27f4a777ad61', 0, 0, 0, 0, 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_event`
--
ALTER TABLE `tbl_event`
  ADD PRIMARY KEY (`event_id`);

--
-- Indexes for table `tbl_kiosk`
--
ALTER TABLE `tbl_kiosk`
  ADD PRIMARY KEY (`kiosk_id`),
  ADD KEY `tbl_kiosk_ibfk_1` (`event_id`);

--
-- Indexes for table `tbl_notifications`
--
ALTER TABLE `tbl_notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tbl_transactions`
--
ALTER TABLE `tbl_transactions`
  ADD PRIMARY KEY (`form_id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `kiosk_id` (`kiosk_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`user_info_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_event`
--
ALTER TABLE `tbl_event`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `tbl_kiosk`
--
ALTER TABLE `tbl_kiosk`
  MODIFY `kiosk_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=451;

--
-- AUTO_INCREMENT for table `tbl_notifications`
--
ALTER TABLE `tbl_notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=567;

--
-- AUTO_INCREMENT for table `tbl_transactions`
--
ALTER TABLE `tbl_transactions`
  MODIFY `form_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `user_info_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_kiosk`
--
ALTER TABLE `tbl_kiosk`
  ADD CONSTRAINT `tbl_kiosk_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_notifications`
--
ALTER TABLE `tbl_notifications`
  ADD CONSTRAINT `tbl_notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`user_info_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_transactions`
--
ALTER TABLE `tbl_transactions`
  ADD CONSTRAINT `tbl_transactions_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `tbl_event` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_transactions_ibfk_2` FOREIGN KEY (`kiosk_id`) REFERENCES `tbl_kiosk` (`kiosk_id`),
  ADD CONSTRAINT `tbl_transactions_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`user_info_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
