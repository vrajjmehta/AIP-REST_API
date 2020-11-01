//Sequelize model for rewards, this is used to communicate with the database
const reward = (sequelize, DataTypes) => {
    const Reward = sequelize.define('reward', {
        reward_name: {
            primaryKey: true,
            type: DataTypes.STRING(95),
            allowNull: false
        }
    }, {
        timestamps: false,
    });
    return Reward;
};
module.exports = reward;