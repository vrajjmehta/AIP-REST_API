const db = require("../config/setup.js");
const post = require("../routes/post.js");
const { findAll } = require("./user.js");
const Post = db.posts;
const postRewards = db.postRewards;
const Op = db.Sequelize.Op;

module.exports = {

    async findOne(req, res) {
        try {
            const post = await Post.findAll({
                where: {
                    post_id: req.params.id
                }
            });
            if (post.length != 0) {
                res.status(200).send({ 'post': post });
            } else {
                res.status(404).send({ "message": "Post not found" });
            }
        } catch (e) {
            console.log(e);
            res.status(500).send(e);
        }
    },
    async findAll(req, res) {
        try {
            const keyword = req.query.keyword
            const post = await Post.findAll({
                where: {
                    title: {
                        [Op.like]: '%' +
                            keyword + '%'
                    }
                }

            })
            if (post.length == 0) {
                res.status(404).send({ "message": "Post not found!" });
            } else {
                res.status(200).send({
                    'post': post
                });
            }
        } catch (e) {
            res.status(500).send(e);
            console.log(e)
        }

    },

    async createPost(req, res) {
        try {
            const inputPost = {
                added_by: req.body.post.added_by,
                title: req.body.post.title,
                description: req.body.post.description
            };
            const post = await Post.create(inputPost);

            var rewards = req.body.reward;
            for (i = 0; i < rewards.length; i++) {
                const inputRewards = {
                    post_id: post.post_id,
                    user_id: req.body.post.added_by,
                    reward_name: rewards[i].name,
                    qty: rewards[i].qty
                };
                const rewardPost = postRewards.create(inputRewards);
            }

            res.status(201).send({
                "message": "Post successfully created",
                "post": post
            });
        } catch (e) {
            console.log(e);
            res.status(400).send(e);
        }
    },
};