module.exports = app => {
    const posts = require("../controllers/post.js");

    var router = require("express").Router();

    router.get("/:id", posts.findOne);
    router.get("/", posts.findAll);
    router.post("/", posts.createPost);
    router.post("/add_rewards", posts.addRewardPost);
    router.put("/apply_rewards", posts.applyRewardPost);

    app.use('/api/posts', router);
};