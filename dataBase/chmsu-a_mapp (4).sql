-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2024 at 11:57 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chmsu-a_mapp`
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
(1, 'Intramurals', '2024-11-30 19:04:00', '2024-12-07 19:04:00', '\nIntramurals are a dynamic event promoting sportsmanship, teamwork, and school spirit through various sports and recreational activities. It fosters unity and camaraderie among participants, offering', 'event_67484e7b4dbdc1.08589516.png', '1', '2024-11-28 19:05:31'),
(2, 'Intercampus', '2024-12-09 23:17:00', '2024-12-13 23:17:00', 'Intercampus activities foster collaboration and friendly competition among multiple campuses, promoting unity, teamwork, and mutual respect. They feature diverse events such as sports, academic contes', 'event_674889f7670980.23142139.jpg', '0', '2024-11-28 23:19:19');

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
(1, 1, 'kiosk 1', 'unavailable', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk1.jpg', 2.95, -0.05, '', '2024-11-28 19:05:31'),
(2, 1, 'kiosk 2', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk2.jpg', 2.95, -0.25, '', '2024-11-28 19:05:31'),
(3, 1, 'kiosk 3', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk3.jpg', 2.95, -0.45, '', '2024-11-28 19:05:31'),
(4, 1, 'kiosk 4', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk4.jpg', 1.72, -0.45, '', '2024-11-28 19:05:31'),
(5, 1, 'kiosk 5', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk5.jpg', 1.92, -0.45, '', '2024-11-28 19:05:31'),
(6, 1, 'kiosk 6', 'unavailable', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk6.jpg', 2.12, -0.45, '', '2024-11-28 19:05:31'),
(7, 1, 'kiosk 7', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk7.jpg', 2.50, -0.45, '', '2024-11-28 19:05:31'),
(8, 1, 'kiosk 8', 'unavailable', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk8.jpg', 2.72, -0.45, '', '2024-11-28 19:05:31'),
(9, 1, 'kiosk 9', 'unavailable', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk1.jpg', 0.30, 0.25, '', '2024-11-28 19:05:31'),
(10, 1, 'kiosk 10', 'unavailable', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk2.jpg', 0.30, 0.05, '', '2024-11-28 19:05:31'),
(11, 1, 'kiosk 11', 'unavailable', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk3.jpg', 0.30, -0.15, '', '2024-11-28 19:05:31'),
(12, 1, 'kiosk 12', 'unavailable', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk4.jpg', 0.30, -0.35, '', '2024-11-28 19:05:31'),
(13, 1, 'kiosk 13', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk5.jpg', 0.30, -0.55, '', '2024-11-28 19:05:31'),
(14, 1, 'kiosk 14', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk6.jpg', 0.30, -0.75, '', '2024-11-28 19:05:31'),
(15, 1, 'kiosk 15', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk7.jpg', 3.40, -0.28, '', '2024-11-28 19:05:31'),
(16, 1, 'kiosk 16', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk8.jpg', 3.40, -0.48, '', '2024-11-28 19:05:31'),
(17, 1, 'kiosk 17', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk1.jpg', 3.40, -0.68, '', '2024-11-28 19:05:31'),
(18, 1, 'kiosk 18', 'available', 'Affordable Price: Rent a kiosk for only ₱250.\nConvenient Space: Perfect for showcasing products or services.\nEvent-Ready: Strategically located for maximum visibility during events.\nIdeal for Entrepreneurs: Boost your brand and engage with a diverse audience.\nHassle-Free Setup: Designed to support your business needs efficiently.', 'kiosk2.jpg', 3.40, -0.88, '', '2024-11-28 19:05:31'),
(19, 2, 'kiosk 1', 'available', '', 'kiosk1.jpg', 2.95, -0.05, '', '2024-11-28 23:19:19'),
(20, 2, 'kiosk 2', 'available', '', 'kiosk2.jpg', 2.95, -0.25, '', '2024-11-28 23:19:19'),
(21, 2, 'kiosk 3', 'available', '', 'kiosk3.jpg', 2.95, -0.45, '', '2024-11-28 23:19:19'),
(22, 2, 'kiosk 4', 'available', '', 'kiosk4.jpg', 1.72, -0.45, '', '2024-11-28 23:19:19'),
(23, 2, 'kiosk 5', 'available', '', 'kiosk5.jpg', 1.92, -0.45, '', '2024-11-28 23:19:19'),
(24, 2, 'kiosk 6', 'available', '', 'kiosk6.jpg', 2.12, -0.45, '', '2024-11-28 23:19:19'),
(25, 2, 'kiosk 7', 'available', '', 'kiosk7.jpg', 2.50, -0.45, '', '2024-11-28 23:19:19'),
(26, 2, 'kiosk 8', 'available', '', 'kiosk8.jpg', 2.72, -0.45, '', '2024-11-28 23:19:19'),
(27, 2, 'kiosk 9', 'available', '', 'kiosk1.jpg', 0.30, 0.25, '', '2024-11-28 23:19:19'),
(28, 2, 'kiosk 10', 'available', '', 'kiosk2.jpg', 0.30, 0.05, '', '2024-11-28 23:19:19'),
(29, 2, 'kiosk 11', 'available', '', 'kiosk3.jpg', 0.30, -0.15, '', '2024-11-28 23:19:19'),
(30, 2, 'kiosk 12', 'available', '', 'kiosk4.jpg', 0.30, -0.35, '', '2024-11-28 23:19:19'),
(31, 2, 'kiosk 13', 'available', '', 'kiosk5.jpg', 0.30, -0.55, '', '2024-11-28 23:19:19'),
(32, 2, 'kiosk 14', 'available', '', 'kiosk6.jpg', 0.30, -0.75, '', '2024-11-28 23:19:19'),
(33, 2, 'kiosk 15', 'available', '', 'kiosk7.jpg', 3.40, -0.28, '', '2024-11-28 23:19:19'),
(34, 2, 'kiosk 16', 'available', '', 'kiosk8.jpg', 3.40, -0.48, '', '2024-11-28 23:19:19'),
(35, 2, 'kiosk 17', 'available', '', 'kiosk1.jpg', 3.40, -0.68, '', '2024-11-28 23:19:19'),
(36, 2, 'kiosk 18', 'available', '', 'kiosk2.jpg', 3.40, -0.88, '', '2024-11-28 23:19:19');

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
(2, 57, 'Your transaction is still pending', 'unread', '2024-11-28 03:01:57'),
(4, 59, 'Your transaction is still pending', 'unread', '2024-11-28 03:45:25'),
(5, 60, 'Your transaction is still pending', 'unread', '2024-11-28 03:50:08'),
(6, 61, 'Your transaction is still pending', 'unread', '2024-11-28 04:49:16'),
(7, 56, 'Your transaction has been paid', 'read', '2024-11-28 11:55:02'),
(8, 62, 'Your account is pending', 'unread', '2024-11-28 05:17:10'),
(9, 62, 'Your transaction has been approved', 'unread', '2024-11-28 12:22:27'),
(10, 63, 'Your account is pending', 'unread', '2024-11-28 05:37:40'),
(11, 63, 'Your account has already been updated to approved', 'unread', '2024-11-28 05:38:47'),
(12, 56, 'Your transaction has been paid', 'read', '2024-11-29 00:52:53'),
(13, 56, 'Your transaction has been finished', 'unread', '2024-11-29 00:53:15'),
(14, 56, 'Your transaction has been approved', 'unread', '2024-11-29 03:24:16'),
(15, 56, 'Your transaction has been paid', 'unread', '2024-11-29 03:24:20'),
(16, 56, 'Your transaction has been finished', 'unread', '2024-11-29 03:35:37'),
(17, 56, 'Your transaction has been paid', 'unread', '2024-11-29 04:09:04'),
(18, 64, 'Your account is pending', 'unread', '2024-11-28 21:46:11'),
(19, 64, 'Your account has already been updated to approved', 'read', '2024-11-28 21:50:01'),
(20, 64, 'Your transaction has been approved', 'unread', '2024-11-29 05:18:59'),
(21, 64, 'Your transaction has been paid', 'unread', '2024-11-29 05:23:39'),
(22, 65, 'Your account is pending', 'unread', '2024-11-29 03:54:05'),
(23, 65, 'Your account has already been updated to approved', 'unread', '2024-11-29 03:54:34');

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
  `purpose` varchar(60) NOT NULL,
  `status` enum('pending','approved','denied','finished','paid') NOT NULL DEFAULT 'pending',
  `receipt_number` varchar(50) NOT NULL,
  `file_size` int(11) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `file_name` varchar(50) NOT NULL,
  `date_created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_transactions`
--

INSERT INTO `tbl_transactions` (`form_id`, `user_id`, `event_id`, `kiosk_id`, `date_req`, `purpose`, `status`, `receipt_number`, `file_size`, `file_type`, `file_name`, `date_created`) VALUES
(1, 56, 1, 9, '2024-12-29 00:00:00', 'To gather essential information from applicants for kiosk re', 'finished', '098765ao', 0, '', '67485510eec72_Document1.pdf', '2024-11-28 19:33:37'),
(2, 61, 1, 11, '2024-11-30 00:00:00', 'asdasdsa', 'pending', '', 0, '', '674859123077b_Basanta.pdf', '2024-11-28 19:50:42'),
(3, 62, 1, 10, '2024-11-30 00:00:00', 'TO SHOW CASE MY PRODUCTS', 'finished', '', 0, '', 'letter.pdf', '2024-11-28 20:21:39'),
(4, 62, 1, 12, '2024-12-01 00:00:00', 'TO SHOW CASE MY PRODUCTS', 'pending', '', 0, '', '6748629a328e0_letterofintent.pdf', '2024-11-28 20:31:22'),
(5, 62, 1, 8, '2024-12-07 00:00:00', 'asdsad', 'pending', '', 0, '', '6748636d62332_letter of intent.pdf', '2024-11-28 20:34:53'),
(6, 56, 1, 6, '2024-11-30 00:00:00', 'I want to get a kioks to sell my products', 'pending', '', 0, '', '67493370526af_letter of intent.pdf', '2024-11-29 11:22:24'),
(7, 56, 1, 6, '2024-11-30 00:00:00', 'I want to get a kioks to sell my products', 'paid', '', 0, '', '6749337053c34_letter of intent.pdf', '2024-11-29 11:22:24'),
(8, 64, 1, 1, '2024-12-02 00:00:00', 'TO SHOW CASE MY PRODUCTS', 'paid', '009230678', 0, '', '67494db32bda1_letter of intent.pdf', '2024-11-29 13:14:27');

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
(59, 'Edwin', 'Bugna', '2147483647', 'chmsua910@gmail.com', 'CHMSU-A Executive Director', 'Ex-Director', '$2y$10$e568jnzylju2I5pqLQgO7.tBmtqvsSl0TWGxLybY8SGwVcTBXkqxy', 'EX-Director', '1', '', '2024-11-28 18:45:25', 'e364f6ce-771c-45fb-a468-71379030d040', 0, 1, 1, 0, 0, 0),
(60, 'Admin', 'Admin', '2147483647', 'chmsua910@gmail.com', 'CHMSU-A Admin', 'Admin', '$2y$10$a0MlzbGrhufAzJBCGPpQ0.cgKw63C4G8a/9USMv32ghqap8rHWC2G', 'admin', '1', '', '2024-11-28 18:50:08', 'd619f9b6-f9c4-42e3-8aa3-86e7e1763afd', 0, 1, 1, 1, 1, 1),
(61, 'asdsad', 'asdasd', '09056685366', 'asdasd@gmail.com', 'asdasd23', 'asdasd23', '$2y$10$rbRD0Hw9zK4pgBkOPP19sOyzqul1xVwUJcLCEQOuwBLFRLG90PXi6', 'user', '1', '', '2024-11-28 19:49:16', '13b5bf90-41b4-4c77-8b97-1bd0b5f88a9e', 0, 0, 0, 0, 0, 0),
(62, 'Ajin', 'Joseph', '09095410778', 'josephairajean@gmail.com', 'POTATO CORNER', 'Ajin', '$2y$10$QgtDMgSVHGv1qWxCFv6Hme64LdToQmWNKHdyhZ24xAqtzIxVVSpdC', 'user', '1', '', '2024-11-28 20:17:10', '5eaf9525-2bf3-4aa9-a0c3-9e3a693597c9', 0, 0, 0, 0, 0, 0),
(63, 'Ash', 'Jyven', '09098575663', 'ashjyven@gmail.com', 'TAKO-TAKO', 'Ash', '$2y$10$fmySja5uNleHcWrQ7azk2uSZvKV1pVuPmDSHOHyGq3tOTYPmSjoPS', 'user', '1', '', '2024-11-28 20:37:40', 'fff13556-96be-4d48-bafd-f7c4c526156e', 0, 0, 0, 0, 0, 0),
(64, 'Teya', 'Jaena', '09095410777', 'aprilmahusayjeana@gmail.com', 'Waffle', 'teya', '$2y$10$9LLVLOLObdggGVuGyUdp4ODZHqx7mNqCjErKZHMWd68TSYKOPuEim', 'user', '1', '', '2024-11-29 12:46:11', '8f43c2b0-3125-4676-813c-0e0a580e73a7', 0, 0, 0, 0, 0, 0),
(65, 'master', 'shomai', '09073551685', 'w25128882@gmail.com', 'shomaai', 'master', '$2y$10$ZJ7lYtAsTvQzLx6vbS/DJOjoPj4CXNfWf6lP8yj/asAmn8MlcW16u', 'user', '1', '', '2024-11-29 18:54:05', '49b6d8ab-c71e-4464-aed7-33a24f7beda1', 0, 0, 0, 0, 0, 0);

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
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_kiosk`
--
ALTER TABLE `tbl_kiosk`
  MODIFY `kiosk_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `tbl_notifications`
--
ALTER TABLE `tbl_notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `tbl_transactions`
--
ALTER TABLE `tbl_transactions`
  MODIFY `form_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `user_info_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

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
