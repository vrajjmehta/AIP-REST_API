//Sequelize model for post-rewards, this is used to communicate with the database
const postReward = (sequelize, DataTypes) => {
    const PostReward = sequelize.define('post_reward_history', {
        post_id: {
            primaryKey: false,
            type: DataTypes.UUIDV1(36),         // UUID for post_id
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        user_id: {
            primaryKey: false,
            type: DataTypes.UUIDV1(36),         // UUID for user_id
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        reward_name: {
            type: DataTypes.STRING(95),
            allowNull: false
        },
        qty: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    });
    PostReward.removeAttribute('id');
    return PostReward;
};

module.exports = postReward;