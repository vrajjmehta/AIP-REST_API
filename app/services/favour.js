const db = require("../config/setup.js");
const User = db.users;

class favourService{

    static refactorTransactions(transactions){
        const rewards = [];
        const outputTransactions = [];

        for (let i = 0; i < transactions.length; ++i) {
            rewards.push({
                "reward_name": transactions[i].reward_name,
                "qty": transactions[i].qty
            });
        }

        outputTransactions.push({
            "transaction_id": transactions[0].transaction_id,
            "user_owes": transactions[0].user_owes,
            "user_owed": transactions[0].user_owed,
            "proof": transactions[0].proof,
            "rewards": rewards
        });

        return outputTransactions;
    }

    static refactorUserTransactions(transactions){
        let internalRewards = [];
        let finalTransactions = [];
        let transaction_id = transactions[0].transaction_id;
        let proof = transactions[0].proof;
        let timestamp = transactions[0].timestamp;

        for (let i = 0; i<transactions.length; ++i){
            
            if (transaction_id == transactions[i].transaction_id){
                internalRewards.push({
                    "reward_name": transactions[i].reward_name,
                    "qty": transactions[i].qty
                });
            }
            else if(transaction_id != transactions[i].transaction_id){
                finalTransactions.push({
                        "transaction_id": transaction_id,
                        "rewards": internalRewards,
                        "proof": proof,
                        "timestamp": timestamp
                });

                internalRewards = [];
                transaction_id = transactions[i].transaction_id;
                proof = transactions[i].proof;
                timestamp = transactions[i].timestamp;

                internalRewards.push({
                    "reward_name": transactions[i].reward_name,
                    "qty": transactions[i].qty
                });
            }
        }

        finalTransactions.push({
                "transaction_id": transaction_id,
                "rewards": internalRewards,
                "proof": proof,
                "timestamp": timestamp
        });

        return finalTransactions;
    }

    static async refactorFavours(favours, check){
        try{
            let favourUsers = [];
            let user = null;

            for (let i=0; i<favours.length; ++i){
                if (check){
                    user = await User.findAll({
                        where: { 
                            user_id: favours[i].user_owed
                        } 
                    });
                }
                else{
                    user = await User.findAll({
                        where: { 
                            user_id: favours[i].user_owes
                        } 
                    });
                }

                const username = user[0].first_name + " " + user[0].last_name;
                console.log(username);

                favourUsers.push({
                    "user_id": user[0].user_id,
                    "username": username,
                    "favour_qty": favours[i].favour_qty
                });
            }
            return favourUsers;
        }
        catch(e){
            console.log(e);
        }
    }

    static async finalFavours(favours_owes, favours_owed){
        try{
            let finalFavourOwes = [];
            let finalFavourOwed = [];

            // loop to add favour to favour_owed if favour_qty<0
            for(let i=0; i<favours_owes.length; ++i){
                if (favours_owes[i].favour_qty < 0 ){
                    finalFavourOwed.push({
                        "user_id": favours_owes[i].user_id,
                        "username": favours_owes[i].username,
                        "favour_qty": favours_owes[i].favour_qty*(-1)
                    });
                }
                else {
                    finalFavourOwes.push({
                        "user_id": favours_owes[i].user_id,
                        "username": favours_owes[i].username,
                        "favour_qty": favours_owes[i].favour_qty
                    });
                }
            }

            // loop to add favour to favour_owes if favour_qty<0
            for(let i=0; i<favours_owed.length; ++i){
                if (favours_owed[i].favour_qty < 0 ){
                    finalFavourOwes.push({
                        "user_id": favours_owed[i].user_id,
                        "username": favours_owed[i].username,
                        "favour_qty": favours_owed[i].favour_qty*(-1)
                    });
                }
                else {
                    finalFavourOwed.push({
                        "user_id": favours_owed[i].user_id,
                        "username": favours_owed[i].username,
                        "favour_qty": favours_owed[i].favour_qty
                    });
                }
                }

            return [finalFavourOwes, finalFavourOwed];
        }
        catch(e){
            console.log(e);
        }
    }
}

module.exports = favourService;