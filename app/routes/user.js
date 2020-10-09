module.exports = app => {
    const users = require("../controllers/user.js");
    var router = require("express").Router();
    const auth = require('../middleware/auth')

    router.post("/", users.create);
    router.post('/:id', users.login);
    router.get("/", auth, users.findAll);
    router.get("/:id", users.findOne);
    router.delete("/:id", users.delete);
    router.put("/:id", users.update);
    app.use('/api/users', router);
};