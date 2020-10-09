const db = require("../config/setup.js");
const user = require("../routes/user.js");
const User = db.users;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


module.exports = {

    async create(req, res) {
        const user = {
            user_id: req.body.user_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, 8)
        };
        try {
            await User.create(user);
            res.status(201).send(user);
            if (!req.body.username) {
                res.status(400).send({
                    message: 'Please enter all fields!'
                });
                return;
            }
        } catch (e) {
            res.status(500).send(e);
        }
    },
    async login(req, res) {
        const username = req.body.username
        const user = await User.findOne({
            where: {
                username: username
            }
        });
        try {
            if (!user) {
                return res.status(404).send({
                    message: 'Username or Password is incorrect!'
                });
            }

            const isMatch = await bcrypt.compare(req.body.password, user.password);
            const token = jwt.sign({ username: username.toString() }, 'thisismynewkey', { expiresIn: '1 hour' });
            //const data = jwt.verify(token, 'thisismynewkey')
            if (!isMatch) {
                res.status(401).send({
                    'message': 'Username or Password is incorrect!'
                });
            } else {
                // console.log(data)
                res.status(200).send({ 'users': user, token });
            }
        } catch (e) {
            console.log(e);
            res.status(500).send('error 500');
        }
    },
    async findAll(req, res) {
        const username = req.query.username;
        try {
            if (username) {
                const user = await User.findAll({
                    where: {
                        username: username
                    }
                });
                if (user.length != 0) {
                    res.status(200).send({ 'users': user });
                } else {
                    res.status(404).send({
                        'message': 'User not found'
                    });
                }
            }
            const users = await User.findAll({});
            res.status(200).send({ 'users': users });
        } catch (e) {
            res.status(400).send();
        }
    },

    async findOne(req, res) {
        const id = req.params.id;
        try {
            const user = await User.findAll({
                where: {
                    user_id: id
                }
            });
            if (user.length == 0) {
                return res.status(404).send("Could not find the user with ID: " + id);
            }
            res.send({
                'users': user
            });
        } catch (e) {
            res.status(500).send(e);
        }
    },

    async delete(req, res) {
        const id = req.params.id;
        try {
            const user = await User.destroy({ where: { user_id: id } });
            if (!user) {
                return res.status(404).send("Could not delete the user with ID: " + id);
            }
            res.send('User successfully deleted');
        } catch (e) {
            res.status(500).send(e);
        }
    },

    async update(req, res) {
        const id = req.params.id;
        const updates = Object.keys(req.body);
        const allowedUpdates = ['first_name', 'last_name', 'email', 'password', 'age'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid update!' });
        }
        try {
            const user = await User.update(req.body, { where: { user_id: id } });
            if (user == 0) {
                res.send('Cannot update user with ID: ' + id);

            } else {
                res.status(200).send('Successfully updated user!!');
            }
        } catch (e) {
            res.status(500).send(e);
            console.log(e);
        }

    }
};