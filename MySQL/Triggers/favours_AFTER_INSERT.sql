-- TRIGGER to update the final favour count for an individual user after insert

CREATE DEFINER=`root`@`%` TRIGGER `favours_AFTER_INSERT` AFTER INSERT ON `favours` FOR EACH ROW BEGIN
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
END