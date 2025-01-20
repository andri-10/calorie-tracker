-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: caloriesdb
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `foodentries`
--

DROP TABLE IF EXISTS `foodentries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foodentries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `food_name` varchar(255) NOT NULL,
  `calories` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `date_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `meal_type` enum('BREAKFAST','LUNCH','DINNER','SNACK') NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_date` (`user_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foodentries`
--

LOCK TABLES `foodentries` WRITE;
/*!40000 ALTER TABLE `foodentries` DISABLE KEYS */;
INSERT INTO `foodentries` VALUES (1,1,'Pizza',200,10.00,'2025-01-11 14:25:31','2025-01-11 14:25:31','DINNER','Pizza diavola me pepperoni'),(2,1,'Cake',200,4.00,'2025-01-11 20:26:24','2025-01-11 20:26:24','BREAKFAST','Cake with choco'),(3,1,'Qofte',300,2.00,'2025-01-11 21:00:08','2025-01-11 21:00:09','LUNCH','Traditional food'),(4,1,'Apple',10,2.00,'2025-01-11 21:11:50','2025-01-11 21:11:50','SNACK','Friut'),(5,1,'Fish',250,10.00,'2025-01-11 21:22:19','2025-01-11 21:22:19','DINNER',''),(6,1,'Chocolate',100,4.00,'2025-01-11 22:20:10','2025-01-11 22:20:10','SNACK',''),(7,1,'Tea',20,0.00,'2025-01-11 23:06:43','2025-01-11 23:06:43','SNACK','Green Tea'),(8,1,'Milk',20,1.00,'2025-01-11 23:16:16','2025-01-11 23:16:16','BREAKFAST','');
/*!40000 ALTER TABLE `foodentries` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-12 12:27:12
