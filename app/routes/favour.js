module.exports = app => {
    const favours = require("../controllers/favour.js");

    let router = require("express").Router();

    router.post("/add_transaction", favours.addTransaction);
    router.get("/transaction", favours.findAll);
    router.get("/transaction/:id", favours.findOne);
    router.put("/transaction", favours.updateTransaction);
    router.get("/", favours.findUserFavours);
    router.get("/leaderboard", favours.leaderboard);

    app.use('/api/favours', router);
};