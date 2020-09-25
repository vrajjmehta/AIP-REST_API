const db = require("../config/setup.js");
const User = db.users;
const Op = db.Sequelize.Op;
exports.findOne = (req, res) => {

    const id = req.params.id;

    User.findAll({
            where: {
                user_id: id
            }
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send(err, {
                message: "Error retrieving User with id=" + id
            });
        });
};