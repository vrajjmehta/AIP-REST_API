const db = require("../config/setup.js");
const Transaction = db.transaction;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const {fn, col} = db.Sequelize;
const {v4:uuid} = require('uuid');
const favourService = require("../services/favour.js");
const Favour = db.favour;
const User = db.users;

module.exports = {
    async addTransaction(req, res) {
        try {
            if (req.body.user_owes == req.body.user_owed){
                res.status(400).send({
                    "message": "Cannot do transaction with yourself"
                });
            }

            const id = uuid();
            let rewards = req.body.reward;
            for (i = 0; i < rewards.length; i++) {
                const inputTransaction = {
                    transaction_id: id,
                    user_owes: req.body.user_owes,
                    user_owed: req.body.user_owed,
                    proof: req.body.proof,
                    reward_name: rewards[i].name,
                    qty: rewards[i].qty
                };
                transaction = await Transaction.create(inputTransaction);
                // console.log(transaction.transaction_id);
            }
            res.status(201).send({
                "transaction_id": id,
                "message": "Transaction added successfully!"
            });
        } catch (e) {
            console.log(e);
            res.status(400).send(e);
        }
    },

    async findAll(req, res) {
        try {
            const user_owes = req.query.user_owes;
            const user_owed = req.query.user_owed;
            let outputTransactions = [];
            
            if (!(user_owes && user_owed)){
                res.status(404).send({ "message": "Missing parameter, input should have both user_owes & user_owed!" });
            }

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

    async findOne(req, res) {
        try {
            const transaction_id = req.params.id;
            let outputTransactions = [];
            
            if (transaction_id){
                transactions = await Transaction.findAll({
                    where: {
                        transaction_id: transaction_id
                    }
                });

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

    async updateTransaction(req, res){
        try{
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

    async findUserFavours(req, res){
        try{
            const user_id = req.query.user_id;

            if (!user_id){
                res.status(404).send({
                    "message": "Missing paramter!"
                });
            }

            let favours_owes = await Favour.findAll({
                attributes: ['user_owed', 'favour_qty'],
                where:{
                    user_owes: user_id
                }
            });
            
            console.log(favours_owes);

            let favours_owed = await Favour.findAll({
                attributes: ['user_owes', 'favour_qty'],
                where:{
                    user_owed: user_id
                }
            });

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

    async leaderboard(req, res){
        try{
            let high_favours = req.query.high_favours;
            let order = req.query.order;
            let users = null;

            if(!order){
                order = 'DESC';
            }

            // Least Debt 
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
            // Highest Debt
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

    async cycleDetection(req, res){
        try{
            const user_id = req.params.id;

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
        
            for (i=0; i<favours[0].length; ++i){
                let graphFavours = await favourService.searchByFavourQty(favours[0][i].favour_qty);
                const cycleDetection = await favourService.cycleDetection(graphFavours, user_id);
                if (cycleDetection){
                    const cycleFavours = await favourService.refactorCycleFavours(graphFavours);
                    res.status(200).send({
                        'cycle_detected': cycleDetection,
                        'favours': cycleFavours
                    });
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
