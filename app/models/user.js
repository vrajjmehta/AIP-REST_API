const user = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        user_id: {
            primaryKey: true,
            type: DataTypes.UUIDV1(36),
            defaultValue: DataTypes.UUIDV4,
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
        },
        favour_qty:{
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: 0
        }
    }, {
        timestamps: false,
    });
    return User;
};
module.exports = user;