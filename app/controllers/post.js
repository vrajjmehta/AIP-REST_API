const db = require("../config/setup.js");
const post = require("../models/post.js");
const Post = db.posts;
const Op = db.Sequelize.Op;

module.exports = {

    async findOne(req, res){
        try{
            const post = await Post.findAll({
                where:{
                    post_id: req.params.id
                }
            });
            if (post.length != 0){
                res.status(200).send(post);
            }
            else{
                res.status(404).send({"message":"Post not found"});
            }
        }
        catch(e){
            console.log(e);
            res.status(500).send(e);
        }
    },

    async createPost(req,res) {
        try {
            const post = await Post.create({
                added_by : req.body.added_by,
                title : req.body.title,
                status: req.body.status
            });
            res.status(201).send(post);
        }
        catch(e){
            console.log(e);
            res.status(400).send(e);
        }
    },
};