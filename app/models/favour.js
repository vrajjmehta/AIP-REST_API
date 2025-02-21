//Sequelize model for favours, this is used to communicate with the database
const favour = (sequelize, DataTypes) => {
    const Favour = sequelize.define('favour', {
        user_owes: {
            type: DataTypes.UUIDV1(36),     // UUID for user_owes
            allowNull: false
        },
        user_owed: {
            type: DataTypes.UUIDV1(36),     // UUID for user_owed
            allowNull: false
        },
        favour_qty: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        }
    }, {
        timestamps: false,
    });
    Favour.removeAttribute('id');
    return Favour;
};
module.exports = favour;