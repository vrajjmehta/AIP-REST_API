module.exports = app => {
    //  import favour controller
    const favours = require("../controllers/favour.js");

    let router = require("express").Router();

    //  below are the endpoint routes for all favour APIs
    router.post("/add_transaction", favours.addTransaction);
    router.get("/transaction", favours.findAll);
    router.get("/transaction/:id", favours.findOne);
    router.put("/transaction", favours.updateTransaction);
    router.get("/", favours.findUserFavours);
    router.get("/leaderboard", favours.leaderboard);
    router.get("/cycle-detection/:id", favours.cycleDetection);

    app.use('/api/favours', router);
};