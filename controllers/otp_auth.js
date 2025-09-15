import db from "../config/database.js";

export const otpAuth = async (req, res)=>{
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


}