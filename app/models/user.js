const { v4: uuidv4 } = require('uuid')
const user = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        user_id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: sequelize.UUIDV4,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(35),
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING(35),
            allowNull: false,

        },
        last_name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(35),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(35),
            allowNull: false
        }
    }, {
        timestamps: false,
    });
    return User;
};
module.exports = user;