const db = require("../config/setup.js");
const User = db.users;
const sequelize = db.sequelize;
const Graph = require('tarjan-graph');
const user = require("../models/user.js");

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
        let image_url = transactions[0].image_url;

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
                        "timestamp": timestamp,
                        "image_url": image_url
                });

                internalRewards = [];
                transaction_id = transactions[i].transaction_id;
                proof = transactions[i].proof;
                timestamp = transactions[i].timestamp;
                image_url = transactions[i].image_url;

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
                "timestamp": timestamp,
                "image_url": image_url
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

            if (favours_owes!= null){
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
            }

            if (favours_owed!= null){
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
            }

            return [finalFavourOwes, finalFavourOwed];
        }
        catch(e){
            console.log(e);
        }
    }

    static async refactorCycleFavours(favours){
        try{
            let cycleFavours = [];

            for (let i=0; i<favours.length; ++i){
                let user_owes = await User.findAll({
                    where: { 
                        user_id: favours[i].user_owes
                    } 
                });
                let user_owed = await User.findAll({
                    where: { 
                        user_id: favours[i].user_owed
                    } 
                });

                const username_owes = user_owes[0].first_name + " " + user_owes[0].last_name;
                const username_owed = user_owed[0].first_name + " " + user_owed[0].last_name;

                cycleFavours.push({
                    "user_owes": username_owes,
                    "user_owed": username_owed,
                    "favour_qty": favours[i].favour_qty
                });
            }
            return cycleFavours;
        }
        catch(e){
            console.log(e);
        }
    }

    static async searchByFavourQty(favour_qty){
        try{
            const query = `
                        SELECT
                            * 
                        FROM 
                            favours
                        WHERE
                            favour_qty = $favour_qty
                        `;

            let favours = await sequelize.query(query, {
                bind: { favour_qty: favour_qty }
                });
            
            return favours[0];
        }
        catch(e){
            console.log(e);
        }
    }

    static async cycleDetection(favours, user_id){
        try{
            const graphWithoutUserID = new Graph();
            const graphWithUserID = new Graph();

            for(let i=0; i<favours.length; ++i){
                if (favours[i].favour_qty > 0){
                    if (!(favours[i].user_owes == user_id || favours[i].user_owed == user_id)){
                        graphWithoutUserID.add(favours[i].user_owes, [favours[i].user_owed]);
                    }
                    graphWithUserID.add(favours[i].user_owes, [favours[i].user_owed]);
                }
                else if (favours[i].favour_qty < 0){
                    if (!(favours[i].user_owes == user_id || favours[i].user_owed == user_id)){
                        graphWithoutUserID.add(favours[i].user_owed, [favours[i].user_owes]);
                    }
                    graphWithUserID.add(favours[i].user_owes, [favours[i].user_owed]);
                }
            }

            console.log("Graph Without User ID has Cycle", graphWithoutUserID.hasCycle()); 
            console.log("Graph With User ID has Cycle", graphWithUserID.hasCycle()); 
            // console.log(graph.getStronglyConnectedComponents());

            if (graphWithoutUserID.hasCycle() == false && graphWithUserID.hasCycle() == true){
                return true;
            }
        }
        catch(e){
            console.log(e);
        }
    }
}

module.exports = favourService;