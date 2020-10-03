const db = require("../config/setup.js");
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

            const rewards = await postRewards.findAll({
                attributes: ['user_id', 'reward_name', 'qty'],
                where:{
                    post_id: req.params.id
                }
            });

            // restucture the json format
            var userRewards = [];
            var reward = [];
            user_id = rewards[0].user_id;

            for (i = 0; i<rewards.length; ++i){
                
                if (user_id == rewards[i].user_id){
                    reward.push({
                        "reward_name": rewards[i].reward_name,
                        "qty": rewards[i].qty
                    });
                }
                else if(user_id != rewards[i].user_id){
                    userRewards.push({
                        "user_id": user_id,
                        "rewards": reward
                    });

                    reward = [];
                    user_id = rewards[i].user_id;

                    reward.push({
                        "reward_name": rewards[i].reward_name,
                        "qty": rewards[i].qty
                    });
                }
            }

            userRewards.push({
                "user_id": user_id,
                "rewards": reward
            });
            // End of destructure code

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
            var post = null;

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
                    }
                });
            }

            else if (user_id){
                post = await Post.findAll({
                    where: {
                        added_by: user_id
                    }
                });
            }

            else {
                post = await Post.findAll();
            }

            if (post.length == 0) {
                res.status(404).send({ "message": "Post not found!" });
            } 
            else {
                res.status(200).send({
                    'post': post
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

    async addRewardPost(req, res){
        try{
            var rewards = req.body.reward;
            for (i = 0; i < rewards.length; i++){
                const inputRewards = {
                    post_id: req.body.post_id,
                    user_id: req.body.user_id,
                    reward_name: rewards[i].name,
                    qty: rewards[i].qty
                };
                const rewardPost = postRewards.create(inputRewards);
            }

            res.status(201).send({
                "message": "Rewards added successfully"
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
            var req_status = "Assigned";
            
            if (req_proof == 1){
                req_status = "Closed";
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