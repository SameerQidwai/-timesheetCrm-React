-- MySQL dump 10.13  Distrib 5.7.33, for Linux (x86_64)
--
-- Host: localhost    Database: oneLmDev
-- ------------------------------------------------------
-- Server version	5.7.33-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bank_accounts`
--

DROP TABLE IF EXISTS `bank_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bank_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `account_no` varchar(255) NOT NULL,
  `bsb` varchar(255) NOT NULL,
  `organization_id` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_cc20105b139589c697648c925c3` (`organization_id`),
  KEY `FK_54020e3939d0c5ba1291d417921` (`employee_id`),
  CONSTRAINT `FK_54020e3939d0c5ba1291d417921` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_cc20105b139589c697648c925c3` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bank_accounts`
--

LOCK TABLES `bank_accounts` WRITE;
/*!40000 ALTER TABLE `bank_accounts` DISABLE KEYS */;
INSERT INTO `bank_accounts` VALUES (1,'2021-04-20 12:59:25.082882','2021-04-20 12:59:25.082882',NULL,'','','',1,NULL),(2,'2021-04-20 13:00:32.928711','2021-04-20 13:00:32.928711',NULL,'','','',2,NULL),(3,'2021-04-20 13:12:45.699311','2021-04-20 13:12:45.699311',NULL,'Bank HBL','xxx-xxx-xxxx','bsab-xxx',NULL,1);
/*!40000 ALTER TABLE `bank_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendar_holidays`
--

DROP TABLE IF EXISTS `calendar_holidays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calendar_holidays` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `calendar_id` int(11) DEFAULT NULL,
  `holiday_type_id` int(11) DEFAULT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_70ea83ba2ed4855b39d1a1bc6af` (`calendar_id`),
  KEY `FK_348da17f1c1284cebd26fa9a626` (`holiday_type_id`),
  CONSTRAINT `FK_348da17f1c1284cebd26fa9a626` FOREIGN KEY (`holiday_type_id`) REFERENCES `holiday_types` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_70ea83ba2ed4855b39d1a1bc6af` FOREIGN KEY (`calendar_id`) REFERENCES `calendars` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendar_holidays`
--

LOCK TABLES `calendar_holidays` WRITE;
/*!40000 ALTER TABLE `calendar_holidays` DISABLE KEYS */;
/*!40000 ALTER TABLE `calendar_holidays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendars`
--

DROP TABLE IF EXISTS `calendars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calendars` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `label` varchar(255) NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendars`
--

LOCK TABLES `calendars` WRITE;
/*!40000 ALTER TABLE `calendars` DISABLE KEYS */;
/*!40000 ALTER TABLE `calendars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_person_organizations`
--

DROP TABLE IF EXISTS `contact_person_organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact_person_organizations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `designation` varchar(255) NOT NULL,
  `organization_id` int(11) DEFAULT NULL,
  `contact_person_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a92b0a8611370896910ca96bb4b` (`organization_id`),
  KEY `FK_ac13c04d25a86dddf489fc58ad9` (`contact_person_id`),
  CONSTRAINT `FK_a92b0a8611370896910ca96bb4b` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_ac13c04d25a86dddf489fc58ad9` FOREIGN KEY (`contact_person_id`) REFERENCES `contact_persons` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_person_organizations`
--

LOCK TABLES `contact_person_organizations` WRITE;
/*!40000 ALTER TABLE `contact_person_organizations` DISABLE KEYS */;
INSERT INTO `contact_person_organizations` VALUES (1,'2021-04-20 13:02:47.991434','2021-04-20 13:02:47.991434',NULL,'2021-04-12 13:02:46',NULL,'dsad',1,1),(2,'2021-04-20 13:08:38.790783','2021-04-20 13:08:38.790783',NULL,'2021-04-21 13:08:20',NULL,'Designer',2,2);
/*!40000 ALTER TABLE `contact_person_organizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_person_standard_skill_standard_level`
--

DROP TABLE IF EXISTS `contact_person_standard_skill_standard_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact_person_standard_skill_standard_level` (
  `contactPersonsId` int(11) NOT NULL,
  `standardSkillStandardLevelsId` int(11) NOT NULL,
  PRIMARY KEY (`contactPersonsId`,`standardSkillStandardLevelsId`),
  KEY `IDX_13419eb9942fd9a5ed7da64766` (`contactPersonsId`),
  KEY `IDX_595209fce311d78badc6ade44e` (`standardSkillStandardLevelsId`),
  CONSTRAINT `FK_13419eb9942fd9a5ed7da64766c` FOREIGN KEY (`contactPersonsId`) REFERENCES `contact_persons` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_595209fce311d78badc6ade44ee` FOREIGN KEY (`standardSkillStandardLevelsId`) REFERENCES `standard_skill_standard_levels` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_person_standard_skill_standard_level`
--

LOCK TABLES `contact_person_standard_skill_standard_level` WRITE;
/*!40000 ALTER TABLE `contact_person_standard_skill_standard_level` DISABLE KEYS */;
INSERT INTO `contact_person_standard_skill_standard_level` VALUES (1,2),(1,4),(2,2);
/*!40000 ALTER TABLE `contact_person_standard_skill_standard_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_persons`
--

DROP TABLE IF EXISTS `contact_persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact_persons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `gender` enum('M','F','O') NOT NULL,
  `date_of_birth` datetime DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `state_id` int(11) DEFAULT NULL,
  `clearance_level` enum('BV','NV1','NV2','PV') DEFAULT NULL,
  `clearance_granted_date` datetime DEFAULT NULL,
  `clearance_expiry_date` datetime DEFAULT NULL,
  `clearance_sponsor_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_bf098a56e685c8a2416371c48d6` (`state_id`),
  KEY `FK_c66166898d2c2effe847aa10cd8` (`clearance_sponsor_id`),
  CONSTRAINT `FK_bf098a56e685c8a2416371c48d6` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_c66166898d2c2effe847aa10cd8` FOREIGN KEY (`clearance_sponsor_id`) REFERENCES `organizations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_persons`
--

LOCK TABLES `contact_persons` WRITE;
/*!40000 ALTER TABLE `contact_persons` DISABLE KEYS */;
INSERT INTO `contact_persons` VALUES (1,'2021-04-20 13:02:02.340824','2021-04-20 13:12:45.000000',NULL,'Ali','Mehndi ','M','2021-04-20 13:09:00','878','email ','Address',NULL,'BV','2021-04-20 13:01:54','2021-04-24 13:01:56',1),(2,'2021-04-20 13:08:38.778522','2021-04-20 13:13:29.000000',NULL,'fiazan ','Ali ','M','2021-04-06 13:13:05','098','faizan@gmal.com','15 yemen road, yemen',NULL,'BV','2021-04-20 13:08:30','2021-04-30 13:08:32',1);
/*!40000 ALTER TABLE `contact_persons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `contact_person_organization_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `next_of_kin_name` varchar(255) DEFAULT NULL,
  `next_of_kin_phone_number` varchar(255) DEFAULT NULL,
  `next_of_kin_email` varchar(255) DEFAULT NULL,
  `next_of_kin_relation` varchar(255) DEFAULT NULL,
  `tfn` varchar(255) DEFAULT NULL,
  `tax_free_threshold` tinyint(4) DEFAULT NULL,
  `help_hecs` tinyint(4) DEFAULT NULL,
  `superannuation_name` varchar(255) DEFAULT NULL,
  `superannuation_type` enum('P','S') DEFAULT NULL,
  `superannuation_bank_name` varchar(255) DEFAULT NULL,
  `superannuation_bank_account_or_membership_number` varchar(255) DEFAULT NULL,
  `superannuation_abn_or_usi` varchar(255) DEFAULT NULL,
  `superannuation_bank_bsb` varchar(255) DEFAULT NULL,
  `superannuation_address` varchar(255) DEFAULT NULL,
  `training` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_31358a1a133482b25fe81b021e` (`username`),
  UNIQUE KEY `REL_1bc1da6628a26dad7e37b6f05c` (`contact_person_organization_id`),
  CONSTRAINT `FK_1bc1da6628a26dad7e37b6f05c1` FOREIGN KEY (`contact_person_organization_id`) REFERENCES `contact_person_organizations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'2021-04-20 13:12:45.693539','2021-04-20 13:12:45.693539',NULL,1,'aliM@gmail.com',NULL,NULL,NULL,NULL,'TA-xx',1,0,'Name','P',NULL,'9898','09898',NULL,NULL,'Trained'),(2,'2021-04-20 13:13:29.403133','2021-04-20 13:13:29.403133',NULL,2,'alif@gmail.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employment_contracts`
--

DROP TABLE IF EXISTS `employment_contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employment_contracts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `payslip_email` varchar(255) DEFAULT NULL,
  `comments` varchar(255) DEFAULT NULL,
  `pay_frequency` enum('1','2','3','4','5','6','7') NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `type` enum('1','2','3') NOT NULL,
  `no_of_hours` int(11) DEFAULT NULL,
  `no_of_hours_per` enum('1','2','3','4','5','6','7') NOT NULL,
  `remuneration_amount` int(11) NOT NULL,
  `remuneration_amount_per` enum('1','2','3','4','5','6','7') NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_3a6fc0765b6b1a6676a3e0bf63c` (`employee_id`),
  CONSTRAINT `FK_3a6fc0765b6b1a6676a3e0bf63c` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employment_contracts`
--

LOCK TABLES `employment_contracts` WRITE;
/*!40000 ALTER TABLE `employment_contracts` DISABLE KEYS */;
INSERT INTO `employment_contracts` VALUES (1,'2021-04-20 13:12:45.696389','2021-04-20 13:12:45.696389',NULL,'ailM@gmail.com','Comments','3','2021-04-08 13:10:39','2021-04-23 13:10:43','1',10,'3',20000,'1',1),(2,'2021-04-20 13:13:29.406277','2021-04-20 13:13:29.406277',NULL,NULL,'comments','1','2021-04-14 13:13:08','2021-04-27 13:13:10','1',10,'3',200,'2',2);
/*!40000 ALTER TABLE `employment_contracts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `global_settings`
--

DROP TABLE IF EXISTS `global_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `global_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `key_label` varchar(255) NOT NULL,
  `key_value` varchar(255) NOT NULL,
  `data_type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `global_settings`
--

LOCK TABLES `global_settings` WRITE;
/*!40000 ALTER TABLE `global_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `global_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holiday_types`
--

DROP TABLE IF EXISTS `holiday_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `holiday_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `label` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holiday_types`
--

LOCK TABLES `holiday_types` WRITE;
/*!40000 ALTER TABLE `holiday_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `holiday_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leases`
--

DROP TABLE IF EXISTS `leases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `company_name` varchar(255) NOT NULL,
  `vehicle_registration_no` varchar(255) NOT NULL,
  `vehicle_make_model` varchar(255) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `financed_amount` int(11) NOT NULL,
  `installment_frequency` enum('1','2','3','4','5','6','7') NOT NULL,
  `pre_tax_deduction_amount` int(11) NOT NULL,
  `post_tax_deduction_amount` int(11) NOT NULL,
  `financer_name` varchar(255) NOT NULL,
  `employee_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_523aa5808d4f206471cbeacb94b` (`employee_id`),
  CONSTRAINT `FK_523aa5808d4f206471cbeacb94b` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leases`
--

LOCK TABLES `leases` WRITE;
/*!40000 ALTER TABLE `leases` DISABLE KEYS */;
/*!40000 ALTER TABLE `leases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opportunities`
--

DROP TABLE IF EXISTS `opportunities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `opportunities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `value` int(11) NOT NULL,
  `type` enum('1','2') NOT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `bid_date` datetime DEFAULT NULL,
  `entry_date` datetime DEFAULT NULL,
  `qualified_ops` tinyint(4) DEFAULT NULL,
  `tender` varchar(255) NOT NULL,
  `tender_number` varchar(255) DEFAULT NULL,
  `cm_percentage` int(11) DEFAULT NULL,
  `go_percentage` int(11) DEFAULT NULL,
  `get_percentage` int(11) DEFAULT NULL,
  `hours_per_day` int(11) DEFAULT NULL,
  `organization_id` int(11) DEFAULT NULL,
  `panel_id` int(11) DEFAULT NULL,
  `contact_person_id` int(11) DEFAULT NULL,
  `state_id` int(11) DEFAULT NULL,
  `account_director_id` int(11) DEFAULT NULL,
  `account_manager_id` int(11) DEFAULT NULL,
  `opportunity_manager_id` int(11) DEFAULT NULL,
  `project_manager_id` int(11) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'O',
  PRIMARY KEY (`id`),
  KEY `FK_bd0c6dbc38bfbc1e441e20b666c` (`organization_id`),
  KEY `FK_d868bb2e5a98957d8654df3deef` (`panel_id`),
  KEY `FK_3b99b877e6d79d6c2322a1f63d9` (`contact_person_id`),
  KEY `FK_b688dce039e8bc989c9a17755ec` (`state_id`),
  KEY `FK_0adb323b93898590d60578893fa` (`account_director_id`),
  KEY `FK_cdf41621b4475aa672c0878f3bc` (`account_manager_id`),
  KEY `FK_1b495148aa46ac6112dafb12667` (`opportunity_manager_id`),
  KEY `FK_b7722b33917eb2d46bf2701513b` (`project_manager_id`),
  CONSTRAINT `FK_0adb323b93898590d60578893fa` FOREIGN KEY (`account_director_id`) REFERENCES `employees` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_1b495148aa46ac6112dafb12667` FOREIGN KEY (`opportunity_manager_id`) REFERENCES `employees` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_3b99b877e6d79d6c2322a1f63d9` FOREIGN KEY (`contact_person_id`) REFERENCES `contact_persons` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_b688dce039e8bc989c9a17755ec` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_b7722b33917eb2d46bf2701513b` FOREIGN KEY (`project_manager_id`) REFERENCES `employees` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_bd0c6dbc38bfbc1e441e20b666c` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_cdf41621b4475aa672c0878f3bc` FOREIGN KEY (`account_manager_id`) REFERENCES `employees` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_d868bb2e5a98957d8654df3deef` FOREIGN KEY (`panel_id`) REFERENCES `panels` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opportunities`
--

LOCK TABLES `opportunities` WRITE;
/*!40000 ALTER TABLE `opportunities` DISABLE KEYS */;
INSERT INTO `opportunities` VALUES (1,'2021-04-20 16:01:16.159317','2021-04-20 16:01:16.159317',NULL,'Sevice',2000,'1','2021-03-01 16:00:43','2021-06-01 16:00:46','2021-04-20 16:00:55','2021-04-20 16:00:14',1,'Sudoware','+8797394372',20,20,20,NULL,2,1,NULL,NULL,1,NULL,1,NULL,'O');
/*!40000 ALTER TABLE `opportunities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opportunity_resource_allocations`
--

DROP TABLE IF EXISTS `opportunity_resource_allocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `opportunity_resource_allocations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `opportunity_resource_id` int(11) NOT NULL,
  `selling_rate` decimal(10,3) DEFAULT NULL,
  `buying_rate` decimal(10,3) DEFAULT NULL,
  `is_marked_as_selected` tinyint(4) NOT NULL DEFAULT '0',
  `contact_person_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_fb8480eb3c464cd05b29276fe2f` (`opportunity_resource_id`),
  KEY `FK_9002ddbdfcb11a62423c1926204` (`contact_person_id`),
  CONSTRAINT `FK_9002ddbdfcb11a62423c1926204` FOREIGN KEY (`contact_person_id`) REFERENCES `contact_persons` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_fb8480eb3c464cd05b29276fe2f` FOREIGN KEY (`opportunity_resource_id`) REFERENCES `opportunity_resources` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opportunity_resource_allocations`
--

LOCK TABLES `opportunity_resource_allocations` WRITE;
/*!40000 ALTER TABLE `opportunity_resource_allocations` DISABLE KEYS */;
INSERT INTO `opportunity_resource_allocations` VALUES (1,'2021-04-20 16:03:01.565240','2021-04-20 16:04:17.000000',NULL,1,80.000,20.000,1,1),(2,'2021-04-20 16:03:22.466727','2021-04-20 16:03:22.466727',NULL,1,40.000,30.000,0,2),(3,'2021-04-20 16:03:59.199346','2021-04-20 16:04:18.000000',NULL,2,100.000,20.000,1,2),(4,'2021-04-20 16:04:14.613959','2021-04-20 16:04:20.000000',NULL,3,50.000,30.000,1,1);
/*!40000 ALTER TABLE `opportunity_resource_allocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opportunity_resources`
--

DROP TABLE IF EXISTS `opportunity_resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `opportunity_resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `panel_skill_id` int(11) NOT NULL,
  `panel_skill_standard_level_id` int(11) NOT NULL,
  `billable_hours` decimal(10,3) NOT NULL,
  `opportunity_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_7c6a39aaedb36e7c68cb789789d` (`panel_skill_id`),
  KEY `FK_af66c23ca8241eb5c9cf660082d` (`panel_skill_standard_level_id`),
  KEY `FK_fb6d65558a3f9b5b0483206284c` (`opportunity_id`),
  CONSTRAINT `FK_7c6a39aaedb36e7c68cb789789d` FOREIGN KEY (`panel_skill_id`) REFERENCES `panel_skills` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_af66c23ca8241eb5c9cf660082d` FOREIGN KEY (`panel_skill_standard_level_id`) REFERENCES `panel_skill_standard_levels` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_fb6d65558a3f9b5b0483206284c` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunities` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opportunity_resources`
--

LOCK TABLES `opportunity_resources` WRITE;
/*!40000 ALTER TABLE `opportunity_resources` DISABLE KEYS */;
INSERT INTO `opportunity_resources` VALUES (1,'2021-04-20 16:01:33.790229','2021-04-20 16:01:33.790229',NULL,1,1,10.000,1),(2,'2021-04-20 16:01:44.519696','2021-04-20 16:01:44.519696',NULL,1,2,20.000,1),(3,'2021-04-20 16:01:56.663995','2021-04-20 16:01:56.663995',NULL,2,3,20.000,1);
/*!40000 ALTER TABLE `opportunity_resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organizations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text,
  `website` varchar(255) DEFAULT NULL,
  `australian_business_number` varchar(255) DEFAULT NULL,
  `business_type` enum('1','2','3','4') NOT NULL,
  `tax_code` varchar(255) DEFAULT NULL,
  `current_financial_year_total_forecast` decimal(10,3) DEFAULT '0.000',
  `next_financial_year_total_forecast` decimal(10,3) DEFAULT '0.000',
  `invoice_email` varchar(255) DEFAULT NULL,
  `invoice_contact_number` varchar(255) DEFAULT NULL,
  `pi_insurer` varchar(255) DEFAULT NULL,
  `pl_insurer` varchar(255) DEFAULT NULL,
  `wc_insurer` varchar(255) DEFAULT NULL,
  `pi_policy_number` varchar(255) DEFAULT NULL,
  `pl_policy_number` varchar(255) DEFAULT NULL,
  `wc_policy_number` varchar(255) DEFAULT NULL,
  `pi_sum_insured` decimal(10,3) DEFAULT '0.000',
  `pl_sum_insured` decimal(10,3) DEFAULT '0.000',
  `wc_sum_insured` decimal(10,3) DEFAULT '0.000',
  `pi_insurance_expiry` datetime DEFAULT NULL,
  `pl_insurance_expiry` datetime DEFAULT NULL,
  `wc_insurance_expiry` datetime DEFAULT NULL,
  `parent_organization_id` int(11) DEFAULT NULL,
  `delegate_contact_person_organization_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_b2942c2abac6a57dffac221431f` (`parent_organization_id`),
  KEY `FK_ea7c37ea7af49ca216dfaf04eba` (`delegate_contact_person_organization_id`),
  CONSTRAINT `FK_b2942c2abac6a57dffac221431f` FOREIGN KEY (`parent_organization_id`) REFERENCES `organizations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_ea7c37ea7af49ca216dfaf04eba` FOREIGN KEY (`delegate_contact_person_organization_id`) REFERENCES `contact_person_organizations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` VALUES (1,'2021-04-20 12:59:25.078190','2021-04-20 12:59:25.078190',NULL,'1LM','+6287987','9827837','Address ','1lm.com','','3','',0.000,0.000,'','','','','','','','',0.000,0.000,0.000,NULL,NULL,NULL,NULL,NULL),(2,'2021-04-20 13:00:32.923432','2021-04-20 13:00:32.923432',NULL,'5cube','','','','','','2','',0.000,0.000,'','','','','','','','',0.000,0.000,0.000,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `panel_skill_standard_levels`
--

DROP TABLE IF EXISTS `panel_skill_standard_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `panel_skill_standard_levels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `level_label` varchar(255) NOT NULL,
  `short_term_ceil` decimal(10,3) NOT NULL DEFAULT '0.000',
  `long_term_ceil` decimal(10,3) NOT NULL DEFAULT '0.000',
  `panel_skill_id` int(11) DEFAULT NULL,
  `standard_level_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_13653078d3fb7433f1e5646dd77` (`panel_skill_id`),
  KEY `FK_d1c70a2af2221b5dd8759c29a89` (`standard_level_id`),
  CONSTRAINT `FK_13653078d3fb7433f1e5646dd77` FOREIGN KEY (`panel_skill_id`) REFERENCES `panel_skills` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_d1c70a2af2221b5dd8759c29a89` FOREIGN KEY (`standard_level_id`) REFERENCES `standard_levels` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `panel_skill_standard_levels`
--

LOCK TABLES `panel_skill_standard_levels` WRITE;
/*!40000 ALTER TABLE `panel_skill_standard_levels` DISABLE KEYS */;
INSERT INTO `panel_skill_standard_levels` VALUES (1,'2021-04-20 12:55:51.128258','2021-04-20 12:55:51.128258',NULL,'Expert',200.000,300.000,1,4),(2,'2021-04-20 12:55:51.131002','2021-04-20 12:55:51.131002',NULL,'Senior',102.000,200.000,1,3),(3,'2021-04-20 12:57:20.092018','2021-04-20 12:57:20.092018',NULL,'Junior',899.000,2839.000,2,3);
/*!40000 ALTER TABLE `panel_skill_standard_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `panel_skills`
--

DROP TABLE IF EXISTS `panel_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `panel_skills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `label` varchar(255) NOT NULL,
  `standard_skill_id` int(11) DEFAULT NULL,
  `panel_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_0c5a6931b5879ffc4190038d9b5` (`standard_skill_id`),
  KEY `FK_a935f999ba61fbb6e699c474cfa` (`panel_id`),
  CONSTRAINT `FK_0c5a6931b5879ffc4190038d9b5` FOREIGN KEY (`standard_skill_id`) REFERENCES `standard_skills` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_a935f999ba61fbb6e699c474cfa` FOREIGN KEY (`panel_id`) REFERENCES `panels` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `panel_skills`
--

LOCK TABLES `panel_skills` WRITE;
/*!40000 ALTER TABLE `panel_skills` DISABLE KEYS */;
INSERT INTO `panel_skills` VALUES (1,'2021-04-20 12:55:51.124235','2021-04-20 12:55:51.124235',NULL,'Native Developer',1,1),(2,'2021-04-20 12:57:20.087830','2021-04-20 12:57:20.087830',NULL,'Native Designer',2,1);
/*!40000 ALTER TABLE `panel_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `panels`
--

DROP TABLE IF EXISTS `panels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `panels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `label` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `panels`
--

LOCK TABLES `panels` WRITE;
/*!40000 ALTER TABLE `panels` DISABLE KEYS */;
INSERT INTO `panels` VALUES (1,'2021-04-20 12:54:20.927902','2021-04-20 12:54:20.927902',NULL,'1LM');
/*!40000 ALTER TABLE `panels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `samples`
--

DROP TABLE IF EXISTS `samples`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `samples` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `samples`
--

LOCK TABLES `samples` WRITE;
/*!40000 ALTER TABLE `samples` DISABLE KEYS */;
/*!40000 ALTER TABLE `samples` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `standard_levels`
--

DROP TABLE IF EXISTS `standard_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `standard_levels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `label` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `standard_levels`
--

LOCK TABLES `standard_levels` WRITE;
/*!40000 ALTER TABLE `standard_levels` DISABLE KEYS */;
INSERT INTO `standard_levels` VALUES (1,'2021-04-20 12:51:10.534033','2021-04-20 12:51:10.534033',NULL,'Senior'),(2,'2021-04-20 12:51:21.321582','2021-04-20 12:51:21.321582',NULL,'Junior'),(3,'2021-04-20 12:51:34.429806','2021-04-20 12:51:34.429806',NULL,'Intern'),(4,'2021-04-20 12:51:39.942561','2021-04-20 12:51:39.942561',NULL,'Lead');
/*!40000 ALTER TABLE `standard_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `standard_skill_standard_levels`
--

DROP TABLE IF EXISTS `standard_skill_standard_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `standard_skill_standard_levels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `standard_skill_id` int(11) DEFAULT NULL,
  `standard_level_id` int(11) DEFAULT NULL,
  `priority` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ebeeb4b501e6926295a2b452b4b` (`standard_skill_id`),
  KEY `FK_5515a8b76c3162bbdbebd368554` (`standard_level_id`),
  CONSTRAINT `FK_5515a8b76c3162bbdbebd368554` FOREIGN KEY (`standard_level_id`) REFERENCES `standard_levels` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_ebeeb4b501e6926295a2b452b4b` FOREIGN KEY (`standard_skill_id`) REFERENCES `standard_skills` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `standard_skill_standard_levels`
--

LOCK TABLES `standard_skill_standard_levels` WRITE;
/*!40000 ALTER TABLE `standard_skill_standard_levels` DISABLE KEYS */;
INSERT INTO `standard_skill_standard_levels` VALUES (1,'2021-04-20 12:52:38.413806','2021-04-20 12:52:38.413806',NULL,1,4,1),(2,'2021-04-20 12:52:38.417937','2021-04-20 12:52:38.417937',NULL,1,1,2),(3,'2021-04-20 12:53:12.959856','2021-04-20 12:53:12.959856',NULL,2,1,1),(4,'2021-04-20 12:53:12.968852','2021-04-20 12:53:12.968852',NULL,2,2,2);
/*!40000 ALTER TABLE `standard_skill_standard_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `standard_skills`
--

DROP TABLE IF EXISTS `standard_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `standard_skills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `label` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `standard_skills`
--

LOCK TABLES `standard_skills` WRITE;
/*!40000 ALTER TABLE `standard_skills` DISABLE KEYS */;
INSERT INTO `standard_skills` VALUES (1,'2021-04-20 12:52:38.405723','2021-04-20 12:52:38.405723',NULL,'Developer'),(2,'2021-04-20 12:53:12.955506','2021-04-20 12:53:12.955506',NULL,'Desioger');
/*!40000 ALTER TABLE `standard_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `states` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `label` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `states`
--

LOCK TABLES `states` WRITE;
/*!40000 ALTER TABLE `states` DISABLE KEYS */;
/*!40000 ALTER TABLE `states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `time_off_policies`
--

DROP TABLE IF EXISTS `time_off_policies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `time_off_policies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `label` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `time_off_policies`
--

LOCK TABLES `time_off_policies` WRITE;
/*!40000 ALTER TABLE `time_off_policies` DISABLE KEYS */;
/*!40000 ALTER TABLE `time_off_policies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `time_off_policy_time_off_types`
--

DROP TABLE IF EXISTS `time_off_policy_time_off_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `time_off_policy_time_off_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `time_off_policy_id` int(11) NOT NULL,
  `time_off_type_id` int(11) NOT NULL,
  `earn_hours` int(11) NOT NULL,
  `earn_every` enum('N','M','Y','EM','EY') NOT NULL,
  `reset_hours` int(11) NOT NULL,
  `reset_every` enum('N','M','Y','EM','EY') NOT NULL,
  `threshold` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_521609c3a872273ba155b3f222f` (`time_off_policy_id`),
  KEY `FK_b27b20b1e0c035dfa3497404aec` (`time_off_type_id`),
  CONSTRAINT `FK_521609c3a872273ba155b3f222f` FOREIGN KEY (`time_off_policy_id`) REFERENCES `time_off_policies` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_b27b20b1e0c035dfa3497404aec` FOREIGN KEY (`time_off_type_id`) REFERENCES `time_off_types` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `time_off_policy_time_off_types`
--

LOCK TABLES `time_off_policy_time_off_types` WRITE;
/*!40000 ALTER TABLE `time_off_policy_time_off_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `time_off_policy_time_off_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `time_off_types`
--

DROP TABLE IF EXISTS `time_off_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `time_off_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `label` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `time_off_types`
--

LOCK TABLES `time_off_types` WRITE;
/*!40000 ALTER TABLE `time_off_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `time_off_types` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-20 16:39:00
