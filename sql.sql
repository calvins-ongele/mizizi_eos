-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 09, 2026 at 10:02 AM
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
-- Database: `mizizi`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(30) DEFAULT NULL,
  `entity` varchar(100) DEFAULT NULL,
  `entity_id` int(11) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `calendar`
--

CREATE TABLE `calendar` (
  `id` int(11) NOT NULL,
  `uuid` varchar(50) DEFAULT uuid(),
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime NOT NULL,
  `status` enum('pending','cancelled','completed','in_session') DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `company_id` varchar(50) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `calendar`
--

INSERT INTO `calendar` (`id`, `uuid`, `start_date`, `end_date`, `status`, `title`, `notes`, `created_by`, `customer_id`, `customer_name`, `customer_email`, `company_id`, `customer_phone`, `created_at`) VALUES
(1, '80c613e4-6588-11f1-aaf7-482ae38fc1e4', '2026-06-22 18:00:00', '2026-06-24 18:00:00', 'pending', 'Task', 'n', 1, NULL, NULL, NULL, '2e682df5-2de9-445e-937d-34f8db3260fb', NULL, '2026-06-11 14:25:40'),
(2, 'be05a359-6588-11f1-aaf7-482ae38fc1e4', '2026-06-22 18:00:00', '2026-06-24 18:00:00', 'pending', 'Interview', 'xc', 1, NULL, NULL, NULL, '2e682df5-2de9-445e-937d-34f8db3260fb', NULL, '2026-06-11 14:27:23'),
(3, '62e830b7-6598-11f1-aaf7-482ae38fc1e4', '2026-06-03 18:00:00', '2026-06-04 18:00:00', 'pending', 'Stock', 'xcer', 1, NULL, NULL, NULL, '2e682df5-2de9-445e-937d-34f8db3260fb', NULL, '2026-06-11 16:19:22');

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `tel` varchar(20) DEFAULT NULL,
  `logo` varchar(100) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`id`, `name`, `email`, `tel`, `logo`, `description`) VALUES
(NULL, 'My Org', 'email@company.com', '0712345678', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `company_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `email`, `phone`, `address`, `created_at`, `company_id`) VALUES
(1, 'Calvin Ongele', 'calvinsongele@gmail.com', '0706031920', 'b 40100', '2026-06-23 21:18:05', '2e682df5-2de9-445e-937d-34f8db3260fb'),
(2, 'Calvin Ongele', 'calvinsongele@gmail.com', '0706031920', 'b 40100', '2026-06-23 21:22:14', '2e682df5-2de9-445e-937d-34f8db3260fb'),
(9, 'Calvin Ongele', 'calvinsongele@gmail.com', '0706031920', 'Kisumu 40100', '2026-07-02 11:54:55', '2e682df5-2de9-445e-937d-34f8db3260fb');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `category` enum('Travel','Office Supplies','Utilities','Travel','Marketing','Maintenance','Software','Compliance','Salaries & Wages') DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `amount` decimal(14,2) DEFAULT NULL,
  `status` enum('paid','pending','overdue') DEFAULT 'paid',
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `company_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `category`, `description`, `amount`, `status`, `created_by`, `created_at`, `company_id`) VALUES
(1, 'Utilities', 'arb', 100.00, 'paid', 1, '2026-06-24 00:01:40', '2e682df5-2de9-445e-937d-34f8db3260fb'),
(2, 'Marketing', 'marketing', 3500.00, 'paid', 1, '2026-06-24 00:50:28', '2e682df5-2de9-445e-937d-34f8db3260fb'),
(3, 'Compliance', 'license', 50000.00, 'paid', 1, '2026-06-24 00:53:11', '2e682df5-2de9-445e-937d-34f8db3260fb');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `uuid` varchar(50) DEFAULT NULL,
  `invoice_no` varchar(30) NOT NULL,
  `total` decimal(14,2) NOT NULL,
  `invoice_date` datetime DEFAULT current_timestamp(),
  `invoice_due_date` datetime NOT NULL,
  `message` varchar(300) DEFAULT NULL,
  `invoice_data` longtext DEFAULT NULL,
  `payment_status` enum('pending','paid','cancelled','refunded','overdue') DEFAULT 'pending',
  `invoice_status` enum('draft','sent','paid','cancelled') DEFAULT 'draft',
  `created_by` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `customer_address` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `company_id` varchar(50) DEFAULT NULL,
  `invoice_discount` decimal(12,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `uuid`, `invoice_no`, `total`, `invoice_date`, `invoice_due_date`, `message`, `invoice_data`, `payment_status`, `invoice_status`, `created_by`, `customer_id`, `customer_name`, `customer_email`, `customer_phone`, `customer_address`, `created_at`, `company_id`, `invoice_discount`) VALUES
(1, 'a3609d44-f41f-4eeb-8648-d9e3f4debe3f', 'Inv-193', 400.00, '2026-06-19 00:00:00', '2026-06-19 00:00:00', '', '[{\"id\":\"dddf78b0-5855-42de-8d7f-695fa95b91e1\",\"product\":\"jj\",\"quantity\":4,\"unit\":\"4\",\"price\":100,\"vat\":0},{\"id\":\"858b7d97-abfe-402f-9940-55f1c9a5de86\",\"product\":\"lo\",\"quantity\":2,\"unit\":\"3\",\"price\":400,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-17 11:37:38', '2e682df5-2de9-445e-937d-34f8db3260fb', NULL),
(2, '3a468460-1396-4c2b-a970-f6f412aab22b', 'c34', 7200.00, '2026-06-05 00:00:00', '2026-06-05 00:00:00', 'cfd', '[{\"id\":\"088e308e-fb0d-44b8-a548-d88bea93c990\",\"product\":\"7\",\"quantity\":9,\"unit\":\"kj\",\"price\":800,\"vat\":0},{\"id\":\"91e7036b-11c0-4bbc-a74a-70a87dbae62a\",\"product\":\"5\",\"quantity\":45,\"unit\":\"cv\",\"price\":433,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-17 12:06:43', '2e682df5-2de9-445e-937d-34f8db3260fb', NULL),
(3, '791f6650-a63e-4ae4-a177-cbaf1622a90a', 'c34', 26685.00, '2026-06-05 00:00:00', '2026-06-05 00:00:00', 'cfd', '[{\"id\":\"088e308e-fb0d-44b8-a548-d88bea93c990\",\"product\":\"7\",\"quantity\":9,\"unit\":\"kj\",\"price\":800,\"vat\":0},{\"id\":\"91e7036b-11c0-4bbc-a74a-70a87dbae62a\",\"product\":\"5\",\"quantity\":45,\"unit\":\"cv\",\"price\":433,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-17 12:08:35', '2e682df5-2de9-445e-937d-34f8db3260fb', NULL),
(4, 'e96b4c0b-4d21-4623-a30c-a5347526c10e', 'c34', 26685.00, '2026-06-05 00:00:00', '2026-06-05 00:00:00', 'cfd', '[{\"id\":\"088e308e-fb0d-44b8-a548-d88bea93c990\",\"product\":\"7\",\"quantity\":9,\"unit\":\"kj\",\"price\":800,\"vat\":0},{\"id\":\"91e7036b-11c0-4bbc-a74a-70a87dbae62a\",\"product\":\"5\",\"quantity\":45,\"unit\":\"cv\",\"price\":433,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-17 12:08:39', '2e682df5-2de9-445e-937d-34f8db3260fb', NULL),
(5, '1b3950c8-d20e-4b0a-a79b-46e8e636cb25', 'c34', 26685.00, '2026-06-05 00:00:00', '2026-06-05 00:00:00', 'cfd', '[{\"id\":\"088e308e-fb0d-44b8-a548-d88bea93c990\",\"product\":\"7\",\"quantity\":9,\"unit\":\"kj\",\"price\":800,\"vat\":0},{\"id\":\"91e7036b-11c0-4bbc-a74a-70a87dbae62a\",\"product\":\"5\",\"quantity\":45,\"unit\":\"cv\",\"price\":433,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-17 12:08:55', '2e682df5-2de9-445e-937d-34f8db3260fb', NULL),
(6, '969eafae-a23a-4dcb-b4fc-22c38252dff3', 'c34', 26685.00, '2026-06-05 00:00:00', '2026-06-05 00:00:00', 'cfd', '[{\"id\":\"088e308e-fb0d-44b8-a548-d88bea93c990\",\"product\":\"7\",\"quantity\":9,\"unit\":\"kj\",\"price\":800,\"vat\":0},{\"id\":\"91e7036b-11c0-4bbc-a74a-70a87dbae62a\",\"product\":\"5\",\"quantity\":45,\"unit\":\"cv\",\"price\":433,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-17 12:11:12', '2e682df5-2de9-445e-937d-34f8db3260fb', NULL),
(7, 'f87cc505-7375-4f3c-bfb2-11e8c545117d', 'c34', 26685.00, '2026-06-05 00:00:00', '2026-06-05 00:00:00', 'cfd', '[{\"id\":\"088e308e-fb0d-44b8-a548-d88bea93c990\",\"product\":\"7\",\"quantity\":9,\"unit\":\"kj\",\"price\":800,\"vat\":0},{\"id\":\"91e7036b-11c0-4bbc-a74a-70a87dbae62a\",\"product\":\"5\",\"quantity\":45,\"unit\":\"cv\",\"price\":433,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-17 12:12:21', '2e682df5-2de9-445e-937d-34f8db3260fb', NULL),
(8, 'dd8d4522-a0b0-40c7-bd79-6d568f1512e8', 'c34', 26685.00, '2026-06-05 00:00:00', '2026-06-05 00:00:00', 'cfd', '[{\"id\":\"088e308e-fb0d-44b8-a548-d88bea93c990\",\"product\":\"7\",\"quantity\":9,\"unit\":\"kj\",\"price\":800,\"vat\":0},{\"id\":\"91e7036b-11c0-4bbc-a74a-70a87dbae62a\",\"product\":\"5\",\"quantity\":45,\"unit\":\"cv\",\"price\":433,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-17 12:12:25', '2e682df5-2de9-445e-937d-34f8db3260fb', NULL),
(9, '484a0c1b-79c4-470e-80ad-c8c20306f647', 'c34', 26685.00, '2026-06-05 00:00:00', '2026-06-05 00:00:00', 'cfd', '[{\"id\":\"088e308e-fb0d-44b8-a548-d88bea93c990\",\"product\":\"7\",\"quantity\":9,\"unit\":\"kj\",\"price\":800,\"vat\":0},{\"id\":\"91e7036b-11c0-4bbc-a74a-70a87dbae62a\",\"product\":\"5\",\"quantity\":45,\"unit\":\"cv\",\"price\":433,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-17 12:14:53', '2e682df5-2de9-445e-937d-34f8db3260fb', NULL),
(10, '2ac49eb2-c865-402d-96d8-d0dc40261a21', 'c34', 26685.00, '2026-06-05 00:00:00', '2026-06-05 00:00:00', 'cfd', '[{\"id\":\"088e308e-fb0d-44b8-a548-d88bea93c990\",\"product\":\"7\",\"quantity\":9,\"unit\":\"kj\",\"price\":800,\"vat\":0},{\"id\":\"91e7036b-11c0-4bbc-a74a-70a87dbae62a\",\"product\":\"5\",\"quantity\":45,\"unit\":\"cv\",\"price\":433,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-17 12:15:21', '2e682df5-2de9-445e-937d-34f8db3260fb', NULL),
(11, 'd1bd8fea-4210-4d80-9c37-81d5596b4d61', 'c34', 26685.00, '2026-06-05 00:00:00', '2026-06-05 00:00:00', 'cfd', '[{\"id\":\"088e308e-fb0d-44b8-a548-d88bea93c990\",\"product\":\"7\",\"quantity\":9,\"unit\":\"kj\",\"price\":800,\"vat\":0},{\"id\":\"91e7036b-11c0-4bbc-a74a-70a87dbae62a\",\"product\":\"5\",\"quantity\":45,\"unit\":\"cv\",\"price\":433,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-17 12:15:25', '2e682df5-2de9-445e-937d-34f8db3260fb', NULL),
(12, 'd109c918-02b2-4315-aa23-13ef4b6ee965', 'c34', 26685.00, '2026-06-05 00:00:00', '2026-06-05 00:00:00', 'cfd', '[{\"id\":\"088e308e-fb0d-44b8-a548-d88bea93c990\",\"product\":\"7\",\"quantity\":9,\"unit\":\"kj\",\"price\":800,\"vat\":0},{\"id\":\"91e7036b-11c0-4bbc-a74a-70a87dbae62a\",\"product\":\"5\",\"quantity\":45,\"unit\":\"cv\",\"price\":433,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-17 12:15:26', '2e682df5-2de9-445e-937d-34f8db3260fb', NULL),
(13, '3bbdc9f3-af77-4456-b4cd-d74726c0bd70', 'c34', 26685.00, '2026-06-05 00:00:00', '2026-06-05 00:00:00', 'cfd', '[{\"id\":\"088e308e-fb0d-44b8-a548-d88bea93c990\",\"product\":\"7\",\"quantity\":9,\"unit\":\"kj\",\"price\":800,\"vat\":0},{\"id\":\"91e7036b-11c0-4bbc-a74a-70a87dbae62a\",\"product\":\"5\",\"quantity\":45,\"unit\":\"cv\",\"price\":433,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-17 12:15:27', '2e682df5-2de9-445e-937d-34f8db3260fb', NULL),
(14, '34306217-c09d-402b-8c70-9889d65b6008', 'c34', 26685.00, '2026-06-05 00:00:00', '2026-06-05 00:00:00', 'cfd', '[{\"id\":\"088e308e-fb0d-44b8-a548-d88bea93c990\",\"product\":\"7\",\"quantity\":9,\"unit\":\"kj\",\"price\":800,\"vat\":0},{\"id\":\"91e7036b-11c0-4bbc-a74a-70a87dbae62a\",\"product\":\"5\",\"quantity\":45,\"unit\":\"cv\",\"price\":433,\"vat\":0}]', 'pending', 'draft', 1, NULL, 'Calvin Ongele', 'calvinsongele@gmail.com', '0706031920', NULL, '2026-06-17 12:15:50', '2e682df5-2de9-445e-937d-34f8db3260fb', NULL),
(15, 'e7acc121-6fa5-42e3-9ca2-dceeaa25642e', 'c34', 26685.00, '2026-06-05 00:00:00', '2026-06-05 00:00:00', 'cfd', '[{\"id\":\"088e308e-fb0d-44b8-a548-d88bea93c990\",\"product\":\"7\",\"quantity\":9,\"unit\":\"kj\",\"price\":800,\"vat\":0},{\"id\":\"91e7036b-11c0-4bbc-a74a-70a87dbae62a\",\"product\":\"5\",\"quantity\":45,\"unit\":\"cv\",\"price\":433,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-17 12:16:06', '2e682df5-2de9-445e-937d-34f8db3260fb', NULL),
(16, '274c66f5-b8a1-4ed2-a579-2b98a0f97b8c', 'sdsd', 0.00, '2026-06-17 00:00:00', '2026-06-17 00:00:00', 'sd', '[{\"id\":\"2e8cc604-2898-47c7-bfd3-3c4c0cd78cd0\",\"product\":\"dsd\",\"quantity\":4,\"unit\":\"g\",\"price\":43,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-23 20:47:13', '2e682df5-2de9-445e-937d-34f8db3260fb', 0.00),
(17, 'f6196259-5353-4a6d-88bb-fe4296277fcc', 'sdsd', 172.00, '2026-06-17 00:00:00', '2026-06-17 00:00:00', 'sd', '[{\"id\":\"2e8cc604-2898-47c7-bfd3-3c4c0cd78cd0\",\"product\":\"dsd\",\"quantity\":4,\"unit\":\"g\",\"price\":43,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-23 20:47:13', '2e682df5-2de9-445e-937d-34f8db3260fb', 0.00),
(18, 'd80d1885-89ed-40b0-8f69-2d37b4b1b9e4', 'sdsd', 172.00, '2026-06-17 00:00:00', '2026-06-17 00:00:00', 'sd', '[{\"id\":\"2e8cc604-2898-47c7-bfd3-3c4c0cd78cd0\",\"product\":\"dsd\",\"quantity\":4,\"unit\":\"g\",\"price\":43,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-23 20:47:13', '2e682df5-2de9-445e-937d-34f8db3260fb', 0.00),
(19, '0e9f4a80-4521-4d4f-bb55-d03cdd570467', 'Inv-3939', 0.00, '2026-06-26 00:00:00', '2026-06-26 00:00:00', 'Okay. please', '[{\"id\":\"d9b407c3-df65-48bf-ac5c-a16c0c345ecd\",\"product\":\"m\",\"quantity\":3,\"unit\":\"kj\",\"price\":500,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-23 21:15:19', '2e682df5-2de9-445e-937d-34f8db3260fb', 0.00),
(20, '2abeb909-53cf-43c0-823f-8a902da821aa', 'INV-1782238653211', 14140.00, '2026-06-25 00:00:00', '2026-06-25 00:00:00', 'dsd', '[{\"id\":\"d69f65cf-d44a-42b2-827f-7628c1effc8c\",\"product\":\"rer\",\"quantity\":4,\"unit\":\"4\",\"price\":3535,\"vat\":0},{\"id\":\"327d5363-455e-472c-b1b1-a2349ce1086d\",\"product\":\"\",\"quantity\":1,\"unit\":\"\",\"price\":0,\"vat\":0}]', 'pending', 'sent', 1, NULL, 'Calvin Ongele', 'calvinsongele@gmail.com', '0706031920', 'Kisumu 40100', '2026-06-23 21:17:33', '2e682df5-2de9-445e-937d-34f8db3260fb', 0.00),
(21, 'b517b095-a1b4-473f-a54a-fc72f02e4259', 'INV-1782239168482', 14140.00, '2026-06-25 00:00:00', '2026-06-25 00:00:00', 'dsd', '[{\"id\":\"d69f65cf-d44a-42b2-827f-7628c1effc8c\",\"product\":\"rer\",\"quantity\":4,\"unit\":\"4\",\"price\":3535,\"vat\":0},{\"id\":\"327d5363-455e-472c-b1b1-a2349ce1086d\",\"product\":\"\",\"quantity\":1,\"unit\":\"\",\"price\":0,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-23 21:26:08', '2e682df5-2de9-445e-937d-34f8db3260fb', 0.00),
(22, 'a2b5b8c3-3f65-45d3-8c62-42da76dbd4c0', 'INV-1782239486928', 14140.00, '2026-06-25 00:00:00', '2026-06-25 00:00:00', 'dsd', '[{\"id\":\"d69f65cf-d44a-42b2-827f-7628c1effc8c\",\"product\":\"rer\",\"quantity\":4,\"unit\":\"4\",\"price\":3535,\"vat\":0},{\"id\":\"327d5363-455e-472c-b1b1-a2349ce1086d\",\"product\":\"\",\"quantity\":1,\"unit\":\"\",\"price\":0,\"vat\":0}]', 'pending', 'draft', 1, NULL, NULL, NULL, NULL, NULL, '2026-06-23 21:31:27', '2e682df5-2de9-445e-937d-34f8db3260fb', 0.00),
(23, '6ff99d62-4f6e-47b4-a270-77884f4b992a', 'INV-1782239570218', 0.00, '2026-06-12 00:00:00', '2026-06-12 00:00:00', 'cd', '[{\"id\":\"31afa19d-bf48-4837-a704-6f638c71dbb9\",\"product\":\"d\",\"quantity\":3,\"unit\":\"g\",\"price\":434,\"vat\":0}]', 'pending', 'sent', 1, NULL, 'Calvin Ongele', 'calvinsongele@gmail.com', '0706031920', 'Kisumu 40100', '2026-06-23 21:32:50', '2e682df5-2de9-445e-937d-34f8db3260fb', 0.00),
(24, 'a715182a-63bd-484b-844e-05671af1ca3d', 'INV-1782239974216', 0.00, '2026-06-20 00:00:00', '2026-06-20 00:00:00', 'dsdsd', '[{\"id\":\"330d067e-88df-45a5-a34c-27497b364b37\",\"product\":\"fe\",\"quantity\":32,\"unit\":\"f\",\"price\":4343,\"vat\":0}]', 'pending', 'sent', 1, NULL, 'Calvin Ongele', 'calvinsongele@gmail.com', '0706031920', 'Kisumu 40100', '2026-06-23 21:39:34', '2e682df5-2de9-445e-937d-34f8db3260fb', 0.00),
(25, 'ace9a3de-58d2-412a-b665-4cafcbce809d', 'INV-1782982489016', 660.00, '2026-07-17 00:00:00', '2026-07-17 00:00:00', '', '[{\"id\":\"08991f4b-f299-4297-9b30-6fc3f8b4143e\",\"product\":\"Soda\",\"quantity\":12,\"unit\":\"500ml\",\"price\":50,\"vat\":0},{\"id\":\"b239f09d-3751-4654-b0bf-63a4904c8d21\",\"product\":\"Bread\",\"quantity\":2,\"unit\":\"50g\",\"price\":30,\"vat\":0}]', 'pending', 'sent', 1, NULL, 'Calvin Ongele', 'calvinsongele@gmail.com', '0706031920', 'Kisumu 40100', '2026-07-02 11:54:49', '2e682df5-2de9-445e-937d-34f8db3260fb', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `mpesa_transactions`
--

CREATE TABLE `mpesa_transactions` (
  `id` int(11) NOT NULL,
  `checkout_request_id` varchar(100) DEFAULT NULL,
  `receipt_no` varchar(30) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `amount` decimal(14,2) DEFAULT NULL,
  `status` enum('pending','success','failed') DEFAULT NULL,
  `callback_payload` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `id` int(11) NOT NULL,
  `uuid` varchar(50) DEFAULT uuid(),
  `customer_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `institution_name` varchar(100) DEFAULT NULL,
  `address` varchar(150) DEFAULT NULL,
  `website` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `capacity_allowed` int(11) DEFAULT 30,
  `status` enum('active','pending','deactivated') DEFAULT NULL,
  `license_key` varchar(255) DEFAULT NULL,
  `license_type` enum('trial','paid') DEFAULT NULL,
  `license_id` int(11) DEFAULT NULL,
  `license_expiry` datetime NOT NULL,
  `pin` varchar(50) DEFAULT 'PIN001234'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`id`, `uuid`, `customer_name`, `phone`, `email`, `institution_name`, `address`, `website`, `created_at`, `capacity_allowed`, `status`, `license_key`, `license_type`, `license_id`, `license_expiry`, `pin`) VALUES
(1, '2e682df5-2de9-445e-937d-34f8db3260fb', 'John Brooks', '0712345678', 'info@miziziclassifieds.com', 'Mizizi Trial', 'Marjo Complex', 'www.miziziclassifieds.com', '2026-07-02 13:15:56', 30, NULL, 's', 'paid', 1, '2026-07-02 12:14:41', 'PIN001234');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `uuid` varchar(100) DEFAULT NULL,
  `sale_id` int(11) DEFAULT NULL,
  `amount_received` decimal(14,2) DEFAULT 0.00,
  `method` enum('Mpesa_STK','Cash','Mpesa_Paybill','Card') DEFAULT NULL,
  `amount` decimal(14,2) DEFAULT NULL,
  `reference` varchar(150) DEFAULT NULL,
  `status` enum('pending','confirmed','failed') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `uuid`, `sale_id`, `amount_received`, `method`, `amount`, `reference`, `status`, `created_at`) VALUES
(1, 'fbb7cb75-d6f1-46b6-9a69-98bd24b12b3d', 3, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 12:57:59'),
(2, 'd6c0a255-3a0a-4222-9abf-f8a170740664', 5, 0.00, 'Cash', 270.00, 'Sale', 'confirmed', '2026-07-02 13:02:57'),
(3, 'b2a45e22-315f-4ea7-9e28-4eeb22e2f489', 6, 0.00, 'Cash', 370.00, 'Sale', 'confirmed', '2026-07-02 13:05:33'),
(4, '02f86919-bd48-45d5-9909-33065341ab5e', 7, 0.00, 'Cash', 450.00, 'Sale', 'confirmed', '2026-07-02 13:19:48'),
(5, 'fae243df-696b-4723-adc5-353024dbd667', 8, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 13:34:12'),
(6, 'a324da71-c269-4c44-b7ce-7a2ce1ffac45', 9, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 13:37:58'),
(7, '552425e5-5687-42d4-b9ce-817b86ae8d81', 10, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 13:40:10'),
(8, '984e445b-57a9-4815-81f1-d86058f15297', 11, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 13:46:20'),
(9, '1d2e742d-2334-4f46-8baf-418d2f131fb9', 12, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 13:48:13'),
(10, 'a5568d78-6718-4772-ad13-f15eb58196c3', 13, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 13:48:58'),
(11, '9098de0e-2203-46af-b24a-2351d87728e0', 14, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 13:49:54'),
(12, '31f0bb46-460a-4522-b926-b133c6152c9a', 15, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 13:51:31'),
(13, '5e03c078-2a68-432f-9035-ec22a4ab7fb3', 16, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 13:54:17'),
(14, 'b1ca347d-bf61-450b-80c7-36b2a7f2bc19', 17, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 13:54:29'),
(15, '77363486-168c-4317-9a79-1f91c7ebe295', 18, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 13:55:47'),
(16, '619f635d-edcb-4460-b3c7-620dee00e184', 18, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 13:55:59'),
(17, 'fa120216-6e12-478c-b971-002a59799a88', 19, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 13:56:47'),
(18, '9b9a6efe-726e-4353-bca5-539220cad0bb', 20, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 13:56:57'),
(19, '82e3eaa2-8a7f-47c0-bd28-34333448b3ff', 21, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 13:57:18'),
(20, '8e7205ed-7706-4cd7-89da-3bd7b3a7ffe4', 22, 0.00, 'Cash', 180.00, 'Sale', 'confirmed', '2026-07-02 14:00:25'),
(21, '571474ad-0e12-405b-bf1a-6aa31263eb04', 23, 0.00, 'Cash', 450.00, 'Sale', 'confirmed', '2026-07-02 14:00:57'),
(22, '61acd73c-ff41-43ba-92f1-565db8a1c79f', 24, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 14:08:09'),
(23, 'bb1e3a3b-b80b-4fd6-b900-7c38f0148b5a', 26, 0.00, 'Cash', 450.00, 'Sale', 'confirmed', '2026-07-02 14:11:38'),
(24, '478c0ad5-9c79-49ae-829c-afb32cf7ac56', 27, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-02 14:15:50'),
(25, '66a7ddf5-3e8e-4402-8f1e-69e94b21e641', 28, 0.00, 'Cash', 1330.00, 'Sale', 'confirmed', '2026-07-02 15:04:14'),
(26, '343bfac8-be58-4c6c-9ff9-a1381aac6b3a', 29, 0.00, 'Cash', 430.00, 'Sale', 'confirmed', '2026-07-02 15:08:11'),
(27, '4dcb3153-2902-4f47-8890-30f928ece486', 30, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-04 18:07:35'),
(28, '912b2fcc-1639-4bc4-a7c5-29104a6f6a3a', 31, 0.00, 'Cash', 350.00, 'Sale', 'confirmed', '2026-07-07 16:29:46'),
(29, '2b4f25d8-dd75-42f4-940c-10ecd36f96b3', 33, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-07 16:34:37'),
(30, 'a79863ad-4427-41e0-af1a-998bd6aae925', 34, 0.00, 'Cash', 100.00, 'Sale', 'confirmed', '2026-07-07 16:36:59'),
(31, 'f29017fc-a7dc-4b4d-93f9-311975103eda', 35, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-07 16:39:52'),
(32, 'd71d67c9-20c8-4d61-acd3-2f8d3866050b', 36, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-08 08:53:17'),
(33, 'a2bba4c8-5b54-494b-82a5-35ff2724fd63', 37, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-08 09:18:28'),
(34, '719c6cc3-55b4-45e1-acd8-613f2b2a4f31', 38, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-08 09:44:18'),
(35, '5e06d1f3-1b7b-4e72-abb0-fb16c5f05eaa', 39, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-08 09:57:44'),
(36, '5f1cd83e-5298-4777-a27a-052df99c4c42', 40, 0.00, 'Cash', 350.00, 'Sale', 'confirmed', '2026-07-08 09:58:07'),
(37, '083dba42-a690-4cb7-a9b9-a9bb0bf19e65', 41, 0.00, 'Cash', 350.00, 'Sale', 'confirmed', '2026-07-08 10:00:12'),
(38, '493ea90c-3b3f-437d-9afe-a586e9012b8f', 42, 0.00, 'Cash', 180.00, 'Sale', 'confirmed', '2026-07-08 10:05:58'),
(39, '13eb34b2-176a-414a-b6bc-8e66aeca0ef5', 43, 0.00, 'Cash', 860.00, 'Sale', 'confirmed', '2026-07-08 10:13:34'),
(40, 'f141d8eb-1868-46b5-829a-64d8b47d134f', 44, 0.00, 'Cash', 430.00, 'Sale', 'confirmed', '2026-07-08 10:16:58'),
(41, '4505f17a-6eda-4c39-a89c-80b3dbb7513b', 45, 0.00, 'Cash', 280.00, 'Sale', 'confirmed', '2026-07-08 10:17:44'),
(42, '76c495ed-f9f4-4644-8137-6d10d05f97a1', 46, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-08 10:18:19'),
(43, '3cd1c26a-cb52-4d72-9b94-a8c19c791988', 47, 0.00, 'Cash', 350.00, 'Sale', 'confirmed', '2026-07-08 10:49:27'),
(44, '5e0ba08b-004a-46ec-a501-bc4fefee715f', 48, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-08 10:54:01'),
(45, '7e354599-2370-43be-9e9a-f2b710fef784', 49, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-08 10:55:40'),
(46, 'd29d2037-c151-466a-b5bf-b76d6a1031db', 50, 0.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-08 10:58:11'),
(47, '1afb15b8-f17e-4b3a-a85d-22d4c2e1cdbd', 51, 100.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-08 11:27:49'),
(48, 'e5fce73c-059a-4759-8d68-7ea462804612', 52, 1000.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-08 11:29:57'),
(49, '8b8671d3-4209-4f43-a78a-5b967ac69038', 52, 1000.00, 'Cash', 80.00, 'Sale', 'confirmed', '2026-07-08 11:32:17'),
(50, '97b6ff8e-cf1e-4921-b261-525918097146', 53, 1000.00, 'Cash', 620.00, 'Sale', 'confirmed', '2026-07-09 10:04:32'),
(51, 'bf441abb-6eed-4478-b5c2-ccfbe8cd36d4', 54, 300.00, 'Cash', 300.00, 'Sale', 'confirmed', '2026-07-09 10:09:53');

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `uid` varchar(50) DEFAULT uuid(),
  `name` varchar(50) DEFAULT NULL,
  `monthly_price` decimal(14,2) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `is_favourite` int(11) DEFAULT 0,
  `icon` varchar(30) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `uid`, `name`, `monthly_price`, `created_by`, `is_favourite`, `icon`, `created_at`) VALUES
(1, '3c0acdda-7586-11f1-8689-482ae38fc1e4', 'Basic', 1000.00, 1, 0, ' bi-star', '2026-07-01 22:41:12'),
(2, '3c0ad1fc-7586-11f1-8689-482ae38fc1e4', 'Standard', 1500.00, 1, 1, 'bi-star-half', '2026-07-01 22:41:12'),
(3, '3c0ad403-7586-11f1-8689-482ae38fc1e4', 'Business', 2500.00, 1, 0, 'bi-star-fill', '2026-07-01 22:42:50');

-- --------------------------------------------------------

--
-- Table structure for table `pos`
--

CREATE TABLE `pos` (
  `id` int(11) NOT NULL,
  `uid` varchar(50) DEFAULT uuid(),
  `cart_value` decimal(14,2) DEFAULT NULL,
  `customer_name` varchar(50) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `customer_email` varchar(50) DEFAULT NULL,
  `cart_data` longtext DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `company_id` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pos`
--

INSERT INTO `pos` (`id`, `uid`, `cart_value`, `customer_name`, `customer_phone`, `customer_email`, `cart_data`, `created_by`, `company_id`, `created_at`) VALUES
(1, 'cb5de3d5-716b-11f1-8689-482ae38fc1e4', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":67,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-26 17:32:01'),
(2, '13c25bec-7595-11f1-8689-482ae38fc1e4', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 00:36:28'),
(3, '79c6bbbd-a576-43e5-832f-54feb7d40f57', 270.00, '', '', '', '[{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 01:31:47'),
(4, '5a39dd2a-a42f-4f1c-b42d-8846bdcded08', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 12:57:30'),
(5, 'a33d2f2a-5827-4e62-81fc-c16b413cbc0a', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 12:57:46'),
(6, 'c3f80052-4183-4c4f-86fc-12e0f277d185', 270.00, '', '', '', '[{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:00:15'),
(7, '49308698-0475-4fac-9c34-96774994f082', 270.00, 'John Brooks', '0706031920', '', '[{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:02:52'),
(8, '701ec8a6-67db-452b-918e-8b598fcc21c4', 370.00, 'Calvin Ongele', '0706031920', '', '[{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":1},{\"barcode\":\"BC-FANTA-500\",\"product_name\":\"Fanta Orange 500ml\",\"price\":100,\"available\":30,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:05:29'),
(9, '769a6fcc-f6eb-4c3f-8ac0-c9d141e26f10', 450.00, '', '', '', '[{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":1},{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":2},{\"barcode\":\"BC-FANTA-500\",\"product_name\":\"Fanta Orange 500ml\",\"price\":100,\"available\":30,\"qty\":3}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:19:13'),
(10, '8a78bcc6-cc9c-4ad2-98e2-fd4b04d61c0a', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:32:40'),
(11, 'e31500ee-20fc-4f5f-9ec0-6d2f93dbabdd', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:37:53'),
(12, '4918abd8-89d2-42ca-8c98-d8425f7bc83a', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:40:08'),
(13, '693ee1db-63e8-4ef9-8063-596779e0a51e', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:46:17'),
(14, 'f5221ad7-aa61-4cb1-8bc7-efb3785d88f0', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:48:11'),
(15, '48b47a4d-cc76-40a4-8762-58de867a4839', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:48:55'),
(16, '03f1499f-73d6-4409-89bb-e3daff5d52df', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:49:52'),
(17, '1f01d7d4-c1d7-4628-af69-28e866418f19', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:51:28'),
(18, '97590d8a-7eaf-4576-a895-213a38604090', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:54:14'),
(19, '7d948982-01ec-4423-9cc9-4e63e0cd7de9', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:54:27'),
(20, '01d67e63-61e8-4f9d-ba8b-a2d4d2361eb9', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:55:45'),
(21, '7307b12b-5827-4271-990d-79c94fd091f1', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:56:44'),
(22, '4d8a71c3-6c4a-47c8-84f6-75fdb5eb502c', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:56:54'),
(23, '97a7d079-bb45-461c-9248-fa1c26b5238f', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:57:14'),
(24, 'c08b658d-dabe-4d11-9def-023829e03274', 180.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1},{\"barcode\":\"BC-FANTA-500\",\"product_name\":\"Fanta Orange 500ml\",\"price\":100,\"available\":30,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 14:00:22'),
(25, 'aa26355f-73ca-4157-bc39-188a8943ba08', 450.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1},{\"barcode\":\"BC-FANTA-500\",\"product_name\":\"Fanta Orange 500ml\",\"price\":100,\"available\":30,\"qty\":1},{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 14:00:55'),
(26, '03ca9ddb-77ac-44c3-b3b1-aec67f50b525', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 14:07:48'),
(27, 'b97eafbb-d08b-4c2d-b8e4-dbeb63fe316e', 450.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":4},{\"barcode\":\"BC-FANTA-500\",\"product_name\":\"Fanta Orange 500ml\",\"price\":100,\"available\":30,\"qty\":3},{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":2}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 14:09:10'),
(28, '3b1744a3-5255-4659-9adb-b24ee9f256a0', 450.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":4},{\"barcode\":\"BC-FANTA-500\",\"product_name\":\"Fanta Orange 500ml\",\"price\":100,\"available\":30,\"qty\":2},{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":3}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 14:09:56'),
(29, '8a4b537c-ae61-4d31-b70b-dddf92040bc0', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 14:15:48'),
(30, '6e31369e-7662-4b25-a14a-8006086dc80e', 1330.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":4},{\"barcode\":\"BC-FANTA-500\",\"product_name\":\"Fanta Orange 500ml\",\"price\":100,\"available\":30,\"qty\":2},{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":3}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 15:04:09'),
(31, 'b29ebc35-9163-4c82-85c9-b8215c1c9acc', 430.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":2},{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 15:08:09'),
(32, 'a07055f7-607f-4443-a3eb-60e8ad94e2bd', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-04 18:07:25'),
(33, 'cacab43f-fbe8-4136-9fc7-d3e1c50c9715', 350.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1},{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-07 16:29:39'),
(34, 'b801dff4-060b-4e2d-b1b1-f3da5c8ddb01', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-07 16:34:32'),
(35, 'ce0b4851-7fe3-4a89-a094-19967c65819a', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-07 16:34:32'),
(36, '348bb44c-3fb9-49c0-9db8-f84fb4b750c5', 100.00, '', '', '', '[{\"barcode\":\"BC-FANTA-500\",\"product_name\":\"Fanta Orange 500ml\",\"price\":100,\"available\":30,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-07 16:36:56'),
(37, '08531539-0780-4f23-9156-a87caaf4e306', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-07 16:39:49'),
(38, '4ff4b752-e73f-482c-aaf1-4496bf4fbebd', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 08:53:14'),
(39, 'a932944c-ddbd-41df-b204-d2ba15062983', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 09:18:24'),
(40, '8d26320c-1e52-46e6-8a11-2735da94971a', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 09:44:15'),
(41, '103a5658-ec92-494c-988c-4c2eefb88f08', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 09:57:41'),
(42, 'ee0a8ece-246d-4ca7-9a0d-da49c856d86f', 350.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1},{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 09:58:05'),
(43, 'fdcc4617-828f-444d-8260-53e246d3ab41', 350.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1},{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:00:09'),
(44, '59b003b8-f2cc-4b10-a810-8474fd9ebcab', 180.00, '', '', '', '[{\"barcode\":\"BC-FANTA-500\",\"product_name\":\"Fanta Orange 500ml\",\"price\":100,\"available\":30,\"qty\":1},{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:05:55'),
(45, 'f8764aeb-de0f-43d9-a3bb-93b9cec721b5', 860.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":4},{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":2}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:13:32'),
(46, 'eaf311ba-ebdd-4ee1-a479-da0166446140', 430.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":2},{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:16:54'),
(47, '7498c160-b3ad-432a-b242-882e5f8fcc4a', 280.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1},{\"barcode\":\"BC-FANTA-500\",\"product_name\":\"Fanta Orange 500ml\",\"price\":100,\"available\":30,\"qty\":2}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:17:41'),
(48, '63dc699e-da51-4be2-9f58-c3be02769e1b', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:18:16'),
(49, 'ee08978a-ef21-4380-b671-6495257f58b9', 350.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1},{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:48:12'),
(50, '2eb52a69-e589-4b3e-a439-378b1b8f4d68', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:53:56'),
(51, '797626f3-2c8c-44fa-94ab-69a84729e0c3', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:55:27'),
(52, '7f12a3ad-e5b3-4fdd-8ed3-67b97153a27b', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:58:07'),
(53, '5a5c6434-9798-4e83-b4a0-3b487a0d17b1', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 11:27:44'),
(54, 'd897b056-f8a0-4e36-92f7-15579a2776d4', 80.00, '', '', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 11:29:51'),
(55, '861e6983-ae56-4987-b53e-b76541463a57', 620.00, 'Calvin Ongele', '0706031920', '', '[{\"barcode\":\"BC-BLC-50\",\"product_name\":\"Fanta Blackcurrent 500ml\",\"price\":80,\"available\":70,\"qty\":1},{\"barcode\":\"BC-GUIN-440\",\"product_name\":\"Guinness Can 440ml\",\"price\":270,\"available\":30,\"qty\":2}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-09 10:04:25'),
(56, 'c85f7af5-fa1d-4001-9174-bee2d971fcd4', 300.00, '', '', '', '[{\"barcode\":\"BC-FANTA-500\",\"product_name\":\"Fanta Orange 500ml\",\"price\":100,\"available\":30,\"qty\":3}]', 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-09 10:09:39');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(140) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `image` varchar(100) DEFAULT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `published` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(140) DEFAULT NULL,
  `company_id` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`id`, `name`, `company_id`, `created_at`) VALUES
(3, 'Soft Drinks', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 11:02:19'),
(4, 'Energy Drinks', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 11:39:59'),
(5, 'Whisky', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 15:14:17'),
(6, 'Vodka', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 15:14:21'),
(7, 'Beer', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 15:14:25'),
(8, 'Snacks', '2e682df5-2de9-445e-637d-34f8db3260fb', '2026-06-02 15:14:25');

-- --------------------------------------------------------

--
-- Table structure for table `product_definitions`
--

CREATE TABLE `product_definitions` (
  `id` int(11) NOT NULL,
  `uuid` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `size` varchar(40) DEFAULT NULL,
  `barcode` varchar(50) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `cost_price` decimal(14,2) DEFAULT NULL,
  `selling_price` decimal(14,2) DEFAULT NULL,
  `is_serialized` int(11) DEFAULT 0,
  `is_active` int(11) DEFAULT 1,
  `product_company_id` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_definitions`
--

INSERT INTO `product_definitions` (`id`, `uuid`, `name`, `size`, `barcode`, `category_id`, `unit_id`, `cost_price`, `selling_price`, `is_serialized`, `is_active`, `product_company_id`, `created_at`, `updated_at`) VALUES
(1, 'adc48a09-008d-472a-8b90-32ffdb84bc07', 'Fanta Blackcurrent', '500ml', 'BC-BLC-50', 3, 1, 62.00, 80.00, NULL, 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 11:13:58', '2026-06-02 15:55:14'),
(12, '05a18f4e-5e7e-11f1-aaf7-482ae38fc1e4', 'Guinness Can', '440ml', 'BC-GUIN-440', 7, 3, 190.00, 270.00, 0, 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 15:24:17', '2026-06-02 15:54:16'),
(13, '05a1b77b-5e7e-11f1-aaf7-482ae38fc1e4', 'Smirnoff Red', '750ml', 'BC-SMIR-750', 6, 3, 850.00, 1100.00, 0, 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 15:24:17', '2026-06-02 15:54:33'),
(14, '05a1b8a3-5e7e-11f1-aaf7-482ae38fc1e4', 'VAT 69', '375ml', 'BC-VAT69-375', 5, 3, 600.00, 750.00, 0, 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 15:24:17', '2026-06-02 15:54:37'),
(15, '05a1b95b-5e7e-11f1-aaf7-482ae38fc1e4', 'VAT 69', '750ml', 'BC-VAT69-750', 5, 3, 1150.00, 1400.00, 0, 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 15:24:17', '2026-06-02 15:54:31'),
(19, '1b3df5e3-5e7e-11f1-aaf7-482ae38fc1e4', 'Fanta Orange', '500ml', 'BC-FANTA-500', 3, 3, 60.00, 100.00, 0, 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 15:24:53', '2026-06-02 15:54:35'),
(20, '1b3e0576-5e7e-11f1-aaf7-482ae38fc1e4', 'Sprite', '500ml', 'BC-SPRITE-500', 3, 3, 60.00, 100.00, 0, 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 15:24:53', '2026-06-02 15:54:28'),
(21, '1b3e064f-5e7e-11f1-aaf7-482ae38fc1e4', 'Pepsi', '500ml', 'BC-PEPSI-500', 3, 3, 55.00, 95.00, 0, 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 15:24:53', '2026-06-02 15:54:25'),
(23, '1b3e0774-5e7e-11f1-aaf7-482ae38fc1e4', 'Popcorn', '100g', 'BC-POP-100', 8, 4, 70.00, 120.00, 0, 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 15:24:53', '2026-06-02 15:54:21'),
(24, '1b3e07da-5e7e-11f1-aaf7-482ae38fc1e4', 'Biscuits', '150g', 'BC-BISC-150', 8, 4, 90.00, 140.00, 0, 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 15:24:53', '2026-06-02 15:54:19'),
(32, '6e3e8d96-eef7-45b6-94b7-3e8b315c7511', 'Samsung Phone', '500g', '2003503578387', 4, 4, 1000.00, 1500.00, NULL, 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 12:39:38', '2026-07-08 12:39:38'),
(33, 'ea1d605d-fec3-4b97-b879-cdc61dfc020a', 'Tecno Phone', '50g', '2005051684689', 4, 4, 2000.00, 2500.00, NULL, 1, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 13:06:08', '2026-07-08 13:06:08');

-- --------------------------------------------------------

--
-- Table structure for table `product_items`
--

CREATE TABLE `product_items` (
  `id` int(11) NOT NULL,
  `uuid` varchar(50) DEFAULT NULL,
  `product_definition_id` int(11) DEFAULT NULL,
  `serial_number` varchar(40) DEFAULT NULL,
  `status` enum('in_stock','sold','damaged','returned') DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

CREATE TABLE `purchases` (
  `id` int(11) NOT NULL,
  `uuid` varchar(50) DEFAULT NULL,
  `supplier_name` int(11) DEFAULT NULL,
  `total_cost` decimal(14,2) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_definition_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `cost_price` decimal(14,2) DEFAULT NULL,
  `company_id` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` (`id`, `uuid`, `supplier_name`, `total_cost`, `user_id`, `product_definition_id`, `quantity`, `cost_price`, `company_id`, `created_at`) VALUES
(1, '3e7ce072-5e7e-11f1-aaf7-482ae38fc1e4', NULL, 15000.00, 1, NULL, 1000, NULL, NULL, '2026-06-02 15:25:53'),
(2, '49ec5514-5e7e-11f1-aaf7-482ae38fc1e4', NULL, 15000.00, 1, NULL, 1000, NULL, NULL, '2026-06-02 15:26:12'),
(3, NULL, NULL, 2280.00, 1, NULL, 12, NULL, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-06 00:00:45'),
(4, 'a2dcef43-7671-405b-8f62-92ac6d96ca38', 1, 806.00, 1, NULL, 13, NULL, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-06 00:32:18'),
(5, '6a2d04b1-6023-4172-9f21-8002e00f3e7c', 1, 186.00, 1, NULL, 3, NULL, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-01 16:07:10'),
(6, '6fa84df1-b1c0-48f5-9adf-e42e75b3d6a2', 1, 50000.00, 1, NULL, 50, NULL, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 12:44:19'),
(7, 'f5742ff4-c553-46cb-b278-2c17610bacb9', 1, 100000.00, 1, NULL, 100, NULL, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 12:59:25'),
(8, '4db5d7d6-8341-4336-a652-115d24367216', 1, 160000.00, 1, NULL, 80, NULL, '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 13:11:55');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_items`
--

CREATE TABLE `purchase_items` (
  `id` int(11) NOT NULL,
  `purchase_id` int(11) DEFAULT NULL,
  `product_definition_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `cost_price` decimal(14,2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_items`
--

INSERT INTO `purchase_items` (`id`, `purchase_id`, `product_definition_id`, `quantity`, `cost_price`, `created_at`) VALUES
(7, 2, 1, 24, 180.00, '2026-06-02 15:27:09'),
(8, 2, 12, 12, 190.00, '2026-06-02 15:27:09'),
(9, 2, 13, 30, 60.00, '2026-06-02 15:27:09'),
(10, 3, 12, 12, 190.00, '2026-06-06 00:00:45'),
(11, 4, 1, 13, 62.00, '2026-06-06 00:32:18'),
(12, 5, 1, 3, 62.00, '2026-07-01 16:07:10'),
(14, 7, 32, 100, 1000.00, '2026-07-08 12:59:25'),
(15, 8, 33, 80, 2000.00, '2026-07-08 13:11:55');

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `id` int(11) NOT NULL,
  `requested_by` int(11) DEFAULT NULL,
  `action` enum('delete_profile','edit_email') DEFAULT NULL,
  `company_id` varchar(100) DEFAULT NULL,
  `requested_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`id`, `requested_by`, `action`, `company_id`, `requested_at`) VALUES
(1, 1, 'delete_profile', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-23 18:23:53'),
(2, 1, 'delete_profile', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-23 18:27:30');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'SuperAdmin'),
(2, 'Admin'),
(3, 'Cashier'),
(4, 'Buyer'),
(5, 'Auditor'),
(6, 'Customer');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `uuid` varchar(100) DEFAULT NULL,
  `receipt_no` varchar(30) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `subtotal` decimal(14,2) DEFAULT NULL,
  `discount` decimal(14,2) DEFAULT NULL,
  `total` decimal(14,2) DEFAULT NULL,
  `status` enum('pending','paid','cancelled') DEFAULT 'pending',
  `company_id` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `uuid`, `receipt_no`, `user_id`, `subtotal`, `discount`, `total`, `status`, `company_id`, `created_at`) VALUES
(1, '79c6bbbd-a576-43e5-832f-54feb7d40f57', 'SAL-7', 1, 270.00, 0.00, 270.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 01:31:47'),
(2, '5a39dd2a-a42f-4f1c-b42d-8846bdcded08', 'SAL-31604', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 12:57:30'),
(3, 'a33d2f2a-5827-4e62-81fc-c16b413cbc0a', 'SAL-45728', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 12:57:46'),
(4, 'c3f80052-4183-4c4f-86fc-12e0f277d185', 'SAL-31668', 1, 270.00, 0.00, 270.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:00:15'),
(5, '49308698-0475-4fac-9c34-96774994f082', 'SAL-20890', 1, 270.00, 0.00, 270.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:02:52'),
(6, '701ec8a6-67db-452b-918e-8b598fcc21c4', 'SAL-21157', 1, 370.00, 0.00, 370.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:05:29'),
(7, '769a6fcc-f6eb-4c3f-8ac0-c9d141e26f10', 'SAL-86610', 1, 450.00, 0.00, 450.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:19:13'),
(8, '8a78bcc6-cc9c-4ad2-98e2-fd4b04d61c0a', 'SAL-11861', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:32:40'),
(9, 'e31500ee-20fc-4f5f-9ec0-6d2f93dbabdd', 'SAL-93534', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:37:53'),
(10, '4918abd8-89d2-42ca-8c98-d8425f7bc83a', 'SAL-33270', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:40:08'),
(11, '693ee1db-63e8-4ef9-8063-596779e0a51e', 'SAL-69982', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:46:17'),
(12, 'f5221ad7-aa61-4cb1-8bc7-efb3785d88f0', 'SAL-54601', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:48:11'),
(13, '48b47a4d-cc76-40a4-8762-58de867a4839', 'SAL-23878', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:48:55'),
(14, '03f1499f-73d6-4409-89bb-e3daff5d52df', 'SAL-97852', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:49:52'),
(15, '1f01d7d4-c1d7-4628-af69-28e866418f19', 'SAL-93888', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:51:28'),
(16, '97590d8a-7eaf-4576-a895-213a38604090', 'SAL-23120', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:54:14'),
(17, '7d948982-01ec-4423-9cc9-4e63e0cd7de9', 'SAL-74527', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:54:27'),
(18, '01d67e63-61e8-4f9d-ba8b-a2d4d2361eb9', 'SAL-34102', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:55:45'),
(19, '7307b12b-5827-4271-990d-79c94fd091f1', 'SAL-29778', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:56:44'),
(20, '4d8a71c3-6c4a-47c8-84f6-75fdb5eb502c', 'SAL-71849', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:56:54'),
(21, '97a7d079-bb45-461c-9248-fa1c26b5238f', 'SAL-57170', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 13:57:14'),
(22, 'c08b658d-dabe-4d11-9def-023829e03274', 'SAL-37968', 1, 180.00, 0.00, 180.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 14:00:22'),
(23, 'aa26355f-73ca-4157-bc39-188a8943ba08', 'SAL-50853', 1, 450.00, 0.00, 450.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 14:00:55'),
(24, '03ca9ddb-77ac-44c3-b3b1-aec67f50b525', 'SAL-24812', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 14:07:48'),
(25, 'b97eafbb-d08b-4c2d-b8e4-dbeb63fe316e', 'SAL-52494', 1, 450.00, 0.00, 450.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 14:09:10'),
(26, '3b1744a3-5255-4659-9adb-b24ee9f256a0', 'SAL-84752', 1, 450.00, 0.00, 450.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 14:09:56'),
(27, '8a4b537c-ae61-4d31-b70b-dddf92040bc0', 'SAL-46328', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 14:15:48'),
(28, '6e31369e-7662-4b25-a14a-8006086dc80e', 'SAL-39908', 1, 1330.00, 0.00, 1330.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 15:04:09'),
(29, 'b29ebc35-9163-4c82-85c9-b8215c1c9acc', 'SAL-32020', 1, 430.00, 0.00, 430.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-02 15:08:09'),
(30, 'a07055f7-607f-4443-a3eb-60e8ad94e2bd', 'SAL-33183', 1, 80.00, 0.00, 80.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-04 18:07:25'),
(31, 'cacab43f-fbe8-4136-9fc7-d3e1c50c9715', 'SAL-19192', 1, 350.00, 0.00, 350.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-07 16:29:39'),
(32, 'b801dff4-060b-4e2d-b1b1-f3da5c8ddb01', 'SAL-65159', 1, 80.00, 0.00, 80.00, 'pending', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-07 16:34:32'),
(33, 'ce0b4851-7fe3-4a89-a094-19967c65819a', 'SAL-95184', 1, 80.00, 0.00, 80.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-07 16:34:32'),
(34, '348bb44c-3fb9-49c0-9db8-f84fb4b750c5', 'SAL-60332', 1, 100.00, 0.00, 100.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-07 16:36:56'),
(35, '08531539-0780-4f23-9156-a87caaf4e306', 'SAL-33469', 1, 80.00, 0.00, 80.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-07 16:39:49'),
(36, '4ff4b752-e73f-482c-aaf1-4496bf4fbebd', 'SAL-30051', 1, 80.00, 0.00, 80.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 08:53:14'),
(37, 'a932944c-ddbd-41df-b204-d2ba15062983', 'SAL-81691', 1, 80.00, 0.00, 80.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 09:18:24'),
(38, '8d26320c-1e52-46e6-8a11-2735da94971a', 'SAL-14943', 1, 80.00, 0.00, 80.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 09:44:15'),
(39, '103a5658-ec92-494c-988c-4c2eefb88f08', 'SAL-89241', 1, 80.00, 0.00, 80.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 09:57:41'),
(40, 'ee0a8ece-246d-4ca7-9a0d-da49c856d86f', 'SAL-97440', 1, 350.00, 0.00, 350.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 09:58:05'),
(41, 'fdcc4617-828f-444d-8260-53e246d3ab41', 'SAL-75287', 1, 350.00, 0.00, 350.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:00:09'),
(42, '59b003b8-f2cc-4b10-a810-8474fd9ebcab', 'SAL-90533', 1, 180.00, 0.00, 180.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:05:55'),
(43, 'f8764aeb-de0f-43d9-a3bb-93b9cec721b5', 'SAL-26583', 1, 860.00, 0.00, 860.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:13:32'),
(44, 'eaf311ba-ebdd-4ee1-a479-da0166446140', 'SAL-29118', 1, 430.00, 0.00, 430.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:16:54'),
(45, '7498c160-b3ad-432a-b242-882e5f8fcc4a', 'SAL-29858', 1, 280.00, 0.00, 280.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:17:41'),
(46, '63dc699e-da51-4be2-9f58-c3be02769e1b', 'SAL-57368', 1, 80.00, 0.00, 80.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:18:16'),
(47, 'ee08978a-ef21-4380-b671-6495257f58b9', 'SAL-19735', 1, 350.00, 0.00, 350.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:48:12'),
(48, '2eb52a69-e589-4b3e-a439-378b1b8f4d68', 'SAL-20880', 1, 80.00, 0.00, 80.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:53:56'),
(49, '797626f3-2c8c-44fa-94ab-69a84729e0c3', 'SAL-56453', 1, 80.00, 0.00, 80.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:55:27'),
(50, '7f12a3ad-e5b3-4fdd-8ed3-67b97153a27b', 'SAL-54300', 1, 80.00, 0.00, 80.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 10:58:07'),
(51, '5a5c6434-9798-4e83-b4a0-3b487a0d17b1', 'SAL-73075', 1, 80.00, 0.00, 80.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 11:27:44'),
(52, 'd897b056-f8a0-4e36-92f7-15579a2776d4', 'SAL-12613', 1, 80.00, 0.00, 80.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-08 11:29:51'),
(53, '861e6983-ae56-4987-b53e-b76541463a57', 'SAL-63285', 1, 620.00, 0.00, 620.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-09 10:04:25'),
(54, 'c85f7af5-fa1d-4001-9174-bee2d971fcd4', 'SAL-49738', 1, 300.00, 0.00, 300.00, 'paid', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-07-09 10:09:39');

-- --------------------------------------------------------

--
-- Table structure for table `sale_items`
--

CREATE TABLE `sale_items` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) DEFAULT NULL,
  `product_definition_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `selling_price` decimal(14,2) DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `serialized_item_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale_items`
--

INSERT INTO `sale_items` (`id`, `sale_id`, `product_definition_id`, `quantity`, `selling_price`, `total`, `serialized_item_id`) VALUES
(1, 3, 1, 1, 80.00, 80, NULL),
(2, 5, 12, 1, 270.00, 270, NULL),
(3, 6, 12, 1, 270.00, 270, NULL),
(4, 6, 19, 1, 100.00, 100, NULL),
(5, 7, 12, 1, 270.00, 270, NULL),
(6, 7, 1, 2, 80.00, 160, NULL),
(7, 7, 19, 3, 100.00, 300, NULL),
(8, 8, 1, 1, 80.00, 80, NULL),
(9, 9, 1, 1, 80.00, 80, NULL),
(10, 10, 1, 1, 80.00, 80, NULL),
(11, 11, 1, 1, 80.00, 80, NULL),
(12, 12, 1, 1, 80.00, 80, NULL),
(13, 13, 1, 1, 80.00, 80, NULL),
(14, 14, 1, 1, 80.00, 80, NULL),
(15, 15, 1, 1, 80.00, 80, NULL),
(16, 16, 1, 1, 80.00, 80, NULL),
(17, 17, 1, 1, 80.00, 80, NULL),
(18, 18, 1, 1, 80.00, 80, NULL),
(19, 18, 1, 1, 80.00, 80, NULL),
(20, 19, 1, 1, 80.00, 80, NULL),
(21, 20, 1, 1, 80.00, 80, NULL),
(22, 21, 1, 1, 80.00, 80, NULL),
(23, 22, 1, 1, 80.00, 80, NULL),
(24, 22, 19, 1, 100.00, 100, NULL),
(25, 23, 1, 1, 80.00, 80, NULL),
(26, 23, 19, 1, 100.00, 100, NULL),
(27, 23, 12, 1, 270.00, 270, NULL),
(28, 24, 1, 1, 80.00, 80, NULL),
(29, 26, 1, 4, 80.00, 320, NULL),
(30, 26, 1, 4, 80.00, 320, NULL),
(31, 26, 1, 4, 80.00, 320, NULL),
(32, 27, 1, 1, 80.00, 80, NULL),
(33, 27, 1, 1, 80.00, 80, NULL),
(34, 27, 1, 1, 80.00, 80, NULL),
(35, 27, 1, 1, 80.00, 80, NULL),
(36, 28, 1, 4, 80.00, 320, NULL),
(37, 28, 1, 4, 80.00, 320, NULL),
(38, 28, 1, 4, 80.00, 320, NULL),
(39, 28, 1, 4, 80.00, 320, NULL),
(40, 28, 1, 4, 80.00, 320, NULL),
(41, 28, 1, 4, 80.00, 320, NULL),
(42, 29, 1, 2, 80.00, 160, NULL),
(43, 29, 1, 2, 80.00, 160, NULL),
(44, 29, 1, 2, 80.00, 160, NULL),
(45, 29, 12, 1, 270.00, 270, NULL),
(46, 27, 1, 1, 80.00, 80, NULL),
(47, 28, 1, 4, 80.00, 320, NULL),
(48, 28, 19, 2, 100.00, 200, NULL),
(49, 28, 12, 3, 270.00, 810, NULL),
(50, 29, 1, 2, 80.00, 160, NULL),
(51, 29, 12, 1, 270.00, 270, NULL),
(52, 30, 1, 1, 80.00, 80, NULL),
(53, 30, 1, 1, 80.00, 80, NULL),
(54, 31, 1, 1, 80.00, 80, NULL),
(55, 31, 12, 1, 270.00, 270, NULL),
(56, 33, 1, 1, 80.00, 80, NULL),
(57, 34, 19, 1, 100.00, 100, NULL),
(58, 35, 1, 1, 80.00, 80, NULL),
(59, 36, 1, 1, 80.00, 80, NULL),
(60, 37, 1, 1, 80.00, 80, NULL),
(61, 37, 1, 1, 80.00, 80, NULL),
(62, 38, 1, 1, 80.00, 80, NULL),
(63, 39, 1, 1, 80.00, 80, NULL),
(64, 40, 1, 1, 80.00, 80, NULL),
(65, 40, 12, 1, 270.00, 270, NULL),
(66, 41, 1, 1, 80.00, 80, NULL),
(67, 41, 12, 1, 270.00, 270, NULL),
(68, 42, 19, 1, 100.00, 100, NULL),
(69, 42, 1, 1, 80.00, 80, NULL),
(70, 43, 1, 4, 80.00, 320, NULL),
(71, 43, 12, 2, 270.00, 540, NULL),
(72, 44, 1, 2, 80.00, 160, NULL),
(73, 44, 12, 1, 270.00, 270, NULL),
(74, 45, 1, 1, 80.00, 80, NULL),
(75, 45, 19, 2, 100.00, 200, NULL),
(76, 46, 1, 1, 80.00, 80, NULL),
(77, 47, 1, 1, 80.00, 80, NULL),
(78, 47, 12, 1, 270.00, 270, NULL),
(79, 48, 1, 1, 80.00, 80, NULL),
(80, 49, 1, 1, 80.00, 80, NULL),
(81, 50, 1, 1, 80.00, 80, NULL),
(82, 50, 1, 1, 80.00, 80, NULL),
(83, 51, 1, 1, 80.00, 80, NULL),
(84, 52, 1, 1, 80.00, 80, NULL),
(85, 52, 1, 1, 80.00, 80, NULL),
(86, 53, 1, 1, 80.00, 80, NULL),
(87, 53, 12, 2, 270.00, 540, NULL),
(88, 53, 1, 1, 80.00, 80, NULL),
(89, 53, 12, 2, 270.00, 540, NULL),
(90, 54, 19, 3, 100.00, 300, NULL),
(91, 54, 19, 3, 100.00, 300, NULL),
(92, 54, 19, 3, 100.00, 300, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `value` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stock_movements`
--

CREATE TABLE `stock_movements` (
  `id` int(11) NOT NULL,
  `uuid` varchar(50) DEFAULT NULL,
  `product_definition_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `type` enum('purchase','sale','adjustment','return') DEFAULT NULL,
  `reference_type` varchar(100) DEFAULT NULL,
  `reference_id` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_movements`
--

INSERT INTO `stock_movements` (`id`, `uuid`, `product_definition_id`, `quantity`, `type`, `reference_type`, `reference_id`, `user_id`, `created_at`) VALUES
(1, '743a765a-5e7e-11f1-aaf7-482ae38fc1e4', 1, 24, 'purchase', 'purchase', '2', 1, '2026-06-02 15:27:23'),
(2, '743a9257-5e7e-11f1-aaf7-482ae38fc1e4', 13, 12, 'purchase', 'purchase', '2', 1, '2026-06-02 15:27:23'),
(3, '743a9490-5e7e-11f1-aaf7-482ae38fc1e4', 12, 30, 'purchase', 'purchase', '2', 1, '2026-06-02 15:27:23'),
(4, 'adc48a09-008d-472a-8b90-32ffdb84bc07', 1, 30, 'purchase', 'purchase', '2', 1, '2026-06-02 15:27:23'),
(5, 'ade48a09-008d-472a-8b90-32ffdb84bc07', 19, 30, 'purchase', 'purchase', '2', 1, '2026-06-02 15:27:23'),
(6, '440c33f7-9f30-4385-a5a7-8d640351a4bc', 1, 13, 'purchase', 'purchase', NULL, 1, '2026-06-06 00:32:18'),
(7, '71737cea-5faf-4a30-a0e5-9d4b689b8b80', 1, 3, 'purchase', 'purchase', NULL, 1, '2026-07-01 16:07:10'),
(8, 'e575889b-afa7-4d3c-85a7-ed383152561f', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 12:57:59'),
(9, '9d2ad786-77d8-4cf7-b6b6-b2352ba007ee', 12, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:02:57'),
(10, 'cfd802e8-90c5-4bb0-8a5e-6f5c9a286d2a', 12, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:05:33'),
(11, '7cf0e3c1-0da9-457c-86a8-2ab75688943c', 19, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:05:33'),
(12, '42e511ab-17ea-4129-818a-9892191a146d', 12, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:19:48'),
(13, '3635ad6d-960d-4dfe-ba5a-978e88a69cf5', 1, -2, 'sale', 'Sale', '15', 1, '2026-07-02 13:19:48'),
(14, 'd474fc40-3710-4295-8fa9-771a12528ba3', 19, -3, 'sale', 'Sale', '15', 1, '2026-07-02 13:19:48'),
(15, '6ac531f7-7a08-480c-be35-36d123b38d14', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:34:12'),
(16, 'dc1152cc-7f2e-406a-9a26-8d88aff911d1', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:37:58'),
(17, 'b0eacf40-0bed-4366-ae15-8c17c8b53258', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:40:10'),
(18, 'a6f840c5-8326-478f-808b-42a42c610597', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:46:20'),
(19, 'bc6f50e0-06d1-4c33-ad58-ac8a9f8a399c', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:48:13'),
(20, '8fd7980a-4413-48c6-abba-2bdc5fd68034', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:48:58'),
(21, '91c04557-c623-47df-8532-b709bff876e8', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:49:54'),
(22, 'f729a4f1-4d60-4ae7-b5b2-33308676bb84', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:51:31'),
(23, '39e85223-2f8d-4f88-9537-103144bc5fc6', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:54:17'),
(24, 'eaef850d-cc5d-45a8-bb88-e4ae599c2320', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:54:29'),
(25, '7dae0205-d1bf-4484-b20f-ca7b5a41e155', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:55:47'),
(26, 'c35a5877-72d1-4787-90e4-ce070756a3c8', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:55:59'),
(27, '47088563-d181-46a4-9efa-2aa7525fbbc0', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:56:47'),
(28, '48701631-0509-49ae-bc74-2875a23552e7', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:56:57'),
(29, 'cd1b7fd0-6558-4d99-8f93-c1ee4598539a', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 13:57:18'),
(30, 'b3dca4cc-8c9b-40ee-a1a2-9acdde2ee3e2', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 14:00:25'),
(31, '0f28396a-4c98-4d12-bc5d-69ee0f511dc2', 19, -1, 'sale', 'Sale', '15', 1, '2026-07-02 14:00:25'),
(32, '1fa2dbd3-1d49-478f-a230-6711c1e5eabc', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 14:00:57'),
(33, 'f0ea4863-9552-4f3f-bc65-076d7379eb81', 19, -1, 'sale', 'Sale', '15', 1, '2026-07-02 14:00:57'),
(34, '01920d9a-a031-43ce-b140-4e3cfa0163b5', 12, -1, 'sale', 'Sale', '15', 1, '2026-07-02 14:00:57'),
(35, '86f2ab3e-8567-49fe-8ec1-2deab919be23', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 14:08:09'),
(36, '76c2027b-ea63-4679-9046-dd627fbe7ffe', 1, -4, 'sale', 'Sale', '15', 1, '2026-07-02 14:11:38'),
(37, '8e0db7fd-227d-405b-84b1-3463579b22f0', 1, -4, 'sale', 'Sale', '15', 1, '2026-07-02 14:11:38'),
(38, 'f805a008-ce1a-4407-b295-b7582f7cde67', 1, -4, 'sale', 'Sale', '15', 1, '2026-07-02 14:11:38'),
(39, 'da6900b6-b67a-4ffe-8f5c-6d9cf47489cf', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 14:15:50'),
(40, '869253d2-05f4-4354-a681-331db004818a', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 15:01:55'),
(41, 'd029ee76-d84a-4b93-8aaa-d85510213154', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 15:02:04'),
(42, '0649f6b6-50b3-40d1-8491-bff17fa05592', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 15:03:16'),
(43, '33b62def-b234-4312-842b-98e50a728002', 1, -4, 'sale', 'Sale', '15', 1, '2026-07-02 15:04:14'),
(44, '72615142-8a75-411a-aec5-eeae071c80c1', 1, -4, 'sale', 'Sale', '15', 1, '2026-07-02 15:04:14'),
(45, '9eb26c97-d8c9-496e-bca8-838adedbf675', 1, -4, 'sale', 'Sale', '15', 1, '2026-07-02 15:04:14'),
(46, '8ab28cab-778a-4493-8cc1-3ae592189c3f', 1, -4, 'sale', 'Sale', '15', 1, '2026-07-02 15:04:32'),
(47, '878d3694-10f3-46c2-afe2-c9fd3e099610', 1, -4, 'sale', 'Sale', '15', 1, '2026-07-02 15:04:32'),
(48, 'aa2e16f6-da8c-46d5-83f4-0a1eb7e1f1d9', 1, -4, 'sale', 'Sale', '15', 1, '2026-07-02 15:04:32'),
(49, '2d68fea9-90c5-4c85-998f-4050a2b3f130', 1, -2, 'sale', 'Sale', '15', 1, '2026-07-02 15:08:11'),
(50, '41812b83-a430-45b5-8b92-0da4d558f651', 1, -2, 'sale', 'Sale', '15', 1, '2026-07-02 15:08:11'),
(51, '22511a11-8c22-47a1-8944-4d7060d7c5ef', 1, -2, 'sale', 'Sale', '15', 1, '2026-07-02 15:10:02'),
(52, 'fc59a76d-ccc2-4d9c-86e0-35a0712851ac', 12, -1, 'sale', 'Sale', '15', 1, '2026-07-02 15:10:02'),
(53, 'b4d3704a-7327-4202-94b2-acf014ea1246', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-02 17:02:01'),
(54, 'f6f60242-1171-40b0-a7b3-c7b929c934be', 1, -4, 'sale', 'Sale', '15', 1, '2026-07-03 01:00:28'),
(55, '6f64caee-c621-465a-951a-b34a98bcd5ba', 19, -2, 'sale', 'Sale', '15', 1, '2026-07-03 01:00:28'),
(56, 'eb3fc63c-43e6-43cc-a6be-6a83988f42ea', 12, -3, 'sale', 'Sale', '15', 1, '2026-07-03 01:00:28'),
(57, 'f969aa60-7338-4364-aa22-fb7c916db5ef', 1, -2, 'sale', 'Sale', '15', 1, '2026-07-03 01:00:38'),
(58, '35bd35e6-22ed-4e12-a335-a52b7ed4db79', 12, -1, 'sale', 'Sale', '15', 1, '2026-07-03 01:00:38'),
(59, '967e069a-29e8-4214-9d7a-69f4ffd05868', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-04 18:07:35'),
(60, '3e9c3137-76f9-4d22-a363-fea64b069a5f', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-07 09:27:00'),
(61, '1d57766b-a0a2-4e07-bb7b-d0b89b5cf78d', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-07 16:29:46'),
(62, '966b3745-1413-43aa-9091-d8e60f1eb6d5', 12, -1, 'sale', 'Sale', '15', 1, '2026-07-07 16:29:46'),
(63, 'acb89dcf-fec5-41fb-990e-b8c633c862d0', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-07 16:34:37'),
(64, '6628eb65-26f7-451a-97ec-adc6abb10b7a', 19, -1, 'sale', 'Sale', '15', 1, '2026-07-07 16:36:59'),
(65, 'c2db9a6b-a829-4dbf-83a3-3b8160556e7a', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-07 16:39:52'),
(66, '4479db91-dc31-456d-a727-c6d7d00d4e43', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 08:53:17'),
(67, 'a8026ae2-c637-471b-b8cc-50d1318be867', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 09:18:28'),
(68, '1ebac11d-30ad-4376-8e70-32557aa20dc9', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 09:21:24'),
(69, 'eb0fd777-9a87-4501-8359-82a7e78bf307', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 09:44:18'),
(70, '95358b9c-b8e5-4aeb-bc5e-a79ba69937ee', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 09:57:44'),
(71, 'f149e690-3a47-4f06-8a26-1cfeb28b3dd0', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 09:58:07'),
(72, 'c044bb3a-e296-444a-912a-6b0f68b19e24', 12, -1, 'sale', 'Sale', '15', 1, '2026-07-08 09:58:07'),
(73, 'c97db2b7-cdd6-451a-9f14-44173a0de3ca', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 10:00:12'),
(74, '8e54b155-dd39-4338-933e-39ae26294c35', 12, -1, 'sale', 'Sale', '15', 1, '2026-07-08 10:00:12'),
(75, 'a84b5702-be46-4075-b302-f7ae51bf36f5', 19, -1, 'sale', 'Sale', '15', 1, '2026-07-08 10:05:58'),
(76, 'a8463b46-1d8c-4c12-a551-7478861cbd9f', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 10:05:58'),
(77, 'cd4f3cfd-835a-4813-bb26-4c8a2d1de0f3', 1, -4, 'sale', 'Sale', '15', 1, '2026-07-08 10:13:34'),
(78, '82f16ace-fadc-4414-9e95-8568de058fe5', 12, -2, 'sale', 'Sale', '15', 1, '2026-07-08 10:13:34'),
(79, 'b822929c-3ddd-4d23-a822-cd4feadcd076', 1, -2, 'sale', 'Sale', '15', 1, '2026-07-08 10:16:57'),
(80, 'bfd47c58-ebbf-46b8-a786-ff72dfff3059', 12, -1, 'sale', 'Sale', '15', 1, '2026-07-08 10:16:58'),
(81, '78bb5dde-8ead-493a-af5d-36735f874bdc', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 10:17:44'),
(82, 'c46f896a-77d8-4d9c-b117-4f7d9e47232b', 19, -2, 'sale', 'Sale', '15', 1, '2026-07-08 10:17:44'),
(83, '5e2a376b-b9cd-4bfa-a778-a56f5e63328a', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 10:18:19'),
(84, '6562bd40-4962-40d0-9a09-db5fafbfc9f9', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 10:49:27'),
(85, '40299e71-1791-4912-a381-71d56a94cc9b', 12, -1, 'sale', 'Sale', '15', 1, '2026-07-08 10:49:27'),
(86, '9d9d77f8-ef4e-4f0c-b882-4d1d7a14a580', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 10:54:01'),
(87, 'fe97c8fb-05de-43e9-877f-ff33cd73fc79', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 10:55:40'),
(88, 'c322c97a-6716-4e29-ac09-eb9627754af7', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 10:58:11'),
(89, 'a9898c89-3947-4105-9d42-eadac9ccc42a', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 11:23:15'),
(90, 'c3e2d09d-c8bd-4c58-a9e9-33f6f52989a5', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 11:27:49'),
(91, '5497b740-999d-4234-a067-e43fe2545482', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 11:29:57'),
(92, '90eb689f-4a74-44a2-a502-a9cbfc6d45b6', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-08 11:32:17'),
(93, 'adc48a09-008d-472a-9b90-32ffdb84bc05', 32, 0, 'purchase', NULL, NULL, 1, '2026-07-08 12:58:51'),
(94, '00c8f7c3-cea0-4b95-9c17-d9dea670b809', 32, 100, 'purchase', 'purchase', NULL, 1, '2026-07-08 12:59:25'),
(95, 'cb250e4c-b84e-47c4-82ac-0e1ca9ee8ef1', 33, 0, 'purchase', 'purchase', NULL, 1, '2026-07-08 13:06:08'),
(96, '70335c24-bcbb-42b9-9e54-c7028814040b', 33, 80, 'purchase', 'purchase', NULL, 1, '2026-07-08 13:11:55'),
(97, '1dccdc45-d3ea-40e7-b755-0ac208006dd6', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-09 10:04:32'),
(98, '9bcf9871-8e13-48f4-a146-bdf9811b631b', 12, -2, 'sale', 'Sale', '15', 1, '2026-07-09 10:04:32'),
(99, 'c8c30bba-d50c-455c-be17-8b75acd185cd', 1, -1, 'sale', 'Sale', '15', 1, '2026-07-09 10:08:46'),
(100, '69004e05-dbde-4a46-a472-aa289d9ca7d3', 12, -2, 'sale', 'Sale', '15', 1, '2026-07-09 10:08:46'),
(101, 'cd9688c3-b31f-4586-aa98-c51390e8f72f', 19, -3, 'sale', 'Sale', '15', 1, '2026-07-09 10:09:53'),
(102, '384c2f20-6982-4689-8a9a-3896027d853a', 19, -3, 'sale', 'Sale', '15', 1, '2026-07-09 10:23:16'),
(103, '61cff917-31e0-4b8f-9457-a50efcbee8f5', 19, -3, 'sale', 'Sale', '15', 1, '2026-07-09 10:25:43');

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions_history`
--

CREATE TABLE `subscriptions_history` (
  `id` int(11) NOT NULL,
  `order_number` varchar(50) DEFAULT uuid(),
  `plan_id` int(11) NOT NULL,
  `amount` decimal(14,2) DEFAULT NULL,
  `status` enum('pending','paid','cancelled') DEFAULT NULL,
  `company_id` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `company_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `name`, `email`, `phone`, `company_id`) VALUES
(1, 'John dirit', 'diri@gmail.com', '0712345678', '2e682df5-2de9-445e-937d-34f8db3260fb');

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` int(11) NOT NULL,
  `name` varchar(140) DEFAULT NULL,
  `units_company_id` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`id`, `name`, `units_company_id`, `created_at`) VALUES
(1, 'kg', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 11:09:59'),
(2, 'cm', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 11:10:05'),
(3, 'ml', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 11:12:23'),
(4, 'g', '2e682df5-2de9-445e-937d-34f8db3260fb', '2026-06-02 11:12:28');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `uuid` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `dp` varchar(50) DEFAULT '/uploads/dp.jpeg',
  `role_id` int(11) DEFAULT NULL,
  `is_active` int(11) DEFAULT 0,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `user_company_id` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uuid`, `name`, `email`, `phone`, `password`, `dp`, `role_id`, `is_active`, `last_login_at`, `created_at`, `updated_at`, `user_company_id`) VALUES
(1, '2d682df5-2de9-445e-937d-34f8db3260fb', 'John Doe', 'xyz@gmail.com', '0712345678', '$2b$10$ZG8y3RpXzNLUJXvnRuB.YOjleQIJmaiQ/ElUusc19LdG7WKM4PZ5i', '/uploads/dp.jpeg', 1, 1, '2026-07-09 06:45:39', '2026-06-02 10:36:42', '2026-07-09 09:45:39', '2e682df5-2de9-445e-937d-34f8db3260fb'),
(2, 'c0b494ad-a73b-4177-94df-7938667c4b10', 'Calvin', 'name@example.com', '0706031920', '$2b$10$FqxnVXDUfEj1SyinxzVRo.I6Zi/zLwbWFulAa8kdwtzZ8oH76Gu..', '/uploads/dp.jpeg', 3, 1, '2026-07-09 06:45:39', '2026-07-01 19:43:00', '2026-07-09 09:45:39', '2e682df5-2de9-445e-937d-34f8db3260fb');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `calendar`
--
ALTER TABLE `calendar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `mpesa_transactions`
--
ALTER TABLE `mpesa_transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `license_id` (`license_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_id` (`sale_id`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `pos`
--
ALTER TABLE `pos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_definitions`
--
ALTER TABLE `product_definitions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `unit_id` (`unit_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_items`
--
ALTER TABLE `product_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_definition_id` (`product_definition_id`);

--
-- Indexes for table `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_definition_id` (`product_definition_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_definition_id` (`product_definition_id`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_id` (`sale_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_definition_id` (`product_definition_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `subscriptions_history`
--
ALTER TABLE `subscriptions_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `plan_id` (`plan_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
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
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `calendar`
--
ALTER TABLE `calendar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `mpesa_transactions`
--
ALTER TABLE `mpesa_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pos`
--
ALTER TABLE `pos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `product_definitions`
--
ALTER TABLE `product_definitions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `product_items`
--
ALTER TABLE `product_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `purchase_items`
--
ALTER TABLE `purchase_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stock_movements`
--
ALTER TABLE `stock_movements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `subscriptions_history`
--
ALTER TABLE `subscriptions_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `calendar`
--
ALTER TABLE `calendar`
  ADD CONSTRAINT `calendar_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `calendar_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `organizations`
--
ALTER TABLE `organizations`
  ADD CONSTRAINT `organizations_ibfk_1` FOREIGN KEY (`license_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `plans`
--
ALTER TABLE `plans`
  ADD CONSTRAINT `plans_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pos`
--
ALTER TABLE `pos`
  ADD CONSTRAINT `pos_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_definitions`
--
ALTER TABLE `product_definitions`
  ADD CONSTRAINT `product_definitions_ibfk_1` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_definitions_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_items`
--
ALTER TABLE `product_items`
  ADD CONSTRAINT `product_items_ibfk_1` FOREIGN KEY (`product_definition_id`) REFERENCES `product_definitions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`product_definition_id`) REFERENCES `product_definitions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchases_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD CONSTRAINT `purchase_items_ibfk_1` FOREIGN KEY (`product_definition_id`) REFERENCES `product_definitions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD CONSTRAINT `stock_movements_ibfk_1` FOREIGN KEY (`product_definition_id`) REFERENCES `product_definitions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_movements_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subscriptions_history`
--
ALTER TABLE `subscriptions_history`
  ADD CONSTRAINT `subscriptions_history_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
