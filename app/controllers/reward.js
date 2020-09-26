const db = require("../config/setup.js");
const reward = require("../routes/reward.js");
const Reward = db.rewards;
const Op = db.Sequelize.Op;

module.exports = {
    async findAll(req, res) {
        try {
            const reward = await Reward.findAll();
            if (reward.length != 0) {
                res.status(200).send(reward);
            } else {
                res.status(404).send({ "message": "Reward not found" });
            }
        } catch (e) {
            console.log(e);
            res.status(500).send(e);
        };
    }
}