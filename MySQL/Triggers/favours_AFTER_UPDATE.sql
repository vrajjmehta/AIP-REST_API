CREATE DEFINER=`root`@`%` TRIGGER `favours_AFTER_UPDATE` AFTER UPDATE ON `favours` FOR EACH ROW BEGIN
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
END