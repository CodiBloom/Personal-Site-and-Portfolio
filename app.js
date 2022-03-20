
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
let parse = require('node-html-parser').parse;
let https = require("https");
let cookieParser = require("cookie-parser");
// let formStatus = "";
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

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("node_modules/bootstrap/dist/"));
app.use(express.static("public/"));

app.get("/", function(req, res){
  res.cookie("formStatus", "incomplete");
  res.sendFile(__dirname + "/index.html");
});
app.get("/index.html", function(req, res){
  res.cookie("formStatus", "incomplete");
  res.sendFile(__dirname + "/index.html");
})
app.get("/contactme.html", function(req, res){
  // formStatus = "incomplete";
  res.cookie("formStatus", "filling");
  res.render("contacts", {formStatus: req.cookies.formStatus});
});

app.post("/contactme.html", function(request, response){
  let firstName = request.body.firstName;
  let lastName = request.body.lastName;
  let email = request.body.email;
  let phone = request.body.phone;
  if (request.body.phone === ""){
    phone = "Nothing";
  }
  let message = request.body.message;
  if (request.body.message === ""){
    message = "Nothing";
  }

  if (request.cookies.formStatus === "filling"){
    response.cookie("formStatus", "complete");
    response.render("contacts", {
      formStatus: request.cookies.formStatus,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      message: message
    })
  }
  else if (request.cookies.formStatus === "complete"){
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
          console.log("Post successful");
          let submit = "Thanks for reaching out " + firstName + "! I'll get back to you as soon as I can.";
          response.render("contacts", {
            formStatus: request.cookies.formStatus,
            submit: submit
          })
        }
        else if (status !== 200){
          console.log("STATUS: " + res.statusCode);
          console.log("HEADERS: " + JSON.stringify(res.headers));
          let submit = "Oops, something went wrong! Please reach out to me directly, " + firstName + ".";
          response.render("contacts", {
            formStatus: request.cookies.formStatus,
            submit: submit
          })
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
  }

})

app.listen(3000, function(){
  console.log("Server listening on port 3000.")
});
