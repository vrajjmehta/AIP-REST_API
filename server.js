const express = require('express');
let bodyParser = require('body-parser');
const cors = require("cors");
const app = express();

let corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//the below line is needed for each new model route created to connect to API
require("./app/routes/user.js")(app);
require("./app/routes/post.js")(app);
require("./app/routes/reward.js")(app);
require("./app/routes/favour.js")(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server is up on port ' + PORT);
});