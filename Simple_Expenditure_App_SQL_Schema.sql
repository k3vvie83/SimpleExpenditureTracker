-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: SimpleDatabase
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Expenditure`
--


USE SimpleDatabase;

DROP TABLE IF EXISTS `Expenditure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Expenditure` (
  `ExpenditureUUID` varchar(128) NOT NULL,
  `UserUUID` varchar(128) NOT NULL,
  `DateOfExpenditure` datetime NOT NULL,
  `Description` varchar(200) NOT NULL,
  `AmountSpent` float NOT NULL,
  `Remarks` varchar(500) DEFAULT NULL,
  `CreatedDT` datetime NOT NULL,
  `LastUpdatedDT` datetime NOT NULL,
  PRIMARY KEY (`ExpenditureUUID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Expenditure`
--

LOCK TABLES `Expenditure` WRITE;
/*!40000 ALTER TABLE `Expenditure` DISABLE KEYS */;
INSERT INTO `Expenditure` VALUES ('483d1e5f-3b07-4672-9b1a-a821694297e6','204705f6-07d8-41c4-9f2b-ab6bef92c17b','2021-06-10 00:00:00','11',11,'11','2021-06-11 14:52:39','2021-06-11 14:52:39'),('6cc379bb-95fc-4c99-93ce-e060d37bca26','204705f6-07d8-41c4-9f2b-ab6bef92c17b','2021-06-14 00:00:00','qwert',122,'qwert','2021-06-14 17:12:40','2021-06-14 17:12:40'),('cfbabacd-331f-4551-b9e2-545732c936f9','204705f6-07d8-41c4-9f2b-ab6bef92c17b','2021-06-10 00:00:00','12',12,'12','2021-06-10 23:19:58','2021-06-10 23:19:58');
/*!40000 ALTER TABLE `Expenditure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserTable`
--

DROP TABLE IF EXISTS `UserTable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserTable` (
  `UserUUID` varchar(128) NOT NULL,
  `UserFullName` varchar(66) NOT NULL,
  `UserLoginID` varchar(66) NOT NULL,
  `Password` varchar(128) NOT NULL,
  `Role` varchar(45) NOT NULL,
  `LastLogin` datetime NOT NULL,
  `CreatedDT` datetime NOT NULL,
  PRIMARY KEY (`UserUUID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserTable`
--

LOCK TABLES `UserTable` WRITE;
/*!40000 ALTER TABLE `UserTable` DISABLE KEYS */;
INSERT INTO `UserTable` VALUES ('21e335dd-6c2c-4078-a3b9-686010c97140','Bob','BOB','552b1eb93f8eaf6dd6d0e4fa29057ac85e81c83748aabc0a87a07227fa76052a','User','2021-06-14 17:53:54','2021-06-14 17:42:29'),('3ea39690-9c36-4b32-9d30-a17a0f57f623','Alice','ALICE','a99d4565dc2e83700019daa93d2877edc8763dcd8d74fca6b38f5de320247470','Admin','2021-06-14 17:59:11','2021-06-14 15:55:56'),('c6178ae7-583a-489a-895d-a5cbf78c1bfd','Eve','EVE','86f1cf75a19703c56f844e20709dcb830aa915f225368da4760cbe8890510b79','User','2021-06-14 17:42:46','2021-06-14 17:42:46');
/*!40000 ALTER TABLE `UserTable` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-14 18:18:39

CREATE USER 'appdbuser'@'localhost' IDENTIFIED BY 'P@ssw0rd';
GRANT Select, Update, Insert, Delete ON *.* TO 'appdbuser'@'localhost';
CREATE USER 'appdbuser'@'%' IDENTIFIED BY 'P@ssw0rd';
GRANT Select, Update, Insert, Delete ON *.* TO 'appdbuser'@'%';
