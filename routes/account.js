const express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport"),
    jwt = require("jsonwebtoken"),
    config = require("../config/db");

// router.get("/reg", (request, response) => {
//     response.send("Registration page");
// });

router.post("/reg", (request, response) => {
    let newUser = new User({
        name: request.body.name,
        email: request.body.email,
        login: request.body.login,
        password: request.body.password
    });

    User.addUser(newUser, (err, user) => {
        if(err)
            response.json({success: false, msg: `User hasn't been added`});
        else 
            response.json({success: true, msg: `User has been added`});
    });
});

router.get("/auth", (request, response) => {
    const login = request.body.login,
        password = request.body.password;

    User.getUserByLogin(login, (err, user) => {
        if(err) throw err;
        if(!user)
            return res.json({success: false, msg: "User is not fuound"});
        User.comparePass(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 3600 * 24
                });
                response.json({
                    success: true,
                    token: "JWT " + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        login: user.login,
                        email: user.email,
                    }
                });
            } else 
              return res.json({success: false, msg: "Passwords are not matched"});
        }); 
    });
});

router.get("/dashboard", passport.authenticate("jwt", {session: false}), (request, response) => {
    response.send("User account");
});

module.exports = router;