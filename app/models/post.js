//Sequelize model for posts, this is used to communicate with the database
const post = (sequelize, DataTypes) => {
    const Post = sequelize.define('post', {
        post_id: {
            primaryKey: true,
            type: DataTypes.UUIDV1(36),
            defaultValue: DataTypes.UUIDV4
        },
        added_by: {
            type: DataTypes.UUIDV1(36),
            allowNull: false
        },
        offer_by: {
            type: DataTypes.UUIDV1(36),
        },
        title: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT
        },
        added_datetime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.STRING(35),
            allowNull: false,
            defaultValue: 'Open'
        },
        proof: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        }
    }, {
        timestamps: false,
    });
    return Post;
};
module.exports = post;