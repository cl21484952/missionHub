//

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");

// Connect to database
const config = require("./config/database");
mongoose.connect(config.database); // Local database
mongoose.connection.on('connected', () => {
    console.log("connected to database"+config.database);
});
mongoose.connection.on('error', (err) => {
    console.log("database error"+err)
})

const app = express(); // Framework

const port = 3000; // Port

const users = require("./routes/users");

/*
Middleware Stuff
*/

// CORS
// Allow different domain name to interact
// with us
app.use(cors());

// Set Static folder
app.use(express.static(path.join(__dirname, 'public')));
// __dirname: str, current directory
// 'public': str, the directory where static stuff is

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use("/users", users); //???

// Index routes
app.get("/", (req, res)=>{
    res.send("Invalid end point");
});

// Starts the server
app.listen(port, ()=>{
    console.log("server started on port");
});
