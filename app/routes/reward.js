module.exports = app => {
    const rewards = require("../controllers/reward.js");
    let router = require("express").Router();
    router.get("/", rewards.findAll);
    app.use('/api/rewards', router);
};