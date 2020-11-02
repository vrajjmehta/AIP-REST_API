# Referencing
Declan - The Complete Node.js Developer Course (3rd edition) by Andrew Mead (Udemy)
I used this to learn Node.js, including implmenetation of JWTs for this assignment
Vraj - 



# API List and Categories

## ---User APIs and OUTPUT ---
GET - Find All Users ---- {{url}}/api/users
OUTPUT -
{
    "users": [
        {
            "user_id": "2cf25020-2008-4663-ade2-6091c87e4efa",
            "username": "Alice",
            "first_name": "Alice",
            "last_name": "Alice",
            "email": "Alice@gmail.com",
            "password": "declan2000",
            "favour_qty": -1
        },
        {
            "user_id": "9bbf25ec-93b1-4e04-aed9-298ecd356f5c",
            "username": "ben",
            "first_name": "Benjamin",
            "last_name": "Johnston",
            "email": "ben@example.com",
            "password": "$2a$08$LpwdKgFuxjMIbnmHviEG8.dYGsBuwfdR0katUZKk9cE8vP8QCg.eC",
            "favour_qty": 11
        },
        ...
        {
            "user_id": "41920400-d6ec-4fb5-84c3-166f9ec34147",
            "username": "yuzhao",
            "first_name": "yu",
            "last_name": "zhao",
            "email": "yu@gmail.com",
            "password": "$2a$08$3itENsPf0OJkBf0GOWgezOvVUthfLZZNSmFuN.GD9JBOxtvWe3qGS",
            "favour_qty": -3
        }
    ]
}
------------------------------------------------
GET - Find Specific User - {{url}}/api/users/<user_id>
{
    "users": [
        {
            "user_id": "2cf25020-2008-4663-ade2-6091c87e4efa",
            "username": "Alice",
            "first_name": "Alice",
            "last_name": "Alice",
            "email": "Alice@gmail.com",
            "password": "declan2000",
            "favour_qty": -1
        }
    ]
}
--------------------------------------------------
POST - New User Sign-Up -  {{url}}/api/users
INPUT ---- {
    "first_name":"Jonathon",
    "username":"Jonathon1",
    "last_name":"Glover",
    "email":"jonathon300@gmail.com",
    "password":"Jonathon20000@"
}
OUPUT ---- 
{
    "message": "Username/email address not unqiue!"
}
-----------------------------------------------------
PUT - Update Specific User - {{url}}/api/users/<user_id>
INPUT ---- {
    "password":"declan2000"
}
OUTPUT -----
Successfully updated user!
---------------------------------------------------
DELETE - Delete Specific User - {{url}}/api/users/<user_id>
cannot currently run as all users have related posts, due to this the databse will not allow you to delete them.
---------------------------------------------------
POST - Log-in - {{url}}/api/users/login
INPUT -- 
{
  "username":"Hiromi1",
  "password":"Christina200"
}
OUPUT --
Login Successful
--------------------------------------------------
Logout
--------------------------------------------------
---Post APIs---
GET - Find Particular Post
INPUT  --- {{url}/api/posts/<post_id>
OUTPUT --- 
{
    "post": [
        {
            "post_id": "c4afa510-addf-4eb8-91e7-4d096c090008",
            "added_by": "ca83e7a7-ddfb-46a9-9da1-895c80497c14",
            "offer_by": "9bbf25ec-93b1-4e04-aed9-298ecd356f5c",
            "title": "Clean the office",
            "description": "Please clean the whole office",
            "added_datetime": "2020-10-22 12:05:38",
            "status": "Closed",
            "proof": true
        }
    ],
    "rewards": [
        {
            "user_id": "ca83e7a7-ddfb-46a9-9da1-895c80497c14",
            "rewards": [
                {
                    "reward_name": "Chocolate",
                    "qty": 2
                },
                {
                    "reward_name": "Coffee",
                    "qty": 2
                },
                {
                    "reward_name": "Mint",
                    "qty": 1
                },
                {
                    "reward_name": "Pizza",
                    "qty": 1
                }
            ]
        }
    ]
}
--------------------------------------------------
GET - Find All Posts - 
INPUT  --- {{url}}/api/posts
Parameters --- keyword, user_id, offer_by, reward
OUTPUT ---
{
    "post": [
        {
            "post_id": "8f7439b9-1c0a-4458-872f-20c2f0331f62",
            "username": "Tony Tony",
            "title": "ass112",
            "description": "ee",
            "added_datetime": "2020-10-26 13:20:39",
            "status": "Assigned",
            "proof": 0
        },
        {
            "post_id": "4b8b9d70-08be-43c7-abe7-c808310d0eb4",
            "username": "Declan Glover",
            "title": "adada",
            "description": "dadadada",
            "added_datetime": "2020-10-22 12:25:41",
            "status": "Closed",
            "proof": 1
        },
        ...
        {
            "post_id": "41a9e65a-3ad1-4ac1-806b-00dc30da06d5",
            "username": "mia liu",
            "title": "feed cats",
            "description": "fees cats on this Friday",
            "added_datetime": "2020-10-22 11:58:20",
            "status": "Open",
            "proof": 0
        }
    ]
}
---------------------------------------------------------
POST - Create New Post - {{url}}/api/posts
INPUT  ---
{
    "post" : {
        "added_by": "2cf25020-2008-4663-ade2-6091c87e4efa",
        "title": "Wash my car",
        "description": "Need help cleaning the exterior"
    },
    "reward" : [
        {
        "name": "Coffee",
        "qty" : 2
        },
        {
        "name" : "Pizza",
        "qty" : 3
        }
    ]
}
OUTPUT --- 
{
    "message": "Post successfully created",
    "post": {
        "post_id": "c1805de1-249d-4c1f-978f-ea8d8e996396",
        "added_datetime": "2020-11-02T10:03:51.364Z",
        "status": "Open",
        "proof": false,
        "added_by": "2cf25020-2008-4663-ade2-6091c87e4efa",
        "title": "Wash my car",
        "description": "Need help cleaning the exterior"
    }
}
--------------------------------------------------------------
POST - Add/Update Reward of Post - {{url}}/api/posts/add_rewards
INPUT --- 
{   
    "post_id": "8f7439b9-1c0a-4458-872f-20c2f0331f62",
    "user_id": "2cf25020-2008-4663-ade2-6091c87e4efa",
    "reward" : [
        {
        "name": "Pizza",
        "qty" : 4
        },
        {
        "name": "Cupcake",
        "qty": 2
        }
    ]
}
OUTPUT ---
{
    "message": "Rewards added/updated successfully!"
}
-------------------------------------------------------------
PUT - Apply/Upload Proof For Post - {{url}}/api/posts/apply_rewards
INPUT ---
{   
    "post_id": "c03d7810-41ad-4aff-8928-a08b5db22ca5",
    "user_id": "8eff921e-cd56-4146-b902-d8d0438b0ae0",
    "proof": 1,
    "image_url": "https://firebasestorage.googleapis.com/v0/b/aip-v1.appspot.com/o/images%2Fweb.PNG?alt=media&token=a34473b2-6a2b-40a3-b030-95ef0469c17f"
}
OUTPUT --- 
{
    "message": "User applied successfully"
}
------------------------------------------------------------
---Reward APIs---
GET - Find Reward - {{url}}/api/rewards
OUTPUT ---
[
    {
        "reward_name": "chocolate"
    },
    {
        "reward_name": "coffee"
    },
    {
        "reward_name": "cupcake"
    },
    {
        "reward_name": "mint"
    },
    {
        "reward_name": "pizza"
    }
]
----------------------------------------------------------
---Favour APIs---
POST - Add Transaction - {{url}}/api/favours/add_transaction
INPUT ---
{
    "user_owes": "6fb9c570-8189-4095-bb54-a549342b737b",
    "user_owed": "395f1a43-a6d7-4618-bc77-1f2e4c90c58e",
    "proof": 1,
    "reward" : [
        {
            "name": "Coffee",
            "qty" : 1
        },
        {
            "name" : "Mint",
            "qty" : 10
        }
    ]
}
OUPUT ---
{
    "transaction_id": "81228096-93ec-4146-a099-1fdf419f9778",
    "message": "Transaction added successfully!"
}
----------------------------------------------------------------
GET - Search Transaction -  
INPUT --- {{url}}/api/favours/transaction
Parameters --- user_owes, user_owed
OUPUT ---
{
    "transactions": [
        {
            "transaction_id": "81228096-93ec-4146-a099-1fdf419f9778",
            "rewards": [
                {
                    "reward_name": "Mint",
                    "qty": 10
                },
                {
                    "reward_name": "Coffee",
                    "qty": 1
                }
            ],
            "proof": true,
            "timestamp": "2020-11-02 21:23:57",
            "image_url": null
        }
    ]
}
--------------------------------------------------------------
GET - Find Particular Transaction - 
INPUT --- {{url}}/api/favours/transaction/<transaction_id>
OUTPUT ---
{
    "transactions": [
        {
            "transaction_id": "81228096-93ec-4146-a099-1fdf419f9778",
            "rewards": [
                {
                    "reward_name": "Coffee",
                    "qty": 1
                },
                {
                    "reward_name": "Mint",
                    "qty": 10
                }
            ],
            "proof": true,
            "timestamp": "2020-11-02 21:23:57",
            "image_url": null
        }
    ]
}
--------------------------------------------------------
PUT - Upload Proof - {{url}}/api/favours/transaction
INPUT ---
{  
    "transaction_id": "05ed3450-7692-4f8b-ae9c-2de2700678fa",
    "proof": 1,
    "image_url": "https://firebasestorage.googleapis.com/v0/b/aip-v1.appspot.com/o/images%2Fweb.PNG?alt=media&token=a34473b2-6a2b-40a3-b030-95ef0469c17f"
}
OUPUT ---
{
    "message": "Proof uploaded successfully"
}
-----------------------------------------------------------
GET - Leaderboard - {{url}}/api/favours/leaderboard?high_favours=1&order=DESC
OUPUT ---
{
    "users": [
        {
            "user_id": "149148a1-864e-498c-9204-fbec38d1e7e6",
            "username": "Joy Joy",
            "favour_qty": 11
        },
        {
            "user_id": "395f1a43-a6d7-4618-bc77-1f2e4c90c58e",
            "username": "Tom Tom",
            "favour_qty": 11
        },
        {
            "user_id": "9bbf25ec-93b1-4e04-aed9-298ecd356f5c",
            "username": "Benjamin Johnston",
            "favour_qty": 11
        },
        {
            "user_id": "d00b4b93-874b-4923-a600-092afce895c5",
            "username": "John3422 John3422",
            "favour_qty": 2
        },
        {
            "user_id": "d77676b6-1f89-4633-8e09-c485d71a1e1f",
            "username": "John John",
            "favour_qty": 2
        },
        {
            "user_id": "08b074f5-0bb3-41af-a215-ee6ab996ad8a",
            "username": "Grey Grey",
            "favour_qty": 1
        },
        {
            "user_id": "a36a974d-ab7e-483e-8fd6-45783a528802",
            "username": "Jim Jim",
            "favour_qty": 1
        },
        {
            "user_id": "16ed99d2-5cbe-41ae-8c36-072a5fe5ab8b",
            "username": "Hiroyasu Ichikawa",
            "favour_qty": 0
        },
        {
            "user_id": "42625485-953b-45c9-a3c9-c3141c8d2425",
            "username": "Carol Carol",
            "favour_qty": 0
        },
        {
            "user_id": "4b97fb15-d998-4d50-9078-9c6d10da7509",
            "username": "Maria Maria",
            "favour_qty": 0
        }
    ]
}
----------------------------------------------------------------------
GET - Cycle Detection - 
INPUT ---
{{url}}/api/favours/cycle-detection/<user_id>
OUPUT ---
{
    "message": "No cycle detected!"
}
------------------------------------------------------------------------
