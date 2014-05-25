SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `wine` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `wine` ;

-- -----------------------------------------------------
-- Table `wine`.`users`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `wine`.`users` (
  `user_id` BIGINT NOT NULL AUTO_INCREMENT ,
  `username` VARCHAR(45) NULL ,
  `password` VARCHAR(45) NULL ,
  `joined` DATE NULL DEFAULT NULL ,
  `balance` INT NULL DEFAULT 0 ,
  `type` VARCHAR(15) NULL ,
  `active` TINYINT(1) NULL ,
  PRIMARY KEY (`user_id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wine`.`profile`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `wine`.`profile` (
  `user_id` BIGINT NOT NULL ,
  `fname` VARCHAR(45) NULL ,
  `lname` VARCHAR(45) NULL ,
  `email` VARCHAR(45) NULL ,
  `dob` DATE NULL ,
  `contact_no` VARCHAR(45) NULL ,
  PRIMARY KEY (`user_id`) ,
  INDEX `fk_profile_user1_idx` (`user_id` ASC) ,
  CONSTRAINT `fk_profile_user1`
    FOREIGN KEY (`user_id` )
    REFERENCES `wine`.`users` (`user_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wine`.`class`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `wine`.`class` (
  `class_id` INT NOT NULL AUTO_INCREMENT ,
  `class_name` VARCHAR(45) NULL ,
  PRIMARY KEY (`class_id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wine`.`company`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `wine`.`company` (
  `company_id` INT NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(45) NULL ,
  PRIMARY KEY (`company_id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wine`.`wine`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `wine`.`wine` (
  `wine_id` BIGINT NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(45) NULL ,
  `mnf_date` DATE NULL ,
  `other_info` VARCHAR(200) NULL ,
  `per_alc` TINYINT NULL ,
  `price` INT NULL ,
  `class_id` INT NOT NULL ,
  `company_id` INT NOT NULL ,
  PRIMARY KEY (`wine_id`, `class_id`, `company_id`) ,
  INDEX `fk_wine_classification1_idx` (`class_id` ASC) ,
  INDEX `fk_wine_company1_idx` (`company_id` ASC) ,
  CONSTRAINT `fk_wine_classification1`
    FOREIGN KEY (`class_id` )
    REFERENCES `wine`.`class` (`class_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_wine_company1`
    FOREIGN KEY (`company_id` )
    REFERENCES `wine`.`company` (`company_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wine`.`comments`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `wine`.`comments` (
  `user_id` BIGINT NOT NULL ,
  `wine_id` BIGINT NOT NULL ,
  `comment` VARCHAR(200) NULL ,
  INDEX `fk_comments_wine1_idx` (`wine_id` ASC) ,
  CONSTRAINT `fk_comments_user`
    FOREIGN KEY (`user_id` )
    REFERENCES `wine`.`users` (`user_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_comments_wine1`
    FOREIGN KEY (`wine_id` )
    REFERENCES `wine`.`wine` (`wine_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wine`.`location`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `wine`.`location` (
  `zip` VARCHAR(10) NOT NULL ,
  `distric` VARCHAR(45) NULL ,
  `state` VARCHAR(45) NULL ,
  `country` VARCHAR(45) NULL ,
  PRIMARY KEY (`zip`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wine`.`winery`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `wine`.`winery` (
  `winery_id` INT NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(45) NULL ,
  `street` VARCHAR(100) NULL ,
  `zip` VARCHAR(10) NOT NULL ,
  PRIMARY KEY (`winery_id`, `zip`) ,
  INDEX `fk_winery_location1_idx` (`zip` ASC) ,
  CONSTRAINT `fk_winery_location1`
    FOREIGN KEY (`zip` )
    REFERENCES `wine`.`location` (`zip` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wine`.`available_at`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `wine`.`available_at` (
  `winery_id` INT NOT NULL ,
  `wine_id` BIGINT NOT NULL ,
  `quantity` INT NULL ,
  PRIMARY KEY (`winery_id`, `wine_id`) ,
  INDEX `fk_wine_has_winery_winery1_idx` (`winery_id` ASC) ,
  INDEX `fk_wine_has_winery_wine1_idx` (`wine_id` ASC) ,
  CONSTRAINT `fk_wine_has_winery_wine1`
    FOREIGN KEY (`wine_id` )
    REFERENCES `wine`.`wine` (`wine_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_wine_has_winery_winery1`
    FOREIGN KEY (`winery_id` )
    REFERENCES `wine`.`winery` (`winery_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wine`.`wishlist`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `wine`.`wishlist` (
  `user_id` BIGINT NOT NULL ,
  `wine_id` BIGINT NOT NULL ,
  PRIMARY KEY (`user_id`, `wine_id`) ,
  INDEX `fk_wish_list_wine1_idx` (`wine_id` ASC) ,
  CONSTRAINT `fk_wish_list_user1`
    FOREIGN KEY (`user_id` )
    REFERENCES `wine`.`users` (`user_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_wish_list_wine1`
    FOREIGN KEY (`wine_id` )
    REFERENCES `wine`.`wine` (`wine_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wine`.`cart`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `wine`.`cart` (
  `id` BIGINT NOT NULL AUTO_INCREMENT ,
  `user_id` BIGINT NOT NULL ,
  `wine_id` BIGINT NOT NULL ,
  `quantity` INT NULL ,
  PRIMARY KEY (`id`, `user_id`, `wine_id`) ,
  INDEX `fk_cart_wine1_idx` (`wine_id` ASC) ,
  CONSTRAINT `fk_cart_user1`
    FOREIGN KEY (`user_id` )
    REFERENCES `wine`.`users` (`user_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_cart_wine1`
    FOREIGN KEY (`wine_id` )
    REFERENCES `wine`.`wine` (`wine_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wine`.`orders`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `wine`.`orders` (
  `order_id` INT NOT NULL AUTO_INCREMENT ,
  `placed_on` DATETIME NULL ,
  `user_id` BIGINT NOT NULL ,
  `total_price` INT NULL ,
  `name` VARCHAR(45) NULL ,
  `address` VARCHAR(100) NULL ,
  `city` VARCHAR(45) NULL ,
  `country` VARCHAR(45) NULL ,
  `email` VARCHAR(100) NULL ,
  `contact_no` VARCHAR(100) NULL ,
  `zip` VARCHAR(10) NULL ,
  PRIMARY KEY (`order_id`, `user_id`) ,
  INDEX `fk_orders_users1_idx` (`user_id` ASC) ,
  CONSTRAINT `fk_orders_users1`
    FOREIGN KEY (`user_id` )
    REFERENCES `wine`.`users` (`user_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wine`.`ordered_items`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `wine`.`ordered_items` (
  `order_id` INT NULL ,
  `wine_id` BIGINT NULL ,
  `quantity` INT NULL ,
  INDEX `fk_ordered_items_wine1_idx` (`wine_id` ASC) ,
  CONSTRAINT `fk_ordered_items_orders1`
    FOREIGN KEY (`order_id` )
    REFERENCES `wine`.`orders` (`order_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ordered_items_wine1`
    FOREIGN KEY (`wine_id` )
    REFERENCES `wine`.`wine` (`wine_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wine`.`stock`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `wine`.`stock` (
  `wine_id` BIGINT NOT NULL ,
  `quantity` INT NULL ,
  PRIMARY KEY (`wine_id`) ,
  CONSTRAINT `fk_stock_wine1`
    FOREIGN KEY (`wine_id` )
    REFERENCES `wine`.`wine` (`wine_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wine`.`rate`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `wine`.`rate` (
  `user_id` BIGINT NOT NULL ,
  `wine_id` BIGINT NOT NULL ,
  `rate` INT NULL ,
  PRIMARY KEY (`user_id`, `wine_id`) ,
  INDEX `fk_users_has_wine_wine1_idx` (`wine_id` ASC) ,
  INDEX `fk_users_has_wine_users1_idx` (`user_id` ASC) ,
  CONSTRAINT `fk_users_has_wine_users1`
    FOREIGN KEY (`user_id` )
    REFERENCES `wine`.`users` (`user_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_has_wine_wine1`
    FOREIGN KEY (`wine_id` )
    REFERENCES `wine`.`wine` (`wine_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `wine` ;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
