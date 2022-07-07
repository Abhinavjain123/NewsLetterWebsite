const express = require("express");
// const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");

// mailchimp.setConfig({
//     apiKey: "95d8791d17868a8cd203dd79669ddef9-us8",
//     server: "us8"
// });

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req, res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    // Another method from documentation
    // const data={  
    //     email_address: email,
    //     status: "subscribed",
    //     merge_fields:{
    //         FNAME: firstName,
    //         LNAME: lastName
    //     }
    // };
    // async function run() {
    //     const response = await mailchimp.lists.addListMember("4f305f0073", data);
    //     // res.send(response);
    //     https.get(response._links[0].href, function(res2){
    //         res2.on("data", function(data){
    //             console.log(JSON.parse(data).status);
    //         })
    //     })
    // };
    // run();

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    var jsonData = JSON.stringify(data);
    var url = "https://us8.api.mailchimp.com/3.0/lists/4f305f0073";
    var options={
        method:"POST",
        auth:"abhinav1:95d8791d17868a8cd203dd79669ddef9-us8"
    }
    var request = https.request(url, options, function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html")
        }
        // response.on("data",function(data){
        //     console.log(JSON.parse(data));
        // });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    // res.sendFile(__dirname+"/signup.html"); OR
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){console.log("Running");});

// Mailchimp key 95d8791d17868a8cd203dd79669ddef9-us8
// audience id 4f305f0073