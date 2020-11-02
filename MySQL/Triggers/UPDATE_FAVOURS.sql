-- TRIGGER to update the favour count between two users when a transaction is updated

CREATE DEFINER=`root`@`%` TRIGGER `UPDATE_FAVOURS` AFTER UPDATE ON `transactions` FOR EACH ROW BEGIN
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
END