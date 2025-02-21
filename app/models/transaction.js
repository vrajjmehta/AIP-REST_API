//Sequelize model for transactions, this is used to communicate with the database
const transaction = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('transaction', {
        transaction_id: {
            type: DataTypes.UUIDV1(36),     // UUID for transaction_id
            allowNull: false
        },
        user_owes: {
            type: DataTypes.UUIDV1(36),     // UUID for user_owes
            allowNull: false
        },
        user_owed: {
            type: DataTypes.UUIDV1(36),     // UUID for user_owed
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
        proof: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        image_url: {
            type: DataTypes.STRING(1000),
            allowNull: true
        }
    }, {
        timestamps: false,
    });
    Transaction.removeAttribute('id');
    return Transaction;
};
module.exports = transaction;