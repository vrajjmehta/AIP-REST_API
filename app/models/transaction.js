const transaction = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('transaction', {
        transaction_id: {
            type: DataTypes.UUIDV1(36),
            allowNull: false
        },
        user_owes: {
            type: DataTypes.UUIDV1(36),
            allowNull: false
        },
        user_owed: {
            type: DataTypes.UUIDV1(36),
            allowNull: false
        },
        reward_name: {
            type: DataTypes.STRING(95),
            allowNull: false
        },
        qty: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        proof:{
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        }
    }, {
        timestamps: false,
    });
    Transaction.removeAttribute('id');
    return Transaction;
};
module.exports = transaction;