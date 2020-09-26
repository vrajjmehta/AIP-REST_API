module.exports = app => {
    const rewards = require("../controllers/reward.js");
    var router = require("express").Router();
    router.get("/", rewards.findAll);
    app.use('/api/rewards', router);
}