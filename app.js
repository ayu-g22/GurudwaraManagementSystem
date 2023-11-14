const express = require('express');
require('dotenv').config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');
const { on } = require('nodemailer/lib/xoauth2');
const ejs = require('ejs');
const port = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({
  extended:true
}));

app.use(express.static(__dirname));

// Set EJS as the view engine
app.set('view engine', 'ejs');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use the email service you want to send through
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'project.id2003@gmail.com',
    pass: 'zwha olym uzso uejb' // App password
  }
});


mongoose.connect('mongodb+srv://GurudwaraMS:Waheguru%401234@gms.1csrloh.mongodb.net/account',{useNewUrlParser:true});

const userSchema={
  name:String,
  amt:Number,
  reason:String
}

const extSchema={
  name:String,
  amt:Number,
  reason:String
}

const accSchema={
  incoming:Number,
  outgoing:Number,
  total:Number
}

const account=mongoose.model('balance sheet',accSchema);
const exits=mongoose.model('exit',extSchema);
const entry=mongoose.model("enteries",userSchema);

app.listen(process.env.PORT||3000, () => {
    console.log("Application started and Listening on port 3000");
  });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/src/Login.html");
});

app.get("/forgot", (req, res) => {
  res.sendFile(__dirname + "/src/forgot.html");

});

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/src/form.html");
});

app.get('/admin',(req,res)=>{
  var inc;
  var out;
  var total;
  account.find().then(function(documents){
      inc=documents[0].incoming;
      out=documents[0].outgoing;
      total=documents[0].total;
      res.render('admin', { inc , out,total })
  });
})

app.get('/page',(req,res)=>{
  res.sendFile(__dirname + "/src/page404.html");
})

app.post("/", (req, res) => {
  const username=req.body.username;
  const password=req.body.password;
  if(username==="adminji@1234" && password==="realadmin@9876")
    res.redirect('/admin')
  else if(username==="waheguru@1234" && password==="onlyuser@123")
    res.redirect('/home');
  else
    res.redirect('/page')
});

app.post("/forgot", (req, res) => {
  const mailOptions = {
    from: 'ayushagupta225@gmail.com',
    to: req.body.email,
    subject: "Password for Gurudwara Management System",
    text: 'realadmin@9876'
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send email' });
    } else {
      console.log('Email sent:', info.response);
      res.json({ message: 'Email sent successfully' });
    }
  });
  res.redirect('/');
});

app.post('/home',(req,res) => {
  var x=0;
  var name=req.body.name;
  var amount=req.body.amount;
  var reason=req.body.reason;
  var checkbox = req.body.isSeva;
  if(checkbox==='on'){
    const ent=new entry({
    name:name,
    amt:amount,
    reason:reason
    });
    account.find().then(function(documents){
      var val = documents[0].total;
      var inc = documents[0].incoming;
      const updateAccount = async (val, amount) => {
        try {
          await account.updateOne({}, { total: val + Number(amount) });
          await account.updateOne({}, { incoming: inc + Number(amount) });
        } catch (err) {
          console.error(err);
        }
      };
      
      // Call the function with your values
      updateAccount(val, amount);
   })
    ent.save();
    console.log("Inserted as donation");
  }
  else{
    const ext=new exits({
      name:name,
      amt:amount,
      reason:reason
      });
      account.find().then(function(documents){
        var val = documents[0].total;
        var out = documents[0].outgoing;
        const updateAccount = async (val, amount) => {
          try {
              await account.updateOne({}, { total: val - Number(amount) });
            await account.updateOne({}, { outgoing: out + Number(amount) });
          } catch (err) {
            console.error(err);
          }
        };
        // Call the function with your values
        updateAccount(val, amount);
      })
        ext.save();
      console.log('outgoing saved');
      
    }
    res.sendFile(path.join(__dirname, '/src/form.html'));
})


