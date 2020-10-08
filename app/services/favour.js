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
        let user_owes = transactions[0].user_owes;
        let user_owed = transactions[0].user_owed;
        let transaction_id = transactions[0].transaction_id;

        for (let i = 0; i<transactions.length; ++i){
            
            if (transaction_id == transactions[i].transaction_id){
                internalRewards.push({
                    "reward_name": transactions[i].reward_name,
                    "qty": transactions[i].qty
                });
            }
            else if(transaction_id != transactions[i].transaction_id){
                finalTransactions.push({
                    "user_owes": user_owes,
                    "user_owed": user_owed,
                    "transactions": {
                        "transaction_id": transaction_id,
                        "rewards": internalRewards
                    }
                });

                internalRewards = [];
                user_owes = transactions[i].user_owes;
                user_owed = transactions[i].user_owed;
                transaction_id = transactions[i].transaction_id;

                internalRewards.push({
                    "reward_name": transactions[i].reward_name,
                    "qty": transactions[i].qty
                });
            }
        }

        finalTransactions.push({
            "user_owes": user_owes,
            "user_owed": user_owed,
            "transactions": {
                "transaction_id": transaction_id,
                "rewards": internalRewards
            }
        });

        return finalTransactions;
    }
}

module.exports = favourService;