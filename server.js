const express = require('express');
let bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const path = require('path');
const debug = require('debug')('myapp:server');
const multer = require('multer');

let corsOptions = {
    origin: ["https://web-app-dot-aip-v1.ts.r.appspot.com", "http://localhost:3000"]
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


// Disk storage for files
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

// Mutler object upload
const upload = multer({ storage: storage });

// store file uploads
app.post('/upload', upload.single('file'), (req,res) => {
    debug(req.file);
    console.log('storage location is ', req.hostname +'/' + req.file.path);
    return res.send(req.file);
});

// retrieve the file
app.get('/file/:fileName', function (req, res) {
    try{
        const filePath = __dirname + '/uploads/' + req.params.fileName;
        res.sendFile(filePath);
    }
    catch(e){
        console.log(e);
    }
});