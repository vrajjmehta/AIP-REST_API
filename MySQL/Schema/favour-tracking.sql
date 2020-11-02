-- MySQL dump 10.13  Distrib 8.0.18, for macos10.14 (x86_64)
--
-- Host: 35.244.120.60    Database: favour-tracking
-- ------------------------------------------------------
-- Server version	8.0.18-google

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '2af05b4e-f8c3-11ea-8d93-42010a98003f:1-792183';

--
-- Table structure for table `favours`
--

DROP TABLE IF EXISTS `favours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favours` (
  `user_owes` varchar(36) NOT NULL,
  `user_owed` varchar(36) NOT NULL,
  `favour_qty` int(11) NOT NULL,
  PRIMARY KEY (`user_owes`,`user_owed`),
  KEY `fk_transaction_users1_idx` (`user_owes`),
  KEY `fk_transaction_users2_idx` (`user_owed`),
  CONSTRAINT `fk_transaction_users1` FOREIGN KEY (`user_owes`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_transaction_users2` FOREIGN KEY (`user_owed`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `favours_AFTER_INSERT` AFTER INSERT ON `favours` FOR EACH ROW BEGIN
	UPDATE
		users
	SET 
		favour_qty = favour_qty + NEW.favour_qty
	WHERE
		user_id = NEW.user_owed;
	
	UPDATE
		users
	SET 
		favour_qty = favour_qty - NEW.favour_qty
	WHERE
		user_id = NEW.user_owes;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `favours_AFTER_UPDATE` AFTER UPDATE ON `favours` FOR EACH ROW BEGIN
	DECLARE `favour` INT;
    SET `favour` = NEW.favour_qty - OLD.favour_qty;
    
	UPDATE
		users
	SET 
		favour_qty = favour_qty + `favour`
	WHERE
		user_id = NEW.user_owed;
	
	UPDATE
		users
	SET 
		favour_qty = favour_qty - `favour`
	WHERE
		user_id = NEW.user_owes;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `post_reward_history`
--

DROP TABLE IF EXISTS `post_reward_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_reward_history` (
  `post_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `reward_name` varchar(95) NOT NULL,
  `qty` int(11) NOT NULL,
  PRIMARY KEY (`post_id`,`user_id`,`reward_name`),
  KEY `fk_reward_history_posts1_idx` (`post_id`),
  KEY `fk_reward_history_users1_idx` (`user_id`),
  KEY `fk_post_reward_history_rewards1_idx` (`reward_name`),
  CONSTRAINT `fk_post_reward_history_rewards1` FOREIGN KEY (`reward_name`) REFERENCES `rewards` (`reward_name`),
  CONSTRAINT `fk_reward_history_posts1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`),
  CONSTRAINT `fk_reward_history_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `post_id` varchar(36) NOT NULL,
  `added_by` varchar(36) NOT NULL,
  `offer_by` varchar(36) DEFAULT NULL,
  `title` varchar(45) NOT NULL,
  `description` text,
  `added_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(45) NOT NULL,
  `proof` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`post_id`),
  KEY `fk_Post_User_idx` (`added_by`),
  KEY `fk_posts_users1_idx` (`offer_by`),
  CONSTRAINT `fk_Post_User` FOREIGN KEY (`added_by`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_posts_users1` FOREIGN KEY (`offer_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rewards`
--

DROP TABLE IF EXISTS `rewards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rewards` (
  `reward_name` varchar(95) NOT NULL,
  PRIMARY KEY (`reward_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transaction_id` varchar(36) NOT NULL,
  `user_owes` varchar(36) NOT NULL,
  `user_owed` varchar(36) NOT NULL,
  `reward_name` varchar(95) NOT NULL,
  `qty` int(11) NOT NULL,
  `proof` tinyint(4) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image_url` text,
  PRIMARY KEY (`transaction_id`,`user_owes`,`user_owed`,`reward_name`),
  KEY `fk_transactions_users1_idx` (`user_owes`),
  KEY `fk_transactions_users2_idx` (`user_owed`),
  KEY `fk_transactions_rewards1_idx` (`reward_name`),
  CONSTRAINT `fk_transactions_rewards1` FOREIGN KEY (`reward_name`) REFERENCES `rewards` (`reward_name`),
  CONSTRAINT `fk_transactions_users1` FOREIGN KEY (`user_owes`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_transactions_users2` FOREIGN KEY (`user_owed`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `INSERT_FAVOURS` AFTER INSERT ON `transactions` FOR EACH ROW BEGIN	

    DECLARE `check1` BOOLEAN;
	DECLARE `check2` BOOLEAN;
    
    # Check1 to check if user_owes and user_owed match 
	SET `check1` = IF ( 
		EXISTS(
			SELECT * 
				FROM `favour-tracking`.favours 
			WHERE
				user_owes = NEW.user_owes
				AND
				user_owed = NEW.user_owed), 1, 0
    );
    
    # Check1 to check if vice versa of user_owes and user_owed match 
	SET `check2` = IF ( 
		EXISTS(
			SELECT * 
				FROM `favour-tracking`.favours 
			WHERE
				user_owes = NEW.user_owed
				AND
				user_owed = NEW.user_owes), 1, 0
    );
    
    # If proof not uploaded and favour table dont an existing transaction
    IF (NEW.proof = 0 AND !`check1` AND !`check2`) THEN
		INSERT INTO 
			`favour-tracking`.favours 
		SET
			user_owes = NEW.user_owes,
			user_owed = NEW.user_owed,
			favour_qty = 0;
	END IF;
    
    # If proof uploaded and favour table dont an existing transaction
    IF (NEW.proof = 1 AND !`check1` AND !`check2`) THEN
		INSERT INTO 
			`favour-tracking`.favours 
		SET
			user_owes = NEW.user_owes,
			user_owed = NEW.user_owed,
			favour_qty = NEW.qty;
	END IF;
	
    # If proof uploaded and favour table exactly have the same transaction
    IF (NEW.proof = 1 AND `check1` AND !`check2`) THEN
		UPDATE 
			`favour-tracking`.favours 
		SET
			favour_qty = favour_qty + NEW.qty
		WHERE 
			user_owes = NEW.user_owes
			AND
			user_owed = NEW.user_owed;
	END IF;
    
    # If proof uploaded and favour table exactly have the vice versa of the same transaction
	IF (NEW.proof = 1 AND `check2` AND !`check1`) THEN
		UPDATE 
			`favour-tracking`.favours 
		SET
			favour_qty = favour_qty - NEW.qty
		WHERE
			user_owes = NEW.user_owed
			AND
			user_owed = NEW.user_owes;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `UPDATE_FAVOURS` AFTER UPDATE ON `transactions` FOR EACH ROW BEGIN
	DECLARE `check1` BOOLEAN;
	DECLARE `check2` BOOLEAN;
    
    # Check1 to check if user_owes and user_owed match 
	SET `check1` = IF ( 
		EXISTS(
			SELECT * 
				FROM `favour-tracking`.favours 
			WHERE
				user_owes = NEW.user_owes
				AND
				user_owed = NEW.user_owed), 1, 0
    );
    
    # Check1 to check if vice versa of user_owes and user_owed match 
	SET `check2` = IF ( 
		EXISTS(
			SELECT * 
				FROM `favour-tracking`.favours 
			WHERE
				user_owes = NEW.user_owed
				AND
				user_owed = NEW.user_owes), 1, 0
    );
    
    # If proof uploaded and favour table dont an existing transaction
    IF (NEW.proof = 1 AND !`check1` AND !`check2`) THEN
		INSERT INTO 
			`favour-tracking`.favours 
		SET
			user_owes = NEW.user_owes,
			user_owed = NEW.user_owed,
			favour_qty = NEW.qty;
	END IF;
	
    # If proof uploaded and favour table exactly have the same transaction
    IF (NEW.proof = 1 AND `check1` AND !`check2`) THEN
		UPDATE 
			`favour-tracking`.favours 
		SET
			favour_qty = favour_qty + NEW.qty
		WHERE 
			user_owes = NEW.user_owes
			AND
			user_owed = NEW.user_owed;
	END IF;
    
    # If proof uploaded and favour table exactly have the vice versa of the same transaction
	IF (NEW.proof = 1 AND `check2` AND !`check1`) THEN
		UPDATE 
			`favour-tracking`.favours 
		SET
			favour_qty = favour_qty - NEW.qty
		WHERE
			user_owes = NEW.user_owed
			AND
			user_owed = NEW.user_owes;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` varchar(36) NOT NULL,
  `username` varchar(95) NOT NULL,
  `first_name` varchar(95) NOT NULL,
  `last_name` varchar(95) DEFAULT NULL,
  `email` varchar(95) DEFAULT NULL,
  `password` varchar(95) NOT NULL,
  `favour_qty` int(11) NOT NULL DEFAULT '0',
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `Username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-02 15:37:21
