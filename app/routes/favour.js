module.exports = app => {
    const favours = require("../controllers/favour.js");

    var router = require("express").Router();

    router.post("/add_transaction", favours.addTransaction);
    router.get("/transaction", favours.findAll);

    app.use('/api/favours', router);
};