// Dependencies
// =============================================================
const express = require("express");
const router = express.Router();
var db = require("../models");
//npm package import, bcrypt does the encrypting for us
var bcrypt = require('bcrypt');
const axios = require("axios");


// Routes
// =============================================================


// Each of the below routes just handles the HTML page that the user gets sent to.

// index route loads landing page
router.get("/", function (req, res) {
    res.render("index");
});

// loads login page
router.get("/login", function (req, res) {
    res.render("login");
});

// sending entered login data to db
router.post('/login', function (req, res) {
    console.log(req.body);
    db.User.findOne({
        where: {
            email: req.body.email
        }
    }).then(function (dbUser) {
        console.log(dbUser)
        //compares password send in req.body to one in database, will return true if matched.
        if(!dbUser){
            req.session.user=false;
            req.session.error = 'no user found!'
        }
        else if (bcrypt.compareSync(req.body.password, dbUser.password)) {
            //create new session property "user", set equal to logged in user
            req.session.user = { first_name: dbUser.first_name, id: dbUser.id };
            // router.get("/trip");
        }
        else {
            //delete existing user, add error
            req.session.user = false;
            req.session.error = 'Authentification Failed'
        }
        res.json(req.session);
    })
});

// loads register page
router.get("/register", function (req, res) {
    res.render("register");
});

// sending entered sign up info to db
router.post("/register", function (req, res) {
    db.User.create(req.body).then(function (data) {
        res.json(data);
    }).catch(err=>console.log("register err", err))
});

// trip route loads the page
router.get("/trip/", function (req, res) {
    // console.log(googleURL)
    // let googleApiKey = process.env.GOOGLE_API_KEY
    // let cityOne = "Seattle+WA"
    // let cityTwo = "phoenix+az"
    // let vehicleType = "driving"

    // let googleURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + cityOne + "&destinations=" + cityTwo + "&mode=" + vehicleType + "&language=en-FR&key=" + googleApiKey;
    // axios.get(googleURL).then(response => {
    //     // res.json(response.data);
    //     const ourData = {
    //         tripTime: response.data.rows[0].elements[0].duration.text,
    //         tripDistance: response.data.rows[0].elements[0].distance.text,
    //     }
    //     console.log(ourData)
    //     res.render("trip", ourData);
    // })
    // if(req.session.user) {
    //     res.render('trip',req.session.user);
    // }else {
    //     res.send('Need to Login')
    // }

    res.render("trip",{istrip:true });
});

router.get("/retrieveTripData/:start/:end", function (req, res) {
    let googleApiKey = process.env.GOOGLE_API_KEY
    let cityOne = req.params.start
    let cityTwo = req.params.end
    let vehicleType = "driving"

    let googleURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + cityOne + "&destinations=" + cityTwo + "&mode=" + vehicleType + "&language=en-FR&key=" + googleApiKey;
    axios.get(googleURL).then(response => {
        // res.json(response.data);
        const ourData = {
            tripTime: response.data.rows[0].elements[0].duration.text,
            tripDistance: response.data.rows[0].elements[0].distance.text,
        }
        console.log(ourData)
        res.render("trip", ourData);
        // res.render("trip", ourData);
    })
})

// router.get("/retrieveTripData/:start/:end", function (req, res) {
//     let googleApiKey = process.env.GOOGLE_API_KEY
//     let cityOne = req.params.start
//     let cityTwo = req.params.end
//     let vehicleType = "driving"

//     let googleURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + cityOne + "&destinations=" + cityTwo + "&mode=" + vehicleType + "&language=en-FR&key=" + googleApiKey;
//     axios.get(googleURL).then(response => {
//         // res.json(response.data);
//         const ourData = {
//             tripTime: response.data.rows[0].elements[0].duration.text,
//             tripDistance: response.data.rows[0].elements[0].distance.text,
//         }
//         console.log(ourData)
//         res.json(response.data);
//         // res.render("trip", ourData);
//     })
// })

// profile route loads profile.html with data from our tables
router.get("/profile", function (req, res) {
    db.User.findOne({raw:true,
        where: {
            id: req.session.user.id
        }
    }).then(function (data) {
        if(req.session.user) {
            console.log(data);
            
            db.Trip.findAll({raw:true,
                where: {
                    UserId: data.id
                }
            }).then(function(result){
                console.log(result[0], result[1]);
                let total_used_carbon = 0;
                let total_saved_carbon = 0;
                for (trip in result) {
                    total_used_carbon += trip.used_carbon;
                    total_saved_carbon += trip.saved.carbon;
                }
                console.log(total_used_carbon);
                console.log(total_saved_carbon);
            })
            res.render('profile', req.session.user);
        }else {
            res.send('Need to Login')
        }
    });
});

// router.post("/profile", function (req, res){
//     db.User.findOne
// })

module.exports = router;

