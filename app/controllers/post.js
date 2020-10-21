const db = require("../config/setup.js");
const Post = db.posts;
const postRewards = db.postRewards;
const Op = db.Sequelize.Op;
const postService = require("../services/post.js");
const sequelize = db.sequelize;
const {v4:uuid} = require('uuid');
const Transaction = db.transaction;

module.exports = {

    async findOne(req, res) {
        try {
            let userRewards = null;
            const post = await Post.findAll({
                where: {
                    post_id: req.params.id
                }
            });

            if (post.length != 0){
                const rewards = await postRewards.findAll({
                    attributes: ['user_id', 'reward_name', 'qty'],
                    where:{
                        post_id: req.params.id
                    }
                });
                userRewards = await postService.refactorPost(rewards);
            }

            if (post.length != 0) {
                res.status(200).send({ 
                    'post': post,
                    'rewards': userRewards
                });
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
            const keyword = req.query.keyword;
            const user_id = req.query.user_id;
            const offer_by = req.query.offer_by;
            const reward = req.query.reward;
            let post = null;

            if (keyword){
                post = await Post.findAll({
                    where: {
                        [Op.or]: [{
                                title: {
                                    [Op.like]: '%' + keyword + '%'
                                }
                            },
                            {
                                description: {
                                    [Op.like]: '%' + keyword + '%'
                                }
                            }
                        ]
                    },
                    order: [
                        ['added_datetime', 'DESC']
                    ]
                });
            }

            else if (user_id){
                post = await Post.findAll({
                    where: {
                        added_by: user_id
                    },
                    order: [
                        ['added_datetime', 'DESC']
                    ]
                });
            }

            else if (offer_by){
                post = await Post.findAll({
                    where: {
                        added_by: offer_by
                    },
                    order: [
                        ['added_datetime', 'DESC']
                    ]
                });
            }

            else if(reward){
                try{
                    const query = `
                                SELECT
                                    distinct(post_reward_history.post_id),
                                    concat(users.first_name, ' ', users.last_name) 'username',
                                    posts.title,
                                    posts.description,
                                    posts.added_datetime,
                                    posts.status,
                                    posts.proof
                                FROM 
                                    post_reward_history,
                                    posts,
                                    users
                                WHERE
                                    reward_name = $reward
                                    and
                                    post_reward_history.post_id = posts.post_id
                                    and
                                    users.user_id = posts.added_by
                                ORDER BY
                                    added_datetime DESC;`;

                    post = await sequelize.query(query, {
                                                bind: { reward: reward }
                                                });
                    
                    if (post[0].length !=0){
                        res.status(200).send({
                            'post': post[0]
                        });
                    }
                    else{
                        res.status(404).send({
                            "message": "Post not found!"
                        });
                    }
                }
                catch(e){
                    res.status(500).send(e);
                    console.log(e);
                }
            }

            else {
                post = await Post.findAll(
                    {
                        order: [
                            ['added_datetime', 'DESC']
                        ]
                    }
                );
            }

            const postUsers = await postService.refactorPosts(post);

            if (post.length == 0) {
                res.status(404).send({ "message": "Post not found!" });
            } 
            else {
                res.status(200).send({
                    'post': postUsers
                });
            }
        } catch (e) {
            res.status(500).send(e);
            console.log(e);
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

            let rewards = req.body.reward;
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

    async addRewardPost(req, res){
        try{
            let rewards = req.body.reward;
            for (i = 0; i < rewards.length; i++){
                const inputRewards = {
                    post_id: req.body.post_id,
                    user_id: req.body.user_id,
                    reward_name: rewards[i].name,
                    qty: rewards[i].qty
                };
                
                // Find the Rewards for the post already exists
                const postReward = await postRewards.findAll({
                    where: {
                        post_id: req.body.post_id,
                        user_id: req.body.user_id,
                        reward_name: rewards[i].name
                    }
                });

                // Check if it already exits and Update it with new rewards
                if (postReward.length !=0){
                    await postRewards.update({
                        qty: rewards[i].qty
                    },
                    {
                        where: {
                            post_id: req.body.post_id,
                            user_id: req.body.user_id,
                            reward_name: rewards[i].name
                        }
                    });
                }
                // Create the Rewards for the post
                else{
                    await postRewards.create(inputRewards);
                }
            }

            res.status(201).send({
                "message": "Rewards added/updated successfully!"
            });
        }
        catch(e){
            console.log(e);
            res.status(400).send(e);
        }
    },

    async applyRewardPost(req, res){
        try{
            const req_proof = req.body.proof;
            const image_url = req.body.image_url;
            let req_status = "Assigned";
            
            if (req_proof == 1){
                req_status = "Closed";

                const rewards = await postRewards.findAll({
                    attributes: ['user_id', 'reward_name', 'qty'],
                    where:{
                        post_id: req.body.post_id
                    }
                });

                const id = uuid();
                for (i = 0; i < rewards.length; i++) {
                    const inputTransaction = {
                        transaction_id: id,
                        user_owes: rewards[i].user_id,
                        user_owed: req.body.user_id,
                        proof: req.body.proof,
                        reward_name: rewards[i].reward_name,
                        qty: rewards[i].qty,
                        image_url: image_url
                    };
                    const transaction = await Transaction.create(inputTransaction);
                }
            }

            const post = await Post.update({ 
                    offer_by: req.body.user_id,
                    status: req_status,
                    proof: req_proof
                }, 
                {
                where: {
                    post_id: req.body.post_id
                }
            });

            res.status(200).send({
                "message": "User applied successfully"
            });
        }
        catch(e){
            console.log(e);
            res.status(400).send(e);
        }
    },
};