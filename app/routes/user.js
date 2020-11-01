module.exports = app => {

    //below are the routes for all user APIs, without these no connection can be made to the user APIs
    const users = require("../controllers/user.js");

    let router = require("express").Router();

    router.post("/", users.create);
    router.get("/", users.findAll);
    router.get("/:id", users.findOne);
    router.delete("/:id", users.delete);
    router.put("/:id", users.update);
    router.post("/login", users.login);

    app.use('/api/users', router);
};