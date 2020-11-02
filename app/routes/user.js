module.exports = app => {
    //  import user controller
    const users = require("../controllers/user.js");

    let router = require("express").Router();

    //  below are the endpoint routes for all user APIs
    router.post("/", users.create);
    router.get("/", users.findAll);
    router.get("/:id", users.findOne);
    router.delete("/:id", users.delete);
    router.put("/:id", users.update);
    router.post("/login", users.login);

    app.use('/api/users', router);
};