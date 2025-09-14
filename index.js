import express from "express";
import bodyParser  from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path"; 
import sgMail from "./config/email.js";
import session from "express-session";
import db from "./config/database.js";
import dotenv from "dotenv";
dotenv.config();


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



app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/public/index.html")
});
app.get("/home", (req, res)=>{
    console.log("At home page");
    res.render("home.ejs");
});

app.post("/submit-auth-info", async (req, res)=>{
    const in_usn = req.body.usn;

    const result = await db.query("SELECT email from users WHERE usn = $1", [in_usn]);
    const email = result.rows[0]?.email;
    console.log(email);
    req.session.gmail = email;
    await db.query("DELETE FROM otp_verifications WHERE expires_at < NOW() OR is_used = true");
    if (email){
        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log(otp);
        const expire_at = new Date(Date.now() + 10 * 60 * 1000);
        try{
            await db.query(
                "INSERT INTO otp_verifications (email, otp_code, expires_at, purpose) VALUES($1, $2, $3, 'login')", [email, otp, expire_at]
            );
        }catch(err){
            console.log(err)
        }
        
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
app.post("/otp-auth",async (req, res)=>{
const in_otp = req.body.otp;
const email = req.session.gmail;
const result = await db.query("SELECT * from otp_verifications WHERE email = $1 AND expires_at > NOW() AND is_used = false", [email]);
const otp = result.rows[0]?.otp_code;
if(otp == in_otp){
    
    delete req.session.gmail;
    await db.query("UPDATE otp_verifications SET is_used = true WHERE email = $1", [email]);
    res.redirect("/home");
}else{
    res.render("login.ejs", { 
            mail: email, 
            error: "Invalid OTP. Please  try again." 
        });
}


});

app.listen(port, ()=> {
    console.log(`Listening to ${port}.`);
    console.log("http://localhost:3000");
});