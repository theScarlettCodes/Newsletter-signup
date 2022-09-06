const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const port = process.env.PORT || 4000;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us9.api.mailchimp.com/3.0/lists/65e4902641";

  const options = {
    method: "POST",
    auth: "scarlett1:570c63d06001c328aff1a6dc9d5cc475-us9",
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});

// API KEY
// 570c63d06001c328aff1a6dc9d5cc475-us9

// LIST ID
// 65e4902641.
