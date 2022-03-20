
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
    "Authorization": "Bearer 508a2aff7cccafd7a0bc6d293c80097e-us14",
    "Cookie": "ak_bmsc=1BA620655D9F899F14EA24002C306C4E~000000000000000000000000000000~YAAQv3EGF8wT2dR+AQAARI+h3g6qy+z1cPGQgWLcNxTkLRnpXPE3jUCs8rdoHY1c1ExSy09vAUL26HBOCRgt2lM9y+4Jqgz4Tk5xbYBs+5Stf5LD33vmhuoCTWmEHb8sADiIAVU77rtLtrIeXqics32velWTk55nsDOm77v8cG/EoE3mA+Jap2LvhODkozBSVz2fznkiQRbdHpIkbBHRlKEtGFcnE2NynFSUPXOexH/L0ZoMDmfIfmht3CW8JaqeFN+eFx07SP0P+nHpaUfHdUXf3/ycB6OF88H63bikRAIG0ExFavVaRdYhXM8VU6Af0gDC86X3Jq9oGfHKI1R6X67/yAj4fcVest7LTU75avjm/uYcM/dM/pvrmHU2Kvw3NarcNw==; bm_sv=001F430B7DD23725EB2FBD2FE3DAA37B~vvYZA/1OqAiV86mSxjLwF2rksmtKriSRHy+g1/BW52FjfoFRDZ53TIrHFzR4QrOenQbPiDE0mVCl7Ef5RCCBGnKa5R4X0U12WdAp2sr24SYGGa3eP+GN+cQFn3II+acfu2YDP1QknoaWzS1hkr2T3v/gwRSr+Fb8go0f+rvNZJ8="
  },
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
