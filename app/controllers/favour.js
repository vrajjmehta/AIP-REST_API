const db = require("../config/setup.js");
const Transaction = db.transaction;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const {fn, col} = db.Sequelize;
const {v4:uuid} = require('uuid');
const favourService = require("../services/favour.js");
const Favour = db.favour;
const User = db.users;

// All the methods are coded with async/await syntax
// It takes input from req (either body or query-parameters) and response a JSON output

module.exports = {
    // Method to Add a transaction between two users (user_owes and user_owed) with multiple rewards
    // (Generate MySQL trigger to add favours qty between two users)
    // Check MySQL/Triggers/favours_AFTER_INSERT.sql
    async addTransaction(req, res) {
        try {
            // cannot add transaction with the same user
            if (req.body.user_owes == req.body.user_owed){
                res.status(400).send({
                    "message": "Cannot do transaction with yourself"
                });
            }
            else{
                // generate a UUID for transaction_id
                const id = uuid();
                let rewards = req.body.reward;
                
                // loop through each reward and store in an object
                for (i = 0; i < rewards.length; i++) {
                    const inputTransaction = {
                        transaction_id: id,
                        user_owes: req.body.user_owes,
                        user_owed: req.body.user_owed,
                        proof: req.body.proof,
                        reward_name: rewards[i].name,
                        qty: rewards[i].qty
                    };
                    // store the transaction to the DB
                    transaction = await Transaction.create(inputTransaction);
                }
                res.status(201).send({
                    "transaction_id": id,
                    "message": "Transaction added successfully!"
                });
            }
        } catch (e) {
            console.log(e);
            res.status(400).send(e);
        }
    },

    // Method to Find all the transactions between two users (user_id as input)
    async findAll(req, res) {
        try {
            // take input of user_owes and user_owed to find their transactions
            const user_owes = req.query.user_owes;
            const user_owed = req.query.user_owed;
            let outputTransactions = [];
            
            // if missing parameters
            if (!(user_owes && user_owed)){
                res.status(404).send({ "message": "Missing parameter, input should have both user_owes & user_owed!" });
            }

            // sequelize query to find all the transactions and order by timestamp desc
            else if (user_owes && user_owed){
                transactions = await Transaction.findAll({
                    where:{
                        user_owes: user_owes,
                        user_owed: user_owed
                    },
                    order: [
                        ['transaction_id'],
                        ['timestamp', 'DESC']
                    ]
                });

                // refactor the output to group the rewards for same transaction_id in JSON
                if (transactions.length != 0){
                    outputTransactions = favourService.refactorUserTransactions(transactions);
                }
            }

            else {
                res.status(404).send({ "message": "Missing parameters!" });
            }

            if (outputTransactions.length == 0) {
                res.status(404).send({ "message": "Transaction not found!" });
            } 
            else {
                res.status(200).send({
                    'transactions': outputTransactions
                });
            }
        } catch (e) {
            res.status(500).send(e);
            console.log(e);
        }
    },

    // Method to Find the individual transaction given the transaction_id
    async findOne(req, res) {
        try {
            // Input Parameter as transaction_id 
            const transaction_id = req.params.id;
            let outputTransactions = [];
            
            // Sequelize query to find all the transactions with that id
            if (transaction_id){
                transactions = await Transaction.findAll({
                    where: {
                        transaction_id: transaction_id
                    }
                });

                // refactor the output to group the rewards for same transaction_id in JSON
                if (transactions.length != 0){
                    outputTransactions = favourService.refactorUserTransactions(transactions);
                }
            }

            else {
                res.status(404).send({ "message": "Missing parameters!" });
            }

            if (outputTransactions.length == 0) {
                res.status(404).send({ "message": "Transaction not found!" });
            } 
            else {
                res.status(200).send({
                    'transactions': outputTransactions
                });
            }
        } catch (e) {
            res.status(500).send(e);
            console.log(e);
        }
    },

    // Method to Update transaction with proof if uploaded 
    // (Generate MySQL trigger to update favours qty between two users)
    // Check MySQL/Triggers/favours_AFTER_UPDATE.sql
    async updateTransaction(req, res){
        try{
            // Sequelize query to update the record in DB with proof and image_url
            // Input body as transaction_id
            const transactions = await Transaction.update({ 
                    proof: req.body.proof,
                    image_url: req.body.image_url
                }, 
                {
                where: {
                    transaction_id: req.body.transaction_id
                }
            });

            res.status(200).send({
                "message": "Proof uploaded successfully"
            });
        }
        catch(e){
            console.log(e);
            res.status(400).send(e);
        }
    },

    // Method to Find all the favours owed or owed to other users (Input - user_id)
    async findUserFavours(req, res){
        try{
            // Input as user_id
            const user_id = req.query.user_id;

            if (!user_id){
                res.status(404).send({
                    "message": "Missing paramter!"
                });
            }

            // Sequelize query to find all the favour_owes for the user_id
            let favours_owes = await Favour.findAll({
                attributes: ['user_owed', 'favour_qty'],
                where:{
                    user_owes: user_id
                }
            });

            // Sequelize query to find all the favour_owed for the user_id
            let favours_owed = await Favour.findAll({
                attributes: ['user_owes', 'favour_qty'],
                where:{
                    user_owed: user_id
                }
            });

            // Refactor favours to include 'fullname' for the favours recieved
            if (favours_owed.length == 0 && favours_owes.length != 0){
                favours_owed = null;
                favours_owes = await favourService.refactorFavours(favours_owes, 1);
            }
            else if (favours_owes.length == 0 && favours_owed.length != 0){
                favours_owes = null;
                favours_owed = await favourService.refactorFavours(favours_owed, 0);
            }
            else if(favours_owes.length != 0 && favours_owed.length != 0){
                favours_owes = await favourService.refactorFavours(favours_owes, 1);
                favours_owed = await favourService.refactorFavours(favours_owed, 0);
            }
            else if(favours_owes.length == 0 && favours_owed.length == 0){
                favours_owes = null;
                favours_owed = null;
            }

            const finalFavours = await favourService.finalFavours(favours_owes, favours_owed);
            if (finalFavours[0].length == 0){
                finalFavours[0] = null;
            }
            if (finalFavours[1].length == 0){
                finalFavours[1] = null;
            }

            res.status(200).send({
                "favours_owes": finalFavours[0],
                "favours_owed": finalFavours[1]
            });
        }
        catch(e){
            console.log(e);
            res.status(500).send(e);
        }
    },

    // Method to list the top 10 users by owes and owed
    async leaderboard(req, res){
        try{
            // Take high_favours = 1 as input for least debt and high_favours = 0 for most debt 
            let high_favours = req.query.high_favours;
            // Take order as input for sorting in ASC or DESC
            let order = req.query.order;
            let users = null;

            if(!order){
                order = 'DESC';
            }

            // Sequelize query to find users with Least Debt 
            if (high_favours == 1){
                users = await User.findAll({
                        attributes: ['user_id', [fn('CONCAT', col('first_name'), ' ', col('last_name')), 'username'], 'favour_qty',],
                        where:{
                            favour_qty:{
                                [Op.gte]: 0
                            }
                        },
                        order: [
                            ['favour_qty', order]
                        ],
                        limit : 10
                });
            }
            // Sequelize query to find users with Most Debt 
            else {
                // Reverse the order as favours are -ve
                if(order == 'DESC'){
                    order = 'ASC';
                }
                else{
                    order = 'DESC';
                }

                users = await User.findAll({
                    attributes: ['user_id', [fn('CONCAT', col('first_name'), ' ', col('last_name')), 'username'], 'favour_qty',],
                    where:{
                        favour_qty:{
                            [Op.lte]: 0
                        }
                    },
                    order: [
                        ['favour_qty', order]
                    ],
                    limit : 10
            });
            }

            res.status(200).send({
                "users": users
            });
        }
        catch(e){
            console.log(e);
            res.status(500).send(e);
        }
    },

    // Method to detect if the provided user is in a cycle, return the list of user with favour_qty in cycle
    async cycleDetection(req, res){
        try{
            // Input as user_id
            const user_id = req.params.id;

            // Find all the transactions with that user
            const query = `
                        SELECT
                            * 
                        FROM 
                            favours
                        WHERE
                            user_owes = $user_id
                            OR 
                            user_owed = $user_id
                            `;

            let favours = await sequelize.query(query, {
                            bind: { user_id: user_id }
                            });
        
            // Loop through each transaction qty
            for (i=0; i<favours[0].length; ++i){
                if (favours[0][i].favour_qty !=0 ){
                    // Find all the favours with same qty (Considering only same weights)
                    let graphFavours = await favourService.searchByFavourQty(favours[0][i].favour_qty);

                    //  Create a graph with the favours found between users to detect a cycle (Creating a directed graph)
                    const cycleDetection = await favourService.cycleDetection(graphFavours, user_id);
                    if (cycleDetection){
                        // Refactor favours to find 'fullname' of the cycle detected favours
                        const cycleFavours = await favourService.refactorCycleFavours(graphFavours);
                        res.status(200).send({
                            'cycle_detected': cycleDetection,
                            'favours': cycleFavours
                        });
                    }
                }
            }

            res.status(404).send({
                'message': 'No cycle detected!'
            });
        }
        catch(e){
            console.log(e);
            res.status(500).send(e);
        }
    }
};
