const db = require("../config/setup.js");
const Transaction = db.transaction;
const Op = db.Sequelize.Op;
const {v4:uuid} = require('uuid');
const favourService = require("../services/favour.js");
const Favour = db.favour;

module.exports = {
    async addTransaction(req, res) {
        try {
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
                const transaction = await Transaction.create(inputTransaction);
                // console.log(transaction.transaction_id);
            }
            res.status(201).send({
                "message": "Transaction added successfully!"
            });
        } catch (e) {
            console.log(e);
            res.status(400).send(e);
        }
    },

    async findAll(req, res) {
        try {
            // const transaction_id = req.query.transaction_id;
            const user_owes = req.query.user_owes;
            const user_owed = req.query.user_owed;
            let outputTransactions = [];
            
            // if (transaction_id){
            //     transactions = await Transaction.findAll({
            //         where: {
            //             transaction_id: transaction_id
            //         }
            //     });
                
            //     if (transactions.length != 0){
            //         outputTransactions = favourService.refactorTransactions(transactions);
            //     }
            // }

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

    async updateTransaction(req, res){
        try{
            const transactions = await Transaction.update({ 
                    proof: req.body.proof
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
            let favours_owes = [];
            let favours_owed = [];

            if (!user_id){
                res.status(404).send({
                    "message": "Missing paramter!"
                });
            }

            favours_owes = await Favour.findAll({
                attributes: ['user_owed', 'favour_qty'],
                where:{
                    user_owes: user_id
                }
            });

            favours_owed = await Favour.findAll({
                attributes: ['user_owes', 'favour_qty'],
                where:{
                    user_owed: user_id
                }
            });

            if (favours_owed.length == 0){
                favours_owed = null;
            }
            if (favours_owes.length == 0){
                favours_owes = null;
            }
            else{
                favours_owes = await favourService.refactorFavours(favours_owes, 1);
                favours_owed = await favourService.refactorFavours(favours_owed, 0);
            }

            res.status(200).send({
                "favours_owes": favours_owes,
                "favours_owed": favours_owed
            });
        }
        catch(e){
            console.log(e);
            res.status(500).send(e);
        }
    }
};
