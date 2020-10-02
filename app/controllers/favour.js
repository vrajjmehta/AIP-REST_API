const db = require("../config/setup.js");
const Transaction = db.transaction;
const Op = db.Sequelize.Op;
const {v4:uuid} = require('uuid');
const transaction = require("../models/transaction.js");

module.exports = {
    async addTransaction(req, res) {
        try {
            const id = uuid();
            var rewards = req.body.reward;
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
            const transaction_id = req.query.transaction_id;
            const user_owes = req.query.user_owes;
            const user_owed = req.query.user_owed;

            if (transaction_id){
                transactions = await Transaction.findAll({
                    where: {
                        transaction_id: transaction_id
                    }
                });
            }

            else if (user_owes){
                transactions = await Transaction.findAll({
                    where:{
                        user_owes: user_owes
                    }
                });
            }

            else if (user_owed){
                transactions = await Transaction.findAll({
                    where:{
                        user_owed: user_owed
                    }
                });
            }
            
            else {
                res.status(404).send({ "message": "Missing parameters!" });
            }

            if (transactions.length == 0) {
                res.status(404).send({ "message": "Transaction not found!" });
            } 
            else {
                res.status(200).send({
                    'transactions': transactions
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
    }
};