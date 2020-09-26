const post = (sequelize, Sequelize) => {
    const Post = sequelize.define('post', {
        post_id: {
            primaryKey: true,
            type: Sequelize.UUIDV1(36),
            defaultValue: Sequelize.UUIDV4
        },
        added_by: {
            type: Sequelize.UUIDV1(36),
            allowNull: false
        },
        offer_by: {
            type: Sequelize.UUIDV1(36),
        },
        title: {
            type: Sequelize.STRING(45),
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT
        },
        added_datetime: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        status: {
            type: Sequelize.STRING(35),
            allowNull: false,
            defaultValue: 'Open'
        },
        proof:{
            type: Sequelize.BOOLEAN,
            defaultValue: 0
        }
    },
    {
        timestamps: false,
    }
    );
    return Post;
};
module.exports = post;