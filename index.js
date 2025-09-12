import express from "express";
import bodyParser  from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path"; 
import sgMail from '@sendgrid/mail';
import session from "express-session";

import dotenv from "dotenv";
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const __dirname = dirname(fileURLToPath(import.meta.url));



const app = express();
const port = 3000;

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 * 4
    }
}))

app.use(bodyParser.urlencoded({extended: true}));



let users = [
    {usn: 30,
    email: "sneax822@gmail.com",},
]

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/public/index.html")
});
app.get("/home", (req, res)=>{
    console.log("At home page");
    res.render("home.ejs");
});

app.post("/submit-auth-info", (req, res)=>{
    const in_usn = req.body.usn;

    const email = users.find(user => user.usn == in_usn)?.email;
    const usn = users.find(user => user.usn == in_usn)?.usn;
    console.log(email);
    
    
    if (email){
        const otp = Math.floor(100000 + Math.random() * 900000);
        req.session.generatedOTP = otp;
        req.session.userEmail = email;
        req.session.userUSN = in_usn;

        console.log(otp);

        console.log("Stored in session:", req.session.generatedOTP);

        const msg = {
            to: "sneax822@gmail.com",
            from: process.env.SENDER_EMAIL,
            subject: 'OTP for GradNet registration',
            text: `Your otp is ${otp}.`,
            html: `<strong>${otp}</strong>`,
        }
        sgMail
            .send(msg)
            .then(() => {
            console.log('Email sent')
            })
            .catch((error) => {
            console.error(error)
            })


        res.render("login.ejs", {mail: email})
    }else{
        res.redirect("/");
    }
});
app.post("/otp-auth", (req, res)=>{
const otp = req.body.otp;
const {generatedOTP, userEmail, userUSN} = req.session;
if(otp && generatedOTP && parseInt(otp) === generatedOTP){
    delete req.session.generatedOTP;
    req.session.isAuthenticated = true;
    req.session.currentUser = {usn: userUSN, email: userEmail};

    res.redirect("/home");
}else{
    res.render("login.ejs", { 
            mail: userEmail, 
            error: "Invalid OTP. Please try again." 
        });
}

});

app.listen(port, ()=> {
    console.log(`Listening to ${port}.`);
    console.log("http://localhost:3000");
});