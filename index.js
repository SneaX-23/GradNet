import express from "express";
import bodyParser  from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path"; 
import { sendMail } from "./controllers/sendEmail.js";
import session from "express-session";
import {otpAuth} from "./controllers/otp_auth.js"
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
        maxAge: 1000 * 60 * 10
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

app.post("/submit-auth-info", sendMail);

app.post("/otp-auth", otpAuth);

app.listen(port, ()=> {
    console.log(`Listening to ${port}.`);
    console.log("http://localhost:3000");
});