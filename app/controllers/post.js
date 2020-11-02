const db = require("../config/setup.js");
const Post = db.posts;
const postRewards = db.postRewards;
const Op = db.Sequelize.Op;
const postService = require("../services/post.js");
const sequelize = db.sequelize;
const {v4:uuid} = require('uuid');
const Transaction = db.transaction;

// All the methods are coded with async/await syntax
// It takes input from req (either body or query-parameters) and response a JSON output

module.exports = {
    // Method to find a particular post details using post_id as input
    async findOne(req, res) {
        try {
            let userRewards = null;

            // Sequelize query to find post details with post_id
            const post = await Post.findAll({
                where: {
                    post_id: req.params.id
                }
            });

            if (post.length != 0){
                // Sequelize query to rewards from multiple users for the post
                const rewards = await postRewards.findAll({
                    attributes: ['user_id', 'reward_name', 'qty'],
                    where:{
                        post_id: req.params.id
                    }
                });
                // Refactor rewards to group reward together with the user_id in JSON object
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

    // Method to find all the posts with details (title, posted_by, added_datetime) sorted in desc by added_datetime
    async findAll(req, res) {
        try {
            const keyword = req.query.keyword;
            const user_id = req.query.user_id;
            const offer_by = req.query.offer_by;
            const reward = req.query.reward;
            let post = null;

            // Find posts with a specific keyword (searches Title and Description)
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

            // Find posts with the user_id (added_by)
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

            // Find posts with user_id (offer_by)
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

            // Find posts with a specific reward
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

            // If no paramaters passed, find all the posts
            else {
                post = await Post.findAll(
                    {
                        order: [
                            ['added_datetime', 'DESC']
                        ]
                    }
                );
            }

            // Refactor posts to include 'fullname' for user_id
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

    // Method to create new post with the details provided and storing it into DB
    async createPost(req, res) {
        try {
            // Create a post with sequelize
            const inputPost = {
                added_by: req.body.post.added_by,
                title: req.body.post.title,
                description: req.body.post.description
            };
            const post = await Post.create(inputPost);

            // Loop to add multiple rewards for the same post
            let rewards = req.body.reward;
            for (i = 0; i < rewards.length; i++) {
                const inputRewards = {
                    post_id: post.post_id,
                    user_id: req.body.post.added_by,
                    reward_name: rewards[i].name,
                    qty: rewards[i].qty
                };
                // Sequelize method to store it to DB
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

    // Method to Edit the reward for a post OR add rewards from a different user to the same post
    async addRewardPost(req, res){
        try{
            // Loop to Add multiple rewards from a different user
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

    // Method to apply for the post to complete the task (Upload proof)
    async applyRewardPost(req, res){
        try{
            // Input as proof (boolean) and image_url (Firebase link)
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

            // Sequelize query to update the post with the provided details
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