const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const port = process.env.PORT || 3000;

app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html", __dirname + "/styles.css");

});

app.post("/", function(req, res) {
    const firstName = req.body.fisrtName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const listId = "bd0d718ee3";
    const url = "https://us14.api.mailchimp.com/3.0/lists/" + listId;

    const userNAme = "mobius";
    const key = "b368758ec569c405f7bf542e355975ec-us14";

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const options = {
        method: "POST",
        auth: userNAme + ":" + key,
    }

    const request = https.request(url, options, function(response) {
        response.on("data", function(data) {
            console.log(JSON.parse(data));
            
            if (response.statusCode == 200 && JSON.parse(data).error_count == 0) {
                console.log("Request successful!");
                res.sendFile(__dirname + "/success.html");
            } else {
                console.log("Status code: " + response.statusCode);
                console.log("Errors: " + JSON.stringify(JSON.parse(data).errors));
                res.sendFile(__dirname + "/failure.html");
            }

        }).on("error", function(err) {
            console.log(err);
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
})



app.listen(port, function() {
    console.log("Listening on port 3000...");
});

// key
// b368758ec569c405f7bf542e355975ec-us14

// list id
// bd0d718ee3