module.exports = app => {
    const posts = require("../controllers/post.js");

    var router = require("express").Router();
    
    router.get("/:id", posts.findOne);
    router.post("/", posts.createPost);
    
    app.use('/api/posts', router);
};