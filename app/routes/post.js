module.exports = app => {
    //  import post controller
    const posts = require("../controllers/post.js");

    let router = require("express").Router();

    //  below are the endpoint routes for all post APIs
    router.get("/:id", posts.findOne);
    router.get("/", posts.findAll);
    router.post("/", posts.createPost);
    router.post("/add_rewards", posts.addRewardPost);
    router.put("/apply_rewards", posts.applyRewardPost);

    app.use('/api/posts', router);
};