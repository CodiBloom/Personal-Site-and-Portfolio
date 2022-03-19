
const express = require("express");
const bodyParser = require("body-parser");
let https = require("https");
let fs = require("fs");
let options = {
  "method": "POST",
  "hostname":"us14.api.mailchimp.com",
  "path": "/3.0/lists/3acc4eb093/members",
  "headers": {
    "Authorization": "Bearer",
    "Cookie": "},
  "maxRedirects": 20
};

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("node_modules/bootstrap/dist/"));
app.use(express.static("public/"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});
app.get("/index.html", function(req, res){
  res.sendFile(__dirname + "/index.html");
})
app.get("/contactme.html", function(req, res){
  res.sendFile(__dirname + "/contactme.html");
});

app.post("/contactme.html", function(request, response){
  let firstName = request.body.firstName;
  let lastName = request.body.lastName;
  let email = request.body.email;
  let phone = request.body.phone;
  let message = request.body.message;

  let req = https.request(options, function(res){
    let chunks = [];
    let body = "";
    let status = "";
    let parsedBody = "";

    console.log("STATUS: " + res.statusCode);
    console.log("HEADERS: " +   JSON.stringify(res.headers));

    res.on("data", function(chunk){
      body = body + chunk;
      parsedBody = JSON.parse(body);
      status = res.statusCode;
    });

    res.on("end", function(chunk){
      if (status === 200){
        console.log("BODY: " + parsedBody);
        console.log("STATUS: " + status);
        response.sendFile(__dirname + "/contactme.html");
      }
      else if (status !== 200){
        console.log("BODY: " + parsedBody);
        console.log("STATUS: " + status);
        response.sendFile(__dirname + "/contactme.htmnl");
      }
    })

    res.on("error", function(error){
      console.error(error);
    })
  })

  var postData = JSON.stringify({
    "email_address": email,
    "status": "subscribed",
    "merge_fields": {
      "FNAME": firstName,
      "LNAME": lastName,
      "PHONE": phone,
      "MESSAGE": message
    }
  })

  req.write(postData);
  req.end();
})

app.listen(3000, function(){
  console.log("Server listening on port 3000.")
});
