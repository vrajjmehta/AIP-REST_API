const db = require("../config/setup.js");
const user = require("../routes/user.js");
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");

module.exports = {

    async create(req, res) {
        try 
        {
            const user = {
                first_name: req.body.user.first_name,
                last_name: req.body.user.last_name,
                email: req.body.user.email,
                username: req.body.user.username,
                password: await bcrypt.hash(req.body.user.password, 8)};
            await User.create(user);
            res.status(201).send({"user":user});
        } 
        catch (e) {
            res.status(500).send({'message': 'Username/email address not unqiue!'});
        }

    },

    async findAll(req, res) {
        const username = req.query.username;
        try {
            if (username){
                const user = await User.findAll({
                    where:{
                        username: username
                    }
                });
                if (user.length !=0 ){
                    res.status(200).send({'users':user});
                }
                else{
                    res.status(404).send({
                        'message':'User not found'
                    });
                }
            }
            const users = await User.findAll({});
            res.status(200).send({'users':users});
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
                    } });
            if (user.length == 0) {
                return res.status(404).send("Could not find the user with ID: " + id);
            }
            res.send({
                'users':user
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
            } else if (user == 1) {
                res.status(200).send('Successfully updated user!');

            }
        } catch (e) {
            res.status(500).send(e);
            console.log(e);
        }

    },

    async login(req, res){
        try{
            const username = req.body.user.username;
            const user = await User.findOne({
                where: {
                    username: username
                }
            });
            if (!user) {
                return res.status(404).send({
                    message: 'Username or Password is incorrect!'
                });
            }

            const isMatch = await bcrypt.compare(req.body.user.password, user.password);
            const token = jwt.sign({ username: username.toString() }, 'thisismynewkey', { expiresIn: '1 hour' });
            //const data = jwt.verify(token, 'thisismynewkey')
            if (!isMatch) {
                res.status(401).send({
                    'message': 'Username or Password is incorrect!'
                });
            } else {
                const finalUser = {
                    'user_id': user.user_id,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email
                };
                res.status(200).send({ 'users': finalUser, token });
            }
        } catch (e) {
            console.log(e);
            res.status(500).send('error 500');
        }
    }
};