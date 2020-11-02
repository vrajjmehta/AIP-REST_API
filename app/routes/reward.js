module.exports = app => {
    //  import reward controller
    const rewards = require("../controllers/reward.js");

    let router = require("express").Router();

    //  below are the endpoint routes for all reward API
    router.get("/", rewards.findAll);
    app.use('/api/rewards', router);
};