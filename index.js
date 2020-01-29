const express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    path = require("path"),
    cors = require("cors"),
    bodyParser = require("body-parser"),
    config = require("./config/db"),
    account = require("./routes/account");

const application = express(),
    port = 3000;

application.use(passport.initialize());
application.use(passport.session());

require("./config/passport")(passport);

application.use(cors());
application.use(bodyParser.json());
application.use(express.static(path.join(__dirname, "src")));

mongoose.connect(config.db, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on("connected", () => {
    console.log(`Successfull db connection`);
});
mongoose.connection.on("erroe", (err) => {
    console.log(`Failed db connection: ${err}`);    
});
application.get("/", (request, response) => {
    response.send("The main page");
});
application.use("/account", account);
application.listen(port, () => {
    console.log(`The server was started on port: ${port}` )
});