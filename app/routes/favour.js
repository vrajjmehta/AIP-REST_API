module.exports = app => {
    const favours = require("../controllers/favour.js");

    let router = require("express").Router();

    router.post("/add_transaction", favours.addTransaction);
    router.get("/transaction", favours.findAll);
    router.put("/transaction", favours.updateTransaction);

    app.use('/api/favours', router);
};