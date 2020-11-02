const db = require("../config/setup.js");
const User = db.users;

class postService{
    // Refactor post to merge multiple rewards to same post
    static async refactorPost(rewards){
        let userRewards = [];
        let reward = []; 
        let user_id = rewards[0].user_id;

        for (let i = 0; i<rewards.length; ++i){
            
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
        return userRewards;
    }

    // Refactor post to include 'fullname' in the post object
    static async refactorPosts(post){
        let postUsers = [];
        let user = null;

        for (let i=0; i<post.length; ++i){
            user = await User.findAll({
                where: { 
                    user_id: post[i].added_by
                } 
            });

            const username = user[0].first_name + " " + user[0].last_name;

            postUsers.push({
                "post_id": post[i].post_id,
                "username": username,
                "title": post[i].title,
                "description": post[i].description,
                "added_datetime": post[i].added_datetime,
                "status": post[i].status,
                "proof": post[i].proof
            });
        }
        return postUsers;
    }
}

module.exports = postService;